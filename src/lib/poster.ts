// Poster Maker: turns one plain product photo into a social-media sale poster (1200x1200):
// glowing background, cut-out product, big model name, ribbon, feature badges, price and
// trust badges. Everything is drawn on canvas in the browser; only the optional AI scene
// background costs money. The maths (background mask, text fitting) is pure and tested.

import { ICON_PATHS, type IconName } from "@/components/Icon";

export const POSTER_SIZE = 1200;

export type PosterStyle = "neon" | "fire" | "clean" | "brand";

export type PosterText = {
  headline: string; // big model text, e.g. "G601"
  ribbon: string; // product type on the yellow ribbon, e.g. "Gaming Headset"
  tagline: string;
  features: string[]; // up to 5
  price: string; // already formatted, "" to hide
  oldPrice: string;
  trust: string[]; // up to 4 badges along the bottom
  footer: string; // website or phone
  store: string;
};

type Theme = { bg: [string, string, string]; ink: string; sub: string; head: [string, string]; ribbon: string; ribbonInk: string; pill: string; pillLine: string; glow: string[] };

export const THEMES: Record<PosterStyle, Theme & { label: string }> = {
  neon: {
    label: "Neon gaming",
    bg: ["#050817", "#1747ff", "#c11fd6"],
    ink: "#ffffff",
    sub: "#cfd8ff",
    head: ["#38bdf8", "#e879f9"],
    ribbon: "#facc15",
    ribbonInk: "#0b0b10",
    pill: "rgba(8,12,40,.78)",
    pillLine: "#38bdf8",
    glow: ["#ff004c", "#ffb300", "#22ff88", "#00c8ff", "#8a2bff", "#ff004c"],
  },
  fire: {
    label: "Fire",
    bg: ["#120604", "#ff5a1f", "#ffb020"],
    ink: "#ffffff",
    sub: "#ffe2cc",
    head: ["#ffd166", "#ff5a1f"],
    ribbon: "#ffffff",
    ribbonInk: "#1a0a04",
    pill: "rgba(30,10,4,.75)",
    pillLine: "#ff8a3d",
    glow: ["#ff3d00", "#ffb300", "#ff3d00"],
  },
  clean: {
    label: "Clean white",
    bg: ["#f4f4f6", "#dfe7ff", "#ffe4dc"],
    ink: "#111113",
    sub: "#4b4b55",
    head: ["#111113", "#e5482b"],
    ribbon: "#e5482b",
    ribbonInk: "#ffffff",
    pill: "rgba(255,255,255,.9)",
    pillLine: "#e5482b",
    glow: ["#c7d2fe", "#fecaca", "#c7d2fe"],
  },
  brand: {
    label: "Voltix black",
    bg: ["#0b0b0d", "#e5482b", "#2a2a33"],
    ink: "#ffffff",
    sub: "#d4d4d8",
    head: ["#ffffff", "#ff7a59"],
    ribbon: "#e5482b",
    ribbonInk: "#ffffff",
    pill: "rgba(20,20,24,.82)",
    pillLine: "#e5482b",
    glow: ["#e5482b", "#ffb199", "#e5482b"],
  },
};

const TRUST_ICONS: IconName[] = ["truck", "shield", "cash", "refresh"];
const DISPLAY = '"Space Grotesk Variable", "Inter Variable", sans-serif';
const SANS = '"Inter Variable", sans-serif';

// ---------- pure helpers (tested) ----------

/**
 * Marks the photo's background: pixels connected to the border whose colour is within `tol`
 * of the average border colour. Works for products shot on a plain wall, table or white sheet.
 * Returns 1 for background, 0 for product.
 */
