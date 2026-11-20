"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { discountPct, formatPrice, products } from "@/lib/catalog";
import { ProductImage } from "./ProductImage";
import { Icon } from "./Icon";

// Featured POS products (by POS id); a slide is skipped if that item is sold out and left the catalog.
const featured = [
  { posId: 146, title: "Wireless sound, all day.", bg: "#111113", glow: "#e5482b" },
  { posId: 99, title: "Your TV, from the couch.", bg: "#24476b", glow: "#7cc4ff" },
  { posId: 178, title: "Studio-clear voice, wireless.", bg: "#c4471c", glow: "#ffd2b8" },
  { posId: 94, title: "Power that keeps up.", bg: "#33463a", glow: "#b7e4a0" },
];
const slides = featured.flatMap((s) => {
  const p = products.find((x) => x.posId === s.posId);
  return p ? [{ ...s, slug: p.slug, p }] : [];
});

const INTERVAL_MS = 6000;

export function HeroSlider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = (n: number) => setI((n + slides.length) % slides.length);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI((n) => (n + 1) % slides.length), INTERVAL_MS);
    return () => clearTimeout(t);
  }, [i, paused]);

  return (
    <section
      className="relative overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Featured products"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${i * 100}%)` }}>
        {slides.map((s, idx) => {
          const p = s.p;
          const off = discountPct(p);
          return (
            <div
              key={s.slug}
              className="w-full flex-none text-white"
              style={{ background: `radial-gradient(circle at 75% 45%, ${s.glow}55, transparent 55%), ${s.bg}` }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${idx + 1} of ${slides.length}`}
              aria-hidden={idx !== i}
              inert={idx !== i}
            >
              <div className="wrap grid min-h-[480px] items-center gap-6 py-10 md:min-h-[540px] md:grid-cols-2">
                <div className="order-2 md:order-1">
                  <p className="text-sm font-semibold text-white/75">{p.model} · {p.name}</p>
                  <h2 className="mt-2 font-display text-4xl font-bold leading-[1.05] text-balance sm:text-5xl lg:text-6xl">{s.title}</h2>
                  <p className="mt-4 max-w-md text-white/80">{p.tagline}.</p>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Link href={`/products/${p.slug}`} className="btn bg-white text-ink hover:bg-white/90">
                      Shop now <Icon name="arrow" className="h-4 w-4" />
                    </Link>
                    <span className="whitespace-nowrap text-lg font-bold">{formatPrice(p.price)}</span>
                    {off > 0 && <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold">Save {off}%</span>}
                  </div>
                </div>
                <div className="order-1 mx-auto w-full max-w-[260px] md:order-2 md:max-w-[440px]">
                  <ProductImage product={p} className="art w-full rounded-3xl bg-white p-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute inset-x-0 bottom-5">
        <div className="wrap flex items-center gap-3">
          <div className="flex gap-1.5">
            {slides.map((s, idx) => (
              <button
                key={s.slug}
                onClick={() => go(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={idx === i}
                className="grid h-11 w-8 place-items-center"
              >
                <span className={`block h-1.5 rounded-full transition-all ${idx === i ? "w-7 bg-white" : "w-3 bg-white/40"}`} />
              </button>
            ))}
          </div>
          <div className="ml-auto hidden gap-2 sm:flex">
            <button onClick={() => go(i - 1)} className="btn bg-white/15 px-3 text-white hover:bg-white/25" aria-label="Previous slide">
              <Icon name="arrow" className="h-4 w-4 rotate-180" />
            </button>
            <button onClick={() => go(i + 1)} className="btn bg-white/15 px-3 text-white hover:bg-white/25" aria-label="Next slide">
              <Icon name="arrow" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
