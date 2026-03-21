import { createI18nMiddleware } from "fumadocs-core/i18n/middleware";

import { i18n } from "@/i18n/config";

export const proxy = createI18nMiddleware(i18n);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|icon\\.svg|icon-light\\.svg|apple-icon\\.png|robots\\.txt|sitemap\\.xml|og|llms\\.txt|llms-full\\.txt|llms\\.mdx).*)",
  ],
};
