import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "*.modal.host",
    "*.trycloudflare.com",
  ],
};

export default nextConfig;
