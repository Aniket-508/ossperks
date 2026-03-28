import { createI18nMiddleware } from "fumadocs-core/i18n/middleware";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { i18n } from "@/i18n/config";

const i18nMiddleware = createI18nMiddleware(i18n);

export const proxy = (request: NextRequest, event: NextFetchEvent) => {
  if (request.nextUrl.pathname.endsWith(".mdx")) {
    return NextResponse.next();
  }
  return i18nMiddleware(request, event);
};

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|icon\\.svg|icon-light\\.svg|apple-icon\\.png|robots\\.txt|sitemap\\.xml|og|llms\\.txt|llms-full\\.txt|llms\\.mdx).*)",
  ],
};
