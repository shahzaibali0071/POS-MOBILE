// Browser-side photo editing for the admin studio: auto-enhance, crop/rotate, and turning one
// photo into several shop-ready versions. Pure maths is exported separately so it can be tested.

export type Rotation = 0 | 90 | 180 | 270;

export type Edit = {
  rotation: Rotation;
  zoom: number; // 1 = fill the frame
  panX: number; // -1..1, share of the overflow
  panY: number;
  brightness: number; // 1 = unchanged
  contrast: number; // 1 = unchanged
  auto: boolean; // auto-levels
  bg: string; // padding colour for "contain" versions
};

export const DEFAULT_EDIT: Edit = { rotation: 0, zoom: 1, panX: 0, panY: 0, brightness: 1, contrast: 1, auto: true, bg: "#ffffff" };

export type Variant = {
  id: string;
  label: string;
  w: number;
  h: number;
  fit: "cover" | "contain";
  zoom?: number; // extra zoom on top of the user's
  blurBg?: boolean;
};

export const VARIANTS: Variant[] = [
  { id: "main", label: "Main (square)", w: 1200, h: 1200, fit: "cover" },
  { id: "closeup", label: "Close-up detail", w: 1200, h: 1200, fit: "cover", zoom: 1.8 },
  { id: "full", label: "Full product with margin", w: 1200, h: 1200, fit: "contain" },
  { id: "banner", label: "Wide banner 16:9", w: 1600, h: 900, fit: "contain", blurBg: true },
];

export const DEFAULT_VARIANTS = ["main", "closeup", "full"];

const MAX_SOURCE_PX = 2400;
const CONTAIN_MARGIN = 0.86;

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Where to draw the (rotated) photo inside a W x H frame. */
export function layout(srcW: number, srcH: number, rotation: Rotation, W: number, H: number, fit: "cover" | "contain", zoom: number, panX: number, panY: number) {
  const swap = rotation === 90 || rotation === 270;
  const iw = swap ? srcH : srcW;
  const ih = swap ? srcW : srcH;
  const base = fit === "cover" ? Math.max(W / iw, H / ih) : Math.min((W * CONTAIN_MARGIN) / iw, (H * CONTAIN_MARGIN) / ih);
  const scale = base * Math.max(1, zoom);
  const maxX = Math.max(0, (iw * scale - W) / 2);
  const maxY = Math.max(0, (ih * scale - H) / 2);
  return { scale, maxX, maxY, cx: W / 2 + clamp(panX, -1, 1) * maxX, cy: H / 2 + clamp(panY, -1, 1) * maxY };
}

/** Darkest and brightest luminance (1st and 99th percentile) for auto-levels. Flat images are left alone. */
export function levels(rgba: Uint8ClampedArray): { lo: number; hi: number } {
  const hist = new Uint32Array(256);
  let n = 0;
  for (let i = 0; i < rgba.length; i += 16) {
    hist[(rgba[i] * 0.299 + rgba[i + 1] * 0.587 + rgba[i + 2] * 0.114) | 0]++;
    n++;
  }
  const pick = (target: number) => {
    let acc = 0;
    for (let v = 0; v < 256; v++) if ((acc += hist[v]) >= target) return v;
    return 255;
  };
  const lo = pick(n * 0.01);
  const hi = pick(n * 0.99);
  return hi - lo < 64 ? { lo: 0, hi: 255 } : { lo, hi };
}

/** One linear map per channel: auto-levels stretch, then brightness, then contrast around mid-grey. */
export function toneTable(lo: number, hi: number, brightness: number, contrast: number): Uint8ClampedArray {
  const table = new Uint8ClampedArray(256);
  const k = 255 / Math.max(1, hi - lo);
  for (let v = 0; v < 256; v++) table[v] = ((v - lo) * k * brightness - 128) * contrast + 128;
  return table;
}

export function applyTone(rgba: Uint8ClampedArray, table: Uint8ClampedArray) {
  for (let i = 0; i < rgba.length; i += 4) {
    rgba[i] = table[rgba[i]];
    rgba[i + 1] = table[rgba[i + 1]];
    rgba[i + 2] = table[rgba[i + 2]];
  }
}

// ---------- browser-only helpers ----------

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = Math.round(w);
  c.height = Math.round(h);
  return c;
}

