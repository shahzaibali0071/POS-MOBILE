"use client";

import { useState } from "react";
import { normalizePkMobile } from "@/lib/checkout";

// ponytail: frontend only; call the order-status API once orders are stored.
export function TrackOrderForm() {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  return (
    <form
      noValidate
      className="mt-6 space-y-4 rounded-2xl bg-white p-6 ring-1 ring-black/5"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const id = String(data.get("order") ?? "").trim().toUpperCase();
        const phone = String(data.get("phone") ?? "");
        if (!/^VX-[A-Z0-9]{4,}$/.test(id)) return setMsg({ ok: false, text: "Order numbers look like VX-ABC123." });
        if (!normalizePkMobile(phone)) return setMsg({ ok: false, text: "Enter a valid mobile number, e.g. 0300 1234567." });
        setMsg({ ok: true, text: `Order ${id} is being prepared for dispatch. (Preview data.)` });
      }}
    >
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Order number</span>
        <input name="order" placeholder="VX-ABC123" className="field uppercase" autoComplete="off" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Mobile number</span>
        <input name="phone" type="tel" inputMode="tel" placeholder="0300 1234567" className="field" />
      </label>
      <button className="btn w-full bg-ink text-white hover:bg-black">Track order</button>
      {msg && (
        <p role="status" className={`rounded-xl p-3 text-sm ${msg.ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"}`}>
          {msg.text}
        </p>
      )}
    </form>
  );
}
