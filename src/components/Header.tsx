"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { categories, formatPrice, FREE_SHIPPING_MIN } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { CategoryThumb } from "./ProductImage";
import { SearchPanel } from "./SearchPanel";
import { Overlay } from "./Overlay";
import { Icon } from "./Icon";

const announcements = [
  `Free delivery on orders over ${formatPrice(FREE_SHIPPING_MIN)}`,
  "Cash on delivery nationwide",
  "1 year official warranty",
  "Express delivery in major cities",
  "Corporate and bulk orders welcome",
];

const navLinks = [
  { href: "/collections/new-arrivals", label: "New Arrivals" },
  { href: "/collections/trending", label: "Trending" },
  { href: "/collections/earbuds", label: "Earbuds" },
  { href: "/collections/smart-watches", label: "Smart Watches" },
  { href: "/track-order", label: "Track Order" },
];

export function Header() {
  const { totals, ready, setDrawerOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  // Close panels on navigation. Adjusting state during render is React's recommended
  // pattern for "reset when a value changes" and avoids an extra effect pass.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
    setSearchOpen(false);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const loop = [...announcements, ...announcements];

  return (
    <header className="sticky top-0 z-40">
      <div className="overflow-hidden bg-ink py-2 text-xs font-medium text-white" aria-label="Store announcements">
        <div className="marquee flex w-max gap-12 whitespace-nowrap">
          {loop.map((a, i) => (
            <span key={i} aria-hidden={i >= announcements.length}>{a}</span>
          ))}
        </div>
      </div>

      <div className="border-b border-black/10 bg-white/90 backdrop-blur">
        <div className="wrap flex h-16 items-center gap-3">
          <button className="btn -ml-2 px-3 lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Icon name="menu" />
          </button>

          <Link href="/" className="font-display text-2xl font-bold tracking-tight">
            VOLTIX<span className="text-accent">.</span>
          </Link>

          <nav className="ml-8 hidden h-full items-center gap-1 lg:flex" aria-label="Main">
            <div className="group relative flex h-full items-center">
              <Link href="/collections/all" className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium hover:bg-black/5">
                Shop <Icon name="chevron" className="h-4 w-4 transition group-hover:rotate-180" />
              </Link>
              <div className="invisible absolute left-0 top-full w-[640px] translate-y-2 rounded-2xl bg-white p-4 opacity-0 shadow-xl ring-1 ring-black/5 transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <div className="grid grid-cols-3 gap-2">
                  {categories.map((c) => (
                    <Link key={c.slug} href={`/collections/${c.slug}`} className="flex items-center gap-3 rounded-xl p-2 hover:bg-tile">
                      <span className="grid h-12 w-12 flex-none place-items-center rounded-lg bg-tile">
                        <CategoryThumb slug={c.slug} art={c.art} className="h-10 w-10" label={c.name} />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold">{c.name}</span>
                        <span className="block text-xs text-muted">{c.blurb}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-3 py-2 text-sm font-medium hover:bg-black/5 ${pathname === l.href ? "bg-black/5" : ""}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <button className="btn px-3" onClick={() => setSearchOpen(true)} aria-label="Search products">
              <Icon name="search" />
            </button>
            <button className="btn relative px-3" onClick={() => setDrawerOpen(true)} aria-label={`Cart, ${totals.count} items`}>
              <Icon name="bag" />
              {ready && totals.count > 0 && (
                <span className="absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">
                  {totals.count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <Overlay open={menuOpen} onClose={() => setMenuOpen(false)} side="left" label="Menu">
        <div className="flex items-center justify-between border-b border-black/10 p-4">
          <span className="font-display text-xl font-bold">Menu</span>
          <button className="btn px-3" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <Icon name="close" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-2" aria-label="Mobile">
          <Link href="/collections/all" className="block rounded-xl px-3 py-3 font-semibold hover:bg-tile">All Products</Link>
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="block rounded-xl px-3 py-3 font-semibold hover:bg-tile">{l.label}</Link>
          ))}
          <p className="px-3 pb-1 pt-4 text-xs font-semibold text-muted">Categories</p>
          {categories.map((c) => (
            <Link key={c.slug} href={`/collections/${c.slug}`} className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-tile">
              <CategoryThumb slug={c.slug} art={c.art} className="h-8 w-8" label={c.name} />
              {c.name}
            </Link>
          ))}
        </nav>
      </Overlay>

      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
