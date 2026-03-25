"use client";

import { CircleX } from "lucide-react";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { Suspense, useMemo } from "react";

import { RepoCheckInput } from "@/components/check/check-input";
import { CheckResults } from "@/components/check/check-results";
import { Separator } from "@/components/ui/separator";
import { useCheckData } from "@/hooks/use-check-data";
import { translateReasons } from "@/i18n/translate-reasons";
import { CHECK_PAGE_CONTAINER, DEFAULT_PROVIDER } from "@/lib/check";
import type { CheckTranslations } from "@/locales/en/check";
import type { ProgramTranslationMap } from "@/types/check";

interface CheckPageClientProps {
  children?: ReactNode;
  lang: string;
  programTranslations: ProgramTranslationMap;
  translations: CheckTranslations;
}

const CheckPageFallback = () => (
  <div className={`${CHECK_PAGE_CONTAINER} animate-pulse`}>
    <div className="mb-8">
      <div className="bg-fd-muted mx-auto mb-4 h-10 w-72 rounded" />
      <div className="bg-fd-muted mx-auto mb-2 h-5 max-w-2xl rounded" />
      <div className="bg-fd-muted mx-auto h-5 max-w-xl rounded" />
    </div>
    <div className="bg-fd-muted mx-auto h-12 w-full max-w-2xl rounded" />
  </div>
);

const CheckSkeleton = ({ name }: { name: string }) => (
  <div className={`${CHECK_PAGE_CONTAINER} animate-pulse`}>
    <div className="mb-8">
      <h1 className="mb-2 text-3xl font-bold">{name}</h1>
      <div className="bg-fd-muted mb-4 h-5 w-2/3 rounded" />
      <div className="flex gap-2">
        <div className="bg-fd-muted h-6 w-24 rounded-full" />
        <div className="bg-fd-muted h-6 w-16 rounded-full" />
        <div className="bg-fd-muted h-6 w-28 rounded-full" />
      </div>
    </div>
    <Separator className="mb-8" />
    <div className="mb-8 grid grid-cols-3 gap-4">
      {["stats-1", "stats-2", "stats-3"].map((key) => (
        <div key={key} className="rounded-lg border p-4 text-center">
          <div className="bg-fd-muted mx-auto mb-2 h-9 w-8 rounded" />
          <div className="bg-fd-muted mx-auto h-4 w-20 rounded" />
        </div>
      ))}
    </div>
    {["row-1", "row-2", "row-3", "row-4", "row-5"].map((key) => (
      <div key={key} className="bg-fd-muted mb-3 h-16 rounded-lg" />
    ))}
  </div>
);

const CheckPageInner = ({
  children,
  lang,
  programTranslations,
  translations,
}: Omit<CheckPageClientProps, "fallback">) => {
  const searchParams = useSearchParams();
  const provider = searchParams.get("provider") ?? DEFAULT_PROVIDER;
  const owner = searchParams.get("owner");
  const path = searchParams.get("path");
  const repo = searchParams.get("repo");

  const { data, error, loading } = useCheckData({
    owner,
    path,
    provider,
    repo,
    translations,
  });

  const repoName = path ?? [owner, repo].filter(Boolean).join("/");

  const currentData = useMemo(() => {
    if (
      !data ||
      data.repo.owner !== owner ||
      data.repo.path !== (path ?? [owner, repo].filter(Boolean).join("/")) ||
      data.repo.provider !== provider ||
      data.repo.repo !== repo
    ) {
      return null;
    }
    return data;
  }, [data, owner, path, provider, repo]);

  const translatedData = useMemo(() => {
    if (!currentData) {
      return null;
    }
    return {
      ...currentData,
      results: currentData.results.map((result) => {
        const programTranslation = programTranslations[result.slug];
        return {
          ...result,
          name: programTranslation?.name ?? result.name,
          reasons: translateReasons(
            result.reasons,
            programTranslation?.eligibility ?? [],
            translations.reasons,
            {
              canTranslateRuleReasons:
                programTranslation?.hasEligibilityParity ?? false,
              formatNumber: (value) =>
                new Intl.NumberFormat(lang).format(value),
            },
          ),
        };
      }),
    };
  }, [currentData, lang, programTranslations, translations.reasons]);

  if (loading) {
    return <CheckSkeleton name={repoName} />;
  }

  if (error) {
    return (
      <div className={CHECK_PAGE_CONTAINER}>
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-8 text-center">
          <CircleX className="mx-auto mb-4 size-10 text-red-500" />
          <h1 className="mb-2 text-xl font-semibold">
            {translations.checkFailed}
          </h1>
          <p className="text-fd-muted-foreground mb-6">{error}</p>
          <RepoCheckInput lang={lang} translations={translations.input} />
        </div>
      </div>
    );
  }

  if (!translatedData) {
    return <CheckSkeleton name={repoName} />;
  }

  return (
    <div className={CHECK_PAGE_CONTAINER}>
      <CheckResults
        data={translatedData}
        lang={lang}
        translations={translations}
      />
      {children}
    </div>
  );
};

export const CheckPageClient = ({ ...props }: CheckPageClientProps) => (
  <Suspense fallback={<CheckPageFallback />}>
    <CheckPageInner {...props} />
  </Suspense>
);
