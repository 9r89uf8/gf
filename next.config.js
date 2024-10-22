const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development mode
  register: process.env.NODE_ENV !== 'development',
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add any other Next.js config options here
};

module.exports = withPWA(nextConfig);
