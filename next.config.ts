import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // Image optimization enabled — Next.js will auto-resize, convert to WebP/AVIF, and cache
    minimumCacheTTL: 2592000, // Cache optimized images for 30 days
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "overapprehensive-optatively-meri.ngrok-free.dev",
      },
      {
        protocol: "http",
        hostname: "103.174.189.183",
      },
      {
        protocol: "https",
        hostname: "biovue-ai.onrender.com",
      },
      {
        protocol: "https",
        hostname: "api.biovuedigitalwellness.com",
      },
      {
        protocol: "https",
        hostname: "api.biovuedigitalwellness.com",
      },
      {
        protocol: "https",
        hostname: "ai.biovuedigitalwellness.com",
      },

      {
        protocol: "http",
        hostname: "**.ngrok-free.app",
      },
      {
        protocol: "https",
        hostname: "**.ngrok-free.dev",
      },
      {
        protocol: "http",
        hostname: "**.ngrok-free.dev",
      },
    ],
  },
};

export default nextConfig;
