"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { approveDraft, deletePhoto, generateAngles, importPhoto, logout, uploadPhoto, type ActionResult } from "@/app/admin/actions";
import { AI_ANGLES, AI_COST_USD_PER_IMAGE } from "@/lib/ai-angles";
import { DEFAULT_EDIT, DEFAULT_VARIANTS, encode, loadSource, renderVariant, toneSource, VARIANTS, type Edit, type Source } from "@/lib/photo-edit";
import { PhotoCard } from "./PhotoCard";

const MAX_PHOTOS = 3;

type Item = { id: string; source: Source; edit: Edit };
type Note = { ok: boolean; text: string };
type Props = {
  products: { id: string; label: string }[];
  published: Record<string, string[]>;
  drafts: Record<string, string[]>;
  blobReady: boolean;
};

export function PhotoStudio({ products, published, drafts, blobReady }: Props) {
  const router = useRouter();
  const [pid, setPid] = useState(products[0]?.id ?? "");
  const [items, setItems] = useState<Item[]>([]);
  const [variants, setVariants] = useState<string[]>(DEFAULT_VARIANTS);
  const [useAi, setUseAi] = useState(true);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [importUrl, setImportUrl] = useState("");

  const photos = published[pid] ?? [];
  const pending = drafts[pid] ?? [];
  const say = (ok: boolean, text: string) => setNotes((n) => [...n, { ok, text }]);
  const ok = (r: ActionResult, what: string): r is Extract<ActionResult, { ok: true }> => {
    if (!r.ok) say(false, `${what}: ${r.error}`);
    return r.ok;
  };

  /** Runs one admin job with a busy lock, a status line and a refresh of the server data afterwards. */
  async function job(label: string, work: () => Promise<void>) {
    setBusy(true);
    setNotes([]);
    setStatus(label);
    try {
      await work();
    } catch (err) {
      console.error(err);
      say(false, "Something went wrong. Check your internet connection and try again.");
    } finally {
      setBusy(false);
      setStatus("");
      router.refresh();
    }
  }

  async function addFiles(list: FileList | null) {
    if (!list?.length) return;
    const room = MAX_PHOTOS - items.length;
    if (list.length > room) say(false, `Up to ${MAX_PHOTOS} photos at a time, so ${list.length - Math.max(room, 0)} were skipped.`);
    for (const file of Array.from(list).slice(0, Math.max(room, 0))) {
      try {
        const source = await loadSource(file);
        setItems((xs) => [...xs, { id: crypto.randomUUID(), source, edit: { ...DEFAULT_EDIT } }]);
      } catch {
        say(false, `${file.name || "Photo"} could not be opened. Try a JPG or PNG.`);
      }
    }
  }

  const publish = () =>
    job("Preparing photos...", async () => {
      let uploaded = 0;
      let aiMade = 0;
      const chosen = VARIANTS.filter((v) => variants.includes(v.id));
      for (const [i, item] of items.entries()) {
        const photo = toneSource(item.source, item.edit);
        let firstUrl: string | undefined;
        for (const v of chosen) {
          setStatus(`Photo ${i + 1} of ${items.length}: uploading ${v.label.toLowerCase()}...`);
          const blob = await encode(renderVariant(photo, item.edit, v));
          const fd = new FormData();
          fd.set("pid", pid);
          fd.set("variant", v.id);
          fd.set("file", blob, `${v.id}.${blob.type === "image/webp" ? "webp" : "jpg"}`);
          const r = await uploadPhoto(fd);
          if (ok(r, `Photo ${i + 1} ${v.label}`)) {
            uploaded++;
            firstUrl ??= r.url;
          }
        }
        if (useAi && firstUrl) {
          setStatus(`Photo ${i + 1} of ${items.length}: AI is creating ${AI_ANGLES.length} new angles. This takes up to a minute...`);
          const r = await generateAngles(firstUrl);
          if (ok(r, `Photo ${i + 1} AI angles`)) aiMade += r.made ?? 0;
        }
      }
      setItems([]);
      say(true, `Done. ${uploaded} photos are live${useAi ? `, and ${aiMade} AI angles are waiting for your check below` : ""}.`);
    });

  const runImport = () =>
    job("Downloading image...", async () => {
      const fd = new FormData();
      fd.set("pid", pid);
      fd.set("url", importUrl);
      if (ok(await importPhoto(fd), "Import")) {
        setImportUrl("");
        say(true, "Image added to the product.");
      }
    });

  const remove = (url: string) => {
    if (!window.confirm("Delete this photo? This cannot be undone.")) return;
    job("Deleting...", async () => {
      if (ok(await deletePhoto(url), "Delete")) say(true, "Photo deleted.");
    });
  };

  const approve = (urls: string[]) =>
    job("Publishing...", async () => {
      let done = 0;
      for (const url of urls) if (ok(await approveDraft(url), "Publish")) done++;
      say(true, `${done} AI photo${done === 1 ? "" : "s"} published.`);
    });

  const moreAngles = (url: string) =>
    job(`AI is creating ${AI_ANGLES.length} new angles. This takes up to a minute...`, async () => {
      const r = await generateAngles(url);
      if (ok(r, "AI angles")) say(true, `${r.made} new AI angles are waiting for your check below.${r.failed ? ` ${r.failed} failed.` : ""}`);
    });

  const aiCost = (items.length * AI_ANGLES.length * AI_COST_USD_PER_IMAGE).toFixed(2);

  return (
    <div className="space-y-6">
      {!blobReady && (
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">Photo storage is not connected yet, so uploads will fail. Connect a Vercel Blob store to this project.</p>
      )}

      <div className="flex flex-wrap items-end gap-3 rounded-2xl bg-white p-4 ring-1 ring-black/5">
        <label className="min-w-0 flex-1">
          <span className="mb-1.5 block text-sm font-medium">Product</span>
          <select value={pid} onChange={(e) => setPid(e.target.value)} disabled={busy} className="field">
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label} (#{p.id}, {published[p.id]?.length ?? 0} studio photos)
              </option>
            ))}
          </select>
        </label>
        <form action={logout}>
          <button className="btn ring-1 ring-black/15 hover:bg-black/5">Log out</button>
        </form>
      </div>

      {(status || notes.length > 0) && (
        <div className="space-y-2" aria-live="polite">
          {status && <p className="rounded-xl bg-ink p-3 text-sm text-white">{status}</p>}
          {notes.map((n, i) => (
            <p key={i} className={`rounded-xl p-3 text-sm ${n.ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"}`}>
              {n.text}
            </p>
          ))}
        </div>
      )}

      <section className="rounded-2xl bg-white p-4 ring-1 ring-black/5">
        <h2 className="font-display text-xl font-bold">1. Add photos</h2>
        <p className="mt-1 text-sm text-muted">Use 1 to 3 clear photos of the real product. Good light, plain background works best.</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <PickButton label="Take photo" capture disabled={busy || items.length >= MAX_PHOTOS} onFiles={addFiles} />
          <PickButton label="Choose from gallery" multiple disabled={busy || items.length >= MAX_PHOTOS} onFiles={addFiles} />
        </div>
        <div className="mt-4 flex gap-2">
          <label className="min-w-0 flex-1">
            <span className="sr-only">Image link</span>
            <input
              type="url"
              inputMode="url"
              placeholder="Or paste an official image link (https://...)"
              value={importUrl}
              onChange={(e) => setImportUrl(e.target.value)}
              disabled={busy}
              className="field"
            />
          </label>
          <button type="button" onClick={runImport} disabled={busy || !importUrl.trim()} className="btn bg-ink text-white hover:bg-black">
            Add
          </button>
        </div>
      </section>

      {items.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-bold">2. Check and adjust</h2>
          {items.map((item, i) => (
            <PhotoCard
              key={item.id}
              index={i}
              source={item.source}
              edit={item.edit}
              variants={variants}
              disabled={busy}
              onChange={(edit) => setItems((xs) => xs.map((x) => (x.id === item.id ? { ...x, edit } : x)))}
              onRemove={() => setItems((xs) => xs.filter((x) => x.id !== item.id))}
            />
          ))}

          <div className="rounded-2xl bg-white p-4 ring-1 ring-black/5">
            <h2 className="font-display text-xl font-bold">3. Publish</h2>
            <fieldset disabled={busy} className="mt-3 grid gap-2 sm:grid-cols-2">
              <legend className="sr-only">Versions to create from each photo</legend>
              {VARIANTS.map((v) => (
                <label key={v.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-ink"
                    checked={variants.includes(v.id)}
                    onChange={(e) => setVariants((vs) => (e.target.checked ? [...vs, v.id] : vs.filter((x) => x !== v.id)))}
                  />
                  {v.label}
                </label>
              ))}
              <label className="flex items-start gap-2 text-sm sm:col-span-2">
                <input type="checkbox" className="mt-0.5 h-4 w-4 accent-ink" checked={useAi} onChange={(e) => setUseAi(e.target.checked)} />
                <span>
                  Create {AI_ANGLES.length} extra AI angles per photo ({AI_ANGLES.map((a) => a.label.toLowerCase()).join(", ")}). About ${aiCost} in Vercel AI credits.
                  You approve them before they go live.
                </span>
              </label>
            </fieldset>
            <button
              type="button"
              onClick={publish}
              disabled={busy || (variants.length === 0 && !useAi)}
              className="btn mt-4 w-full bg-accent text-white hover:brightness-95"
            >
              {busy ? "Working..." : `Publish ${items.length} photo${items.length === 1 ? "" : "s"}`}
            </button>
          </div>
        </section>
      )}

      {pending.length > 0 && (
        <section className="rounded-2xl bg-white p-4 ring-1 ring-amber-300">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold">AI angles to check ({pending.length})</h2>
              <p className="text-sm text-muted">AI can change small details. Publish only photos that match the real product.</p>
            </div>
            <button type="button" onClick={() => approve(pending)} disabled={busy} className="btn bg-ink text-white hover:bg-black">
              Publish all
            </button>
          </div>
          <PhotoGrid urls={pending} busy={busy} actions={[{ label: "Publish", onClick: (u) => approve([u]) }, { label: "Delete", danger: true, onClick: remove }]} />
        </section>
      )}

      <section className="rounded-2xl bg-white p-4 ring-1 ring-black/5">
        <h2 className="font-display text-xl font-bold">Studio photos ({photos.length})</h2>
        <p className="text-sm text-muted">Studio photos replace the shop or brand photo. The first one is the cover, the rest show as a gallery, in upload order.</p>
        {photos.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">No studio photos yet, so the shop shows the POS or brand photo.</p>
        ) : (
          <PhotoGrid
            urls={photos}
            busy={busy}
            actions={[
              { label: "AI angles", onClick: moreAngles },
              { label: "Delete", danger: true, onClick: remove },
            ]}
          />
        )}
      </section>
    </div>
  );
}

