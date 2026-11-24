"use client";

import { useEffect, useMemo, useRef } from "react";
import { clamp, DEFAULT_EDIT, layout, renderVariant, shrink, toneSource, VARIANTS, type Edit, type Rotation, type Source } from "@/lib/photo-edit";

const PREVIEW = 360;
const BACKGROUNDS = [
  { hex: "#ffffff", name: "White" },
  { hex: "#f2f2f4", name: "Light grey" },
  { hex: "#111113", name: "Black" },
];

type Props = {
  index: number;
  source: Source;
  edit: Edit;
  variants: string[];
  disabled: boolean;
  onChange: (e: Edit) => void;
  onRemove: () => void;
};

/** Live editor for one photo: drag to reposition, sliders to fix light, plus thumbnails of every version it will create. */
export function PhotoCard({ index, source, edit, variants, disabled, onChange, onRemove }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);

  const small = useMemo(() => shrink(source, 900), [source]);
  const toned = useMemo(
    () => toneSource(small, edit),
    // Only tone settings change pixels; position changes reuse the same toned copy.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [small, edit.auto, edit.brightness, edit.contrast],
  );

  const main = VARIANTS[0];
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.getContext("2d")!.drawImage(renderVariant(toned, edit, main, PREVIEW / main.w), 0, 0);
  }, [toned, edit, main]);

  const thumbs = useMemo(
    () => VARIANTS.filter((v) => variants.includes(v.id)).map((v) => ({ id: v.id, label: v.label, src: renderVariant(toned, edit, v, 160 / v.w).toDataURL("image/jpeg", 0.7) })),
    [toned, edit, variants],
  );

  const set = (patch: Partial<Edit>) => onChange({ ...edit, ...patch });

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drag.current || disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = PREVIEW / rect.width;
    const L = layout(toned.width, toned.height, edit.rotation, PREVIEW, PREVIEW, "cover", edit.zoom, edit.panX, edit.panY);
    const dx = (e.clientX - drag.current.x) * ratio;
    const dy = (e.clientY - drag.current.y) * ratio;
    drag.current = { x: e.clientX, y: e.clientY };
    set({
      panX: L.maxX ? clamp(edit.panX + dx / L.maxX, -1, 1) : 0,
      panY: L.maxY ? clamp(edit.panY + dy / L.maxY, -1, 1) : 0,
    });
  };

  return (
    <article className="rounded-2xl bg-white p-4 ring-1 ring-black/5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">Photo {index + 1}</h3>
        <button type="button" onClick={onRemove} disabled={disabled} className="btn min-h-9 px-3 text-red-600 hover:bg-red-50">
          Remove
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <canvas
            ref={canvasRef}
            width={PREVIEW}
            height={PREVIEW}
            className="aspect-square w-full cursor-grab touch-none rounded-xl bg-tile active:cursor-grabbing"
            aria-label="Main photo preview. Drag to reposition."
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              drag.current = { x: e.clientX, y: e.clientY };
            }}
            onPointerMove={onPointerMove}
            onPointerUp={() => (drag.current = null)}
            onPointerCancel={() => (drag.current = null)}
          />
          <p className="mt-1 text-xs text-muted">Drag the photo to move it inside the frame.</p>
        </div>

        <fieldset disabled={disabled} className="space-y-3 text-sm">
          <legend className="sr-only">Adjust photo {index + 1}</legend>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={edit.auto} onChange={(e) => set({ auto: e.target.checked })} className="h-4 w-4 accent-ink" />
            Auto-enhance light and colour
          </label>
          <Slider label="Zoom" min={1} max={3} step={0.05} value={edit.zoom} onChange={(zoom) => set({ zoom })} />
          <Slider label="Brightness" min={0.5} max={1.5} step={0.02} value={edit.brightness} onChange={(brightness) => set({ brightness })} />
          <Slider label="Contrast" min={0.5} max={1.5} step={0.02} value={edit.contrast} onChange={(contrast) => set({ contrast })} />
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className="btn min-h-10 px-4 ring-1 ring-black/15 hover:bg-black/5" onClick={() => set({ rotation: (((edit.rotation + 90) % 360) as Rotation) })}>
              Rotate
            </button>
            <button type="button" className="btn min-h-10 px-4 ring-1 ring-black/15 hover:bg-black/5" onClick={() => onChange({ ...DEFAULT_EDIT })}>
              Reset
            </button>
          </div>
          <div>
            <span className="mb-1 block">Background</span>
            <div className="flex gap-2">
              {BACKGROUNDS.map((b) => (
                <button
                  key={b.hex}
                  type="button"
                  onClick={() => set({ bg: b.hex })}
                  aria-label={`${b.name} background`}
                  aria-pressed={edit.bg === b.hex}
                  className={`h-10 w-10 rounded-full ring-offset-2 ${edit.bg === b.hex ? "ring-2 ring-ink" : "ring-1 ring-black/20"}`}
                  style={{ background: b.hex }}
                />
              ))}
            </div>
          </div>
        </fieldset>
      </div>

      {thumbs.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold text-muted">Versions that will be uploaded</p>
          <ul className="flex gap-2 overflow-x-auto pb-1">
            {thumbs.map((t) => (
              <li key={t.id} className="flex-none text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.src} alt={t.label} className="h-20 w-auto rounded-lg ring-1 ring-black/10" />
                <span className="mt-1 block text-[11px] text-muted">{t.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

function Slider({ label, value, onChange, ...range }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="flex justify-between">
        {label} <span className="tabular-nums text-muted">{Math.round(value * 100)}%</span>
      </span>
      <input type="range" {...range} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-8 w-full accent-ink" />
    </label>
  );
}
