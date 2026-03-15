import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { Public_Sans } from "next/font/google";

const GEIST_SANS_DIR = join(
  process.cwd(),
  "node_modules",
  "geist",
  "dist",
  "fonts",
  "geist-sans"
);

/**
 * Load Geist Sans TTF data for use with next/og ImageResponse.
 * Returns Regular (400) and SemiBold (600) for title/body.
 */
export const loadGeistFonts = async () => {
  const [regular, semiBold] = await Promise.all([
    readFile(join(GEIST_SANS_DIR, "Geist-Regular.ttf")),
    readFile(join(GEIST_SANS_DIR, "Geist-SemiBold.ttf")),
  ]);
  return [
    {
      data: regular.buffer.slice(
        regular.byteOffset,
        regular.byteOffset + regular.byteLength
      ),
      name: "Geist",
      style: "normal" as const,
      weight: 400 as const,
    },
    {
      data: semiBold.buffer.slice(
        semiBold.byteOffset,
        semiBold.byteOffset + semiBold.byteLength
      ),
      name: "Geist",
      style: "normal" as const,
      weight: 600 as const,
    },
  ];
};

export const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});
