import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone", // Critical for Docker deployments
  reactStrictMode: true,
  
  // Silence Turbopack warning (Next.js 16 uses Turbopack by default)
  turbopack: {},
};

export default nextConfig;
