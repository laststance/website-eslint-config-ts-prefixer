import { codeInspectorPlugin } from 'code-inspector-plugin'

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { dev, isServer }) => {
    config.plugins.push(
      codeInspectorPlugin({ bundler: 'webpack', hotKeys: ['altKey'] }),
    )
    return config
  },
}

export default nextConfig
