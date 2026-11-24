import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export powers the shareable preview; normal builds stay server-rendered.
  ...(process.env.STATIC_EXPORT
    ? { output: "export" as const, trailingSlash: true, images: { unoptimized: true }, assetPrefix: process.env.ASSET_PREFIX }
    : { cacheComponents: true, partialPrefetching: true }),
  experimental: {
    // Photo Studio uploads one compressed photo per request (well under 4mb); Vercel caps bodies at 4.5mb.
    serverActions: { bodySizeLimit: "4mb" },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
