import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  images: {
    domains: ["localhost"],
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
};

export default nextConfig;
