export const GITHUB_CONFIG = {
  branch: "main",
  repo: "ossperks",
  user: "Aniket-508",
};

export const LINK = {
  AWESOME_LIST_STARTER: "https://github.com/Aniket-508/awesome-list-starter",
  CLI: `https://github.com/${GITHUB_CONFIG.user}/${GITHUB_CONFIG.repo}/blob/${GITHUB_CONFIG.branch}/packages/docs/content/cli`,
  GITHUB: `https://github.com/${GITHUB_CONFIG.user}/${GITHUB_CONFIG.repo}`,
  LICENSE: `https://github.com/${GITHUB_CONFIG.user}/${GITHUB_CONFIG.repo}/blob/${GITHUB_CONFIG.branch}/LICENSE`,
  LINGO: "https://lingo.dev",
  PORTFOLIO: "https://aniketpawar.com",
  PRODUCT_HEROICONS_ANIMATED:
    "https://www.npmjs.com/package/heroicons-animated",
  PRODUCT_VERCEL_DOCTOR: "https://www.npmjs.com/package/vercel-doctor",
  SPONSOR: `https://github.com/sponsors/${GITHUB_CONFIG.user}`,
  TWITTER: "https://x.com/alaymanguy",
  VERCEL: "https://vercel.com",
} as const;
