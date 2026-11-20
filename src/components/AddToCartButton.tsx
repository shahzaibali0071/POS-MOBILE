"use client";

import { useCart } from "@/lib/cart";

type Props = { slug: string; color: string; qty?: number; label?: string; className?: string; variant?: "solid" | "outline" };

export function AddToCartButton({ slug, color, qty = 1, label = "Add to Cart", className = "", variant = "solid" }: Props) {
  const { dispatch, setDrawerOpen } = useCart();
  const style =
    variant === "solid" ? "bg-ink text-white hover:bg-black" : "bg-white text-ink ring-1 ring-ink hover:bg-ink hover:text-white";
  return (
    <button
      type="button"
      onClick={() => {
        dispatch({ type: "add", slug, color, qty });
        setDrawerOpen(true);
      }}
      className={`btn ${style} ${className}`}
    >
      {label}
    </button>
  );
}
