import type { NextConfig } from 'next';

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src * 'unsafe-inline' 'unsafe-eval' blob: data:; 
      script-src * 'unsafe-inline' 'unsafe-eval' blob: data:;
      style-src * 'unsafe-inline' 'unsafe-eval' blob: data:;
      img-src * data: blob:;
      font-src * data:;
      frame-src *;
      connect-src *;
      media-src *;
      object-src *;
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
