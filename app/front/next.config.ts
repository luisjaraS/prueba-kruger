import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable standalone output for Docker optimization
  output: 'standalone',
  productionBrowserSourceMaps: false,
  images: {
    unoptimized: true, // Set to false if you want Next.js image optimization
  },
  experimental: {
  }
}

export default nextConfig
