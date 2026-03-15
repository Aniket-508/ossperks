import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

import { LogoMark } from "@/components/logo";
import { LINK } from "@/constants/links";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { i18n } from "@/lib/i18n";

export const baseOptions = (_locale: string): BaseLayoutProps => ({
  githubUrl: LINK.GITHUB,
  i18n,
  links: [
    {
      text: "Programs",
      url: ROUTES.PROGRAMS,
    },
    {
      text: "People",
      url: ROUTES.PEOPLE,
    },
    {
      text: "CLI",
      url: ROUTES.CLI,
    },
    {
      text: "About",
      url: ROUTES.ABOUT,
    },
    // {
    //   text: "Sponsors",
    //   url: ROUTES.SPONSORS,
    // },
  ],
  nav: {
    title: (
      <>
        <LogoMark className="h-6" />
        {SITE.NAME}
      </>
    ),
  },
});
