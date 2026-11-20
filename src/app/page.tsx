import Link from "next/link";
import { categories, formatPrice, FREE_SHIPPING_MIN, productsIn, productsTagged } from "@/lib/catalog";
import { HeroSlider } from "@/components/HeroSlider";
import { ProductRail } from "@/components/ProductRail";
import { ProductArt } from "@/components/ProductArt";
import { CategoryThumb } from "@/components/ProductImage";
import { Icon, type IconName } from "@/components/Icon";

const perks: { icon: IconName; title: string; text: string }[] = [
  { icon: "truck", title: "Free delivery", text: `On orders over ${formatPrice(FREE_SHIPPING_MIN)}` },
  { icon: "shield", title: "1 year warranty", text: "Official brand warranty" },
  { icon: "cash", title: "Cash on delivery", text: "Pay when it arrives" },
  { icon: "refresh", title: "7 day exchange", text: "Hassle-free returns" },
];

const reasons = [
  { title: "Tested before it ships", text: "Every batch goes through battery, Bluetooth and drop checks before it reaches the warehouse." },
  { title: "Local warranty, real support", text: "Claims are handled locally, so you are not waiting on an overseas service centre." },
  { title: "Fair prices, direct", text: "We sell direct to you, which keeps prices honest without cutting corners on quality." },
];

const faqs = [
  { q: "How long does delivery take?", a: "Orders are dispatched within 24 hours on working days and usually arrive in 2 to 5 working days. Express delivery is available in major cities." },
  { q: "Can I pay cash on delivery?", a: "Yes. Cash on delivery is available nationwide. You can also pay with JazzCash, Easypaisa, bank transfer or card." },
  { q: "What does the warranty cover?", a: "All products have a 1 year warranty against manufacturing defects. Physical and liquid damage beyond the stated rating are not covered." },
  { q: "Can I exchange a product?", a: "Unused products in original packaging can be exchanged or returned within 7 days of delivery." },
];

export default function Home() {
  return (
    <>
      <h1 className="sr-only">Voltix: smart wearables and tech accessories</h1>
      <HeroSlider />

      <section className="border-b border-black/10 bg-white">
        <ul className="wrap grid grid-cols-2 gap-4 py-6 lg:grid-cols-4">
          {perks.map((p) => (
            <li key={p.title} className="flex items-center gap-3">
              <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-tile">
                <Icon name={p.icon} />
              </span>
              <span>
                <span className="block text-sm font-semibold">{p.title}</span>
                <span className="block text-xs text-muted">{p.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="wrap mt-14">
        <h2 className="mb-5 font-display text-3xl font-bold tracking-tight">Shop by category</h2>
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-10">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link href={`/collections/${c.slug}`} className="group block text-center">
                <span className="grid aspect-square place-items-center rounded-2xl bg-white ring-1 ring-black/5 transition group-hover:-translate-y-1 group-hover:shadow-md">
                  <CategoryThumb slug={c.slug} art={c.art} className="art h-3/4 w-3/4" label={c.name} />
                </span>
                <span className="mt-2 block text-sm font-semibold">{c.name}</span>
                <span className="block text-xs text-muted">{productsIn(c.slug).length} products</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <ProductRail title="New Arrivals" href="/collections/new-arrivals" products={productsTagged("new")} />
      <ProductRail title="Premium Picks" href="/collections/smart" products={productsTagged("smart")} />

      <section className="wrap mt-16">
        <div className="grid overflow-hidden rounded-3xl bg-accent text-white md:grid-cols-[1.2fr_1fr]">
          <div className="p-8 sm:p-12">
            <p className="text-sm font-semibold text-white/80">Make it yours</p>
            <h2 className="mt-2 font-display text-4xl font-bold leading-[1.05] text-balance">Free name engraving on gift orders</h2>
            <p className="mt-3 max-w-md text-white/85">Add a name or short message to cases and power banks. Perfect for birthdays and corporate gifting.</p>
            <Link href="/info/corporate" className="btn mt-6 bg-white text-ink hover:bg-white/90">
              Explore gifting <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative grid min-h-56 place-items-center bg-black/10 p-6">
            <ProductArt kind="powerbank" color="#111113" className="art h-56 w-56" label="Engraved power bank" />
            <span className="absolute bottom-[42%] font-display text-sm font-bold tracking-widest text-white/80">YOUR NAME</span>
          </div>
        </div>
      </section>

      <ProductRail title="Top Trending" href="/collections/trending" products={productsTagged("trending")} />

      <section className="wrap mt-20">
        <h2 className="font-display text-3xl font-bold tracking-tight">Why choose Voltix?</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {reasons.map((r) => (
            <div key={r.title} className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
              <h3 className="font-display text-lg font-semibold">{r.title}</h3>
              <p className="mt-2 text-sm text-muted">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap mt-20 grid gap-8 md:grid-cols-[1fr_1.6fr]">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight">Questions, answered</h2>
          <p className="mt-2 text-muted">Cannot find what you need? <Link href="/info/contact" className="font-semibold text-ink underline">Contact us</Link>.</p>
        </div>
        <div className="divide-y divide-black/10 rounded-2xl bg-white px-5 ring-1 ring-black/5">
          {faqs.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <Icon name="plus" className="h-5 w-5 flex-none transition group-open:rotate-45" />
              </summary>
              <p className="pb-1 pt-2 text-sm text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
