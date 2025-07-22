// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  optimizeFonts: true, // Make sure font optimization is enabled
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
        // Optionally, you can restrict the path as well:
        // pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'd3sog3sqr61u3b.cloudfront.net',
      },
    ],
  },
  compiler: {
    // Remove console logs only in production
    removeConsole: process.env.NODE_ENV === "production"
  },
  // Add headers configuration for caching
  async headers() {
    return [
      {
        // Add security headers for all pages
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ];
  },
};

module.exports = nextConfig;