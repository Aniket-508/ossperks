import { programs, getCategories, getPeople } from "@ossperks/data";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LINK } from "@/constants/links";
import { ROUTES } from "@/constants/routes";
import { getT } from "@/lib/get-t";
import { i18n, withLocalePrefix } from "@/lib/i18n";

export const generateStaticParams = () =>
  i18n.languages.map((lang) => ({ lang }));

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = await getT(lang);

  const categories = getCategories();
  const people = getPeople();
  const totalPerks = programs.reduce((sum, p) => sum + p.perks.length, 0);

  const stats = [
    { label: t.home.stats.programs, value: programs.length },
    { label: t.home.stats.perks, value: totalPerks },
    { label: t.home.stats.categories, value: categories.length },
    { label: t.home.stats.people, value: people.length },
  ];

  return (
    <>
      {/* Hero */}
      <section className="pb-16">
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          {t.home.heading}
        </h1>
        <p className="text-fd-muted-foreground text-lg max-w-xl mb-8">
          {t.home.description}
        </p>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="default"
            size="lg"
            nativeButton={false}
            render={
              <Link href={withLocalePrefix(lang, ROUTES.PROGRAMS)}>
                {t.home.programsLink}
              </Link>
            }
          />
          <Button
            variant="outline"
            size="lg"
            nativeButton={false}
            render={
              <Link href={withLocalePrefix(lang, ROUTES.CLI)}>
                {t.home.cliLink}
              </Link>
            }
          />
        </div>
      </section>

      {/* Stats */}
      <section className="pb-16">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-fd-primary">{stat.value}</p>
              <p className="text-sm text-fd-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <Separator className="mb-16" />

      {/* Featured Programs */}
      <section className="pb-16">
        <h2 className="text-2xl font-bold mb-2">{t.home.featured.heading}</h2>
        <p className="text-fd-muted-foreground mb-8">
          {t.home.featured.description}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {programs.map((program) => {
            const extraPerks = program.perks.length - 2;
            const categoryLabel =
              t.common.categories[
                program.category as keyof typeof t.common.categories
              ] ?? program.category;

            return (
              <Link
                key={program.slug}
                href={withLocalePrefix(
                  lang,
                  `${ROUTES.PROGRAMS}/${program.slug}` as `/${string}`
                )}
                className="group block"
              >
                <Card className="h-full transition-colors hover:bg-fd-accent">
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit text-xs">
                      {categoryLabel}
                    </Badge>
                    <CardTitle className="font-semibold group-hover:text-fd-primary mt-2">
                      {program.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-fd-muted-foreground line-clamp-2">
                      {program.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {program.perks.slice(0, 2).map((perk) => (
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
                    <div className="flex justify-end">
                      <span className="inline-flex items-center gap-1 text-xs text-fd-primary group-hover:underline">
                        {t.programs.learnMore}
                        <ArrowRight className="size-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <Separator className="mb-16" />

      {/* People */}
      {people.length > 0 && (
        <section className="pb-16">
          <h2 className="text-2xl font-bold mb-2">{t.home.people.heading}</h2>
          <p className="text-fd-muted-foreground mb-8">
            {t.home.people.description}
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {people.slice(0, 6).map(({ contact, provider }) => {
              const initial = contact.name.charAt(0).toUpperCase();
              return (
                <div
                  key={`${contact.name}-${provider}`}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="flex size-16 items-center justify-center rounded-full bg-fd-muted ring-2 ring-fd-primary/30 text-fd-foreground font-semibold text-xl">
                    {initial}
                  </div>
                  <p className="text-sm font-medium">{contact.name}</p>
                  <p className="text-xs text-fd-muted-foreground">{provider}</p>
                </div>
              );
            })}
          </div>
          {people.length > 6 && (
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                nativeButton={false}
                render={
                  <Link href={withLocalePrefix(lang, ROUTES.PEOPLE)}>
                    View all {people.length} people
                    <ArrowRight className="size-4" />
                  </Link>
                }
              />
            </div>
          )}
        </section>
      )}

      <Separator className="mb-16" />

      {/* CTA */}
      <section className="pb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">{t.home.cta.heading}</h2>
        <p className="text-fd-muted-foreground max-w-lg mx-auto mb-6">
          {t.home.cta.description}
        </p>
        <Button
          variant="default"
          size="lg"
          nativeButton={false}
          render={
            <a href={LINK.GITHUB} target="_blank" rel="noopener noreferrer">
              {t.home.cta.buttonText}
              <ArrowRight className="size-4" />
            </a>
          }
        />
      </section>
    </>
  );
}
