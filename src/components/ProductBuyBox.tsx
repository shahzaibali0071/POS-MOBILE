"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { discountPct, formatPrice, FREE_SHIPPING_MIN, type Product } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { ProductImage } from "./ProductImage";
import { Stars } from "./Stars";
import { QtyStepper } from "./CartLines";
import { Icon } from "./Icon";


export function ProductBuyBox({ product: p }: { product: Product }) {
  const { dispatch, setDrawerOpen } = useCart();
  const router = useRouter();
  const [color, setColor] = useState(p.colors[0]);
  const [qty, setQty] = useState(1);
  const off = discountPct(p);

  const add = () => dispatch({ type: "add", slug: p.slug, color: color.name, qty });

  return (
    <div className="mt-4 grid gap-8 lg:grid-cols-2 lg:gap-12">
      <div>
        <div className="relative grid aspect-square place-items-center overflow-hidden rounded-3xl bg-tile">
          <ProductImage product={p} className="art h-4/5 w-4/5" />
          {p.badge && <span className="absolute left-4 top-4 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">{p.badge}</span>}
        </div>
      </div>

      <div className="lg:pt-4">
        <p className="text-sm font-semibold text-muted">{p.model}</p>
        <h1 className="mt-1 font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl">{p.name}</h1>
        <p className="mt-3 text-muted">{p.tagline}</p>
        {p.rating !== undefined && <div className="mt-3"><Stars rating={p.rating} reviews={p.reviews} /></div>}

        <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="whitespace-nowrap text-3xl font-bold">{formatPrice(p.price)}</span>
          {off > 0 && (
            <>
              <s className="whitespace-nowrap text-lg text-muted">{formatPrice(p.compareAt!)}</s>
              <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-white">Save {off}%</span>
            </>
          )}
        </div>

        {p.colors.length > 1 && (
        <fieldset className="mt-6">
          <legend className="text-sm">
            Colour: <b>{color.name}</b>
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {p.colors.map((c) => (
              <label key={c.name} className="cursor-pointer" title={c.name}>
                <input type="radio" name="color" className="peer sr-only" checked={c.name === color.name} onChange={() => setColor(c)} />
                <span
                  className="block h-11 w-11 rounded-full ring-1 ring-black/15 ring-offset-2 transition peer-checked:ring-2 peer-checked:ring-ink peer-focus-visible:ring-2 peer-focus-visible:ring-accent"
                  style={{ background: c.hex }}
                />
                <span className="sr-only">{c.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <QtyStepper value={qty} onChange={(n) => setQty(Math.max(1, n))} label={p.name} />
          <button
            className="btn flex-1 bg-white ring-1 ring-ink hover:bg-ink hover:text-white"
            onClick={() => {
              add();
              setDrawerOpen(true);
            }}
          >
            Add to Cart
          </button>
        </div>
        <button
          className="btn mt-3 w-full bg-ink text-white hover:bg-black"
          onClick={() => {
            add();
            router.push("/checkout");
          }}
        >
          Buy it now
        </button>

        <ul className="mt-6 space-y-2 rounded-2xl bg-white p-4 text-sm ring-1 ring-black/5">
          <li className="flex items-center gap-3"><Icon name="truck" /> Free delivery over {formatPrice(FREE_SHIPPING_MIN)}, dispatched in 24 hours</li>
          <li className="flex items-center gap-3"><Icon name="shield" /> 1 year official warranty</li>
          <li className="flex items-center gap-3"><Icon name="cash" /> Cash on delivery available</li>
        </ul>
      </div>
    </div>
  );
}
