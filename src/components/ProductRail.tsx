import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { ProductCard } from "./ProductCard";
import { Icon } from "./Icon";

/** Section with a heading and products: swipeable row on phones, grid from tablet up. */
export function ProductRail({ title, href, products }: { title: string; href: string; products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section className="wrap mt-16">
      <div className="mb-5 flex items-end justify-between gap-4">
        <h2 className="font-display text-3xl font-bold tracking-tight">{title}</h2>
        <Link href={href} className="flex flex-none items-center gap-1 text-sm font-semibold hover:underline">
          View all <Icon name="arrow" className="h-4 w-4" />
        </Link>
      </div>
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {products.slice(0, 4).map((p) => (
          <div key={p.slug} className="w-[72%] flex-none snap-start sm:w-auto">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
