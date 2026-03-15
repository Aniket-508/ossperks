"use client";

import { ArrowRight } from "lucide-react";

import { ContactSubmissionDialog } from "@/components/people/contact-submission-dialog";
import { ProgramSubmissionDialog } from "@/components/programs/program-submission-dialog";
import { Button } from "@/components/ui/button";

interface HomeCtaWithDialogsProps {
  programOptions: { slug: string; name: string }[];
  translations: {
    heading: string;
    description: string;
    submitProgram: string;
    submitContact: string;
  };
  programDialogTranslations: {
    heading: string;
    description: string;
    buttonText: string;
  };
  contactDialogTranslations: {
    heading: string;
    description: string;
    buttonText: string;
  };
}

export const HomeCtaWithDialogs = ({
  programOptions,
  translations,
  programDialogTranslations,
  contactDialogTranslations,
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
            <ArrowRight className="size-4" />
          </Button>
        }
        translations={programDialogTranslations}
      />
      <ContactSubmissionDialog
        trigger={
          <Button variant="outline" size="lg">
            {translations.submitContact}
            <ArrowRight className="size-4" />
          </Button>
        }
        programs={programOptions}
        translations={contactDialogTranslations}
      />
    </div>
  </section>
);
