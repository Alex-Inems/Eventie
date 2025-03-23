import type { NextConfig } from 'next';

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src * data: blob: 'unsafe-inline' 'unsafe-eval'; 
      script-src * data: blob: 'unsafe-inline' 'unsafe-eval';
      style-src * data: blob: 'unsafe-inline' 'unsafe-eval';
      img-src * data: blob: 'unsafe-inline' 'unsafe-eval';
      font-src * data: blob: 'unsafe-inline' 'unsafe-eval';
      frame-src *;
      connect-src *;
      media-src *;
      object-src * data;
      worker-src * data: blob: 'unsafe-inline' 'unsafe-eval';
      manifest-src *;
    `.replace(/\n/g, '')
  }
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // ✅ Google Auth Images
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // ✅ Unsplash Images
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com', // ✅ Firebase Storage
      },
      {
        protocol: 'https',
        hostname: 'checkout.paystack.com', // ✅ Paystack Script
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
