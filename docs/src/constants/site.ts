const baseUrl =
  process.env.VERCEL_URL !== undefined && process.env.VERCEL_URL !== null
    ? `https://${process.env.VERCEL_URL}`
    : (process.env.SITE_URL ?? "https://www.ossperks.com");

export const SITE = {
  AUTHOR: {
    NAME: "Aniket Pawar",
    TWITTER: "@alaymanguy",
  },
  DESCRIPTION: {
    LONG: "OSS Perks is a website that aggregates perks for open-source software, plus a CLI that checks whether your project qualifies for a particular OSS program based on its guidelines.",
    SHORT:
      "Aggregate of open-source software perks and a CLI to check project eligibility.",
  },
  KEYWORDS: ["oss", "open-source", "perks", "cli", "eligibility"],
  NAME: "OSS Perks",
  OG_IMAGE: `${baseUrl}/og`,
  URL: baseUrl,
} as const;
