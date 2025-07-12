/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'images.pexels.com', pathname: '/**' },
    ],
  },
  eslint: {
    /** ⬇️  Ignora errores de ESLint SOLO en `next build` / Vercel */
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 