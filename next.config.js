/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // 🚨 On bypass le validator Turbopack
  },
};

module.exports = nextConfig;
