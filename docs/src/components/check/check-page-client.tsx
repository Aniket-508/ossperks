"use client";

import { ArrowLeft, CircleX } from "lucide-react";
import Link from "next/link";
import { useMemo, ViewTransition } from "react";

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
  CheckResult,
  CheckUrlSearchParams,
  ProgramTranslationMap,
  TranslatedCheckResult,
} from "@/types/check";

export interface CheckPageClientProps {
  lang: string;
  programTranslations: ProgramTranslationMap;
  translations: CheckTranslations;
  searchParams: CheckUrlSearchParams;
  program?: { name: string; slug: string };
}

type Program = NonNullable<CheckPageClientProps["program"]>;

const repoNameFromParams = ({
  path,
  owner,
  repo,
}: Pick<CheckUrlSearchParams, "path" | "owner" | "repo">): string =>
  path ?? [owner, repo].filter(Boolean).join("/");

const programCheckPath = (slug: string): `/${string}` =>
  `${ROUTES.PROGRAMS}/${slug}/check` as `/${string}`;

const applyTranslations = (
  result: CheckResult,
  programTranslations: ProgramTranslationMap,
  slug: string,
  lang: string,
  reasonTranslations: CheckTranslations["reasons"],
): TranslatedCheckResult => {
  const pt = programTranslations[slug];
  return {
    ...result,
    name: pt?.name ?? result.name,
    reasons: translateReasons(
      result.reasons,
      pt?.eligibility ?? [],
      reasonTranslations,
      {
        canTranslateRuleReasons: pt?.hasEligibilityParity ?? false,
        formatNumber: (value) => new Intl.NumberFormat(lang).format(value),
      },
    ),
  };
};

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

const CheckAnotherSection = ({
  lang,
  translations,
  basePath,
}: {
  lang: string;
  translations: CheckTranslations;
  basePath?: `/${string}`;
}) => (
  <section className="text-center">
    <h2 className="mb-4 text-lg font-semibold">{translations.checkAnother}</h2>
    <RepoCheckInput
      basePath={basePath}
      lang={lang}
      translations={translations.input}
    />
  </section>
);

const CheckErrorSection = ({
  lang,
  translations,
  error,
  basePath,
}: {
  lang: string;
  translations: CheckTranslations;
  error: string;
  basePath?: `/${string}`;
}) => (
  <div className={CHECK_PAGE_CONTAINER}>
    <div className="border border-red-500/20 bg-red-500/5 p-8 text-center">
      <CircleX className="mx-auto mb-4 size-10 text-red-500" />
      <h1 className="mb-2 text-xl font-semibold">{translations.checkFailed}</h1>
      <p className="text-fd-muted-foreground mb-6">{error}</p>
      <RepoCheckInput
        basePath={basePath}
        lang={lang}
        translations={translations.input}
      />
    </div>
  </div>
);

const ProgramBackLink = ({
  lang,
  program,
}: {
  lang: string;
  program: Program;
}) => {
  const href = withLocalePrefix(
    lang,
    `${ROUTES.PROGRAMS}/${program.slug}` as `/${string}`,
  );
  return (
    <div className="mb-6">
      <Button
        variant="link"
        size="sm"
        nativeButton={false}
        render={
          <Link href={href} transitionTypes={["nav-back"]}>
            <ArrowLeft />
            {program.name}
          </Link>
        }
      />
    </div>
  );
};

