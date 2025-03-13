import type { NextConfig } from 'next';

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src *; 
      script-src-elem 'self' 'unsafe-inline' https://checkout.paystack.com https://www.googletagmanager.com https://www.gstatic.com https://www.googleapis.com;
      frame-src *;
      connect-src *;
      img-src * data:;
      style-src * 'unsafe-inline' https://fonts.googleapis.com;
      font-src *;
    `.replace(/\n/g, '') // Remove line breaks
  }
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
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
