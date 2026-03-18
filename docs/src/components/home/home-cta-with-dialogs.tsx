"use client";

import { ArrowRight } from "lucide-react";

import { ContactSubmissionDialog } from "@/components/people/contact-submission-dialog";
import { ProgramSubmissionDialog } from "@/components/programs/program-submission-dialog";
import { Button } from "@/components/ui/button";
import type { CommonTranslations } from "@/locales/en/common";
import type { PeopleTranslations } from "@/locales/en/people";
import type { ProgramsTranslations } from "@/locales/en/programs";

interface HomeCtaWithDialogsProps {
  programOptions: { slug: string; name: string }[];
  translations: {
    heading: string;
    description: string;
    submitProgram: string;
    submitContact: string;
  };
  programDialogTranslations: ProgramsTranslations["submit"];
  contactDialogTranslations: PeopleTranslations["submit"];
  categoryLabels: CommonTranslations["categories"];
}

export const HomeCtaWithDialogs = ({
  programOptions,
  translations,
  programDialogTranslations,
  contactDialogTranslations,
  categoryLabels,
}: HomeCtaWithDialogsProps) => (
  <section className="pt-16 pb-8 text-center">
    <h2 className="text-2xl font-bold mb-2">{translations.heading}</h2>
    <p className="text-fd-muted-foreground max-w-lg mx-auto mb-6">
      {translations.description}
    </p>
    <div className="flex flex-wrap justify-center gap-4">
      <ProgramSubmissionDialog
        trigger={
          <Button variant="default" size="lg">
            {translations.submitProgram}
            <ArrowRight />
          </Button>
        }
        translations={programDialogTranslations}
        categoryLabels={categoryLabels}
      />
      <ContactSubmissionDialog
        trigger={
          <Button variant="outline" size="lg">
            {translations.submitContact}
            <ArrowRight />
          </Button>
        }
        programs={programOptions}
        translations={contactDialogTranslations}
      />
    </div>
  </section>
);
