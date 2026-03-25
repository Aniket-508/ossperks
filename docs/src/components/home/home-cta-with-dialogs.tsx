"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ContactSubmissionDialog } from "@/components/people/contact-submission-dialog";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { withLocalePrefix } from "@/i18n/navigation";
import type { PeopleTranslations } from "@/locales/en/people";

interface HomeCtaWithDialogsProps {
  lang: string;
  programOptions: { slug: string; name: string }[];
  translations: {
    heading: string;
    description: string;
    submitProgram: string;
    submitContact: string;
  };
  contactDialogTranslations: PeopleTranslations["submit"];
}

export const HomeCtaWithDialogs = ({
  lang,
  programOptions,
  translations,
  contactDialogTranslations,
}: HomeCtaWithDialogsProps) => (
  <section className="pt-16 pb-8 text-center">
    <h2 className="mb-2 text-2xl font-bold">{translations.heading}</h2>
    <p className="text-fd-muted-foreground mx-auto mb-6 max-w-lg">
      {translations.description}
    </p>
    <div className="flex flex-wrap justify-center gap-4">
      <Button
        variant="default"
        size="lg"
        nativeButton={false}
        render={
          <Link href={withLocalePrefix(lang, ROUTES.SUBMIT_PROGRAM)}>
            {translations.submitProgram}
            <ArrowRight />
          </Link>
        }
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
