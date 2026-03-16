import { programs, getCategories, getPeople } from "@ossperks/core";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { HeroActions } from "@/components/home/hero-actions";
import { HomeCtaWithDialogs } from "@/components/home/home-cta-with-dialogs";
import { ProgramCard } from "@/components/programs/program-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants/routes";
import { getT } from "@/lib/get-t";
import { i18n, withLocalePrefix } from "@/lib/i18n";
import { getFeaturedPrograms } from "@/lib/programs";
import { createMetadata } from "@/seo/metadata";

export const generateStaticParams = () =>
  i18n.languages.map((lang) => ({ lang }));

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> => {
  const { lang } = await params;
  const t = await getT(lang);
  return createMetadata({
    description: t.home.description,
    lang,
    path: "/",
    title: t.home.heading,
  });
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const [t, featured] = await Promise.all([
    getT(lang),
    getFeaturedPrograms(lang),
  ]);

  const categories = getCategories();
  const people = getPeople();
  const totalPerks = programs.reduce((sum, p) => sum + p.perks.length, 0);
  const programOptions = programs.map((p) => ({ name: p.name, slug: p.slug }));

  const stats = [
    { label: t.home.stats.programs, value: programs.length },
    { label: t.home.stats.perks, value: totalPerks },
    { label: t.home.stats.categories, value: categories.length },
    { label: t.home.stats.people, value: people.length },
  ];

  return (
    <div className="container flex-1 flex flex-col w-full py-12 px-4 mx-auto">
      {/* Hero */}
      <section className="pt-8 pb-16 sm:pt-24 sm:pb-32 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          {t.home.heading}
          <span className="text-fd-primary">.</span>
        </h1>
        <p className="text-fd-muted-foreground mb-8">{t.home.description}</p>
        <HeroActions
          lang={lang}
          browseProgramsLabel={t.home.hero.browsePrograms}
        />
      </section>

      <Separator />

      {/* Built for open source + Stats */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1 py-16">
            <p className="text-xs font-medium uppercase tracking-wider text-fd-muted-foreground mb-2">
              {t.home.builtFor.subheading}
            </p>
            <h2 className="text-2xl font-bold mb-2">
              {t.home.builtFor.heading}
            </h2>
            <p className="text-fd-muted-foreground max-w-2xl">
              {t.home.builtFor.description}
            </p>
          </div>
          <div className="relative grid self-stretch sm:w-[30%] grid-cols-2">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-[15%] bottom-[15%] w-px -translate-x-1/2 bg-linear-to-b from-transparent via-fd-border to-transparent" />
              <div className="absolute top-1/2 left-[15%] right-[15%] h-px -translate-y-1/2 bg-linear-to-r from-transparent via-fd-border to-transparent" />
            </div>
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center p-8"
              >
                <p className="text-3xl font-bold text-fd-primary">
                  {stat.value}
                </p>
                <p className="text-sm text-fd-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* Featured Programs */}
      <section className="py-16">
        <div className="mb-4 flex gap-2 items-center justify-between">
          <h2 className="text-2xl font-bold">{t.home.featured.heading}</h2>
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 text-fd-primary"
            nativeButton={false}
            render={
              <Link href={withLocalePrefix(lang, ROUTES.PROGRAMS)}>
                {t.home.featured.viewAll}
                <ArrowRight className="size-4" />
              </Link>
            }
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {featured.map((program) => {
            const categoryLabel =
              t.common.categories[
                program.category as keyof typeof t.common.categories
              ] ?? program.category;
            const programHref = withLocalePrefix(
              lang,
              `${ROUTES.PROGRAMS}/${program.slug}` as `/${string}`
            );
            return (
              <ProgramCard
                key={program.slug}
                program={program}
                programHref={programHref}
                categoryLabel={categoryLabel}
                learnMore={t.programs.learnMore}
                more={t.programs.more}
              />
            );
          })}
        </div>
      </section>

      <Separator />

      {/* People */}
      {people.length > 0 && (
        <section className="py-16">
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

      {/* How it works */}
      <section className="py-16 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-fd-muted-foreground mb-2">
          {t.home.howItWorks.subheading}
        </p>
        <h2 className="text-2xl font-bold mb-8">{t.home.howItWorks.heading}</h2>
        <div className="grid gap-8 sm:grid-cols-3 max-w-5xl mx-auto">
          {t.home.howItWorks.steps.map((step, index) => (
            <div
              key={step.title}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-fd-primary text-fd-primary-foreground font-bold text-sm">
                {index + 1}
              </div>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="text-balance text-sm text-fd-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* CTA */}
      <HomeCtaWithDialogs
        programOptions={programOptions}
        translations={t.home.cta}
        programDialogTranslations={t.programs.submit}
        contactDialogTranslations={t.people.submit}
      />
    </div>
  );
}
