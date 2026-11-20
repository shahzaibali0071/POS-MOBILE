import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Static export powers the shareable preview; normal builds stay server-rendered.
  ...(process.env.STATIC_EXPORT
    ? { output: "export" as const, trailingSlash: true, images: { unoptimized: true }, assetPrefix: process.env.ASSET_PREFIX }
    : { cacheComponents: true, partialPrefetching: true }),
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
