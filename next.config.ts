import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["media.api-sports.io"],
  },
  typescript: {
    ignoreBuildErrors: true, // ATTENZIONE: Utilizzare solo temporaneamente
  },
  eslint: {
    ignoreDuringBuilds: true, // ATTENZIONE: Utilizzare solo temporaneamente
  },
};

export default nextConfig;