const ctx2d = (c: HTMLCanvasElement) => c.getContext("2d", { willReadFrequently: true })!;

export type Source = { raw: HTMLCanvasElement; auto: { lo: number; hi: number } };

/** Decodes a phone photo (respecting EXIF rotation), shrinks it for speed and measures its levels. */
export async function loadSource(file: Blob): Promise<Source> {
  const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
  const s = Math.min(1, MAX_SOURCE_PX / Math.max(bmp.width, bmp.height));
  const raw = canvas(bmp.width * s, bmp.height * s);
  ctx2d(raw).drawImage(bmp, 0, 0, raw.width, raw.height);
  bmp.close();
  const sample = canvas(200, (200 * raw.height) / raw.width);
  ctx2d(sample).drawImage(raw, 0, 0, sample.width, sample.height);
  return { raw, auto: levels(ctx2d(sample).getImageData(0, 0, sample.width, sample.height).data) };
}

/** Applies tone settings once so every version and the preview share the same corrected pixels. */
export function toneSource(src: Source, e: Edit): HTMLCanvasElement {
  const { lo, hi } = e.auto ? src.auto : { lo: 0, hi: 255 };
  if (lo === 0 && hi === 255 && e.brightness === 1 && e.contrast === 1) return src.raw;
  const out = canvas(src.raw.width, src.raw.height);
  const c = ctx2d(out);
  c.drawImage(src.raw, 0, 0);
  const img = c.getImageData(0, 0, out.width, out.height);
  applyTone(img.data, toneTable(lo, hi, e.brightness, e.contrast));
  c.putImageData(img, 0, 0);
  return out;
}

function drawPhoto(c: CanvasRenderingContext2D, photo: HTMLCanvasElement, e: Edit, W: number, H: number, fit: "cover" | "contain", zoom: number, panX: number, panY: number) {
  const L = layout(photo.width, photo.height, e.rotation, W, H, fit, zoom, panX, panY);
  c.save();
  c.translate(L.cx, L.cy);
  c.rotate((e.rotation * Math.PI) / 180);
  c.drawImage(photo, (-photo.width * L.scale) / 2, (-photo.height * L.scale) / 2, photo.width * L.scale, photo.height * L.scale);
  c.restore();
}

/** Renders one shop version. `scale` < 1 makes a cheap preview of the same composition. */
export function renderVariant(photo: HTMLCanvasElement, e: Edit, v: Variant, scale = 1): HTMLCanvasElement {
  const W = v.w * scale;
  const H = v.h * scale;
  const out = canvas(W, H);
  const c = ctx2d(out);
  c.imageSmoothingQuality = "high";
  c.fillStyle = e.bg;
  c.fillRect(0, 0, W, H);
  if (v.blurBg) {
    // Downscale-then-upscale blur works in every browser (canvas filter is missing in Safari).
    const tiny = canvas(32, (32 * H) / W);
    drawPhoto(ctx2d(tiny), photo, e, tiny.width, tiny.height, "cover", 1, 0, 0);
    c.globalAlpha = 0.85;
    c.drawImage(tiny, 0, 0, W, H);
    c.globalAlpha = 1;
  }
  if (v.fit === "cover") drawPhoto(c, photo, e, W, H, "cover", e.zoom * (v.zoom ?? 1), e.panX, e.panY);
  else drawPhoto(c, photo, e, W, H, "contain", 1, 0, 0);
  return out;
}

/** WebP keeps files small; Safari can't encode WebP, so fall back to JPEG there. */
export async function encode(c: HTMLCanvasElement): Promise<Blob> {
  const as = (type: string, q: number) => new Promise<Blob | null>((r) => c.toBlob(r, type, q));
  const webp = await as("image/webp", 0.86);
  if (webp && webp.type === "image/webp") return webp;
  const jpeg = await as("image/jpeg", 0.88);
  if (!jpeg) throw new Error("This browser could not export the photo.");
  return jpeg;
}

/** Smaller copy of a source for live previews, so sliders stay smooth on phones. */
export function shrink(src: Source, maxPx: number): Source {
  const s = Math.min(1, maxPx / Math.max(src.raw.width, src.raw.height));
  if (s === 1) return src;
  const raw = canvas(src.raw.width * s, src.raw.height * s);
  ctx2d(raw).drawImage(src.raw, 0, 0, raw.width, raw.height);
  return { raw, auto: src.auto };
}
