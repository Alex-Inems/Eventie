import type { NextConfig } from 'next';

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://checkout.paystack.com https://www.googletagmanager.com; frame-src https://checkout.paystack.com; connect-src 'self' https://api.paystack.co;"
  }
]

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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders
      },
    ];
  },
};

export default nextConfig;
