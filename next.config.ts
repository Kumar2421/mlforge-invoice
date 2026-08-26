import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["localhost", "127.0.0.1", "169.254.149.242", "*.169.254.149.242"],
};

export default nextConfig;
