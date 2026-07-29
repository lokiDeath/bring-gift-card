/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow remote brand images later without config headaches.
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
