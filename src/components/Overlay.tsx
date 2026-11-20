"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  side: "left" | "right" | "top";
  label: string;
  children: ReactNode;
};

const placement = {
  left: "mr-auto h-dvh max-h-none w-[min(380px,88vw)]",
  right: "ml-auto h-dvh max-h-none w-[min(420px,92vw)]",
  top: "mb-auto w-full max-w-none",
};

// Native <dialog> gives us focus trapping, Escape-to-close and top-layer stacking for free.
export function Overlay({ open, onClose, side, label, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className={`m-0 overflow-hidden bg-white p-0 text-ink shadow-2xl backdrop:bg-black/40 ${placement[side]}`}
    >
      <div className="flex h-full flex-col">{children}</div>
    </dialog>
  );
}
