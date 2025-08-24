import type { NextConfig } from "next";
import withPWA from "next-pwa";

// Initialize the PWA plugin configuration
const pwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  /* Your existing config options remain here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // 禁用 Next.js 热重载，由 nodemon 处理重编译
  reactStrictMode: false,
  webpack: (config, { dev }) => {
    if (dev) {
      // 禁用 webpack 的热模块替换
      config.watchOptions = {
        ignored: ['**/*'], // 忽略所有文件变化
      };
    }
    return config;
  },
  eslint: {
    // 构建时忽略ESLint错误
    ignoreDuringBuilds: true,
  },
  // The custom 'headers' section has been removed.
  // next-pwa handles caching for the service worker automatically.

  // Enable experimental features
  experimental: {
    optimizeCss: true,
  },
  // Compression
  compress: true,
  // Generate source maps in production for debugging
  productionBrowserSourceMaps: false,
};

// Wrap your Next.js config with the PWA config
export default pwaConfig(nextConfig);