"use client";

import type { EligibilityStatus } from "@ossperks/core";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { withLocalePrefix } from "@/i18n/navigation";
import { STATUS_CONFIG, STATUS_LABELS } from "@/lib/check";
import type { CheckTranslations } from "@/locales/en/check";
import type { TranslatedCheckResult } from "@/types/check";

export const ResultSection = ({
  items,
  lang,
  status,
  translations,
}: {
  items: TranslatedCheckResult[];
  lang: string;
  status: EligibilityStatus;
  translations: CheckTranslations;
}) => {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  const label = translations[STATUS_LABELS[status]];

  return (
    <section className="mb-8">
      <h2
        className={`mb-4 flex items-center gap-2 text-lg font-semibold ${config.color}`}
      >
        <Icon className="size-5" />
        {label} ({items.length})
      </h2>
      <div className="grid gap-3">
        {items.map((result) => (
          <Card key={result.slug} className={config.ring}>
            <CardHeader>
              <CardTitle className="min-w-0 truncate text-base">
                {result.name}
              </CardTitle>
              <CardAction>
                <Badge
                  variant="action"
                  className="text-sm"
                  render={
                    <Link
                      href={withLocalePrefix(
                        lang,
                        `${ROUTES.PROGRAMS}/${result.slug}`,
                      )}
                    >
                      {result.perksCount} {translations.perks}
                      <ArrowRight />
                    </Link>
                  }
                />
              </CardAction>
            </CardHeader>
            {result.reasons.length > 0 && (
              <CardContent className="pt-0">
                <ul className="space-y-1">
                  {[...new Set(result.reasons)]
                    .filter(Boolean)
                    .map((reason) => (
                      <li
                        key={`${result.slug}-${reason}`}
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
        ))}
      </div>
    </section>
  );
};
