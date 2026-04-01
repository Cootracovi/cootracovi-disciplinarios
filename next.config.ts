import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "standalone", // REMOVIDO: Vercel no necesita output standalone
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
