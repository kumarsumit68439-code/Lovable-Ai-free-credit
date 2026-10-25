import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/download-extension": ["./public/extension/**/*"],
  },
};

export default nextConfig;
