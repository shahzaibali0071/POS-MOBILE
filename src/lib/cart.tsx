"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";
import { cartReducer, cartTotals, type CartAction, type CartLine } from "./cart-reducer";

const STORAGE_KEY = "voltix-cart-v1";

type CartContextValue = {
  lines: CartLine[];
  totals: ReturnType<typeof cartTotals>;
  ready: boolean;
  dispatch: (a: CartAction) => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  // `ready` flips on the first "load" so nothing is persisted before storage is read.
  const [{ lines, ready }, dispatch] = useReducer(
    (s: { lines: CartLine[]; ready: boolean }, a: CartAction) => ({
      lines: cartReducer(s.lines, a),
      ready: s.ready || a.type === "load",
    }),
    { lines: [], ready: false },
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Load after mount so server HTML and first client render match.
  useEffect(() => {
    let saved: CartLine[] = [];
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {
      // Corrupt or blocked storage: start with an empty cart.
    }
    dispatch({ type: "load", lines: saved });
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Storage full or disabled: cart still works for this visit.
    }
  }, [lines, ready]);

  const value = useMemo(
    () => ({ lines, totals: cartTotals(lines), ready, dispatch, drawerOpen, setDrawerOpen }),
    [lines, ready, drawerOpen],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
