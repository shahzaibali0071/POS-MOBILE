"use server";

import { copy, del, get, put } from "@vercel/blob";
import { gateway, generateImage } from "ai";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getProductByPosId } from "@/lib/catalog";
import { checkPassword, endSession, isAdmin, startSession } from "@/lib/admin-auth";
import { IMAGES_TAG } from "@/lib/product-images";
import { AI_ANGLES, AI_MODEL } from "@/lib/ai-angles";
import { cleanVariant, isImportableUrl, MAX_IMPORT_BYTES, MAX_UPLOAD_BYTES, ownPhotoPath, photoUrl, sniffImage } from "@/lib/upload-rules";

export type ActionResult = { ok: true; url?: string; made?: number; failed?: number } | { ok: false; error: string };

const fail = (error: string): ActionResult => ({ ok: false, error });

async function guard(): Promise<ActionResult | null> {
  if (!(await isAdmin())) return fail("Your session expired. Please log in again.");
  if (!process.env.BLOB_READ_WRITE_TOKEN) return fail("Photo storage is not connected to this site yet.");
  return null;
}

/** Saves validated image bytes. Published photos go to products/, AI output waits in drafts/ for approval. */
async function store(folder: "products" | "drafts", pid: number, variant: string, bytes: Uint8Array) {
  const kind = sniffImage(bytes);
  if (!kind) throw new UserError("That file is not a JPG, PNG or WebP image.");
  // Timestamp prefix keeps photos in upload order; the random suffix prevents collisions.
  const pathname = `${folder}/${pid}/${Date.now()}-${cleanVariant(variant)}.${kind.ext}`;
  // The store is private (it also holds orders); the shop serves photos through /api/photos.
  const blob = await put(pathname, Buffer.from(bytes), { access: "private", contentType: kind.type, addRandomSuffix: true });
  return photoUrl(blob.pathname);
}

class UserError extends Error {}

const explain = (err: unknown, fallback: string) => (err instanceof UserError ? err.message : fallback);

export async function login(_prev: string | null, form: FormData): Promise<string | null> {
  if (checkPassword(String(form.get("password") ?? ""))) {
    await startSession();
    redirect("/admin"); // re-renders the page with the new session cookie
  }
  await new Promise((r) => setTimeout(r, 800)); // slows down password guessing
  return "Wrong password.";
}

export async function logout() {
  await endSession();
  redirect("/admin");
}

export async function uploadPhoto(form: FormData): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return denied;
  const pid = Number(form.get("pid"));
  const file = form.get("file");
  if (!getProductByPosId(pid)) return fail("Unknown product.");
  if (!(file instanceof File) || file.size === 0) return fail("No photo received.");
  if (file.size > MAX_UPLOAD_BYTES) return fail("Photo is larger than 4 MB.");
  try {
    const url = await store("products", pid, String(form.get("variant") ?? ""), new Uint8Array(await file.arrayBuffer()));
    updateTag(IMAGES_TAG);
    return { ok: true, url };
  } catch (err) {
    console.error("uploadPhoto failed", err);
    return fail(explain(err, "Upload failed. Check your connection and try again."));
  }
}

export async function importPhoto(form: FormData): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return denied;
  const pid = Number(form.get("pid"));
  const url = String(form.get("url") ?? "").trim();
  if (!getProductByPosId(pid)) return fail("Unknown product.");
  if (!isImportableUrl(url)) return fail("Paste a full https:// image link.");
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15_000), redirect: "follow" });
    if (!res.ok) return fail(`The link returned an error (${res.status}).`);
    if (Number(res.headers.get("content-length") ?? 0) > MAX_IMPORT_BYTES) return fail("That image is larger than 8 MB.");
    const bytes = new Uint8Array(await res.arrayBuffer());
    if (bytes.length > MAX_IMPORT_BYTES) return fail("That image is larger than 8 MB.");
    const saved = await store("products", pid, "imported", bytes);
    updateTag(IMAGES_TAG);
    return { ok: true, url: saved };
  } catch (err) {
    console.error("importPhoto failed", err);
    return fail(explain(err, "Could not download that link. Open it in your browser to check it shows an image."));
  }
}

/**
 * Creates extra AI views of a published photo. Results land in drafts/ so a person checks them
 * before customers see them: AI can change small product details, which would mislead buyers.
 */
