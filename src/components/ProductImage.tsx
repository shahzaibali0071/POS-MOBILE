import { artFor, categoryImage, type ArtKind, type Product } from "@/lib/catalog";
import { ProductArt } from "./ProductArt";

/** The product's photo (official or shop) on white; the drawn art only when there is no photo. */
export function ProductImage({ product: p, className = "", label }: { product: Product; className?: string; label?: string }) {
  if (!p.image) return <ProductArt kind={artFor(p)} color={p.colors[0].hex} className={className} label={label ?? p.name} />;
  // ponytail: plain <img>; switch to next/image if image weight starts to matter.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={p.image} alt={label ?? `${p.model} ${p.name}`.trim()} loading="lazy" decoding="async" className={`object-contain ${className}`} />;
}

/** Category tile picture: a real product photo from that category, or the drawn art. */
export function CategoryThumb({ slug, art, label, className = "" }: { slug: string; art: ArtKind; label: string; className?: string }) {
  const p = categoryImage(slug);
  return p ? <ProductImage product={p} className={className} label={label} /> : <ProductArt kind={art} color="#1c1c1f" className={className} label={label} />;
}
