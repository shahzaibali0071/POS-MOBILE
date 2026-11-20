import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { infoPages } from "@/lib/pages";

export const generateStaticParams = () => Object.keys(infoPages).map((slug) => ({ slug }));

export async function generateMetadata({ params }: PageProps<"/info/[slug]">): Promise<Metadata> {
  const page = infoPages[(await params).slug];
  return page ? { title: page.title } : {};
}

export default async function InfoPage({ params }: PageProps<"/info/[slug]">) {
  const page = infoPages[(await params).slug];
  if (!page) notFound();
  return (
    <article className="wrap max-w-2xl pt-12">
      <h1 className="font-display text-4xl font-bold tracking-tight">{page.title}</h1>
      <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink/80">
        {page.body.map((p) => <p key={p}>{p}</p>)}
      </div>
    </article>
  );
}
