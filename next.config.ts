import type { NextConfig } from "next";

// Includes the extension zip in the download-extension serverless function.
const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/download-extension": ["./public/extension/**/*"],
  },
};

export default nextConfig;
