import { getCategories, programs as allPrograms } from "@ossperks/core";

import { ROUTES } from "@/constants/routes";
import type { Translations } from "@/i18n/get-t";
import { withLocalePrefix } from "@/i18n/navigation";

const POPULAR_LIMIT = 12;

export const getFooterPopularCategories = (
  lang: string,
  t: Pick<Translations, "common">,
): { count: number; href: string; label: string }[] => {
  const prefix = (path: `/${string}`) => withLocalePrefix(lang, path);

  return getCategories()
    .map((cat) => ({
      count: allPrograms.filter((p) => p.category === cat).length,
      href: prefix(`${ROUTES.CATEGORIES}/${cat}` as `/${string}`),
      label:
        t.common.categories[cat as keyof typeof t.common.categories] ?? cat,
    }))
    .filter((c) => c.count > 0)
    .toSorted((a, b) => b.count - a.count)
    .slice(0, POPULAR_LIMIT);
};
