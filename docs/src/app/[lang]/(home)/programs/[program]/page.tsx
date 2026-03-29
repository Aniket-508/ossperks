import {
  getAllProgramSlugs,
  getPeopleByProgramSlug,
  getProgramsByCategory,
  programs as allPrograms,
} from "@ossperks/core";
import { ArrowRightIcon, ListTodoIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PersonCard } from "@/components/people/person-card";
import { ProgramBottomBar } from "@/components/programs/program-bottom-bar";
import { ProgramCard } from "@/components/programs/program-card";
import { ProgramStickyHeader } from "@/components/programs/program-sticky-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { generateLangParamsWithProgram } from "@/i18n/config";
import { getT } from "@/i18n/get-t";
import { withLocalePrefix } from "@/i18n/navigation";
import { getProgram } from "@/lib/programs";
import { getProgramPageImage, programsSource } from "@/lib/source";
import { encodeTagForPath } from "@/lib/tag-path";
import { getUnavatarUrl } from "@/lib/unavatar";
import { BreadcrumbJsonLd, ProgramJsonLd } from "@/seo/json-ld";
import { createMetadata } from "@/seo/metadata";

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ lang: string; program: string }>;
}) {
  const { lang, program: programSlug } = await params;
  const [program, t] = await Promise.all([
    getProgram(programSlug, lang),
    getT(lang),
  ]);
  if (!program) {
    notFound();
  }

  const categoryLabel =
    t.common.categories[program.category as keyof typeof t.common.categories] ??
    program.category;

  const people = getPeopleByProgramSlug(programSlug);
  const categoryHref = withLocalePrefix(
    lang,
    `${ROUTES.CATEGORIES}/${program.category}` as `/${string}`,
  );

  const programIdx = allPrograms.findIndex((p) => p.slug === program.slug);
  const prevProgram = programIdx > 0 ? allPrograms[programIdx - 1] : undefined;
  const nextProgram =
    programIdx !== -1 && programIdx < allPrograms.length - 1
      ? allPrograms[programIdx + 1]
      : undefined;

  const programPath = `${ROUTES.PROGRAMS}/${program.slug}` as `/${string}`;
  const canonicalPath = withLocalePrefix(lang, programPath);
  const shareUrl = `${SITE.URL}${canonicalPath}`;

  const prevHref = prevProgram
    ? withLocalePrefix(
        lang,
        `${ROUTES.PROGRAMS}/${prevProgram.slug}` as `/${string}`,
      )
    : null;
  const nextHref = nextProgram
    ? withLocalePrefix(
        lang,
        `${ROUTES.PROGRAMS}/${nextProgram.slug}` as `/${string}`,
      )
    : null;

  const applyUrl = program.applicationUrl ?? program.url;
  const checkHref = withLocalePrefix(
    lang,
    `${ROUTES.PROGRAMS}/${program.slug}/check`,
  );

  const similarRaw = getProgramsByCategory(program.category)
    .filter((p) => p.slug !== program.slug)
    .slice(0, 3);
  const similarProgramsResolved = await Promise.all(
    similarRaw.map((p) => getProgram(p.slug, lang)),
  );
  const similarPrograms = similarProgramsResolved.filter(
    (p): p is NonNullable<typeof p> => p !== null,
  );

  const sec = t.programs.sections;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: t.common.breadcrumbHome, path: "/" },
          { name: t.programs.listing.heading, path: ROUTES.PROGRAMS },
          {
            name: categoryLabel,
            path: `${ROUTES.CATEGORIES}/${program.category}` as `/${string}`,
          },
          {
            name: program.name,
            path: `${ROUTES.PROGRAMS}/${program.slug}` as `/${string}`,
          },
        ]}
        lang={lang}
      />
      <ProgramJsonLd lang={lang} program={program} />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <ProgramStickyHeader
            applyUrl={applyUrl}
            bottomBar={
              <ProgramBottomBar
                labels={{
                  copyLink: sec.copyLink,
                  copyLinkTooltip: sec.copyLinkTooltip,
                  linkCopied: sec.linkCopied,
                  linkCopiedTooltip: sec.linkCopiedTooltip,
                  nextProgram: sec.nextProgram,
                  nextProgramTooltip: sec.nextProgramTooltip,
                  previousProgram: sec.previousProgram,
                  previousProgramTooltip: sec.previousProgramTooltip,
                  share: sec.share,
                  shareOnFacebook: sec.shareOnFacebook,
                  shareOnLinkedIn: sec.shareOnLinkedIn,
                  shareOnReddit: sec.shareOnReddit,
                  shareOnWhatsApp: sec.shareOnWhatsApp,
                  shareOnX: sec.shareOnX,
                }}
                nextHref={nextHref}
                prevHref={prevHref}
                shareText={program.name}
                shareUrl={shareUrl}
              />
            }
            checkHref={checkHref}
            contentSlot={
              <>
                <Separator className="mb-10" />

                <section className="mb-10">
                  <h2 className="mb-4 text-xl font-semibold" id="perks">
                    {sec.perks}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {program.perks.map((perk) => (
                      <Card key={perk.title}>
                        <CardHeader>
                          <CardTitle className="text-base">
                            {perk.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-fd-muted-foreground text-sm">
                            {perk.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>

                <Separator className="mb-10" />

                <section className="mb-10">
                  <h2 className="mb-4 text-xl font-semibold" id="eligibility">
                    {sec.eligibility}
                  </h2>
                  <ul className="text-fd-foreground list-inside list-disc space-y-2">
                    {program.eligibility.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>

                {program.requirements && program.requirements.length > 0 ? (
                  <>
                    <Separator className="mb-10" />
                    <section className="mb-10">
                      <h2
                        className="mb-4 text-xl font-semibold"
                        id="requirements"
                      >
                        {sec.requirements}
                      </h2>
                      <ul className="text-fd-foreground list-inside list-disc space-y-2">
                        {program.requirements.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>
                  </>
                ) : null}

                {program.applicationProcess &&
                program.applicationProcess.length > 0 ? (
                  <>
                    <Separator className="mb-10" />
                    <section className="mb-10">
                      <h2
                        className="mb-4 text-xl font-semibold"
                        id="how-to-apply"
                      >
                        {sec.howToApply}
                      </h2>
                      <ol className="text-fd-foreground list-inside list-decimal space-y-2">
                        {program.applicationProcess.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    </section>
                  </>
                ) : null}
              </>
            }
            introSlot={
              <>
                <p className="text-fd-muted-foreground text-lg">
                  {t.programs.by} {program.provider}
                </p>
                <p className="text-fd-foreground mt-4">{program.description}</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button
                    nativeButton={false}
                    render={
                      <a
                        href={applyUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {t.programs.applyNow}
                        <ArrowRightIcon />
                      </a>
                    }
                    size="sm"
                    variant="default"
                  />
                  <Button
                    nativeButton={false}
                    render={
                      <Link href={checkHref}>
                        <ListTodoIcon />
                        {sec.checkEligibility}
                      </Link>
                    }
                    size="sm"
                    variant="outline"
                  />
                </div>
              </>
            }
            labels={{
              applyShort: sec.applyShort,
              checkShort: sec.checkShort,
            }}
            programName={program.name}
            programUrl={program.url}
          />

          <aside className="space-y-8 lg:sticky lg:top-16 lg:self-start">
            {people.length > 0 ? (
              <section>
                <h2 className="text-fd-muted-foreground mb-3 text-sm font-medium">
                  {sec.contact}
                </h2>
                <div className="flex flex-col gap-3">
                  {people.map((person) => {
                    const personHref = withLocalePrefix(
                      lang,
                      `${ROUTES.PEOPLE}/${person.slug}` as `/${string}`,
                    );
                    const avatarUrl = person.contact.url
                      ? getUnavatarUrl(person.contact.url)
                      : null;
                    return (
                      <PersonCard
                        avatarUrl={avatarUrl}
                        contact={person.contact}
                        href={personHref}
                        key={person.slug}
                        subtitle={
                          person.contact.role
                            ? t.people.roleAt
                                .replace("{role}", person.contact.role)
                                .replace("{provider}", program.provider)
                            : undefined
                        }
                      />
                    );
                  })}
                </div>
              </section>
            ) : null}

            <section>
              <h2 className="text-fd-muted-foreground mb-3 text-sm font-medium">
                {sec.categoryLabel}
              </h2>
              <Link href={categoryHref}>
                <Badge variant="default">{categoryLabel}</Badge>
              </Link>
            </section>

            {program.duration ? (
              <section>
                <h2 className="text-fd-muted-foreground mb-3 text-sm font-medium">
                  {sec.timeline}
                </h2>
                <p className="text-fd-foreground text-sm">{program.duration}</p>
              </section>
            ) : null}

            {program.tags && program.tags.length > 0 ? (
              <section>
                <h2 className="text-fd-muted-foreground mb-3 text-sm font-medium">
                  {sec.tags}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {program.tags.map((tag) => (
                    <Link
                      href={withLocalePrefix(
                        lang,
                        `${ROUTES.TAGS}/${encodeTagForPath(tag)}` as `/${string}`,
                      )}
                      key={tag}
                    >
                      <Badge variant="secondary">{tag}</Badge>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </aside>
        </div>

        {similarPrograms.length > 0 ? (
          <section className="border-fd-border/60 mt-14 border-t pt-10">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <h2 className="text-xl font-semibold whitespace-nowrap">
                  {sec.similarTo.replace("{name}", program.name)}
                </h2>
                <div
                  aria-hidden
                  className="bg-fd-border/80 hidden h-px max-w-20 flex-1 sm:block"
                />
              </div>
              <Button
                nativeButton={false}
                render={
                  <Link href={withLocalePrefix(lang, ROUTES.PROGRAMS)}>
                    {sec.viewAll}
                    <ArrowRightIcon />
                  </Link>
                }
                size="sm"
                variant="ghost"
                className="text-fd-primary"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {similarPrograms.map((p) => {
                const similarCategoryLabel =
                  t.common.categories[
                    p.category as keyof typeof t.common.categories
                  ] ?? p.category;
                const programHref = withLocalePrefix(
                  lang,
                  `${ROUTES.PROGRAMS}/${p.slug}` as `/${string}`,
                );
                return (
                  <ProgramCard
                    categoryLabel={similarCategoryLabel}
                    key={p.slug}
                    learnMore={t.programs.learnMore}
                    more={t.programs.more}
                    program={p}
                    programHref={programHref}
                  />
                );
              })}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}

export const generateStaticParams = () =>
  generateLangParamsWithProgram(getAllProgramSlugs);

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ lang: string; program: string }>;
}): Promise<Metadata> => {
  const { lang, program: programSlug } = await params;
  const program = await getProgram(programSlug, lang);
  if (!program) {
    notFound();
  }

  const programPath = `${ROUTES.PROGRAMS}/${program.slug}` as `/${string}`;
  const programPage = programsSource.getPage([program.slug], lang);
  const ogImage = programPage ? getProgramPageImage(programPage) : undefined;

  return createMetadata({
    description: program.description,
    lang,
    ...(ogImage?.url && { ogImage: ogImage.url }),
    ogType: "article",
    path: programPath,
    title: program.name,
  });
};
