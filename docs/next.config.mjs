import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ["@ossperks/data"],
  rewrites() {
    return [
      {
        destination: "/llms.mdx/cli/:path*",
        source: "/cli/:path*.mdx",
      },
      {
        destination: "/llms.mdx/cli/:lang/:path*",
        source: "/:lang/cli/:path*.mdx",
      },
      {
        destination: "/llms.mdx/programs/:slug",
        source: "/programs/:slug.mdx",
      },
    ];
  },
  serverExternalPackages: ["@takumi-rs/image-response"],
};

export default withMDX(config);
