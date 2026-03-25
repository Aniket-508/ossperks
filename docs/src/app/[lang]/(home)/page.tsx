import {
  programs,
  getCategories,
  getPeople,
  getPersonSlug,
} from "@ossperks/core";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { HeroActions } from "@/components/home/hero-actions";
import { HomeCtaWithDialogs } from "@/components/home/home-cta-with-dialogs";
import { ProgramCard } from "@/components/programs/program-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants/routes";
import { generateLangParams } from "@/i18n/config";
import { getT } from "@/i18n/get-t";
import { withLocalePrefix } from "@/i18n/navigation";
import { getFeaturedPrograms } from "@/lib/programs";
import { getUnavatarUrl } from "@/lib/unavatar";
import { createMetadata } from "@/seo/metadata";

export const generateStaticParams = generateLangParams;

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
    <div className="container mx-auto flex w-full flex-1 flex-col px-4 py-12">
      {/* Hero */}
      <section className="pt-8 pb-16 text-center sm:pt-24 sm:pb-32">
        <h1 className="mb-4 text-5xl font-bold tracking-tight">
          {t.home.heading}
          <span className="text-fd-primary">.</span>
        </h1>
        <p className="text-fd-muted-foreground mb-8">{t.home.description}</p>
        <HeroActions
          lang={lang}
          browseProgramsLabel={t.home.hero.browsePrograms}
          inputTranslations={t.check.input}
        />
      </section>

      <Separator />

      {/* Built for open source + Stats */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1 py-16">
            <p className="text-fd-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
              {t.home.builtFor.subheading}
            </p>
            <h2 className="mb-2 text-2xl font-bold">
              {t.home.builtFor.heading}
            </h2>
            <p className="text-fd-muted-foreground max-w-2xl">
              {t.home.builtFor.description}
            </p>
          </div>
          <div className="relative grid grid-cols-2 self-stretch sm:w-[30%]">
            <div className="pointer-events-none absolute inset-0">
              <div className="via-fd-border absolute top-[15%] bottom-[15%] left-1/2 w-px -translate-x-1/2 bg-linear-to-b from-transparent to-transparent" />
              <div className="via-fd-border absolute top-1/2 right-[15%] left-[15%] h-px -translate-y-1/2 bg-linear-to-r from-transparent to-transparent" />
            </div>
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center p-8"
              >
                <p className="text-fd-primary text-3xl font-bold">
                  {stat.value}
                </p>
                <p className="text-fd-muted-foreground text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* Featured Programs */}
      <section className="space-y-4 py-16">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-2xl font-bold">{t.home.featured.heading}</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-fd-primary shrink-0 max-sm:hidden"
            nativeButton={false}
            render={
              <Link href={withLocalePrefix(lang, ROUTES.PROGRAMS)}>
                {t.home.featured.viewAll}
                <ArrowRight />
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
              `${ROUTES.PROGRAMS}/${program.slug}` as `/${string}`,
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
        <Button
          variant="ghost"
          className="text-fd-primary w-full shrink-0 sm:hidden"
          nativeButton={false}
          render={
            <Link href={withLocalePrefix(lang, ROUTES.PROGRAMS)}>
              {t.home.featured.viewAll}
              <ArrowRight />
            </Link>
          }
        />
      </section>

      <Separator />

      {/* People */}
      <section className="space-y-4 py-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="mb-1 text-2xl font-bold">{t.home.people.heading}</h2>
            <p className="text-fd-muted-foreground">
              {t.home.people.description}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-fd-primary shrink-0 max-sm:hidden"
            nativeButton={false}
            render={
              <Link href={withLocalePrefix(lang, ROUTES.PEOPLE)}>
                {t.home.people.viewAll}
                <ArrowRight />
              </Link>
            }
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {people.slice(0, 6).map(({ contact, provider }) => {
            const personSlug = getPersonSlug(contact.name);
            const personHref = withLocalePrefix(
              lang,
              `/people/${personSlug}` as `/${string}`,
            );
            const roleText = contact.role
              ? t.people.roleAt
                  .replace("{role}", contact.role)
                  .replace("{provider}", provider)
              : provider;

            return (
              <Link
                key={`${contact.name}-${provider}`}
                href={personHref}
                className="group block"
              >
                <div className="ring-foreground/10 hover:bg-fd-accent flex flex-col items-center gap-3 rounded-xl p-8 ring-1 transition-colors">
                  <Avatar className="ring-fd-primary/20 group-hover:ring-fd-primary/40 size-16 ring-2 transition-all">
                    {contact.url &&
                      (() => {
                        const avatarUrl = getUnavatarUrl(contact.url);
                        return avatarUrl ? (
                          <AvatarImage src={avatarUrl} alt={contact.name} />
                        ) : null;
                      })()}
                    <AvatarFallback className="text-xl">
                      {contact.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <p className="font-semibold">{contact.name}</p>
                    <p className="text-fd-muted-foreground text-sm">
                      {roleText}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <Button
          variant="ghost"
          className="text-fd-primary w-full shrink-0 sm:hidden"
          nativeButton={false}
          render={
            <Link href={withLocalePrefix(lang, ROUTES.PEOPLE)}>
              {t.home.people.viewAll}
              <ArrowRight />
            </Link>
          }
        />
      </section>

      <Separator />

      {/* How it works */}
      <section className="py-16 text-center">
        <p className="text-fd-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
          {t.home.howItWorks.subheading}
        </p>
        <h2 className="mb-8 text-2xl font-bold">{t.home.howItWorks.heading}</h2>
        <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
          {t.home.howItWorks.steps.map((step, index) => (
            <div
              key={step.title}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className="bg-fd-primary text-fd-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                {index + 1}
              </div>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="text-fd-muted-foreground text-sm text-balance">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* CTA */}
      <HomeCtaWithDialogs
        lang={lang}
        programOptions={programOptions}
        translations={t.home.cta}
        contactDialogTranslations={t.people.submit}
      />
    </div>
  );
}
