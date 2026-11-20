import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory, getProduct, products, related } from "@/lib/catalog";
import { ProductBuyBox } from "@/components/ProductBuyBox";
import { ProductRail } from "@/components/ProductRail";

export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const p = getProduct((await params).slug);
  return p ? { title: `${p.model} ${p.name}`, description: p.tagline } : {};
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const cat = getCategory(p.category);

  return (
    <>
      <div className="wrap pt-6">
        <nav className="text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">Home</Link>
          {cat && (
            <>
              {" / "}
              <Link href={`/collections/${cat.slug}`} className="hover:text-ink">{cat.name}</Link>
            </>
          )}
          {" / "}
          <span className="text-ink">{p.model || p.name}</span>
        </nav>

        <ProductBuyBox product={p} />

        <div className={`mt-14 grid gap-6 ${p.features.length ? "lg:grid-cols-2" : ""}`}>
          {p.features.length > 0 && (
          <section className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
            <h2 className="font-display text-2xl font-bold">Highlights</h2>
            <ul className="mt-4 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                  {f}
                </li>
              ))}
            </ul>
          </section>
          )}
          <section className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
            <h2 className="font-display text-2xl font-bold">Specifications</h2>
            <dl className="mt-4 divide-y divide-black/10">
              {p.specs.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-4 py-3 text-sm">
                  <dt className="text-muted">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>

      <ProductRail title="You may also like" href={`/collections/${p.category}`} products={related(p)} />
    </>
  );
}
