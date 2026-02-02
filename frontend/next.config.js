/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure we can import from src
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
