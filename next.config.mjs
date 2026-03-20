import path from 'path';
import { fileURLToPath } from 'url';
import { withPayload } from '@payloadcms/next/withPayload';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
const { protocol, hostname, port } = new URL(serverUrl);
const shouldDisableImageOptimization = process.env.VERCEL === '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: dirname,
  images: {
    unoptimized: shouldDisableImageOptimization,
    remotePatterns: [
      {
        protocol: protocol.replace(':', ''),
        hostname,
        port,
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
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
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default withPayload(nextConfig);
