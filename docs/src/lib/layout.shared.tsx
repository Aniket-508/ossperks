import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

import { LogoMark } from "@/components/logo";
import { LINK } from "@/constants/links";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { i18n, withLocalePrefix } from "@/lib/i18n";

export const baseOptions = (locale: string): BaseLayoutProps => ({
  githubUrl: LINK.GITHUB,
  i18n,
  links: [
    {
      text: "Programs",
      url: withLocalePrefix(locale, ROUTES.PROGRAMS),
    },
    {
      text: "People",
      url: withLocalePrefix(locale, ROUTES.PEOPLE),
    },
    {
      text: "CLI",
      url: withLocalePrefix(locale, ROUTES.CLI),
    },
    {
      text: "About",
      url: withLocalePrefix(locale, ROUTES.ABOUT),
    },
    // {
    //   text: "Sponsors",
    //   url: withLocalePrefix(locale, ROUTES.SPONSORS),
    // },
  ],
  nav: {
    title: (
      <>
        <LogoMark className="h-6" />
        {SITE.NAME}
      </>
    ),
    url: withLocalePrefix(locale, ROUTES.HOME),
  },
});
