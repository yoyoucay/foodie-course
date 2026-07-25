import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

// Lets `next dev` see the D1/R2 bindings declared in wrangler.jsonc.
// No-op during `opennextjs-cloudflare build` / production.
initOpenNextCloudflareForDev();

function r2Hostname() {
  const url = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  if (!url) return 'pub-changeme.r2.dev';
  try {
    return new URL(url).hostname;
  } catch {
    return 'pub-changeme.r2.dev';
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: r2Hostname(),
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Every quality value passed to next/image across the app must be listed here (Next 16+).
    qualities: [75, 85],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
