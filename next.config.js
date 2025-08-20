/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'images.pexels.com', pathname: '/**' },
      { protocol: 'https', hostname: 'p77-sg.tiktokcdn.com', pathname: '/**' },
      { protocol: 'https', hostname: 'p16-sg.tiktokcdn.com', pathname: '/**' },
      { protocol: 'https', hostname: 'p77-sign-va.tiktokcdn.com', pathname: '/**' },
      { protocol: 'https', hostname: 'p16-sign-va.tiktokcdn.com', pathname: '/**' },
      { protocol: 'https', hostname: 'p77-sign-sg.tiktokcdn.com', pathname: '/**' },
      { protocol: 'https', hostname: 'p16-sign-sg.tiktokcdn.com', pathname: '/**' }
    ],
  },
  eslint: {
    /** ⬇️  Ignora errores de ESLint SOLO en `next build` / Vercel */
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 