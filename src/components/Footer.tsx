import Link from "next/link";
import { categories } from "@/lib/catalog";
import { Newsletter } from "./Newsletter";
import { Year } from "./Year";

const columns = [
  {
    title: "Shop",
    links: [{ href: "/collections/all", label: "All Products" }, ...categories.map((c) => ({ href: `/collections/${c.slug}`, label: c.name }))],
  },
  {
    title: "Company",
    links: [
      { href: "/info/about", label: "About Us" },
      { href: "/info/contact", label: "Contact Us" },
      { href: "/info/corporate", label: "Corporate Orders" },
      { href: "/info/privacy", label: "Privacy Policy" },
      { href: "/info/terms", label: "Terms and Conditions" },
    ],
  },
  {
    title: "Care",
    links: [
      { href: "/track-order", label: "Track Your Order" },
      { href: "/info/payments", label: "Modes of Payment" },
      { href: "/info/warranty", label: "Warranty Policy" },
      { href: "/info/returns", label: "Exchange and Refund" },
      { href: "/info/shipping", label: "Shipping Policy" },
    ],
  },
];

const payments = ["Visa", "Mastercard", "JazzCash", "Easypaisa", "COD"];

export function Footer() {
  return (
    <footer className="mt-20 bg-ink text-white">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-sm">
          <Link href="/" className="font-display text-3xl font-bold">
            VOLTIX<span className="text-accent">.</span>
          </Link>
          <p className="mt-3 text-sm text-white/65">Smart wearables and tech accessories, built for every day and backed by a 1 year warranty.</p>
          <Newsletter />
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="mb-3 text-sm font-semibold">{col.title}</h2>
            <ul className="space-y-2 text-sm text-white/65">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-col gap-3 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© <Year /> Voltix. All rights reserved.</p>
          <ul className="flex flex-wrap gap-2" aria-label="Accepted payment methods">
            {payments.map((p) => (
              <li key={p} className="rounded-md bg-white/10 px-2 py-1 font-semibold text-white/80">{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