export function backgroundMask(rgba: Uint8ClampedArray, w: number, h: number, tol: number): Uint8Array {
  let r = 0, g = 0, b = 0, n = 0;
  const border: number[] = [];
  for (let x = 0; x < w; x++) border.push(x, (h - 1) * w + x);
  for (let y = 1; y < h - 1; y++) border.push(y * w, y * w + w - 1);
  for (const i of border) {
    r += rgba[i * 4]; g += rgba[i * 4 + 1]; b += rgba[i * 4 + 2]; n++;
  }
  r /= n; g /= n; b /= n;
  const near = (i: number, t: number) => {
    const dr = rgba[i * 4] - r, dg = rgba[i * 4 + 1] - g, db = rgba[i * 4 + 2] - b;
    return dr * dr + dg * dg + db * db <= t * t * 3;
  };

  const mask = new Uint8Array(w * h);
  const stack = new Int32Array(w * h);
  /** Grows a region from `seeds` over pixels within `t` of the background colour; returns its pixels. */
  const grow = (seeds: number[], t: number, mark: Uint8Array) => {
    const region: number[] = [];
    let top = 0;
    for (const i of seeds) if (!mark[i] && near(i, t)) { mark[i] = 1; stack[top++] = i; }
    while (top) {
      const i = stack[--top];
      region.push(i);
      const x = i % w;
      const next = [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w];
      for (const j of next) if (j >= 0 && j < w * h && !mark[j] && near(j, t)) { mark[j] = 1; stack[top++] = j; }
    }
    return region;
  };
  grow(border, tol, mask);

  // Large enclosed gaps of background colour (inside a headband, cable loop, stand) are
  // background too. A tighter tolerance and a size floor keep white parts of the product.
  const seen = mask.slice();
  const minHole = Math.max(64, w * h * 0.01);
  for (let i = 0; i < w * h; i++) {
    if (seen[i] || !near(i, tol / 2)) continue;
    const hole = grow([i], tol / 2, seen);
    if (hole.length >= minHole) for (const j of hole) mask[j] = 1;
  }
  return mask;
}

/**
 * Drops specks the background pass left behind: product-pixel islands smaller than 2% of the
 * biggest island become background. Edits `mask` in place and returns it.
 */
export function dropSpecks(mask: Uint8Array, w: number, h: number): Uint8Array {
  const label = new Int32Array(w * h).fill(-1);
  const sizes: number[] = [];
  const stack = new Int32Array(w * h);
  for (let s = 0; s < w * h; s++) {
    if (mask[s] || label[s] >= 0) continue;
    const id = sizes.length;
    let top = 0, size = 0;
    label[s] = id;
    stack[top++] = s;
    while (top) {
      const i = stack[--top];
      size++;
      const x = i % w;
      const next = [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w];
      for (const j of next) if (j >= 0 && j < w * h && !mask[j] && label[j] < 0) { label[j] = id; stack[top++] = j; }
    }
    sizes.push(size);
  }
  const keep = Math.max(0, ...sizes) * 0.02;
  for (let i = 0; i < w * h; i++) if (!mask[i] && sizes[label[i]] < keep) mask[i] = 1;
  return mask;
}

/** Bounding box of the product (non-background) pixels, or null when nothing is left. */
export function productBox(mask: Uint8Array, w: number, h: number) {
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (!mask[y * w + x]) {
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  return x1 < 0 ? null : { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
}

/** Greedy word wrap with a measuring function, capped at `maxLines` (last line gets "..."). */
export function wrap(text: string, maxWidth: number, measure: (s: string) => number, maxLines: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (measure(test) <= maxWidth || !line) line = test;
    else { lines.push(line); line = word; }
  }
  if (line) lines.push(line);
  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines);
  let last = kept[maxLines - 1];
  while (last.length > 1 && measure(`${last}...`) > maxWidth) last = last.slice(0, -1);
  kept[maxLines - 1] = `${last.trimEnd()}...`;
  return kept;
}

/** Largest font size (step 2) between min and max at which `text` fits `maxWidth`. */
export function fitSize(text: string, maxWidth: number, min: number, max: number, measureAt: (s: string, size: number) => number) {
  for (let size = max; size > min; size -= 2) if (measureAt(text, size) <= maxWidth) return size;
  return min;
}

// ---------- canvas drawing (browser only) ----------

export type Cutout = { canvas: HTMLCanvasElement; removed: boolean };

/** Loads an image URL (same-origin or blob:) into an <img> ready for canvas. */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load that photo."));
    img.src = src;
  });
}

