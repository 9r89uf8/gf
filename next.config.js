const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: process.env.NODE_ENV !== 'development',
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
        // Optionally, you can restrict the path as well:
        // pathname: '/**',
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
        source: '/chicas-ia',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow'
          }
        ]
      },
      {
        source: '/creadoras',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow'
          }
        ]
      },
    {
      source: '/BgHd9LWDnFFhS6BoaqwL',
          headers: [
      {
        key: 'X-Robots-Tag',
        value: 'noindex, nofollow'
      }
    ]
    },
      {
        source: '/uerQ5TMDanh1wex83HIE',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow'
          }
        ]
      },
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

module.exports = withPWA(nextConfig);