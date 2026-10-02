import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  agentRules: false,
  distDir: process.env.PORTFOLIO_LOCAL_EDITOR === "1" ? ".next-editor" : ".next",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mir-s3-cdn-cf.behance.net",
        port: "",
        pathname: "/projects/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
