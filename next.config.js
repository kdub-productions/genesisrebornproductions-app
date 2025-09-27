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
  };
  
  module.exports = nextConfig;