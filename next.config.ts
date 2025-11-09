import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/jczl/:id.html',
        destination: '/jczl/:id',
      },
    ];
  },
};

export default nextConfig;
