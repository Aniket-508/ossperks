import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { RepoCheckInput } from "@/components/home/repo-check-input";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { withLocalePrefix } from "@/lib/i18n";

interface HeroActionsProps {
  lang: string;
  browseProgramsLabel: string;
}

export const HeroActions = ({
  lang,
  browseProgramsLabel,
}: HeroActionsProps) => (
  <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-2xl mx-auto">
    <RepoCheckInput lang={lang} className="max-w-none" />

    <div className="flex sm:flex-col items-center gap-3 sm:gap-1 w-full sm:w-auto">
      <div className="h-px sm:h-auto sm:w-px flex-1 sm:flex-none sm:min-h-2 bg-fd-border" />
      <span className="text-xs font-medium uppercase text-fd-muted-foreground shrink-0">
        or
      </span>
      <div className="h-px sm:h-auto sm:w-px flex-1 sm:flex-none sm:min-h-2 bg-fd-border" />
    </div>

    <Button
      variant="default"
      size="lg"
      className="shrink-0"
      nativeButton={false}
      render={
        <Link href={withLocalePrefix(lang, ROUTES.PROGRAMS)}>
          {browseProgramsLabel}
          <ArrowRight className="size-4" />
        </Link>
      }
    />
  </div>
);
