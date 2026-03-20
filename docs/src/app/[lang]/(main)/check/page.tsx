import { programs as corePrograms } from "@ossperks/core";
import type { Metadata } from "next";

import { RepoCheckInput } from "@/components/check/check-input";
import { Separator } from "@/components/ui/separator";
import { i18n } from "@/i18n/config";
import { getT } from "@/i18n/get-t";
import { CHECK_PAGE_CONTAINER } from "@/lib/check";
import { getPrograms } from "@/lib/programs";
import { createMetadata } from "@/seo/metadata";
import type { ProgramTranslationMap } from "@/types/check";

import { CheckPageClient } from "./page.client";

export const generateStaticParams = () =>
  i18n.languages.map((lang) => ({ lang }));

type CheckPageSearchParams = Record<string, string | string[] | undefined>;

const getSearchParam = (
  value: string | string[] | undefined,
): string | undefined => (Array.isArray(value) ? value[0] : value);

export const generateMetadata = async ({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<CheckPageSearchParams>;
}): Promise<Metadata> => {
  const [{ lang }, query] = await Promise.all([params, searchParams]);
  const t = await getT(lang);

  const owner = getSearchParam(query.owner);
  const repo = getSearchParam(query.repo);
  const provider = getSearchParam(query.provider) ?? "github";

  if (owner && repo) {
    const repoPath = `${owner}/${repo}`;
    const ogParams = new URLSearchParams({ owner, provider, repo });
    return createMetadata({
      description: t.check.description,
      lang,
      ogImage: `/og/${lang}/check?${ogParams.toString()}`,
      ogTitle: `${repoPath} — Eligibility Check`,
      path: "/check",
      title: t.check.heading,
    });
  }

  return createMetadata({
    description: t.check.description,
    lang,
    path: "/check",
    title: t.check.heading,
  });
};

const buildProgramTranslations = async (
  lang: string,
): Promise<ProgramTranslationMap> => {
  const translated = await getPrograms(lang);
  const englishPrograms = new Map(
    corePrograms.map((program) => [program.slug, program]),
  );
  const map: ProgramTranslationMap = {};
  for (const p of translated) {
    const en = englishPrograms.get(p.slug);
    map[p.slug] = {
      eligibility: p.eligibility,
      hasEligibilityParity:
        lang === i18n.defaultLanguage ||
        p.eligibility.length ===
          (en?.eligibility.length ?? p.eligibility.length),
      name: p.name,
    };
  }
  return map;
};

const CheckLanding = ({
  lang,
  translations,
}: {
  lang: string;
  translations: Awaited<ReturnType<typeof getT>>["check"];
}) => (
  <div className={CHECK_PAGE_CONTAINER}>
    <section className="py-16 text-center sm:py-24">
      <h1 className="mb-4 text-4xl font-bold tracking-tight">
        {translations.heading}
        <span className="text-fd-primary">.</span>
      </h1>
      <p className="text-fd-muted-foreground mx-auto mb-8 max-w-2xl">
        {translations.description}
      </p>
      <RepoCheckInput lang={lang} translations={translations.input} />
    </section>
  </div>
);

const CheckPageFooter = ({
  lang,
  translations,
}: {
  lang: string;
  translations: Awaited<ReturnType<typeof getT>>["check"];
}) => (
  <>
    <Separator className="mb-8" />
    <section className="text-center">
      <h2 className="mb-4 text-lg font-semibold">
        {translations.checkAnother}
      </h2>
      <RepoCheckInput lang={lang} translations={translations.input} />
    </section>
  </>
);

export default async function CheckPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<CheckPageSearchParams>;
}) {
  const [{ lang }, query] = await Promise.all([params, searchParams]);
  const [t, programTranslations] = await Promise.all([
    getT(lang),
    buildProgramTranslations(lang),
  ]);

  const owner = getSearchParam(query.owner);
  const repo = getSearchParam(query.repo);

  if (!owner || !repo) {
    return <CheckLanding lang={lang} translations={t.check} />;
  }

  return (
    <CheckPageClient
      lang={lang}
      translations={t.check}
      programTranslations={programTranslations}
    >
      <CheckPageFooter lang={lang} translations={t.check} />
    </CheckPageClient>
  );
}
