"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ProgramSubmissionDialog } from "@/components/programs/program-submission-dialog";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { withLocalePrefix } from "@/lib/i18n";

interface HeroActionsProps {
  lang: string;
  browseProgramsLabel: string;
  submitProgramLabel: string;
  programDialogTranslations: {
    heading: string;
    description: string;
    buttonText: string;
  };
}

export const HeroActions = ({
  lang,
  browseProgramsLabel,
  submitProgramLabel,
  programDialogTranslations,
}: HeroActionsProps) => (
  <div className="flex flex-wrap gap-4">
    <Button
      variant="default"
      size="lg"
      nativeButton={false}
      render={
        <Link href={withLocalePrefix(lang, ROUTES.PROGRAMS)}>
          {browseProgramsLabel}
          <ArrowRight className="size-4" />
        </Link>
      }
    />
    <ProgramSubmissionDialog
      trigger={
        <Button variant="outline" size="lg">
          {submitProgramLabel}
        </Button>
      }
      translations={programDialogTranslations}
    />
  </div>
);
