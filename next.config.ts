import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Allow Tailscale host during local preview.
  allowedDevOrigins: ["100.94.155.2", "animebox"],
};

export default nextConfig;