/** Cuts the product out of a plain background and crops to it. Busy photos are kept whole. */
export function cutOut(img: CanvasImageSource & { width: number; height: number }, tol: number, enabled: boolean): Cutout {
  const s = Math.min(1, 1400 / Math.max(img.width, img.height));
  const w = Math.round(img.width * s), h = Math.round(img.height * s);
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, w, h);
  if (!enabled) return { canvas: c, removed: false };

  const data = ctx.getImageData(0, 0, w, h);
  const mask = dropSpecks(backgroundMask(data.data, w, h, tol), w, h);
  const share = mask.reduce((a, v) => a + v, 0) / mask.length;
  const box = productBox(mask, w, h);
  // Almost nothing or almost everything removed means the background wasn't plain.
  if (!box || share < 0.04 || share > 0.97) return { canvas: c, removed: false };
  for (let i = 0; i < mask.length; i++) {
    if (mask[i]) data.data[i * 4 + 3] = 0;
    else {
      // soften the outline: product pixels touching the background get half alpha
      const x = i % w;
      if ((x > 0 && mask[i - 1]) || (x < w - 1 && mask[i + 1]) || mask[i - w] || mask[i + w]) data.data[i * 4 + 3] = 150;
    }
  }
  ctx.putImageData(data, 0, 0);

  const out = document.createElement("canvas");
  out.width = box.w; out.height = box.h;
  out.getContext("2d")!.drawImage(c, box.x, box.y, box.w, box.h, 0, 0, box.w, box.h);
  return { canvas: out, removed: true };
}

function roundRect(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
}

function icon(c: CanvasRenderingContext2D, name: IconName, x: number, y: number, size: number, color: string) {
  c.save();
  c.translate(x, y);
  c.scale(size / 24, size / 24);
  c.strokeStyle = color;
  c.lineWidth = 2;
  c.lineCap = "round";
  c.lineJoin = "round";
  c.stroke(new Path2D(ICON_PATHS[name]));
  c.restore();
}

function background(c: CanvasRenderingContext2D, t: Theme, S: number) {
  c.fillStyle = t.bg[0];
  c.fillRect(0, 0, S, S);
  const blob = (x: number, y: number, r: number, color: string, alpha: number) => {
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, "transparent");
    c.globalAlpha = alpha;
    c.fillStyle = g;
    c.fillRect(0, 0, S, S);
    c.globalAlpha = 1;
  };
  blob(S * 0.15, S * 0.2, S * 0.7, t.bg[1], 0.55);
  blob(S * 0.9, S * 0.85, S * 0.65, t.bg[2], 0.5);
  // faint perspective grid gives the "desk" depth without a photo
  c.strokeStyle = t.ink;
  c.globalAlpha = 0.05;
  c.lineWidth = 1;
  for (let i = 0; i <= 12; i++) {
    c.beginPath(); c.moveTo((i / 12) * S, S * 0.62); c.lineTo(S / 2 + (i / 12 - 0.5) * S * 2.4, S); c.stroke();
  }
  for (let y = S * 0.62; y < S; y += (y - S * 0.55) * 0.35) {
    c.beginPath(); c.moveTo(0, y); c.lineTo(S, y); c.stroke();
  }
  c.globalAlpha = 1;
}

function glowRing(c: CanvasRenderingContext2D, t: Theme, cx: number, cy: number, rx: number) {
  const g = c.createConicGradient(0, cx, cy);
  t.glow.forEach((col, i) => g.addColorStop(i / (t.glow.length - 1), col));
  c.save();
  c.lineWidth = 14;
  c.strokeStyle = g;
  c.shadowColor = t.glow[0];
  c.shadowBlur = 50;
  for (const blur of [60, 24]) {
    c.shadowBlur = blur;
    c.beginPath();
    c.ellipse(cx, cy, rx, rx * 0.22, 0, 0, Math.PI * 2);
    c.stroke();
  }
  c.restore();
}

export type PosterInput = {
  style: PosterStyle;
  text: PosterText;
  product: Cutout | null;
  scene: HTMLImageElement | null; // AI scene: replaces background and product
};