const ProgramResultCard = ({
  result,
  translations,
}: {
  result: TranslatedCheckResult;
  translations: CheckTranslations;
}) => {
  const { icon: Icon, color, ring } = STATUS_CONFIG[result.status];
  const label = translations[STATUS_LABELS[result.status]];
  const uniqueReasons = [...new Set(result.reasons)].filter(Boolean);

  return (
    <Card className={ring}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className={`size-5 ${color}`} />
          <span className={color}>{label}</span>
        </CardTitle>
      </CardHeader>
      {uniqueReasons.length > 0 && (
        <CardContent className="pt-0">
          <ul className="space-y-1">
            {uniqueReasons.map((reason) => (
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

const ProgramCheckLanding = ({
  lang,
  program,
  translations,
}: {
  lang: string;
  program: Program;
  translations: CheckTranslations;
}) => {
  const heading = translations.checkProgram.replace("{program}", program.name);
  const checkBasePath = programCheckPath(program.slug);

  return (
    <div className={CHECK_PAGE_CONTAINER}>
      <ProgramBackLink lang={lang} program={program} />
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
};

const CheckResultsView = ({
  lang,
  programTranslations,
  translations,
  searchParams,
}: CheckPageClientProps) => {
  const { owner, path, provider: urlProvider, repo } = searchParams;
  const provider = urlProvider ?? DEFAULT_PROVIDER;

  const { data, error, loading } = useCheckData({
    owner,
    path,
    provider,
    repo,
    translations,
  });

  const repoName = repoNameFromParams({ owner, path, repo });

  const translatedData = useMemo(() => {
    if (
      !data ||
      data.repo.owner !== owner ||
      data.repo.path !== repoName ||
      data.repo.provider !== provider ||
      data.repo.repo !== repo
    ) {
      return null;
    }

    return {
      ...data,
      results: data.results.map((result) =>
        applyTranslations(
          result,
          programTranslations,
          result.slug,
          lang,
          translations.reasons,
        ),
      ),
    };
  }, [
    data,
    owner,
    provider,
    repo,
    repoName,
    lang,
    programTranslations,
    translations.reasons,
  ]);

  if (loading || !translatedData) {
    return <CheckSkeleton name={repoName} />;
  }

  if (error) {
    return (
      <CheckErrorSection
        lang={lang}
        translations={translations}
        error={error}
      />
    );
  }

  return (
    <div className={CHECK_PAGE_CONTAINER}>
      <CheckResults
        data={translatedData}
        lang={lang}
        translations={translations}
      />
      <Separator className="mb-8" />
      <CheckAnotherSection lang={lang} translations={translations} />
    </div>
  );
};

const ProgramCheckResultsView = ({
  lang,
  program,
  programTranslations,
  translations,
  searchParams,
}: CheckPageClientProps & { program: Program }) => {
  const { owner, path, provider: urlProvider, repo } = searchParams;
  const provider = urlProvider ?? DEFAULT_PROVIDER;

  const { data, error, loading } = useCheckData({
    owner,
    path,
    program: program.slug,
    provider,
    repo,
    translations,
  });

  const checkBasePath = programCheckPath(program.slug);
  const heading = translations.checkProgram.replace("{program}", program.name);
  const repoName = repoNameFromParams({ owner, path, repo });

  const translatedResult = useMemo((): TranslatedCheckResult | null => {
    const match = data?.results[0];
    if (!match) {
      return null;
    }
    return applyTranslations(
      match,
      programTranslations,
      program.slug,
      lang,
      translations.reasons,
    );
  }, [data, lang, program.slug, programTranslations, translations.reasons]);

  if (loading) {
    return <ProgramCheckSkeleton name={program.name} />;
  }

  if (error) {
    return (
      <CheckErrorSection
        lang={lang}
        translations={translations}
        error={error}
        basePath={checkBasePath}
      />
    );
  }

  return (
    <div className={CHECK_PAGE_CONTAINER}>
      <ProgramBackLink lang={lang} program={program} />

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

      <CheckAnotherSection
        lang={lang}
        translations={translations}
        basePath={checkBasePath}
      />
    </div>
  );
};

const CheckPageInner = (props: CheckPageClientProps) => {
  const { lang, program, translations, searchParams } = props;
  const { owner, repo } = searchParams;
  const hasRepo = Boolean(owner && repo);

  if (program) {
    return hasRepo ? (
      <ProgramCheckResultsView {...props} program={program} />
    ) : (
      <ProgramCheckLanding
        lang={lang}
        program={program}
        translations={translations}
      />
    );
  }

  return hasRepo ? (
    <CheckResultsView {...props} />
  ) : (
    <CheckLanding lang={lang} translations={translations} />
  );
};

export const CheckPageClient = (props: CheckPageClientProps) => (
  <ViewTransition default="none" enter="slide-up">
    <CheckPageInner {...props} />
  </ViewTransition>
);
