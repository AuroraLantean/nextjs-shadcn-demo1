/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    //serverActions: true,
    //appDir: true,
    //webpackBuildWorker: true,
    serverComponentsExternalPackages: ['mongoose'],
  },
  /*   webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  }, */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
      },
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'cdn.filestackcontent.com',
      },
    ],
  },
};

module.exports = nextConfig;
