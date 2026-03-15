import { programs, getCategories } from "@ossperks/data";
import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { getT } from "@/lib/get-t";
import { i18n, withLocalePrefix } from "@/lib/i18n";
import { programsSource } from "@/lib/source";

export const generateStaticParams = () =>
  i18n.languages.map((lang) => ({ lang }));

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

interface ProgramPageData {
  title?: string;
  description?: string;
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
    <>
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
                const { perks } = program;
                const extraPerks = perks.length - 2;

                return (
                  <Link
                    key={program.slug}
                    href={withLocalePrefix(
                      lang,
                      `${ROUTES.PROGRAMS}/${program.slug}` as `/${string}`
                    )}
                    className="group block transition-colors hover:bg-fd-accent"
                  >
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="font-semibold group-hover:text-fd-primary">
                          {pageData?.title ?? program.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-fd-muted-foreground line-clamp-2">
                          {description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {perks.slice(0, 2).map((perk) => (
                            <Badge key={perk.title} variant="default">
                              {perk.title}
                            </Badge>
                          ))}
                          {extraPerks > 0 && (
                            <Badge variant="secondary">
                              {t.programs.more.replace(
                                "{count}",
                                String(extraPerks)
                              )}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </>
  );
}
