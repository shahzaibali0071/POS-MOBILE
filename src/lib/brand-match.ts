// Matches POS products to official brand catalog products by model code (e.g. "SC-308", "R-9").
// Pure functions so they can be tested without the network.

export type BrandProduct = { title: string; handle: string; skus: string[]; image: string | null };

/** "SC-308", "sc 308", "SC308" -> "SC308"; "SC-308PD" stays distinct as "SC308PD". */
const joinCodes = (s: string) => s.toUpperCase().replace(/\b([A-Z]{1,5})[\s-]?(\d{1,5}[A-Z]{0,3})\b/g, "$1$2");

export function tokens(text: string): Set<string> {
  return new Set(joinCodes(text).split(/[^A-Z0-9]+/).filter(Boolean));
}

/** Model codes in a POS product: letter group + digits, like SC-308, PL-50C, R-9, WCG-10. */
export function modelCodes(text: string): string[] {
  return [...joinCodes(text).matchAll(/\b[A-Z]{1,5}\d{1,5}[A-Z]{0,3}\b/g)].map((m) => m[0]);
}

/**
 * The single catalog product carrying one of the codes, or null when there is no match or
 * more than one candidate (an ambiguous match would show the wrong item, so it is skipped).
 */
export function findMatch(codes: string[], catalog: BrandProduct[]): BrandProduct | null {
  for (const code of codes) {
    const hits = catalog.filter((p) => p.image && tokens([p.title, p.handle, ...p.skus].join(" ")).has(code));
    if (hits.length === 1) return hits[0];
  }
  return null;
}
