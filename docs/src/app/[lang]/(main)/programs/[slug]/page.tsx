import { programs, getProgramBySlug } from "@ossperks/data";
import { ArrowRightIcon, ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants/routes";
import { getT } from "@/lib/get-t";
import type { Translations } from "@/lib/get-t";
import { i18n, withLocalePrefix } from "@/lib/i18n";
import { getProgramPageImage, programsSource } from "@/lib/source";

type Program = NonNullable<ReturnType<typeof getProgramBySlug>>;

const resolveProgramContent = (program: Program, t: Translations) => ({
  applicationProcess: program.applicationProcess ?? [],
  categoryLabel:
    t.common.categories[program.category as keyof typeof t.common.categories] ??
    program.category,
  description: program.description,
  eligibility: program.eligibility,
  perks: program.perks,
  requirements: program.requirements ?? [],
  tags: program.tags ?? [],
  title: program.name,
});

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const program = getProgramBySlug(slug);
  if (!program) {
    notFound();
  }

  const t = await getT(lang);
  const {
    title,
    description,
    perks,
    eligibility,
    requirements,
    applicationProcess,
    tags,
    categoryLabel,
  } = resolveProgramContent(program, t);

  return (
    <>
      <div className="mb-6">
        <Button
          variant="link"
          size="sm"
          nativeButton={false}
          render={
            <Link href={withLocalePrefix(lang, ROUTES.PROGRAMS)}>
              <ArrowLeftIcon />
              {t.programs.backToAll}
            </Link>
          }
        />
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Badge variant="default">{categoryLabel}</Badge>
          {program.duration && (
            <Badge variant="secondary">{program.duration}</Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-fd-muted-foreground text-lg">
          {t.programs.by} {program.provider}
        </p>
        <p className="mt-4 text-fd-foreground">{description}</p>
        <div className="mt-6 flex gap-3">
          <Button
            variant="default"
            size="sm"
            nativeButton={false}
            render={
              <a
                href={program.applicationUrl ?? program.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.programs.applyNow}
                <ArrowRightIcon />
              </a>
            }
          />
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={
              <a href={program.url} target="_blank" rel="noopener noreferrer">
                {t.programs.viewDetails.replace("{provider}", program.provider)}
              </a>
            }
          />
        </div>
      </div>

      <Separator className="mb-10" />

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          {t.programs.sections.perks}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {perks.map((perk) => (
            <Card key={perk.title}>
              <CardHeader>
                <CardTitle className="text-base">{perk.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-fd-muted-foreground">
                  {perk.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="mb-10" />

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          {t.programs.sections.eligibility}
        </h2>
        <ul className="list-disc list-inside space-y-2 text-fd-foreground">
          {eligibility.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {requirements.length > 0 && (
        <>
          <Separator className="mb-10" />
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">
              {t.programs.sections.requirements}
            </h2>
            <ul className="list-disc list-inside space-y-2 text-fd-foreground">
              {requirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </>
      )}

      {applicationProcess.length > 0 && (
        <>
          <Separator className="mb-10" />
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">
              {t.programs.sections.howToApply}
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-fd-foreground">
              {applicationProcess.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
        </>
      )}

      {tags.length > 0 && (
        <>
          <Separator className="mb-10" />
          <section>
            <h2 className="text-xl font-semibold mb-4">
              {t.programs.sections.tags}
            </h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </section>
        </>
      )}
    </>
  );
}

export const generateStaticParams = () =>
  programs.map((p) => ({ slug: p.slug }));

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> => {
  const { lang, slug } = await params;
  const program = getProgramBySlug(slug);
  if (!program) {
    notFound();
  }

  const programPath = `${ROUTES.PROGRAMS}/${program.slug}` as `/${string}`;
  const canonical = withLocalePrefix(lang, programPath);
  const languages: Record<string, string> = Object.fromEntries(
    i18n.languages.map((locale) => [
      locale,
      withLocalePrefix(locale, programPath),
    ])
  );
  languages["x-default"] = withLocalePrefix(i18n.defaultLanguage, programPath);

  const ogLocale = lang.replace("-", "_");
  const programPage = programsSource.getPage([program.slug], lang);
  const ogImage = programPage ? getProgramPageImage(programPage) : { url: "" };

  return {
    alternates: {
      canonical,
      languages,
    },
    description: program.description,
    openGraph: {
      description: program.description,
      ...(ogImage.url && {
        images: [
          {
            alt: program.name,
            height: 630,
            url: ogImage.url,
            width: 1200,
          },
        ],
      }),
      locale: ogLocale,
      title: program.name,
      type: "article",
    },
    title: program.name,
    twitter: {
      card: "summary_large_image",
      description: program.description,
      ...(ogImage.url && { images: [ogImage.url] }),
      title: program.name,
    },
  };
};
