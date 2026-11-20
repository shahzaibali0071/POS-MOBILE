import Link from "next/link";
import { discountPct, formatPrice, type Product } from "@/lib/catalog";
import { ProductImage } from "./ProductImage";
import { Stars } from "./Stars";
import { AddToCartButton } from "./AddToCartButton";

export function ProductCard({ product: p }: { product: Product }) {
  const off = discountPct(p);
  const href = `/products/${p.slug}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 transition hover:shadow-lg">
      <Link href={href} className="relative block aspect-square bg-tile" aria-label={`${p.model} ${p.name}`}>
        <ProductImage product={p} className="art absolute inset-0 m-auto h-4/5 w-4/5 transition duration-300 group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {p.badge && <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white">{p.badge}</span>}
          {off > 0 && <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-white">-{off}%</span>}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs font-semibold text-muted">{p.model}</p>
        <h3 className="font-display text-base font-semibold leading-snug">
          <Link href={href} className="hover:underline">{p.name}</Link>
        </h3>
        <p className="line-clamp-1 text-sm text-muted">{p.tagline}</p>
        {p.rating !== undefined && <Stars rating={p.rating} reviews={p.reviews} />}
        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-2">
          <span className="whitespace-nowrap text-lg font-bold">{formatPrice(p.price)}</span>
          {off > 0 && <s className="whitespace-nowrap text-sm text-muted">{formatPrice(p.compareAt!)}</s>}
        </div>
        <AddToCartButton slug={p.slug} color={p.colors[0].name} className="mt-3 w-full" label="Buy Now" />
      </div>
    </article>
  );
}
