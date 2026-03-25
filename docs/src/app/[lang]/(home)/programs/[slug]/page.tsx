import { getAllProgramSlugs } from "@ossperks/core";
import { ArrowRightIcon, ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants/routes";
import { i18n } from "@/i18n/config";
import { getT } from "@/i18n/get-t";
import { withLocalePrefix } from "@/i18n/navigation";
import { getProgram } from "@/lib/programs";
import { getProgramPageImage, programsSource } from "@/lib/source";
import { createMetadata } from "@/seo/metadata";

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const [program, t] = await Promise.all([getProgram(slug, lang), getT(lang)]);
  if (!program) {
    notFound();
  }

  const categoryLabel =
    t.common.categories[program.category as keyof typeof t.common.categories] ??
    program.category;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-12">
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
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="default">{categoryLabel}</Badge>
          {program.duration && (
            <Badge variant="outline">{program.duration}</Badge>
          )}
        </div>
        <h1 className="mb-2 text-3xl font-bold">{program.name}</h1>
        <p className="text-fd-muted-foreground text-lg">
          {t.programs.by} {program.provider}
        </p>
        <p className="text-fd-foreground mt-4">{program.description}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
        <h2 id="perks" className="mb-4 text-xl font-semibold">
          {t.programs.sections.perks}
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
        <h2 id="eligibility" className="mb-4 text-xl font-semibold">
          {t.programs.sections.eligibility}
        </h2>
        <ul className="text-fd-foreground list-inside list-disc space-y-2">
          {program.eligibility.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {program.requirements && program.requirements.length > 0 && (
        <>
          <Separator className="mb-10" />
          <section className="mb-10">
            <h2 id="requirements" className="mb-4 text-xl font-semibold">
              {t.programs.sections.requirements}
            </h2>
            <ul className="text-fd-foreground list-inside list-disc space-y-2">
              {program.requirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </>
      )}

      {program.applicationProcess && program.applicationProcess.length > 0 && (
        <>
          <Separator className="mb-10" />
          <section className="mb-10">
            <h2 id="how-to-apply" className="mb-4 text-xl font-semibold">
              {t.programs.sections.howToApply}
            </h2>
            <ol className="text-fd-foreground list-inside list-decimal space-y-2">
              {program.applicationProcess.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
        </>
      )}

      {program.tags && program.tags.length > 0 && (
        <>
          <Separator className="mb-10" />
          <section>
            <h2 id="tags" className="mb-4 text-xl font-semibold">
              {t.programs.sections.tags}
            </h2>
            <div className="flex flex-wrap gap-2">
              {program.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export const generateStaticParams = () =>
  i18n.languages.flatMap((lang) =>
    getAllProgramSlugs().map((slug) => ({ lang, slug })),
  );

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> => {
  const { lang, slug } = await params;
  const program = await getProgram(slug, lang);
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
