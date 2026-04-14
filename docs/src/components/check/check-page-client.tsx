"use client";

import { ArrowLeft, CircleX } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, ViewTransition } from "react";

import { RepoCheckInput } from "@/components/check/check-input";
import { CheckResults } from "@/components/check/check-results";
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
import { cn } from "@/lib/utils";
import type { CheckTranslations } from "@/locales/en/check";
import type {
  ProgramTranslationMap,
  TranslatedCheckResult,
} from "@/types/check";

export interface CheckPageClientProps {
  lang: string;
  programTranslations: ProgramTranslationMap;
  translations: CheckTranslations;
  /** When set, the per-program check route (single-result UI, scoped API). */
  program?: { name: string; slug: string };
}

const CheckPageFallback = () => (
  <div className={cn(CHECK_PAGE_CONTAINER, "animate-pulse py-28 sm:py-36")}>
    <div className="mb-8">
      <div className="bg-fd-muted mx-auto mb-4 h-10 w-72" />
      <div className="bg-fd-muted mx-auto mb-2 h-5 max-w-2xl" />
      <div className="bg-fd-muted mx-auto h-5 max-w-xl" />
    </div>
    <div className="bg-fd-muted mx-auto h-12 w-full max-w-2xl" />
  </div>
);

const CheckSkeleton = ({ name }: { name: string }) => (
  <div className={cn(CHECK_PAGE_CONTAINER, "animate-pulse")}>
    <div className="mb-8">
      <h1 className="mb-2 text-3xl font-bold">{name}</h1>
      <div className="bg-fd-muted mb-4 h-5 w-2/3" />
      <div className="flex gap-2">
        <div className="bg-fd-muted h-6 w-24" />
        <div className="bg-fd-muted h-6 w-16" />
        <div className="bg-fd-muted h-6 w-28" />
      </div>
    </div>
    <Separator className="mb-8" />
    <div className="mb-8 grid grid-cols-3 gap-4">
      {["stats-1", "stats-2", "stats-3"].map((key) => (
        <div key={key} className="border p-4 text-center">
          <div className="bg-fd-muted mx-auto mb-2 h-9 w-8" />
          <div className="bg-fd-muted mx-auto h-4 w-20" />
        </div>
      ))}
    </div>
    {["row-1", "row-2", "row-3", "row-4", "row-5"].map((key) => (
      <div key={key} className="bg-fd-muted mb-3 h-16" />
    ))}
  </div>
);

const ProgramCheckSkeleton = ({ name }: { name: string }) => (
  <div className={cn(CHECK_PAGE_CONTAINER, "animate-pulse")}>
    <div className="mb-8">
      <h1 className="mb-2 text-3xl font-bold">{name}</h1>
      <div className="bg-fd-muted mb-4 h-5 w-2/3" />
    </div>
    <Separator className="mb-8" />
    <div className="bg-fd-muted mb-3 h-24" />
  </div>
);

const CheckLanding = ({
  lang,
  translations,
}: {
  lang: string;
  translations: CheckTranslations;
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
  basePath,
  translations,
}: {
  lang: string;
  basePath?: `/${string}`;
  translations: CheckTranslations;
}) => (
  <>
    <Separator className="mb-8" />
    <section className="text-center">
      <h2 className="mb-4 text-lg font-semibold">
        {translations.checkAnother}
      </h2>
      <RepoCheckInput
        basePath={basePath}
        lang={lang}
        translations={translations.input}
      />
    </section>
  </>
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
                <span className="bg-fd-muted-foreground/50 size-1 shrink-0" />
                {reason}
              </li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  );
};

const GlobalCheckResultsView = ({
  lang,
  programTranslations,
  translations,
}: CheckPageClientProps) => {
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
        <div className="border border-red-500/20 bg-red-500/5 p-8 text-center">
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
      <CheckPageFooter lang={lang} translations={translations} />
    </div>
  );
};

const ProgramCheckResultsView = ({
  lang,
  program,
  programTranslations,
  translations,
}: CheckPageClientProps & { program: { name: string; slug: string } }) => {
  const searchParams = useSearchParams();
  const provider = searchParams.get("provider") ?? DEFAULT_PROVIDER;
  const owner = searchParams.get("owner");
  const path = searchParams.get("path");
  const repo = searchParams.get("repo");

  const { data, error, loading } = useCheckData({
    owner,
    path,
    program: program.slug,
    provider,
    repo,
    translations,
  });

  const heading = translations.checkProgram.replace("{program}", program.name);

  const translatedResult = useMemo((): TranslatedCheckResult | null => {
    const match = data?.results[0];
    if (!match) {
      return null;
    }
    const pt = programTranslations[program.slug];
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
  }, [data, lang, program.slug, programTranslations, translations.reasons]);

  const checkBasePath =
    `${ROUTES.PROGRAMS}/${program.slug}/check` as `/${string}`;
  const programHref = withLocalePrefix(
    lang,
    `${ROUTES.PROGRAMS}/${program.slug}` as `/${string}`,
  );

  if (!owner || !repo) {
    return (
      <div className={CHECK_PAGE_CONTAINER}>
        <div className="mb-6">
          <Button
            variant="link"
            size="sm"
            nativeButton={false}
            render={
              <Link href={programHref} transitionTypes={["nav-back"]}>
                <ArrowLeft />
                {program.name}
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
            basePath={checkBasePath}
            lang={lang}
            translations={translations.input}
          />
        </section>
      </div>
    );
  }

  if (loading) {
    return <ProgramCheckSkeleton name={program.name} />;
  }

  if (error) {
    return (
      <div className={CHECK_PAGE_CONTAINER}>
        <div className="border border-red-500/20 bg-red-500/5 p-8 text-center">
          <CircleX className="mx-auto mb-4 size-10 text-red-500" />
          <h1 className="mb-2 text-xl font-semibold">
            {translations.checkFailed}
          </h1>
          <p className="text-fd-muted-foreground mb-6">{error}</p>
          <RepoCheckInput
            basePath={checkBasePath}
            lang={lang}
            translations={translations.input}
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
            <Link href={programHref} transitionTypes={["nav-back"]}>
              <ArrowLeft />
              {program.name}
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
          basePath={checkBasePath}
          lang={lang}
          translations={translations.input}
        />
      </section>
    </div>
  );
};

const CheckPageInner = (props: CheckPageClientProps) => {
  const searchParams = useSearchParams();
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  if (props.program) {
    return <ProgramCheckResultsView {...props} program={props.program} />;
  }

  if (!owner || !repo) {
    return <CheckLanding lang={props.lang} translations={props.translations} />;
  }

  return <GlobalCheckResultsView {...props} />;
};

export const CheckPageClient = (props: CheckPageClientProps) => {
  const { program } = props;
  return (
    <Suspense
      fallback={
        <ViewTransition exit="slide-down">
          {program ? (
            <ProgramCheckSkeleton name={program.name} />
          ) : (
            <CheckPageFallback />
          )}
        </ViewTransition>
      }
    >
      <ViewTransition default="none" enter="slide-up">
        <CheckPageInner {...props} />
      </ViewTransition>
    </Suspense>
  );
};
