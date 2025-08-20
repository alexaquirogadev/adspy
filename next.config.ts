import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🚀 habilitamos images.remotePatterns (reemplaza images.domains obsoleto)
  images: {
    remotePatterns: [
      // Existentes
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
      // TikTok CDN
      { protocol: 'https', hostname: 'p77-sg.tiktokcdn.com' },
      { protocol: 'https', hostname: 'p16-sg.tiktokcdn.com' },
      { protocol: 'https', hostname: 'p77-sign-va.tiktokcdn.com' },
      { protocol: 'https', hostname: 'p16-sign-va.tiktokcdn.com' },
      { protocol: 'https', hostname: 'p77-sign-sg.tiktokcdn.com' },
      { protocol: 'https', hostname: 'p16-sign-sg.tiktokcdn.com' },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
