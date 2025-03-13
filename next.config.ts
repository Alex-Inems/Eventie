import type { NextConfig } from 'next';

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.paystack.com https://www.googletagmanager.com;
      frame-src https://checkout.paystack.com;
      connect-src 'self' https://api.paystack.co wss://*.firebaseio.com https://*.googleapis.com https://*.firebaseapp.com;
      font-src 'self' data: https:;
      img-src 'self' data: https:;
      style-src 'self' 'unsafe-inline' https:;
    `,
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
];

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
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
