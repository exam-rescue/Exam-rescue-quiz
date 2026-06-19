import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for @cloudflare/next-on-pages - no output mode
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
