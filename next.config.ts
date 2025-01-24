import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google-hosted images
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Unsplash-hosted images
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com', // Firebase Storage hostname
      },
    ],
  },
  // Add other configuration options as needed
};

export default nextConfig;