/** Draws the full poster. Layout: text column left, product right, trust row along the bottom. */
export function drawPoster(c: CanvasRenderingContext2D, { style, text, product, scene }: PosterInput) {
  const S = POSTER_SIZE;
  const t = THEMES[style];
  const font = (weight: number, size: number, family = DISPLAY, italic = false) => `${italic ? "italic " : ""}${weight} ${size}px ${family}`;
  const measureAt = (f: string) => (s: string) => { c.font = f; return c.measureText(s).width; };
  c.save();
  c.clearRect(0, 0, S, S);

  if (scene) {
    const k = Math.max(S / scene.width, S / scene.height);
    c.drawImage(scene, (S - scene.width * k) / 2, (S - scene.height * k) / 2, scene.width * k, scene.height * k);
    const shade = c.createLinearGradient(0, 0, S * 0.75, 0);
    shade.addColorStop(0, "rgba(0,0,0,.78)");
    shade.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = shade;
    c.fillRect(0, 0, S, S);
  } else {
    background(c, t, S);
    if (product) {
      const area = { x: 470, y: 150, w: 690, h: 760 };
      const k = Math.min(area.w / product.canvas.width, area.h / product.canvas.height);
      const w = product.canvas.width * k, h = product.canvas.height * k;
      const x = area.x + (area.w - w) / 2, y = area.y + area.h - h;
      glowRing(c, t, x + w / 2, y + h - 8, Math.max(w, 260) * 0.62);
      c.save();
      c.shadowColor = "rgba(0,0,0,.45)";
      c.shadowBlur = 40;
      c.shadowOffsetY = 24;
      if (product.removed) c.drawImage(product.canvas, x, y, w, h);
      else {
        roundRect(c, x, y, w, h, 28);
        c.clip();
        c.drawImage(product.canvas, x, y, w, h);
      }
      c.restore();
    }
  }

  const ink = scene ? "#ffffff" : t.ink;
  const sub = scene ? "#e5e7eb" : t.sub;

  // store name
  c.fillStyle = ink;
  c.font = font(700, 46);
  c.textBaseline = "top";
  c.fillText(text.store, 60, 52);
  const storeW = c.measureText(text.store).width;
  c.fillStyle = t.ribbon === "#ffffff" ? t.pillLine : t.ribbon;
  c.beginPath(); c.arc(60 + storeW + 14, 88, 8, 0, Math.PI * 2); c.fill();

  // headline with gradient
  const headSize = fitSize(text.headline, 640, 70, 190, (s, size) => measureAt(font(800, size))(s));
  c.font = font(800, headSize);
  const hg = c.createLinearGradient(60, 0, 60 + c.measureText(text.headline).width, 0);
  hg.addColorStop(0, scene ? "#7dd3fc" : t.head[0]);
  hg.addColorStop(1, scene ? "#f0abfc" : t.head[1]);
  c.fillStyle = hg;
  c.shadowColor = "rgba(0,0,0,.35)";
  c.shadowBlur = 18;
  let y = 140;
  c.fillText(text.headline, 60, y);
  c.shadowBlur = 0;
  y += headSize * 0.98;

  // skewed ribbon
  if (text.ribbon.trim()) {
    const rSize = fitSize(text.ribbon, 520, 30, 54, (s, size) => measureAt(font(700, size, DISPLAY, true))(s));
    c.font = font(700, rSize, DISPLAY, true);
    const rw = c.measureText(text.ribbon).width + 70;
    const rh = rSize + 30;
    c.save();
    c.translate(48, y);
    c.transform(1, 0, -0.25, 1, 0, 0);
    c.fillStyle = t.ribbon;
    c.fillRect(0, 0, rw, rh);
    c.restore();
    c.fillStyle = t.ribbonInk;
    c.fillText(text.ribbon, 80, y + 16);
    y += rh + 26;
  }

  // tagline
  if (text.tagline.trim()) {
    c.font = font(600, 36, DISPLAY, true);
    c.fillStyle = ink;
    for (const line of wrap(text.tagline, 470, measureAt(c.font), 2)) {
      c.fillText(line, 60, y);
      y += 46;
    }
    y += 18;
  }

  // feature pills
  const feats = text.features.map((f) => f.trim()).filter(Boolean).slice(0, 5);
  const pillH = 74;
  const room = 1000 - y; // keep clear of the price row
  const gap = Math.max(10, Math.min(18, (room - feats.length * pillH) / Math.max(1, feats.length)));
  for (const f of feats) {
    if (y + pillH > 1000) break;
    c.fillStyle = scene ? "rgba(0,0,0,.6)" : t.pill;
    c.strokeStyle = t.pillLine;
    c.lineWidth = 2;
    c.shadowColor = t.pillLine;
    c.shadowBlur = scene || style === "clean" ? 0 : 16;
    roundRect(c, 50, y, 400, pillH, 22);
    c.fill();
    c.stroke();
    c.shadowBlur = 0;
    icon(c, "check", 70, y + 19, 36, t.pillLine);
    c.font = font(600, 28, SANS);
    c.fillStyle = ink;
    const lines = wrap(f, 300, measureAt(c.font), 2);
    lines.forEach((l, i) => c.fillText(l, 126, y + (lines.length === 1 ? 22 : 8 + i * 30)));
    y += pillH + gap;
  }

  // price tag (bottom-left)
  if (text.price.trim()) {
    c.font = font(800, 64);
    const pw = c.measureText(text.price).width + 60;
    c.fillStyle = t.ribbon;
    c.shadowColor = "rgba(0,0,0,.35)";
    c.shadowBlur = 20;
    roundRect(c, 50, 1012, pw, 84, 42);
    c.fill();
    c.shadowBlur = 0;
    c.fillStyle = t.ribbonInk;
    c.fillText(text.price, 80, 1022);
    if (text.oldPrice.trim()) {
      c.font = font(600, 34, SANS);
      c.fillStyle = sub;
      const ox = 50 + pw + 24;
      c.fillText(text.oldPrice, ox, 1040);
      const ow = c.measureText(text.oldPrice).width;
      c.strokeStyle = sub;
      c.lineWidth = 3;
      c.beginPath(); c.moveTo(ox - 4, 1058); c.lineTo(ox + ow + 4, 1058); c.stroke();
    }
  }

  // trust badges along the bottom
  const trust = text.trust.map((s) => s.trim()).filter(Boolean).slice(0, 4);
  if (trust.length) {
    const barY = 1118;
    const bw = (S - 100 - (trust.length - 1) * 14) / trust.length;
    trust.forEach((label, i) => {
      const x = 50 + i * (bw + 14);
      c.fillStyle = scene ? "rgba(0,0,0,.6)" : t.pill;
      c.strokeStyle = t.pillLine;
      c.lineWidth = 2;
      roundRect(c, x, barY, bw, 62, 18);
      c.fill();
      c.stroke();
      icon(c, TRUST_ICONS[i % TRUST_ICONS.length], x + 16, barY + 15, 32, t.pillLine);
      c.font = font(600, fitSize(label, bw - 72, 16, 24, (s, size) => measureAt(font(600, size, SANS))(s)), SANS);
      c.fillStyle = ink;
      c.fillText(label, x + 58, barY + 19);
    });
  }

  // footer (website / phone) top-right
  if (text.footer.trim()) {
    c.font = font(600, 24, SANS);
    c.fillStyle = sub;
    c.textAlign = "right";
    c.fillText(text.footer, S - 50, 66);
    c.textAlign = "left";
  }
  c.restore();
}

/** Suggested feature lines per category. Generic on purpose: the admin edits them to the real specs. */
export const FEATURE_HINTS: Record<string, string[]> = {
  earbuds: ["Wireless freedom", "Clear calls", "Deep bass", "Long battery life", "Comfort fit"],
  handsfree: ["Crystal clear calls", "Built-in mic", "Comfort fit", "Tangle-free cable"],
  chargers: ["Fast charging", "Safe & cool", "Compact design", "Wide compatibility"],
  cables: ["Fast charging", "Fast data sync", "Durable build", "Tangle-free"],
  "power-banks": ["High capacity", "Fast charging", "Multiple ports", "Travel friendly"],
  audio: ["Powerful sound", "Deep bass", "Wireless connect", "Portable design"],
  "smart-watches": ["Big bright display", "Health tracking", "Smart notifications", "Long battery"],
  computer: ["Plug & play", "Reliable performance", "Comfortable use", "Durable build"],
  mobiles: ["Original product", "Official warranty", "Fast performance", "Great camera"],
  accessories: ["Premium quality", "Perfect fit", "Durable build", "Great value"],
};
