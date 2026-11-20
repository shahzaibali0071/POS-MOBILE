"use client";

import { useMemo, useState } from "react";
import { discountPct, type Product } from "@/lib/catalog";
import { ProductCard } from "./ProductCard";

const sorts = {
  featured: { label: "Featured", fn: () => 0 },
  "price-asc": { label: "Price: low to high", fn: (a: Product, b: Product) => a.price - b.price },
  "price-desc": { label: "Price: high to low", fn: (a: Product, b: Product) => b.price - a.price },
  rating: { label: "Top rated", fn: (a: Product, b: Product) => (b.rating ?? 0) - (a.rating ?? 0) },
  discount: { label: "Biggest discount", fn: (a: Product, b: Product) => discountPct(b) - discountPct(a) },
} as const;

type SortKey = keyof typeof sorts;

export function CollectionGrid({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortKey>("featured");
  // Array.prototype.sort is stable, so "featured" (compare = 0) keeps catalog order.
  const list = useMemo(() => [...products].sort(sorts[sort].fn), [products, sort]);

  return (
    <>
      <div className="mt-6 flex items-center justify-between gap-4 border-y border-black/10 py-3">
        <p className="text-sm text-muted">{products.length} {products.length === 1 ? "product" : "products"}</p>
        <label className="flex items-center gap-2 text-sm">
          <span className="hidden sm:inline">Sort by</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="field w-auto py-0 text-sm">
            {Object.entries(sorts).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </label>
      </div>
      {list.length === 0 ? (
        <p className="py-20 text-center text-muted">No products here yet. Check back soon.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </>
  );
}
