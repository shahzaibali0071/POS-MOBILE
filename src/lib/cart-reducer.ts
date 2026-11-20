import { getProduct, shippingFor } from "./catalog";

export const MAX_QTY = 10;

export type CartLine = { slug: string; color: string; qty: number };

export type CartAction =
  | { type: "add"; slug: string; color: string; qty?: number }
  | { type: "setQty"; slug: string; color: string; qty: number }
  | { type: "remove"; slug: string; color: string }
  | { type: "clear" }
  | { type: "load"; lines: CartLine[] };

const clampQty = (n: number) => Math.min(MAX_QTY, Math.max(1, Math.floor(Number.isFinite(n) ? n : 1)));
const same = (l: CartLine, slug: string, color: string) => l.slug === slug && l.color === color;

/** Drops lines whose product or colour no longer exists (stale localStorage, catalog edits). */
export function sanitize(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  const out: CartLine[] = [];
  for (const l of raw) {
    if (!l || typeof l.slug !== "string" || typeof l.color !== "string") continue;
    const p = getProduct(l.slug);
    if (!p || !p.colors.some((c) => c.name === l.color)) continue;
    const existing = out.find((x) => same(x, l.slug, l.color));
    if (existing) existing.qty = clampQty(existing.qty + clampQty(Number(l.qty)));
    else out.push({ slug: l.slug, color: l.color, qty: clampQty(Number(l.qty)) });
  }
  return out;
}

export function cartReducer(state: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case "add": {
      if (!getProduct(action.slug)) return state;
      const add = clampQty(action.qty ?? 1);
      const hit = state.find((l) => same(l, action.slug, action.color));
      return hit
        ? state.map((l) => (l === hit ? { ...l, qty: clampQty(l.qty + add) } : l))
        : [...state, { slug: action.slug, color: action.color, qty: add }];
    }
    case "setQty":
      return state.map((l) => (same(l, action.slug, action.color) ? { ...l, qty: clampQty(action.qty) } : l));
    case "remove":
      return state.filter((l) => !same(l, action.slug, action.color));
    case "clear":
      return [];
    case "load":
      return sanitize(action.lines);
  }
}

export function cartTotals(lines: CartLine[]) {
  let subtotal = 0;
  let savings = 0;
  let count = 0;
  for (const l of lines) {
    const p = getProduct(l.slug);
    if (!p) continue;
    subtotal += p.price * l.qty;
    savings += ((p.compareAt ?? p.price) - p.price) * l.qty;
    count += l.qty;
  }
  const shipping = shippingFor(subtotal);
  return { subtotal, savings, count, shipping, total: subtotal + shipping };
}
