/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true,
  },
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript checking during builds
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Use standalone output mode for Netlify
  output: 'standalone',
  // Force dynamic rendering for all pages
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'rentgo-koraput.netlify.app']
    }
  }
}

module.exports = nextConfig 