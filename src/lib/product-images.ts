import "server-only";
import { list } from "@vercel/blob";
import { photoUrl } from "./upload-rules";
import { cacheLife, cacheTag } from "next/cache";

export const IMAGES_TAG = "product-images";
export const IMAGE_PREFIX = "products/";

/** POS id -> studio photo URLs, in upload order (first one is the cover). */
export type ImageMap = Record<string, string[]>;

/**
 * Lists every product photo in Blob storage once and caches it until an upload or delete
 * calls updateTag(IMAGES_TAG). Pathnames look like products/<posId>/<timestamp>-<variant>.webp.
 */
export async function getProductImages(): Promise<ImageMap> {
  "use cache";
  cacheTag(IMAGES_TAG);

  // No store configured (local dev, preview export): fall back to drawn placeholders.
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    cacheLife("max");
    return {};
  }

  try {
    const found: { id: string; pathname: string; url: string }[] = [];
    let cursor: string | undefined;
    do {
      const page = await list({ prefix: IMAGE_PREFIX, cursor });
      for (const b of page.blobs) {
        const id = b.pathname.split("/")[1];
        if (id) found.push({ id, pathname: b.pathname, url: photoUrl(b.pathname) });
      }
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);

    found.sort((a, b) => a.pathname.localeCompare(b.pathname));
    const map: ImageMap = {};
    for (const f of found) (map[f.id] ??= []).push(f.url);
    cacheLife("max");
    return map;
  } catch (err) {
    // Storage hiccup: keep the store up with placeholders and retry soon instead of caching the miss forever.
    console.error("Failed to list product images", err);
    cacheLife("minutes");
    return {};
  }
}
