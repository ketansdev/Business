import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Project photography in /public/images is resized and served as AVIF/WebP automatically.
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920],
  },
  // Tree-shake large packages more aggressively.
  experimental: {
    optimizePackageImports: ["lucide-react", "@react-three/drei"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
