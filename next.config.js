/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [],
  },
  poweredByHeader: false,
  compress: true,
};

module.exports = nextConfig;