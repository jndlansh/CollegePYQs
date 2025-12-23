import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Handle Prisma and pg externals
    config.externals = [...(config.externals || []), '@prisma/client', 'pg'];
    
    // Handle canvas for react-pdf
    if (!isServer) {
      config.resolve.alias.canvas = false;
    }
    
    return config;
  },
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-pg', 'pg'],
};

export default nextConfig;
