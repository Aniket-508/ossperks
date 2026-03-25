"use client";

import { PROVIDER_HOSTS } from "@ossperks/core";
import type { RepoProvider } from "@ossperks/core";
import { GitFork, Lock, Scale, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { LinkText } from "@/components/ui/link-text";
import { Separator } from "@/components/ui/separator";
import { STATUS_CONFIG } from "@/lib/check";
import { formatAge } from "@/lib/date";
import type { CheckTranslations } from "@/locales/en/check";
import type { TranslatedCheckResponse } from "@/types/check";

import { ResultSection } from "./result-section";

export const CheckResults = ({
  data,
  lang,
  translations,
}: {
  data: TranslatedCheckResponse;
  lang: string;
  translations: CheckTranslations;
}) => {
  const { repo, results } = data;
  const eligible = results.filter((result) => result.status === "eligible");
  const review = results.filter((result) => result.status === "needs-review");
  const ineligible = results.filter((result) => result.status === "ineligible");

  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">
          <LinkText
            href={`https://${PROVIDER_HOSTS[repo.provider as RepoProvider]}/${repo.path}`}
          >
            {repo.path}
          </LinkText>
        </h1>
        {repo.description && (
          <p className="text-fd-muted-foreground mb-4">{repo.description}</p>
        )}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="gap-1.5">
            <Star />
            {repo.stars.toLocaleString()} {translations.stars}
          </Badge>
          {repo.license && (
            <Badge variant="outline" className="gap-1.5">
              <Scale />
              {repo.license}
            </Badge>
          )}
          <Badge variant="outline">
            {translations.lastPush}{" "}
            {formatAge(repo.pushedAt, translations.time)}
          </Badge>
          {repo.isFork && (
            <Badge variant="secondary" className="gap-1.5">
              <GitFork />
              {translations.fork}
            </Badge>
          )}
          {repo.isPrivate && (
            <Badge variant="secondary" className="gap-1.5">
              <Lock />
              {translations.private}
            </Badge>
          )}
        </div>
      </div>

      <Separator className="mb-8" />

      <div className="mb-8 grid grid-cols-3 gap-4">
        {(
          [
            {
              count: eligible.length,
              key: "eligible",
              label: translations.eligible,
            },
            {
              count: review.length,
              key: "needs-review",
              label: translations.needsReview,
            },
            {
              count: ineligible.length,
              key: "ineligible",
              label: translations.ineligible,
            },
          ] as const
        ).map((s) => (
          <div key={s.key} className="rounded-lg border p-4 text-center">
            <p className={`text-3xl font-bold ${STATUS_CONFIG[s.key].color}`}>
              {s.count}
            </p>
            <p className="text-fd-muted-foreground text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      {eligible.length > 0 && (
        <ResultSection
          items={eligible}
          lang={lang}
          status="eligible"
          translations={translations}
        />
      )}
      {review.length > 0 && (
        <ResultSection
          items={review}
          lang={lang}
          status="needs-review"
          translations={translations}
        />
      )}
      {ineligible.length > 0 && (
        <ResultSection
          items={ineligible}
          lang={lang}
          status="ineligible"
          translations={translations}
        />
      )}
    </>
  );
};
