/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: "standalone", // Critical for Docker deployments
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // We lint in CI, not during deployment build
  },
};

export default nextConfig;

