"use client";

import Link from "next/link";
import { formatPrice, getProduct, FREE_SHIPPING_MIN } from "@/lib/catalog";
import { MAX_QTY } from "@/lib/cart-reducer";
import { useCart } from "@/lib/cart";
import { ProductImage } from "./ProductImage";
import { Icon } from "./Icon";

export function QtyStepper({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  return (
    <div className="inline-flex items-center rounded-full ring-1 ring-black/15" role="group" aria-label={`Quantity for ${label}`}>
      <button type="button" className="btn h-10 min-h-10 px-3" onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        <Icon name="minus" className="h-4 w-4" />
      </button>
      <span className="w-6 text-center text-sm font-semibold tabular-nums" aria-live="polite">{value}</span>
      <button type="button" className="btn h-10 min-h-10 px-3" onClick={() => onChange(value + 1)} disabled={value >= MAX_QTY} aria-label="Increase quantity">
        <Icon name="plus" className="h-4 w-4" />
      </button>
    </div>
  );
}

export function FreeShippingMeter({ subtotal }: { subtotal: number }) {
  const left = FREE_SHIPPING_MIN - subtotal;
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_MIN) * 100);
  return (
    <div className="rounded-xl bg-tile p-3 text-sm">
      <p>{left > 0 ? <>Add <b>{formatPrice(left)}</b> more for free delivery</> : <b>You have unlocked free delivery</b>}</p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/10">
        <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/** Editable list of cart lines, shared by the drawer and the cart page. */
export function CartLines({ onNavigate }: { onNavigate?: () => void }) {
  const { lines, dispatch } = useCart();
  return (
    <ul className="divide-y divide-black/10">
      {lines.map((l) => {
        const p = getProduct(l.slug);
        if (!p) return null;
        return (
          <li key={`${l.slug}|${l.color}`} className="flex gap-3 py-4">
            <Link href={`/products/${p.slug}`} onClick={onNavigate} className="grid h-20 w-20 flex-none place-items-center rounded-xl bg-tile">
              <ProductImage product={p} className="h-16 w-16" />
            </Link>
            <div className="min-w-0 flex-1">
              <div className="flex justify-between gap-2">
                <Link href={`/products/${p.slug}`} onClick={onNavigate} className="text-sm font-semibold hover:underline">
                  {p.model} {p.name}
                </Link>
                <button
                  type="button"
                  className="-mr-2 -mt-2 grid h-11 w-11 flex-none place-items-center rounded-full text-muted hover:bg-black/5 hover:text-ink"
                  onClick={() => dispatch({ type: "remove", slug: l.slug, color: l.color })}
                  aria-label={`Remove ${p.name}`}
                >
                  <Icon name="trash" className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-muted">{l.color}</p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <QtyStepper value={l.qty} label={p.name} onChange={(qty) => dispatch({ type: "setQty", slug: l.slug, color: l.color, qty })} />
                <span className="whitespace-nowrap text-sm font-bold">{formatPrice(p.price * l.qty)}</span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
