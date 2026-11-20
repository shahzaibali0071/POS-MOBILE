"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { formatPrice } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { CartLines, FreeShippingMeter } from "./CartLines";
import { Overlay } from "./Overlay";
import { Icon } from "./Icon";

export function CartDrawer() {
  const { lines, totals, drawerOpen, setDrawerOpen } = useCart();
  const close = () => setDrawerOpen(false);

  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (drawerOpen) setDrawerOpen(false);
  }

  return (
    <Overlay open={drawerOpen} onClose={close} side="right" label="Shopping cart">
      <div className="flex items-center justify-between border-b border-black/10 p-4">
        <h2 className="font-display text-xl font-bold">Your Cart ({totals.count})</h2>
        <button className="btn px-3" onClick={close} aria-label="Close cart">
          <Icon name="close" />
        </button>
      </div>

      {lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <Icon name="bag" className="h-12 w-12 text-muted" />
          <p className="text-muted">Your cart is empty.</p>
          <Link href="/collections/all" onClick={close} className="btn bg-ink text-white hover:bg-black">
            Start shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="p-4 pb-0">
            <FreeShippingMeter subtotal={totals.subtotal} />
          </div>
          <div className="flex-1 overflow-y-auto px-4">
            <CartLines onNavigate={close} />
          </div>
          <div className="space-y-3 border-t border-black/10 p-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <b>{formatPrice(totals.subtotal)}</b>
            </div>
            {totals.savings > 0 && (
              <div className="flex justify-between text-sm text-accent">
                <span>You save</span>
                <b>{formatPrice(totals.savings)}</b>
              </div>
            )}
            <Link href="/checkout" onClick={close} className="btn w-full bg-ink text-white hover:bg-black">
              Checkout <Icon name="arrow" className="h-4 w-4" />
            </Link>
            <Link href="/cart" onClick={close} className="btn w-full ring-1 ring-black/15 hover:bg-black/5">
              View cart
            </Link>
          </div>
        </>
      )}
    </Overlay>
  );
}
