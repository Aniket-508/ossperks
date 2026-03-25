import type { Metadata } from "next";

import { RepoCheckInput } from "@/components/check/check-input";
import { Separator } from "@/components/ui/separator";
import { generateLangParams } from "@/i18n/config";
import { getT } from "@/i18n/get-t";
import { CHECK_PAGE_CONTAINER } from "@/lib/check";
import { getProgramTranslations } from "@/lib/programs";
import { createMetadata } from "@/seo/metadata";

import { CheckPageClient } from "./page.client";

export const generateStaticParams = generateLangParams;

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
    getProgramTranslations(lang),
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
