import { createI18nMiddleware } from "fumadocs-core/i18n/middleware";
import { isMarkdownPreferred, rewritePath } from "fumadocs-core/negotiation";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { i18n, isLocale } from "@/i18n/config";

const i18nMiddleware = createI18nMiddleware(i18n);

const { rewrite: rewriteCliMdx } = rewritePath(
  "/cli{/*path}.mdx",
  "/llms.mdx/cli{/*path}",
);
const { rewrite: rewriteProgramsMdx } = rewritePath(
  "/programs{/*path}.mdx",
  "/llms.mdx/programs{/*path}",
);

const { rewrite: rewriteCliMarkdown } = rewritePath(
  "/cli{/*path}",
  "/llms.mdx/cli{/*path}",
);
const { rewrite: rewriteProgramsMarkdown } = rewritePath(
  "/programs{/*path}",
  "/llms.mdx/programs{/*path}",
);

const withOptionalLocale = (
  pathname: string,
  section: "cli" | "programs",
  rewrite: (pathname: string) => string | false,
): string | null => {
  const direct = rewrite(pathname);
  if (direct) {
    return direct;
  }

  const localized = pathname.match(new RegExp(`^/([^/]+)/${section}(.*)$`));
  if (!localized?.[1] || !isLocale(localized[1])) {
    return null;
  }

  const [, lang, rest = ""] = localized;
  const rewritten = rewrite(`/${section}${rest}`);
  if (!rewritten) {
    return null;
  }

  return rewritten.replace(
    `/llms.mdx/${section}`,
    `/llms.mdx/${section}/${lang}`,
  );
};

const rewriteMdxPath = (pathname: string) =>
  withOptionalLocale(pathname, "cli", rewriteCliMdx) ||
  withOptionalLocale(pathname, "programs", rewriteProgramsMdx);

const rewriteLLMPath = (pathname: string) =>
  withOptionalLocale(pathname, "cli", rewriteCliMarkdown) ||
  withOptionalLocale(pathname, "programs", rewriteProgramsMarkdown);

export const proxy = (request: NextRequest, event: NextFetchEvent) => {
  const { pathname } = request.nextUrl;
  const rewriteMdxResult = rewriteMdxPath(pathname);

  if (rewriteMdxResult) {
    return NextResponse.rewrite(new URL(rewriteMdxResult, request.nextUrl));
  }

  if (isMarkdownPreferred(request)) {
    const rewriteLLMResult = rewriteLLMPath(pathname);
    if (rewriteLLMResult) {
      return NextResponse.rewrite(new URL(rewriteLLMResult, request.nextUrl));
    }
  }

  return i18nMiddleware(request, event);
};

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|icon\\.svg|icon-light\\.svg|apple-icon\\.png|robots\\.txt|sitemap\\.xml|og|llms\\.txt|llms-full\\.txt|llms\\.mdx).*)",
  ],
};
