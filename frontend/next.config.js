/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Rewrites are handled by Vercel configuration
  // For local development, use environment variable
  async rewrites() {
    // Only use rewrites in development
    if (process.env.NODE_ENV === 'development') {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
      return [
        {
          source: '/api/:path*',
          destination: `${apiUrl}/api/:path*`,
        },
      ];
    }
    // In production, Vercel handles rewrites via vercel.json
    return [];
  },
};

module.exports = nextConfig;