export async function generateAngles(sourceUrl: string): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return denied;
  const path = ownPhotoPath(sourceUrl, "products/");
  const pid = Number(path?.split("/")[1]);
  if (!path || !getProductByPosId(pid)) return fail("Pick one of this product's photos first.");
  try {
    const src = await get(path, { access: "private" });
    if (!src || src.statusCode !== 200) return fail("Could not read the source photo.");
    const source = new Uint8Array(await new Response(src.stream).arrayBuffer());

    const results = await Promise.allSettled(
      AI_ANGLES.map(async (angle) => {
        const { image } = await generateImage({
          model: gateway.imageModel(AI_MODEL),
          prompt: { images: [source], text: angle.prompt },
          aspectRatio: "1:1",
          abortSignal: AbortSignal.timeout(90_000),
        });
        return store("drafts", pid, `ai-${angle.id}`, image.uint8Array);
      }),
    );
    const made = results.filter((r) => r.status === "fulfilled").length;
    results.forEach((r) => r.status === "rejected" && console.error("AI angle failed", r.reason));
    if (made === 0) return fail("AI could not create new angles right now. Check AI Gateway credits in Vercel, then try again.");
    return { ok: true, made, failed: results.length - made };
  } catch (err) {
    console.error("generateAngles failed", err);
    return fail("AI angle generation failed. Try again in a minute.");
  }
}

export async function approveDraft(url: string): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return denied;
  const path = ownPhotoPath(url, "drafts/");
  if (!path) return fail("That is not an AI draft.");
  try {
    const [, pid, file] = path.split("/");
    await copy(path, `products/${pid}/${file}`, { access: "private", addRandomSuffix: false });
    await del(path);
    updateTag(IMAGES_TAG);
    return { ok: true };
  } catch (err) {
    console.error("approveDraft failed", err);
    return fail("Could not publish that photo. Try again.");
  }
}

export async function deletePhoto(url: string): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return denied;
  const path = ownPhotoPath(url, "products/") ?? ownPhotoPath(url, "drafts/");
  if (!path) return fail("That is not a product photo.");
  try {
    await del(path);
    updateTag(IMAGES_TAG);
    return { ok: true };
  } catch (err) {
    console.error("deletePhoto failed", err);
    return fail("Could not delete that photo. Try again.");
  }
}

const SCENES: Record<string, string> = {
  white: "WHITE",
  neon: "a dark gaming desk at night with glowing RGB neon lights in blue and purple, a blurred RGB keyboard behind it",
  fire: "a dark studio with dramatic orange and red rim lighting and glowing embers",
  clean: "a bright minimal white studio with soft daylight and a light grey podium",
  brand: "a sleek black studio with a single warm orange spotlight and a glossy black podium",
};

/**
 * AI background for Poster Maker: puts the real product into a styled scene on the right,
 * leaving the left side dark for the poster text. Returns the image directly (not stored).
 */
export async function posterScene(form: FormData): Promise<{ ok: true; dataUrl: string } | { ok: false; error: string }> {
  if (!(await isAdmin())) return { ok: false, error: "Your session expired. Please log in again." };
  const file = form.get("file");
  const style = String(form.get("style") ?? "neon");
  if (!(file instanceof File) || file.size === 0 || file.size > MAX_UPLOAD_BYTES) return { ok: false, error: "Photo missing or larger than 4 MB." };
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!sniffImage(bytes)) return { ok: false, error: "That file is not a JPG, PNG or WebP image." };
  try {
    const { image } = await generateImage({
      model: gateway.imageModel(AI_MODEL),
      prompt: {
        images: [bytes],
        text:
          style === "white"
            ? "Product photo cut-out: show this exact product alone, centred, on a pure white (#FFFFFF) seamless background with no shadow, no reflection and no other objects. Keep the exact same product: identical shape, colours, packaging, buttons, logo and text."
            : `Professional advertising photo: place this exact product large on the right half of the frame, in ${SCENES[style] ?? SCENES.neon}. Keep the left half of the image simple and darker for text. No text, no letters, no logos added. Keep the exact same product: identical shape, colours, buttons, logo and details.`,
      },
      aspectRatio: "1:1",
      abortSignal: AbortSignal.timeout(90_000),
    });
    return { ok: true, dataUrl: `data:${image.mediaType ?? "image/png"};base64,${image.base64}` };
  } catch (err) {
    console.error("posterScene failed", err);
    return { ok: false, error: "AI could not make the scene right now. Check AI Gateway credits in Vercel, then try again." };
  }
}
