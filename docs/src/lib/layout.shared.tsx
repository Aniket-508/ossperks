import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

import { i18n } from "@/lib/i18n";

// fill this with your actual GitHub info, for example:
export const gitConfig = {
  branch: "main",
  repo: "ossperks",
  user: "Aniket-508",
};

export const baseOptions = (_locale: string): BaseLayoutProps => ({
  githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  i18n,
  links: [
    {
      text: "Programs",
      url: "/programs",
    },
    {
      text: "CLI",
      url: "/cli",
    },
  ],
  nav: {
    title: "OSS Perks",
  },
});
