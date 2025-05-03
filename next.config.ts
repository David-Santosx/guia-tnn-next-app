import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    }
  },
  images: {
    remotePatterns: [
      {
        hostname: '*',
      }
    ],
  },
};

export default nextConfig;
