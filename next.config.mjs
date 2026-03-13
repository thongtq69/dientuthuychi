/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bizweb.dktcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'cdn.dienthoaigiakho.vn',
      },
      {
        protocol: 'https',
        hostname: 'dienthoaigiakho.vn',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
};

export default nextConfig;
