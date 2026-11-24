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
3. Official brand photos (downloaded during `npm run build`, replacing the shop photo):
   - `src/data/official-images.json`: hand-checked `"<posId>": "<url>"` photos (always win).
   - `src/data/brand-sources.json`: brand Shopify sites (Sovo, Space, Ronin). Every build saves their full
     catalog to `/brand-catalog/<brand>.json` on the site and auto-matches new POS products by model code
     (see `/brand-catalog/matches.json`).
   - `src/data/official-exclude.json`: products whose brand photo shows the wrong variant.
   A failed download never breaks the build; the shop photo stays.
4. Orders: `POST /api/orders` stores them privately in Vercel Blob; the POS downloads them from
   `GET /api/orders` with its key (`POS_API_KEY`).

## POS → website sync ("Update website")

- The POS sends its product list with `PUT /api/pos/products` (header `Authorization: Bearer <POS_API_KEY>`,
  body `{"products": [{id, name, brand_name, model, category, sale_price, stock_qty, sold_qty}]}`).
  From the shop PC: `POS_API_KEY=... python scripts/pos_push.py <mobile_pos.db>`.
- The list is stored privately in Blob (`pos/products.json`). If `DEPLOY_HOOK_URL` is set (Vercel →
  Settings → Git → Deploy Hooks, branch `voltix-store`), the site rebuilds; `prebuild` runs
  `scripts/pull-pos-catalog.mts`, which regenerates `src/data/products.json` with `pos_to_catalog.py`.
  A failed or empty push keeps the committed catalog.

## Photo Studio (`/admin`)

- Login with `ADMIN_PASSWORD` (12+ characters). Take or pick 1 to 3 photos per product; the studio
  auto-enhances them, makes several versions, and uploads them under `products/<posId>/` in Blob.
- Optional AI angles (Vercel AI Gateway, `bfl/flux-kontext-pro`) land in `drafts/` until approved.
- Photos are served by `/api/photos/...` (the Blob store is private). Studio photos win over
  official and shop photos; changes show immediately, no rebuild needed.
