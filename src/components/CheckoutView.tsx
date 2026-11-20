"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { formatPrice, getProduct } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { CITIES, PAYMENT_METHODS, normalizePkMobile, validateCheckout, type CheckoutErrors, type CheckoutForm } from "@/lib/checkout";
import { ProductImage } from "./ProductImage";
import { Icon } from "./Icon";

const empty: CheckoutForm = { name: "", phone: "", email: "", city: "", address: "", notes: "", payment: "cod" };

type Placed = { id: string; total: number; phone: string; payment: string };

export function CheckoutView() {
  const { lines, totals, ready, dispatch } = useCart();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [placed, setPlaced] = useState<Placed | null>(null);
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState("");

  const set = (k: keyof CheckoutForm) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  if (placed) {
    return (
      <div className="wrap max-w-xl py-16 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-700">
          <Icon name="shield" className="h-8 w-8" />
        </span>
        <h1 className="mt-5 font-display text-4xl font-bold">Order placed</h1>
        <p className="mt-3 text-muted">
          Thank you. Your order <b className="text-ink">{placed.id}</b> for <b className="text-ink">{formatPrice(placed.total)}</b> ({placed.payment}) is confirmed.
          We will call <b className="text-ink">{placed.phone}</b> to confirm delivery.
        </p>
        <Link href="/" className="btn mt-8 bg-ink text-white hover:bg-black">Continue shopping</Link>
      </div>
    );
  }

  if (!ready) return <div className="wrap min-h-[50vh] py-16" aria-busy="true" />;

  if (lines.length === 0) {
    return (
      <div className="wrap py-20 text-center">
        <h1 className="font-display text-4xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted">Add something you love, then come back to check out.</p>
        <Link href="/collections/all" className="btn mt-6 bg-ink text-white hover:bg-black">Browse products</Link>
      </div>
    );
  }

  const showErrors = (errs: CheckoutErrors) => {
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) document.getElementById(`f-${first}`)?.focus();
    return !!first;
  };

  const submit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (sending || showErrors(validateCheckout(form))) return;
    setSending(true);
    setFailure("");
    try {
      // The server re-validates and re-prices from the catalog; client totals are never trusted.
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form, lines }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 422 && data.errors) {
        if (data.errors.lines) setFailure(data.errors.lines);
        showErrors(data.errors);
        return;
      }
      if (!res.ok || !data.id) {
        setFailure(data.error ?? "We could not place your order. Please try again.");
        return;
      }
      setPlaced({
        id: data.id,
        total: data.total,
        phone: normalizePkMobile(form.phone)!,
        payment: PAYMENT_METHODS.find((p) => p.id === form.payment)!.label,
      });
      dispatch({ type: "clear" });
      window.scrollTo({ top: 0 });
    } catch {
      setFailure("No internet connection. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="wrap pt-8">
      <h1 className="font-display text-4xl font-bold tracking-tight">Checkout</h1>
      <form onSubmit={submit} noValidate className="mt-6 grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          <section className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
            <h2 className="font-display text-xl font-bold">Delivery details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field id="name" label="Full name" error={errors.name}>
                <input id="f-name" autoComplete="name" value={form.name} onChange={set("name")} className="field" aria-invalid={!!errors.name} aria-describedby="e-name" />
              </Field>
              <Field id="phone" label="Mobile number" error={errors.phone}>
                <input id="f-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0300 1234567" value={form.phone} onChange={set("phone")} className="field" aria-invalid={!!errors.phone} aria-describedby="e-phone" />
              </Field>
              <Field id="email" label="Email (optional)" error={errors.email}>
                <input id="f-email" type="email" autoComplete="email" value={form.email} onChange={set("email")} className="field" aria-invalid={!!errors.email} aria-describedby="e-email" />
              </Field>
              <Field id="city" label="City" error={errors.city}>
                <input id="f-city" list="cities" autoComplete="address-level2" value={form.city} onChange={set("city")} className="field" aria-invalid={!!errors.city} aria-describedby="e-city" />
                <datalist id="cities">
                  {CITIES.map((c) => <option key={c} value={c} />)}
                </datalist>
              </Field>
              <div className="sm:col-span-2">
                <Field id="address" label="Full address" error={errors.address}>
                  <textarea id="f-address" rows={3} autoComplete="street-address" value={form.address} onChange={set("address")} className="field py-2.5" aria-invalid={!!errors.address} aria-describedby="e-address" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field id="notes" label="Order notes (optional)">
                  <input id="f-notes" value={form.notes} onChange={set("notes")} placeholder="Landmark, delivery time..." className="field" />
                </Field>
              </div>
            </div>
          </section>

          <fieldset className="rounded-2xl bg-white p-6 ring-1 ring-black/5" aria-describedby="e-payment">
            <legend className="float-left font-display text-xl font-bold">Payment method</legend>
            <div className="clear-both grid gap-2 pt-4">
              {PAYMENT_METHODS.map((m, i) => {
                const disabled = m.id === "card";
                return (
                  <label key={m.id} className={`flex items-start gap-3 rounded-xl p-3 ring-1 transition ${form.payment === m.id ? "bg-tile ring-ink" : "ring-black/10"} ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:ring-black/30"}`}>
                    <input
                      id={i === 0 ? "f-payment" : undefined}
                      type="radio"
                      name="payment"
                      value={m.id}
                      disabled={disabled}
                      checked={form.payment === m.id}
                      onChange={set("payment")}
                      className="mt-1 h-4 w-4 accent-ink"
                    />
                    <span>
                      <span className="block text-sm font-semibold">{m.label}</span>
                      <span className="block text-xs text-muted">{m.note}</span>
                    </span>
                  </label>
                );
              })}
            </div>
            {errors.payment && <p id="e-payment" className="mt-2 text-sm text-red-600">{errors.payment}</p>}
          </fieldset>
        </div>

        <aside className="rounded-2xl bg-white p-6 ring-1 ring-black/5 lg:sticky lg:top-32">
          <h2 className="font-display text-xl font-bold">Order summary</h2>
          <ul className="mt-4 space-y-3">
            {lines.map((l) => {
              const p = getProduct(l.slug)!;
              return (
                <li key={`${l.slug}|${l.color}`} className="flex items-center gap-3 text-sm">
                  <span className="relative grid h-14 w-14 flex-none place-items-center rounded-lg bg-tile">
                    <ProductImage product={p} className="h-12 w-12" />
                    <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[11px] font-bold text-white">{l.qty}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{p.model} {p.name}</span>
                    <span className="block text-xs text-muted">{l.color}</span>
                  </span>
                  <span className="whitespace-nowrap font-semibold">{formatPrice(p.price * l.qty)}</span>
                </li>
              );
            })}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-black/10 pt-4 text-sm">
            <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
            {totals.savings > 0 && <Row label="You save" value={`-${formatPrice(totals.savings)}`} className="text-accent" />}
            <Row label="Delivery" value={totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)} />
            <Row label="Total" value={formatPrice(totals.total)} className="border-t border-black/10 pt-3 text-base font-bold" />
          </dl>
          <button type="submit" disabled={sending} aria-busy={sending} className="btn mt-5 w-full bg-ink text-white hover:bg-black disabled:opacity-60">
            {sending ? "Placing order..." : "Place order"}
          </button>
          {failure && <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{failure}</p>}
          <p className="mt-3 text-center text-xs text-muted">By placing your order you agree to our <Link href="/info/terms" className="underline">terms</Link>.</p>
        </aside>
      </form>
    </div>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={`f-${id}`} className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
      {error && <p id={`e-${id}`} className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function Row({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`flex justify-between gap-4 ${className}`}>
      <dt>{label}</dt>
      <dd className="whitespace-nowrap">{value}</dd>
    </div>
  );
}
