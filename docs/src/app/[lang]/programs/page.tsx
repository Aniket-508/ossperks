import { programs, getCategories } from "@ossperks/data";
import type { Metadata } from "next";
import Link from "next/link";

import { getT } from "@/lib/get-t";
import { withLocalePrefix } from "@/lib/i18n";
import { programsSource } from "@/lib/source";

interface Perk {
  title: string;
  description: string;
}

interface ProgramPageData {
  title?: string;
  description?: string;
  perks?: Perk[];
}

export default async function ProgramsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const categories = getCategories();
  const t = await getT(lang);

  // Build a map of slug → translated page data for locale-aware cards
  const localizedPages = programsSource.getPages(lang);
  const translatedBySlug = new Map(
    localizedPages.map((p) => [p.slugs[0], p.data as ProgramPageData])
  );

  return (
    <main className="container max-w-6xl py-12 px-4 mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">
          {t.programs.listing.heading}
        </h1>
        <p className="text-fd-muted-foreground text-lg max-w-2xl mx-auto">
          {t.programs.listing.description}
        </p>
      </div>

      {categories.map((category) => {
        const categoryPrograms = programs.filter(
          (p) => p.category === category
        );
        if (categoryPrograms.length === 0) {
          return null;
        }

        const categoryLabel =
          t.common.categories[category as keyof typeof t.common.categories] ??
          category;

        return (
          <section key={category} className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 border-b pb-2">
              {categoryLabel}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryPrograms.map((program) => {
                const pageData = translatedBySlug.get(program.slug);
                const description =
                  pageData?.description ?? program.description;
                const perks = pageData?.perks ?? program.perks;
                const extraPerks = perks.length - 2;

                return (
                  <Link
                    key={program.slug}
                    href={withLocalePrefix(lang, `/programs/${program.slug}`)}
                    className="group block rounded-lg border bg-fd-card p-5 transition-colors hover:bg-fd-accent"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold group-hover:text-fd-primary">
                        {pageData?.title ?? program.name}
                      </h3>
                    </div>
                    <p className="text-sm text-fd-muted-foreground mb-3 line-clamp-2">
                      {description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {perks.slice(0, 2).map((perk) => (
                        <span
                          key={perk.title}
                          className="inline-block rounded-md bg-fd-primary/10 px-2 py-0.5 text-xs font-medium text-fd-primary"
                        >
                          {perk.title}
                        </span>
                      ))}
                      {extraPerks > 0 && (
                        <span className="inline-block rounded-md bg-fd-muted px-2 py-0.5 text-xs text-fd-muted-foreground">
                          {t.programs.more.replace(
                            "{count}",
                            String(extraPerks)
                          )}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </main>
  );
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> => {
  const { lang } = await params;
  const t = await getT(lang);
  return {
    description: t.programs.listing.description,
    title: t.programs.listing.heading,
  };
};
