// next.config.js or next.config.ts
import type { NextConfig } from 'next';
import withPWA from 'next-pwa';
import path from 'path';

const isDev = process.env.NODE_ENV === 'development';

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src * data: blob: 'unsafe-inline' 'unsafe-eval';
      script-src * data: blob: 'unsafe-inline' 'unsafe-eval';
      style-src * data: blob: 'unsafe-inline' 'unsafe-eval';
      img-src * data: blob: 'unsafe-inline';
      font-src * data:;
      connect-src *;
      frame-src *;
      media-src *;
      object-src 'none';
      worker-src * data: blob:;
      manifest-src *;
    `.replace(/\n/g, ''),
  },
];

const baseConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'checkout.paystack.com' },
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

const withPWAFunc = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: isDev,
});

export default withPWAFunc(baseConfig);
