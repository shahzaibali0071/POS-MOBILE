// Catalog generated from the ALI MOBILE POS (scripts/pos_to_catalog.py -> src/data/products.json).
// Official brand photos are downloaded at build time (scripts/fetch-official-images.mjs);
// otherwise the shop's own photo is used, and the drawn art only when there is no photo at all.
import data from "@/data/products.json";
import officialImages from "@/data/official-manifest.json";

export type ArtKind =
  | "earbuds"
  | "headphones"
  | "watch"
  | "powerbank"
  | "charger"
  | "cable"
  | "speaker"
  | "neckband"
  | "handsfree";

export type Category = {
  slug: string;
  name: string;
  blurb: string;
  art: ArtKind;
};

export type Color = { name: string; hex: string };

export type Product = {
  posId: number;
  slug: string;
  model: string;
  name: string;
  category: string;
  tagline: string;
  price: number;
  compareAt?: number;
  rating?: number;
  reviews?: number;
  badge?: string;
  image?: string;
  colors: Color[];
  features: string[];
  specs: [label: string, value: string][];
  tags: ("new" | "trending" | "smart")[];
};

type RawProduct = (typeof data.products)[number];

/** One colour per POS product: the shop sells each listing as it is in stock. */
export const STANDARD: Color = { name: "Standard", hex: "#1c1c1f" };
const NEW_COUNT = 12;
const PREMIUM_MIN_PRICE = 3000;

const official = officialImages as Record<string, string>;
const newest = new Set([...data.products].sort((a, b) => b.posId - a.posId).slice(0, NEW_COUNT).map((p) => p.posId));
const rankOf = new Map(data.products.flatMap((p) => ("bestSellerRank" in p ? [[p.posId, p.bestSellerRank as number]] : [])));
const bestSellers = new Set(rankOf.keys());

function toProduct(p: RawProduct): Product {
  const tags: Product["tags"] = [];
  if (newest.has(p.posId)) tags.push("new");
  if (bestSellers.has(p.posId)) tags.push("trending");
  if (p.price >= PREMIUM_MIN_PRICE) tags.push("smart");
  return {
    posId: p.posId,
    slug: p.slug,
    model: p.model,
    name: p.name,
    category: p.category,
    tagline: p.tagline,
    price: p.price,
    badge: bestSellers.has(p.posId) ? "Best Seller" : undefined,
    image: official[String(p.posId)] ?? p.image ?? undefined,
    colors: [STANDARD],
    features: [],
    specs: p.specs as [string, string][],
    tags,
  };
}

export const categories: Category[] = data.categories as Category[];
export const products: Product[] = data.products.map(toProduct);

const bySlug = new Map(products.map((p) => [p.slug, p]));
const catBySlug = new Map(categories.map((c) => [c.slug, c]));

const byPosId = new Map(products.map((p) => [p.posId, p]));

export const getProduct = (slug: string) => bySlug.get(slug);
export const getProductByPosId = (posId: number) => byPosId.get(posId);
export const getCategory = (slug: string) => catBySlug.get(slug);
export const productsIn = (category: string) => products.filter((p) => p.category === category);
export const productsTagged = (tag: Product["tags"][number]) => products.filter((p) => p.tags.includes(tag));
export const artFor = (p: Product): ArtKind => getCategory(p.category)?.art ?? "earbuds";

export const related = (p: Product, limit = 4) => {
  const same = products.filter((x) => x.category === p.category && x.slug !== p.slug);
  const others = products.filter((x) => x.category !== p.category);
  return [...same, ...others].slice(0, limit);
};

export function searchProducts(query: string, limit = 6) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products
    .filter((p) =>
      [p.model, p.name, p.tagline, getCategory(p.category)?.name ?? "", ...p.specs.map((x) => x[1])].join(" ").toLowerCase().includes(q),
    )
    .slice(0, limit);
}

// en-US grouping is identical on server and client, so no hydration mismatch.
const fmt = new Intl.NumberFormat("en-US");
export const formatPrice = (n: number) => `Rs ${fmt.format(Math.round(n))}`;

export const discountPct = (p: Pick<Product, "price" | "compareAt">) =>
  p.compareAt && p.compareAt > p.price ? Math.round((1 - p.price / p.compareAt) * 100) : 0;

export const FREE_SHIPPING_MIN = 3000;
export const SHIPPING_FEE = 250;
export const shippingFor = (subtotal: number) => (subtotal === 0 || subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE);

type Collection = { slug: string; title: string; description: string; products: Product[] };

const specialCollections: Omit<Collection, "products">[] = [
  { slug: "all", title: "All Products", description: "Every gadget and accessory in the store." },
  { slug: "new-arrivals", title: "New Arrivals", description: "Fresh launches, just landed." },
  { slug: "trending", title: "Top Trending", description: "What everyone is buying right now." },
  { slug: "smart", title: "Premium Picks", description: `Our best gear from ${PREMIUM_MIN_PRICE.toLocaleString("en-US")} rupees up.` },
];

const specialProducts: Record<string, () => Product[]> = {
  all: () => products,
  "new-arrivals": () => productsTagged("new"),
  trending: () => productsTagged("trending").sort((a, b) => rankOf.get(a.posId)! - rankOf.get(b.posId)!),
  smart: () => productsTagged("smart"),
};


export const collectionSlugs = () => [...specialCollections.map((c) => c.slug), ...categories.map((c) => c.slug)];

export function getCollection(slug: string): Collection | undefined {
  const special = specialCollections.find((c) => c.slug === slug);
  if (special) return { ...special, products: specialProducts[slug]() };
  const cat = getCategory(slug);
  return cat && { slug, title: cat.name, description: cat.blurb, products: productsIn(slug) };
}

/** A representative photo for a category tile: its first product that has one. */
export const categoryImage = (slug: string) => products.find((p) => p.category === slug && p.image);
