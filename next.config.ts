import type { NextConfig } from 'next';

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.paystack.com https://www.googletagmanager.com https://www.gstatic.com https://www.googleapis.com;
      connect-src 'self' https://api.paystack.co https://firestore.googleapis.com wss://*.firebaseio.com https://*.googleapis.com;
      img-src 'self' data: https://firebasestorage.googleapis.com https://images.unsplash.com https://lh3.googleusercontent.com;
      frame-src https://checkout.paystack.com;
      font-src 'self' https://fonts.gstatic.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    `
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
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
        hostname: 'firebasestorage.googleapis.com', // Firebase Storage
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
