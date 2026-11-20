"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { CartLines, FreeShippingMeter } from "./CartLines";
import { Icon } from "./Icon";

export function CartView() {
  const { lines, totals, ready } = useCart();

  if (!ready) return <div className="wrap min-h-[50vh] py-16" aria-busy="true" />;

  return (
    <div className="wrap pt-8">
      <h1 className="font-display text-4xl font-bold tracking-tight">Your Cart</h1>
      {lines.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-muted">Your cart is empty.</p>
          <Link href="/collections/all" className="btn mt-6 bg-ink text-white hover:bg-black">Browse products</Link>
        </div>
      ) : (
        <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-2xl bg-white px-5 ring-1 ring-black/5">
            <CartLines />
          </div>
          <aside className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-black/5 lg:sticky lg:top-32">
            <FreeShippingMeter subtotal={totals.subtotal} />
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt>Subtotal ({totals.count} items)</dt><dd className="font-semibold">{formatPrice(totals.subtotal)}</dd></div>
              {totals.savings > 0 && <div className="flex justify-between text-accent"><dt>You save</dt><dd className="font-semibold">-{formatPrice(totals.savings)}</dd></div>}
              <div className="flex justify-between"><dt>Delivery</dt><dd className="font-semibold">{totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}</dd></div>
              <div className="flex justify-between border-t border-black/10 pt-3 text-base font-bold"><dt>Total</dt><dd>{formatPrice(totals.total)}</dd></div>
            </dl>
            <Link href="/checkout" className="btn w-full bg-ink text-white hover:bg-black">
              Checkout <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