function PickButton({ label, capture, multiple, disabled, onFiles }: { label: string; capture?: boolean; multiple?: boolean; disabled: boolean; onFiles: (f: FileList | null) => void }) {
  return (
    <label className={`btn cursor-pointer bg-ink text-white hover:bg-black ${disabled ? "pointer-events-none opacity-50" : ""}`}>
      {label}
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        disabled={disabled}
        multiple={multiple}
        {...(capture ? { capture: "environment" as const } : {})}
        onChange={(e) => {
          onFiles(e.target.files);
          e.target.value = ""; // allow picking the same photo again
        }}
      />
    </label>
  );
}

type GridAction = { label: string; danger?: boolean; onClick: (url: string) => void };

function PhotoGrid({ urls, busy, actions }: { urls: string[]; busy: boolean; actions: GridAction[] }) {
  return (
    <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {urls.map((url, i) => (
        <li key={url} className="overflow-hidden rounded-xl ring-1 ring-black/10">
          {/* Admin previews load the stored file directly so new uploads show without waiting on image optimisation. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={`Photo ${i + 1}`} loading="lazy" className="aspect-square w-full bg-tile object-cover" />
          <div className="flex">
            {actions.map((a) => (
              <button
                key={a.label}
                type="button"
                disabled={busy}
                onClick={() => a.onClick(url)}
                className={`min-h-11 flex-1 text-xs font-semibold hover:bg-black/5 disabled:opacity-50 ${a.danger ? "text-red-600" : ""}`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}
