"use client";

import Link from "next/link";
import { useState } from "react";
import { formatPrice, productsTagged, searchProducts } from "@/lib/catalog";
import { ProductImage } from "./ProductImage";
import { Overlay } from "./Overlay";
import { Icon } from "./Icon";

export function SearchPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const results = q.trim() ? searchProducts(q) : productsTagged("new").slice(0, 4);

  return (
    <Overlay open={open} onClose={onClose} side="top" label="Search">
      <div className="wrap py-4">
        <div className="flex items-center gap-2">
          <label className="relative flex-1">
            <span className="sr-only">Search products</span>
            <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              autoFocus
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search earbuds, watches, chargers..."
              className="field pl-11"
            />
          </label>
          <button className="btn px-3" onClick={onClose} aria-label="Close search">
            <Icon name="close" />
          </button>
        </div>

        <p className="mb-2 mt-5 text-xs font-semibold text-muted">{q.trim() ? `Results for "${q.trim()}"` : "New arrivals"}</p>
        {results.length === 0 ? (
          <p className="py-6 text-sm text-muted">No products match that search. Try a category like earbuds or chargers.</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {results.map((p) => (
              <li key={p.slug}>
                <Link href={`/products/${p.slug}`} onClick={onClose} className="flex items-center gap-3 rounded-xl p-2 hover:bg-tile">
                  <span className="grid h-16 w-16 flex-none place-items-center rounded-lg bg-tile">
                    <ProductImage product={p} className="h-14 w-14" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{p.model} {p.name}</span>
                    <span className="block truncate text-xs text-muted">{p.tagline}</span>
                    <span className="text-sm font-bold">{formatPrice(p.price)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Overlay>
  );
}
