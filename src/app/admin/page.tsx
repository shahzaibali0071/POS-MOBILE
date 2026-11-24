import type { Metadata } from "next";
import { Suspense } from "react";
import { list } from "@vercel/blob";
import { connection } from "next/server";
import { formatPrice, products } from "@/lib/catalog";
import { adminConfigured, isAdmin } from "@/lib/admin-auth";
import { getProductImages, type ImageMap } from "@/lib/product-images";
import { LoginForm } from "@/components/admin/LoginForm";
import { photoUrl } from "@/lib/upload-rules";
import { PhotoStudio } from "@/components/admin/PhotoStudio";

export const metadata: Metadata = { title: "Photo Studio", robots: { index: false, follow: false } };

// AI angle generation runs inside this page's server actions and can take a while.
export const maxDuration = 120;

async function listDrafts(): Promise<ImageMap> {
  const map: ImageMap = {};
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: "drafts/", cursor });
    for (const b of page.blobs) (map[b.pathname.split("/")[1]] ??= []).push(photoUrl(b.pathname));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return map;
}

async function AdminGate() {
  await connection(); // always render per request, never serve a cached login state
  if (!adminConfigured()) {
    return <p className="rounded-2xl bg-white p-6 ring-1 ring-black/5">Admin login is not set up. Add an ADMIN_PASSWORD (12+ characters) in the Vercel project settings, then redeploy.</p>;
  }
  if (!(await isAdmin())) return <LoginForm />;

  const blobReady = !!process.env.BLOB_READ_WRITE_TOKEN;
  const [published, drafts] = await Promise.all([getProductImages(), blobReady ? listDrafts() : Promise.resolve({})]);
  return (
    <PhotoStudio
      products={[...products]
        .sort((a, b) => `${a.model} ${a.name}`.localeCompare(`${b.model} ${b.name}`))
        .map((p) => ({
          id: String(p.posId),
          label: `${p.model} ${p.name}`.trim(),
          name: p.name,
          model: p.model,
          category: p.category,
          price: formatPrice(p.price),
          oldPrice: p.compareAt ? formatPrice(p.compareAt) : "",
          image: p.image ?? "",
        }))}
      published={published}
      drafts={drafts}
      blobReady={blobReady}
    />
  );
}

export default function AdminPage() {
  return (
    <div className="wrap max-w-4xl pt-8">
      <h1 className="font-display text-4xl font-bold tracking-tight">Photo Studio</h1>
      <p className="mt-2 text-muted">Snap or pick 1 to 3 photos. The studio cleans them up, makes extra versions and uploads them to the product page.</p>
      <div className="mt-6">
        <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-white ring-1 ring-black/5" />}>
          <AdminGate />
        </Suspense>
      </div>
    </div>
  );
}
