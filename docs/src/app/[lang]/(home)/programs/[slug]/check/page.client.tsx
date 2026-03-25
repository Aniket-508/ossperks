"use client";

import { ArrowLeft, CircleX } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";

import { RepoCheckInput } from "@/components/check/check-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants/routes";
import { useCheckData } from "@/hooks/use-check-data";
import { withLocalePrefix } from "@/i18n/navigation";
import { translateReasons } from "@/i18n/translate-reasons";
import {
  CHECK_PAGE_CONTAINER,
  DEFAULT_PROVIDER,
  STATUS_CONFIG,
  STATUS_LABELS,
} from "@/lib/check";
import type { CheckTranslations } from "@/locales/en/check";
import type {
  ProgramTranslationMap,
  TranslatedCheckResult,
} from "@/types/check";

interface ProgramCheckPageClientProps {
  lang: string;
  programSlug: string;
  programName: string;
  translations: CheckTranslations;
  programTranslations: ProgramTranslationMap;
}

const ProgramCheckSkeleton = ({ name }: { name: string }) => (
  <div className={`${CHECK_PAGE_CONTAINER} animate-pulse`}>
    <div className="mb-8">
      <h1 className="mb-2 text-3xl font-bold">{name}</h1>
      <div className="bg-fd-muted mb-4 h-5 w-2/3 rounded" />
    </div>
    <Separator className="mb-8" />
    <div className="bg-fd-muted mb-3 h-24 rounded-lg" />
  </div>
);

const ProgramResultCard = ({
  result,
  translations,
}: {
  result: TranslatedCheckResult;
  translations: CheckTranslations;
}) => {
  const config = STATUS_CONFIG[result.status];
  const Icon = config.icon;
  const label = translations[STATUS_LABELS[result.status]];

  return (
    <Card className={config.ring}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className={`size-5 ${config.color}`} />
          <span className={config.color}>{label}</span>
        </CardTitle>
      </CardHeader>
      {result.reasons.length > 0 && (
        <CardContent className="pt-0">
          <ul className="space-y-1">
            {[...new Set(result.reasons)].filter(Boolean).map((reason) => (
              <li
                key={reason}
                className="text-fd-muted-foreground flex items-center gap-2 text-sm"
              >
                <span className="bg-fd-muted-foreground/50 size-1 shrink-0 rounded-full" />
                {reason}
              </li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  );
};

const ProgramCheckInner = ({
  lang,
  programSlug,
  programName,
  translations,
  programTranslations,
}: ProgramCheckPageClientProps) => {
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

  const heading = translations.checkProgram.replace("{program}", programName);

  const translatedResult = useMemo((): TranslatedCheckResult | null => {
    if (!data) {
      return null;
    }
    const match = data.results.find((r) => r.slug === programSlug);
    if (!match) {
      return null;
    }
    const pt = programTranslations[programSlug];
    return {
      ...match,
      name: pt?.name ?? match.name,
      reasons: translateReasons(
        match.reasons,
        pt?.eligibility ?? [],
        translations.reasons,
        {
          canTranslateRuleReasons: pt?.hasEligibilityParity ?? false,
          formatNumber: (value) => new Intl.NumberFormat(lang).format(value),
        },
      ),
    };
  }, [data, lang, programSlug, programTranslations, translations.reasons]);

  const checkBasePath =
    `${ROUTES.PROGRAMS}/${programSlug}/check` as `/${string}`;

  if (!owner || !repo) {
    return (
      <div className={CHECK_PAGE_CONTAINER}>
        <div className="mb-6">
          <Button
            variant="link"
            size="sm"
            nativeButton={false}
            render={
              <Link
                href={withLocalePrefix(
                  lang,
                  `${ROUTES.PROGRAMS}/${programSlug}` as `/${string}`,
                )}
              >
                <ArrowLeft />
                {programName}
              </Link>
            }
          />
        </div>
        <section className="py-16 text-center sm:py-24">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            {heading}
            <span className="text-fd-primary">.</span>
          </h1>
          <p className="text-fd-muted-foreground mx-auto mb-8 max-w-2xl">
            {translations.programCheckDescription}
          </p>
          <RepoCheckInput
            lang={lang}
            translations={translations.input}
            basePath={checkBasePath}
          />
        </section>
      </div>
    );
  }

  if (loading) {
    return <ProgramCheckSkeleton name={programName} />;
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
          <RepoCheckInput
            lang={lang}
            translations={translations.input}
            basePath={checkBasePath}
          />
        </div>
      </div>
    );
  }

  const repoName = path ?? [owner, repo].filter(Boolean).join("/");

  return (
    <div className={CHECK_PAGE_CONTAINER}>
      <div className="mb-6">
        <Button
          variant="link"
          size="sm"
          nativeButton={false}
          render={
            <Link
              href={withLocalePrefix(
                lang,
                `${ROUTES.PROGRAMS}/${programSlug}` as `/${string}`,
              )}
            >
              <ArrowLeft />
              {programName}
            </Link>
          }
        />
      </div>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">{heading}</h1>
        <Badge variant="outline">{repoName}</Badge>
      </div>

      <Separator className="mb-8" />

      {translatedResult ? (
        <ProgramResultCard
          result={translatedResult}
          translations={translations}
        />
      ) : (
        <p className="text-fd-muted-foreground text-center">
          {translations.noResultFound}
        </p>
      )}

      <Separator className="my-8" />

      <section className="text-center">
        <h2 className="mb-4 text-lg font-semibold">
          {translations.checkAnother}
        </h2>
        <RepoCheckInput
          lang={lang}
          translations={translations.input}
          basePath={checkBasePath}
        />
      </section>
    </div>
  );
};

export const ProgramCheckPageClient = (props: ProgramCheckPageClientProps) => (
  <Suspense fallback={<ProgramCheckSkeleton name={props.programName} />}>
    <ProgramCheckInner {...props} />
  </Suspense>
);
