/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'i.ytimg.com',
        },
        {
          protocol: 'https',
          hostname: 'img.youtube.com',
        },
      ],
    },
    experimental: {
      turbo: {}, // <-- Changed to an empty object
    },
    // Add cache control headers to prevent browser caching
    async headers() {
      return [
        {
          // Apply to all routes
          source: '/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-cache, no-store, must-revalidate',
            },
            {
              key: 'Pragma',
              value: 'no-cache',
            },
            {
              key: 'Expires',
              value: '0',
            },
          ],
        },
      ];
    },
    // Enable AMP
    amp: {
      canonicalBase: '/',
    },
  };

  module.exports = nextConfig;
