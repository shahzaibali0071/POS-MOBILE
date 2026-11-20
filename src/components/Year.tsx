"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

// Rendered after hydration only, so it never freezes at build time or breaks prerendering.
export function Year() {
  return useSyncExternalStore(noop, () => new Date().getFullYear(), () => null);
}
