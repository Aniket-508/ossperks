import {
  getAllProgramSlugs,
  getPeopleByProgramSlug,
  programs as allPrograms,
} from "@ossperks/core";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";

import { PersonCard } from "@/components/people/person-card";
import { ProgramBottomBar } from "@/components/programs/program-bottom-bar";
import { ProgramHeader } from "@/components/programs/program-header";
import { SimilarPrograms } from "@/components/programs/similar-programs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants/routes";
import { generateLangParamsWithProgram } from "@/i18n/config";
import { getT } from "@/i18n/get-t";
import { withLocalePrefix } from "@/i18n/navigation";
import { getProgram } from "@/lib/programs";
import { getProgramPageImage, programsSource } from "@/lib/source";
import { getUnavatarUrl } from "@/lib/unavatar";
import { encodeUrlForPath } from "@/lib/url";
import { absoluteUrl } from "@/lib/utils";
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
  const shareUrl = absoluteUrl(canonicalPath);

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

  const sec = t.programs.sections;

  return (
    <ViewTransition
      enter={{
        default: "none",
        "nav-back": "nav-back",
        "nav-forward": "nav-forward",
      }}
      exit={{
        default: "none",
        "nav-back": "nav-back",
        "nav-forward": "nav-forward",
      }}
      default="none"
    >
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
      <div className="view-container flex flex-1 flex-col">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="flex flex-col">
            <ProgramHeader
              labels={{
                apply: {
                  short: sec.applyShort,
                  text: t.programs.applyNow,
                },
                by: t.programs.by,
                check: {
                  short: sec.checkShort,
                  text: sec.checkEligibility,
                },
              }}
              name={program.name}
              description={program.description}
              provider={program.provider}
              url={program.url}
              applyUrl={applyUrl}
              checkHref={checkHref}
            />

            <Separator className="mb-10" />

            <section className="mb-10">
              <h2 className="mb-4 text-xl font-semibold" id="perks">
                {sec.perks}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {program.perks.map((perk) => (
                  <Card key={perk.title}>
                    <CardHeader>
                      <CardTitle className="text-base">{perk.title}</CardTitle>
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
                  <h2 className="mb-4 text-xl font-semibold" id="requirements">
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
                  <h2 className="mb-4 text-xl font-semibold" id="how-to-apply">
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
                shareMore: sec.shareMore,
                shareOnBluesky: sec.shareOnBluesky,
                shareOnFacebook: sec.shareOnFacebook,
                shareOnHackerNews: sec.shareOnHackerNews,
                shareOnLinkedIn: sec.shareOnLinkedIn,
                shareOnMastodon: sec.shareOnMastodon,
                shareOnReddit: sec.shareOnReddit,
                shareOnThreads: sec.shareOnThreads,
                shareOnWhatsApp: sec.shareOnWhatsApp,
                shareOnX: sec.shareOnX,
              }}
              nextHref={nextHref}
              prevHref={prevHref}
              shareText={program.name}
              shareUrl={shareUrl}
            />
          </div>

          <aside className="-mt-4 space-y-8 pt-4 lg:sticky lg:top-(--header-height) lg:self-start">
            <section>
              <h2 className="text-fd-muted-foreground mb-3 text-sm font-medium">
                {sec.categoryLabel}
              </h2>
              <Link href={categoryHref} transitionTypes={["nav-back"]}>
                <Badge variant="default">{categoryLabel}</Badge>
              </Link>
            </section>

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
                        `${ROUTES.TAGS}/${encodeUrlForPath(tag)}` as `/${string}`,
                      )}
                      key={tag}
                      transitionTypes={["nav-back"]}
                    >
                      <Badge variant="secondary">{tag}</Badge>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </aside>
        </div>

        <SimilarPrograms
          program={program}
          lang={lang}
          labels={{
            categories: t.common.categories,
            learnMore: t.programs.learnMore,
            more: t.programs.more,
            similarTo: sec.similarTo,
            viewAll: sec.viewAll,
          }}
        />
      </div>
    </ViewTransition>
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
