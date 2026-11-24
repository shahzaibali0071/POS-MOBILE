import { get } from "@vercel/blob";
import { isAdmin } from "@/lib/admin-auth";
import { ownPhotoPath } from "@/lib/upload-rules";

/**
 * Serves Photo Studio images from the private Blob store. Published photos have unique file
 * names, so the CDN may cache them for a year; AI drafts are visible to the admin only.
 */
export async function GET(_req: Request, ctx: RouteContext<"/api/photos/[...path]">) {
  const raw = (await ctx.params).path.join("/");
  const published = ownPhotoPath(raw, "products/");
  const draft = ownPhotoPath(raw, "drafts/");
  const path = published ?? draft;
  if (!path) return new Response("Not found", { status: 404 });
  if (draft && !(await isAdmin())) return new Response("Not found", { status: 404 });

  const blob = await get(path, { access: "private" });
  if (!blob || blob.statusCode !== 200) return new Response("Not found", { status: 404 });
  return new Response(blob.stream, {
    headers: {
      "Content-Type": blob.blob.contentType,
      "Cache-Control": published ? "public, max-age=31536000, immutable" : "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
