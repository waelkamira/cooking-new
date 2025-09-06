/** @type {import('next').NextConfig} */
const nextConfig = {
  // distDir: 'build',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // السماح بجميع النطاقات
      },
    ],
  },
};

module.exports = nextConfig;
