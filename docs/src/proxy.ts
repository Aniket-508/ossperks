import { createI18nMiddleware } from "fumadocs-core/i18n/middleware";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

import { i18n, isLocale } from "@/lib/i18n";

const i18nHandler = createI18nMiddleware(i18n);

/**
 * Server-side locale resolution: redirects to locale-prefixed path when missing.
 * Sets x-next-locale on request so root layout can bind document lang.
 */
export const proxy = function proxy(
  request: NextRequest,
  event: NextFetchEvent
) {
  const { pathname } = request.nextUrl;
  const segment = pathname.split("/").find(Boolean);
  const locale = segment && isLocale(segment) ? segment : i18n.defaultLanguage;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-next-locale", locale);

  if (segment && isLocale(segment)) {
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  return i18nHandler(request, event);
};

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|icon\\.svg|apple-icon\\.png|robots\\.txt|sitemap\\.xml|og|llms\\.txt|llms-full\\.txt|llms\\.mdx).*)",
  ],
};
