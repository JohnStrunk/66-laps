import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Settings for deploying to GitHub Pages
  output: "export",
  basePath: process.env.PAGES_BASE_PATH,
};

export default nextConfig;
