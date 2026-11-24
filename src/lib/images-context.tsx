"use client";

import { createContext, useContext, type ReactNode } from "react";

export const ImagesContext = createContext<Record<string, string[]>>({});

/** Makes the uploaded product photos available to every client component (cards, cart, search). */
export function ImagesProvider({ images, children }: { images: Record<string, string[]>; children: ReactNode }) {
  return <ImagesContext.Provider value={images}>{children}</ImagesContext.Provider>;
}

/** Studio photos for a product, keyed by its POS id (stable even when the name changes). */
export const useProductImages = (posId: number): string[] => useContext(ImagesContext)[String(posId)] ?? [];
