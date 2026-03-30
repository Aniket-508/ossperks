import type { Locale } from "@/i18n/config";
import { i18n } from "@/i18n/config";
import { buildProgramsRssResponse } from "@/lib/rss-programs-feed";

export const revalidate = false;

/** Canonical default-locale feed at `/rss.xml` (same payload as `/{default}/rss.xml`). */
export const GET = () =>
  buildProgramsRssResponse(i18n.defaultLanguage as Locale);
