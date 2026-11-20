# Voltix storefront (frontend)

Next.js 16 (App Router) + TypeScript + Tailwind v4.

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # cart, pricing and checkout logic checks
npm run build
```

## Where things live

- `src/lib/catalog.ts` products, categories, prices, shipping rules (placeholder data)
- `src/lib/cart-reducer.ts` pure cart logic; `src/lib/cart.tsx` React context + localStorage
- `src/lib/checkout.ts` checkout validation (PK mobile numbers, payment methods)
- `src/components/ProductArt.tsx` SVG placeholders; swap for real product photos
- Pages: `/`, `/collections/[slug]`, `/products/[slug]`, `/cart`, `/checkout`, `/track-order`, `/info/[slug]`

## Backend next steps

Replace catalog arrays with DB queries behind the same helpers, add an orders API
(server must re-validate and re-price), an admin panel, and payment gateways.
Search the code for `ponytail:` to find every frontend-only stub.

## ALI MOBILE products

The catalog comes from the shop's POS:

1. `python scripts/pos_to_catalog.py <mobile_pos.db> public/products` writes `src/data/products.json`
   (in-stock items only; cost prices and stock counts are never included).
2. Shop photos live in `public/products/<posId>.webp`.
3. Official brand photos: add `"<posId>": "<url>"` to `src/data/official-images.json`. They are downloaded
   during `npm run build` (prebuild) and replace the shop photo; a failed download keeps the shop photo.
4. Orders: `POST /api/orders` stores them privately in Vercel Blob; the POS downloads them from
   `GET /api/orders` with its key (`POS_API_KEY`).
