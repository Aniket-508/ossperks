import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  images: {
    remotePatterns: [
      { hostname: "unavatar.io", pathname: "/**", protocol: "https" },
    ],
  },
  reactStrictMode: true,
  serverExternalPackages: ["license-similarity"],
  transpilePackages: ["@ossperks/core", "@ossperks/data"],
};

export default withMDX(config);
