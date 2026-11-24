"use client";

import { artFor, categoryImage, type ArtKind, type Product } from "@/lib/catalog";
import { useProductImages } from "@/lib/images-context";
import { ProductArt } from "./ProductArt";

/**
 * The product's best photo: a Photo Studio upload first, then the official or shop photo,
 * and the drawn art only when there is no photo at all. `index` picks a studio gallery photo.
 */
export function ProductImage({ product: p, className = "", label, index = 0 }: { product: Product; className?: string; label?: string; index?: number }) {
  const studio = useProductImages(p.posId);
  const src = studio[index] ?? studio[0] ?? p.image;
  if (!src) return <ProductArt kind={artFor(p)} color={p.colors[0].hex} className={className} label={label ?? p.name} />;
  // ponytail: plain <img>; switch to next/image if image weight starts to matter.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={label ?? `${p.model} ${p.name}`.trim()} loading="lazy" decoding="async" className={`object-contain ${className}`} />;
}

/** Category tile picture: a real product photo from that category, or the drawn art. */
export function CategoryThumb({ slug, art, label, className = "" }: { slug: string; art: ArtKind; label: string; className?: string }) {
  const p = categoryImage(slug);
  return p ? <ProductImage product={p} className={className} label={label} /> : <ProductArt kind={art} color="#1c1c1f" className={className} label={label} />;
}
