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
  }
};

module.exports = withPWA(nextConfig);


