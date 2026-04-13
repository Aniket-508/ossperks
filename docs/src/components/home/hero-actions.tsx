import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { RepoCheckInput } from "@/components/check/check-input";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { withLocalePrefix } from "@/i18n/navigation";
import type { CheckTranslations } from "@/locales/en/check";

interface HeroActionsProps {
  lang: string;
  browseProgramsLabel: string;
  inputTranslations: CheckTranslations["input"];
}

export const HeroActions = ({
  lang,
  browseProgramsLabel,
  inputTranslations,
}: HeroActionsProps) => (
  <div className="mx-auto flex w-full max-w-2xl flex-col items-start gap-4 sm:flex-row">
    <RepoCheckInput
      lang={lang}
      translations={inputTranslations}
      className="max-w-none"
    />

    <div className="flex w-full items-center gap-3 sm:w-auto sm:flex-col sm:gap-1">
      <div className="bg-fd-border h-px flex-1 sm:h-auto sm:min-h-2 sm:w-px sm:flex-none" />
      <span className="text-fd-muted-foreground shrink-0 text-xs font-medium uppercase">
        or
      </span>
      <div className="bg-fd-border h-px flex-1 sm:h-auto sm:min-h-2 sm:w-px sm:flex-none" />
    </div>

    <Button
      variant="default"
      size="lg"
      className="shrink-0"
      nativeButton={false}
      render={
        <Link
          href={withLocalePrefix(lang, ROUTES.PROGRAMS)}
          transitionTypes={["nav-forward"]}
        >
          {browseProgramsLabel}
          <ArrowRight />
        </Link>
      }
    />
  </div>
);
