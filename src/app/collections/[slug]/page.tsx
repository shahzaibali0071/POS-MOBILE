import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, collectionSlugs, getCollection } from "@/lib/catalog";
import { CollectionGrid } from "@/components/CollectionGrid";

export const generateStaticParams = () => collectionSlugs().map((slug) => ({ slug }));

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const c = getCollection((await params).slug);
  return c ? { title: c.title, description: c.description } : {};
}

export default async function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) notFound();

  return (
    <div className="wrap pt-8">
      <nav className="text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-ink">Home</Link> / <span className="text-ink">{c.title}</span>
      </nav>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">{c.title}</h1>
      <p className="mt-2 text-muted">{c.description}</p>

      <nav className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" aria-label="Collections">
        {[{ slug: "all", name: "All" }, ...categories].map((x) => (
          <Link
            key={x.slug}
            href={`/collections/${x.slug}`}
            aria-current={x.slug === slug ? "page" : undefined}
            className={`btn flex-none ring-1 ${x.slug === slug ? "bg-ink text-white ring-ink" : "bg-white ring-black/10 hover:ring-black/30"}`}
          >
            {x.name}
          </Link>
        ))}
      </nav>

      <CollectionGrid products={c.products} />
    </div>
  );
}
