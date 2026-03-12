import { programs, getProgramBySlug } from "@ossperks/data";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getT } from "@/lib/get-t";
import type { Translations } from "@/lib/get-t";
import { withLocalePrefix } from "@/lib/i18n";
import { programsSource } from "@/lib/source";

interface Perk {
  title: string;
  description: string;
}

interface ProgramPageData {
  title: string;
  description?: string;
  perks?: Perk[];
  eligibility?: string[];
  requirements?: string[];
  applicationProcess?: string[];
}

type Program = NonNullable<ReturnType<typeof getProgramBySlug>>;

const resolveProgramContent = (
  program: Program,
  pageData: ProgramPageData | undefined,
  t: Translations
) => ({
  applicationProcess:
    pageData?.applicationProcess ?? program.applicationProcess ?? [],
  categoryLabel:
    t.common.categories[program.category as keyof typeof t.common.categories] ??
    program.category,
  description: pageData?.description ?? program.description,
  eligibility: pageData?.eligibility ?? program.eligibility,
  perks: pageData?.perks ?? program.perks,
  requirements: pageData?.requirements ?? program.requirements ?? [],
  tags: program.tags ?? [],
  title: pageData?.title ?? program.name,
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

  const pageData = programsSource.getPage([slug], lang)?.data as
    | ProgramPageData
    | undefined;
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
  } = resolveProgramContent(program, pageData, t);

  return (
    <main className="container max-w-4xl py-12 px-4 mx-auto">
      <Link
        href={withLocalePrefix(lang, "/programs")}
        className="text-sm text-fd-muted-foreground hover:text-fd-primary mb-6 inline-block"
      >
        {t.programs.backToAll}
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-block rounded-full bg-fd-primary/10 px-3 py-1 text-xs font-medium text-fd-primary">
            {categoryLabel}
          </span>
          {program.duration && (
            <span className="inline-block rounded-full bg-fd-muted px-3 py-1 text-xs text-fd-muted-foreground">
              {program.duration}
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-fd-muted-foreground text-lg">
          {t.programs.by} {program.provider}
        </p>
        <p className="mt-4 text-fd-foreground">{description}</p>
        <div className="mt-6 flex gap-3">
          <a
            href={program.applicationUrl ?? program.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground hover:bg-fd-primary/90 transition-colors"
          >
            {t.programs.applyNow}
          </a>
          <a
            href={program.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-fd-accent transition-colors"
          >
            {t.programs.viewDetails.replace("{provider}", program.provider)}
          </a>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          {t.programs.sections.perks}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {perks.map((perk) => (
            <div key={perk.title} className="rounded-lg border bg-fd-card p-4">
              <h3 className="font-semibold mb-1">{perk.title}</h3>
              <p className="text-sm text-fd-muted-foreground">
                {perk.description}
              </p>
            </div>
          ))}
        </div>
      </section>

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
      )}

      {applicationProcess.length > 0 && (
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
      )}

      {tags.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">
            {t.programs.sections.tags}
          </h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-block rounded-full bg-fd-muted px-3 py-1 text-xs text-fd-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}
    </main>
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

  const pageData = programsSource.getPage([slug], lang)?.data as
    | ProgramPageData
    | undefined;
  const description = pageData?.description ?? program.description;

  return {
    description,
    title: `${pageData?.title ?? program.name} | OSS Programs`,
  };
};
