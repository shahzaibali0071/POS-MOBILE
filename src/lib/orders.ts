import { cartTotals, sanitize } from "./cart-reducer";
import { getProduct } from "./catalog";
import { PAYMENT_METHODS, normalizePkMobile, validateCheckout, type CheckoutErrors, type CheckoutForm } from "./checkout";

export type OrderLine = { posId: number; slug: string; name: string; color: string; qty: number; price: number; lineTotal: number };

export type Order = {
  id: string;
  createdAt: string;
  customer: { name: string; phone: string; email: string; city: string; address: string; notes: string };
  payment: string;
  paymentLabel: string;
  lines: OrderLine[];
  subtotal: number;
  savings: number;
  shipping: number;
  total: number;
};

export type OrderRequest = { form: CheckoutForm; lines: unknown };

const MAX_LEN = { name: 80, phone: 20, email: 120, city: 60, address: 300, notes: 300 } as const;
const ID_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I: read out over the phone

/** 8 random chars from a 32-letter alphabet: ~10^12 ids, collisions are not a practical concern. */
export function newOrderId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return `VX-${Array.from(bytes, (b) => ID_CHARS[b % 32]).join("")}`;
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/**
 * Turns an untrusted checkout request into an order. Prices come from the catalog,
 * never from the client, so a tampered request cannot change what the shop charges.
 */
export function buildOrder(body: unknown, id: string, now: Date): { order: Order } | { errors: CheckoutErrors & { lines?: string } } {
  const b = (body ?? {}) as Partial<OrderRequest>;
  const f = (b.form ?? {}) as Record<string, unknown>;
  const form: CheckoutForm = {
    name: str(f.name, MAX_LEN.name),
    phone: str(f.phone, MAX_LEN.phone),
    email: str(f.email, MAX_LEN.email),
    city: str(f.city, MAX_LEN.city),
    address: str(f.address, MAX_LEN.address),
    notes: str(f.notes, MAX_LEN.notes),
    payment: str(f.payment, 20) as CheckoutForm["payment"],
  };
  const errors: CheckoutErrors & { lines?: string } = validateCheckout(form);
  const cart = sanitize(b.lines);
  if (cart.length === 0) errors.lines = "Your cart is empty.";
  if (Object.keys(errors).length) return { errors };

  const totals = cartTotals(cart);
  const lines = cart.map((l) => {
    const p = getProduct(l.slug)!; // sanitize() kept only known products
    return { posId: p.posId, slug: l.slug, name: `${p.model} ${p.name}`.trim(), color: l.color, qty: l.qty, price: p.price, lineTotal: p.price * l.qty };
  });
  return {
    order: {
      id,
      createdAt: now.toISOString(),
      customer: { ...form, phone: normalizePkMobile(form.phone)! },
      payment: form.payment,
      paymentLabel: PAYMENT_METHODS.find((p) => p.id === form.payment)!.label,
      lines,
      subtotal: totals.subtotal,
      savings: totals.savings,
      shipping: totals.shipping,
      total: totals.total,
    },
  };
}

/** Constant-time check of the POS key, so the key cannot be guessed byte by byte from timing. */
export function keyMatches(given: string | null, expected: string | undefined): boolean {
  if (!expected || !given) return false;
  const a = new TextEncoder().encode(given);
  const b = new TextEncoder().encode(expected);
  let diff = a.length ^ b.length;
  for (let i = 0; i < b.length; i++) diff |= (a[i] ?? 0) ^ b[i];
  return diff === 0;
}
