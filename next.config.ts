import type { NextConfig } from 'next';

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' https://checkout.paystack.com https://www.googletagmanager.com https://www.gstatic.com https://www.googleapis.com;
      frame-src 'self' https://checkout.paystack.com https://firebasestorage.googleapis.com;
      connect-src 'self' https://api.paystack.co https://firestore.googleapis.com https://www.googleapis.com;
      img-src 'self' https://firebasestorage.googleapis.com https://lh3.googleusercontent.com https://images.unsplash.com data:;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com;
    `.replace(/\n/g, '') // Remove all line breaks
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
