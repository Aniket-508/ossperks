import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

import { LogoMark } from "@/components/logo";
import { LINK } from "@/constants/links";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { i18n } from "@/i18n/config";
import { withLocalePrefix } from "@/i18n/navigation";

export const baseOptions = (locale: string): BaseLayoutProps => ({
  githubUrl: LINK.GITHUB,
  i18n,
  links: [
    {
      text: "Programs",
      url: withLocalePrefix(locale, ROUTES.PROGRAMS),
    },
    {
      text: "Categories",
      url: withLocalePrefix(locale, ROUTES.CATEGORIES),
    },
    {
      text: "People",
      url: withLocalePrefix(locale, ROUTES.PEOPLE),
    },
    {
      text: "CLI",
      url: withLocalePrefix(locale, ROUTES.CLI),
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
