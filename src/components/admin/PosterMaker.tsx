"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { posterScene, uploadPhoto } from "@/app/admin/actions";
import { encode } from "@/lib/photo-edit";
import { cutOut, drawPoster, FEATURE_HINTS, loadImage, POSTER_SIZE, THEMES, type PosterStyle, type PosterText } from "@/lib/poster";

export type PosterProduct = {
  id: string;
  name: string;
  model: string;
  category: string;
  price: string;
  oldPrice: string;
  photos: string[]; // studio photos first, then the shop/official photo
};

const TRUST = ["Free Delivery Rs 3,000+", "1 Year Warranty", "Cash on Delivery", "7 Day Exchange"];

function defaults(p: PosterProduct): PosterText {
  return {
    store: "VOLTIX",
    headline: (p.model || p.name).slice(0, 18),
    ribbon: p.model ? p.name : "",
    tagline: "Upgrade your everyday tech",
    features: (FEATURE_HINTS[p.category] ?? FEATURE_HINTS.accessories).slice(0, 5),
    price: p.price,
    oldPrice: p.oldPrice,
    trust: TRUST,
    footer: "voltix-store-zeta.vercel.app",
  };
}

/** One plain photo in, one sale poster out: pick photo, pick style, edit text, save or share. */
export function PosterMaker({ product, onSaved }: { product: PosterProduct; onSaved: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [src, setSrc] = useState(product.photos[0] ?? "");
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [style, setStyle] = useState<PosterStyle>("neon");
  const [text, setText] = useState<PosterText>(() => defaults(product));
  const [removeBg, setRemoveBg] = useState(true);
  const [tol, setTol] = useState(40);
  const [scene, setScene] = useState<HTMLImageElement | null>(null);
  const [fontsReady, setFontsReady] = useState(false);
  const [busy, setBusy] = useState("");
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    // Canvas text only uses web fonts once they are loaded.
    Promise.all([document.fonts.load('800 100px "Space Grotesk Variable"'), document.fonts.load('600 30px "Inter Variable"')]).finally(() => setFontsReady(true));
  }, []);

  useEffect(() => {
    let live = true;
    if (!src) return;
    loadImage(src)
      .then((i) => live && setImg(i))
      .catch(() => live && setNote({ ok: false, text: "That photo could not be loaded. Pick another one." }));
    return () => {
      live = false;
    };
  }, [src]);

  const cut = useMemo(() => (img ? cutOut(img, tol, removeBg) : null), [img, tol, removeBg]);

  useEffect(() => {
    const c = canvasRef.current?.getContext("2d");
    if (c && fontsReady) drawPoster(c, { style, text, product: cut, scene });
  }, [style, text, cut, scene, fontsReady]);

  const set = <K extends keyof PosterText>(k: K, v: PosterText[K]) => setText((t) => ({ ...t, [k]: v }));
  const posterBlob = async () => encode(canvasRef.current!);
  const fileName = `${product.model || product.name}-poster`.replace(/[^\w-]+/g, "-").toLowerCase();

  async function run(label: string, work: () => Promise<void>) {
    setBusy(label);
    setNote(null);
    try {
      await work();
    } catch (err) {
      console.error(err);
      setNote({ ok: false, text: "Something went wrong. Check your connection and try again." });
    } finally {
      setBusy("");
    }
  }

  /** Sends the current photo to AI: "white" returns a clean cut-out source, other styles a full scene. */
  const ai = (mode: "white" | "scene") =>
    run(mode === "white" ? "AI is cleaning the background, up to a minute..." : "AI is building the scene, up to a minute...", async () => {
      if (!img) return;
      const c = document.createElement("canvas");
      const k = Math.min(1, 1600 / Math.max(img.width, img.height));
      c.width = Math.round(img.width * k);
      c.height = Math.round(img.height * k);
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      const fd = new FormData();
      fd.set("file", await encode(c), "product.jpg");
      fd.set("style", mode === "white" ? "white" : style);
      const r = await posterScene(fd);
      if (!r.ok) return setNote({ ok: false, text: r.error });
      if (mode === "white") {
        setSrc(r.dataUrl);
        setRemoveBg(true);
      } else setScene(await loadImage(r.dataUrl));
      setNote({ ok: true, text: "Done. Check the product still looks exactly like the real one before using it." });
    });

  const save = () =>
    run("Saving to product photos...", async () => {
      const blob = await posterBlob();
      const fd = new FormData();
      fd.set("pid", product.id);
      fd.set("variant", "poster");
      fd.set("file", blob, `${fileName}.${blob.type === "image/webp" ? "webp" : "jpg"}`);
      const r = await uploadPhoto(fd);
      setNote(r.ok ? { ok: true, text: "Poster added to this product's photos." } : { ok: false, text: r.error });
      if (r.ok) onSaved();
    });

  const share = () =>
    run("Preparing...", async () => {
      const blob = await posterBlob();
      const file = new File([blob], `${fileName}.${blob.type === "image/webp" ? "webp" : "jpg"}`, { type: blob.type });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: text.headline }).catch(() => undefined);
      } else {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = file.name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 10_000);
      }
    });

  const field = "field text-sm";

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <div>
        <canvas ref={canvasRef} width={POSTER_SIZE} height={POSTER_SIZE} className="aspect-square w-full rounded-xl bg-tile ring-1 ring-black/10" aria-label="Poster preview" />
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button type="button" onClick={share} disabled={!!busy || !img} className="btn bg-ink text-white hover:bg-black">
            Share / download
          </button>
          <button type="button" onClick={save} disabled={!!busy || !img} className="btn bg-accent text-white hover:brightness-95">
            Add to product photos
          </button>
        </div>
        {(busy || note) && (
          <p className={`mt-3 rounded-xl p-3 text-sm ${busy ? "bg-ink text-white" : note?.ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"}`} aria-live="polite">
            {busy || note?.text}
          </p>
        )}
      </div>

      <fieldset disabled={!!busy} className="space-y-4 text-sm">
        <legend className="sr-only">Poster settings</legend>
        <div>
          <span className="mb-1.5 block font-medium">Photo</span>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {product.photos.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setSrc(p)}
                aria-pressed={src === p}
                aria-label="Use this photo"
                className={`h-16 w-16 flex-none overflow-hidden rounded-lg bg-white ring-2 ${src === p ? "ring-ink" : "ring-black/10"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p} alt="" className="h-full w-full object-contain" />
              </button>
            ))}
            <label className="grid h-16 w-16 flex-none cursor-pointer place-items-center rounded-lg text-center text-[11px] font-semibold ring-1 ring-dashed ring-black/30 hover:bg-black/5">
              New photo
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setSrc(URL.createObjectURL(f));
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </div>

        <div>
          <span className="mb-1.5 block font-medium">Style</span>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(THEMES) as PosterStyle[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStyle(s)}
                aria-pressed={style === s}
                className={`btn min-h-10 justify-start ring-1 ${style === s ? "ring-2 ring-ink" : "ring-black/15"}`}
                style={{ background: `linear-gradient(120deg, ${THEMES[s].bg[0]} 40%, ${THEMES[s].bg[1]})`, color: THEMES[s].ink }}
              >
                {THEMES[s].label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-tile p-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={removeBg} onChange={(e) => setRemoveBg(e.target.checked)} className="h-4 w-4 accent-ink" />
            Remove plain background
          </label>
          {removeBg && (
            <label className="mt-2 block">
              <span className="flex justify-between">
                Strength <span className="text-muted">{cut?.removed ? "background removed" : "background kept (not plain)"}</span>
              </span>
              <input type="range" min={10} max={90} value={tol} onChange={(e) => setTol(Number(e.target.value))} className="h-8 w-full accent-ink" />
            </label>
          )}
          <p className="mt-1 text-xs text-muted">Photo taken on a busy table or shelf? Tap AI clean background for a neat cut-out.</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" onClick={() => ai("white")} disabled={!img} className="btn min-h-10 bg-white ring-1 ring-black/15 hover:bg-black/5">
              AI clean background (~$0.04)
            </button>
            <button type="button" onClick={() => ai("scene")} disabled={!img} className="btn min-h-10 bg-white ring-1 ring-black/15 hover:bg-black/5">
              AI scene background (~$0.04)
            </button>
            {scene && (
              <button type="button" onClick={() => setScene(null)} className="btn min-h-10 ring-1 ring-black/15 hover:bg-black/5">
                Remove AI scene
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label className="col-span-2">
            <span className="mb-1 block font-medium">Big title</span>
            <input className={field} value={text.headline} maxLength={24} onChange={(e) => set("headline", e.target.value)} />
          </label>
          <label>
            <span className="mb-1 block font-medium">Ribbon</span>
            <input className={field} value={text.ribbon} maxLength={40} onChange={(e) => set("ribbon", e.target.value)} />
          </label>
          <label>
            <span className="mb-1 block font-medium">Tagline</span>
            <input className={field} value={text.tagline} maxLength={60} onChange={(e) => set("tagline", e.target.value)} />
          </label>
          <label>
            <span className="mb-1 block font-medium">Price</span>
            <input className={field} value={text.price} maxLength={20} onChange={(e) => set("price", e.target.value)} />
          </label>
          <label>
            <span className="mb-1 block font-medium">Old price (crossed)</span>
            <input className={field} value={text.oldPrice} maxLength={20} onChange={(e) => set("oldPrice", e.target.value)} />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block font-medium">Features (one per line, up to 5)</span>
          <textarea
            className={`${field} py-2`}
            rows={5}
            value={text.features.join("\n")}
            onChange={(e) => set("features", e.target.value.split("\n").slice(0, 5))}
          />
          <span className="text-xs text-muted">These are suggestions. Change them to match this exact product.</span>
        </label>

        <label className="block">
          <span className="mb-1 block font-medium">Bottom badges (one per line, up to 4)</span>
          <textarea className={`${field} py-2`} rows={4} value={text.trust.join("\n")} onChange={(e) => set("trust", e.target.value.split("\n").slice(0, 4))} />
        </label>

        <div className="grid grid-cols-2 gap-2">
          <label>
            <span className="mb-1 block font-medium">Shop name</span>
            <input className={field} value={text.store} maxLength={20} onChange={(e) => set("store", e.target.value)} />
          </label>
          <label>
            <span className="mb-1 block font-medium">Website / phone</span>
            <input className={field} value={text.footer} maxLength={40} onChange={(e) => set("footer", e.target.value)} />
          </label>
        </div>
        <button type="button" onClick={() => setText(defaults(product))} className="btn ring-1 ring-black/15 hover:bg-black/5">
          Reset text
        </button>
      </fieldset>
    </div>
  );
}
