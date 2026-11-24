// Pure validation rules for photo uploads; shared by server actions and unit tests.

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
export const MAX_IMPORT_BYTES = 8 * 1024 * 1024;

const SIGNATURES: { type: string; ext: string; test: (b: Uint8Array) => boolean }[] = [
  { type: "image/jpeg", ext: "jpg", test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { type: "image/png", ext: "png", test: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  {
    type: "image/webp",
    ext: "webp",
    test: (b) => ascii(b, 0, 4) === "RIFF" && ascii(b, 8, 12) === "WEBP",
  },
];

function ascii(b: Uint8Array, from: number, to: number) {
  return String.fromCharCode(...b.subarray(from, to));
}

/** Identifies an image by its first bytes, never by the (spoofable) declared type. */
export function sniffImage(bytes: Uint8Array): { type: string; ext: string } | null {
  if (bytes.length < 12) return null;
  const hit = SIGNATURES.find((s) => s.test(bytes));
  return hit ? { type: hit.type, ext: hit.ext } : null;
}

/** Variant labels end up in file names, so keep them short and URL-safe. */
export const cleanVariant = (v: unknown) =>
  String(v ?? "photo")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24) || "photo";

export const PHOTO_ROUTE = "/api/photos/";

/** Public URL the shop uses for a stored photo pathname. */
export const photoUrl = (pathname: string) => `${PHOTO_ROUTE}${pathname}`;

/**
 * Returns the store pathname ("products/<posId>/<file>" or "drafts/<posId>/<file>") for one of
 * our photo URLs or pathnames, otherwise null. Guards every view/delete/approve against other files.
 */
export function ownPhotoPath(raw: unknown, prefix: "products/" | "drafts/"): string | null {
  const path = String(raw ?? "").replace(PHOTO_ROUTE, "");
  return path.startsWith(prefix) && /^(products|drafts)\/\d+\/[A-Za-z0-9._-]+$/.test(path) ? path : null;
}

/** Imports only from public https URLs; blocks obvious local/private targets. */
export function isImportableUrl(raw: unknown): boolean {
  try {
    const u = new URL(String(raw));
    if (u.protocol !== "https:") return false;
    const h = u.hostname;
    return !(h === "localhost" || h.endsWith(".local") || h.endsWith(".internal") || /^(\d+\.){3}\d+$/.test(h) || h.includes(":"));
  } catch {
    return false;
  }
}
