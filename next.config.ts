import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Allow any HTTPS remote image by wildcard pattern
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**", // allow any path on that host
      },
    ],
    // If you prefer to whitelist specific domains instead, use:
    // domains: ['placehold.co'],
  },
};

export default nextConfig;
