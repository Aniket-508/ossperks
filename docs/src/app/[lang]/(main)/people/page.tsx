import { getPeople, programs } from "@ossperks/core";
import { ExternalLink, Plus } from "lucide-react";
import type { Metadata } from "next";

import { ContactSubmissionDialog } from "@/components/people/contact-submission-dialog";
import { Button } from "@/components/ui/button";
import { getT } from "@/lib/get-t";
import { i18n } from "@/lib/i18n";
import { createMetadata } from "@/seo/metadata";

export const generateStaticParams = () =>
  i18n.languages.map((lang) => ({ lang }));

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> => {
  const { lang } = await params;
  const t = await getT(lang);
  return createMetadata({
    description: t.people.description,
    lang,
    path: "/people",
    title: t.people.heading,
  });
};

export default async function PeoplePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = await getT(lang);
  const people = getPeople();

  const programOptions = programs.map((p) => ({ name: p.name, slug: p.slug }));

  return (
    <div className="container flex-1 flex flex-col w-full py-12 px-4 mx-auto">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">{t.people.heading}</h1>
          <p className="text-fd-muted-foreground text-lg max-w-2xl">
            {people.length > 0
              ? `${people.length} ${t.people.description}`
              : t.people.description}
          </p>
        </div>
        <div className="shrink-0">
          <ContactSubmissionDialog
            trigger={
              <Button size="lg">
                <Plus />
                {t.people.submit.buttonText}
              </Button>
            }
            programs={programOptions}
            translations={t.people.submit}
          />
        </div>
      </div>

      {people.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-fd-muted/30 p-12 text-center">
          <p className="text-fd-muted-foreground">{t.people.empty}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {people.map(({ contact, provider }) => {
            const initial = contact.name.charAt(0).toUpperCase();
            const roleText = t.people.roleAt
              .replace("{role}", contact.role)
              .replace("{provider}", provider);

            return (
              <div
                key={`${contact.name}-${provider}`}
                className="flex items-center gap-4 rounded-xl p-4 ring-1 ring-foreground/10 transition-colors hover:bg-fd-accent"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-fd-muted text-fd-foreground font-semibold text-lg">
                  {initial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{contact.name}</p>
                  <p className="text-sm text-fd-muted-foreground truncate">
                    {roleText}
                  </p>
                </div>
                {contact.url && (
                  <a
                    href={contact.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                  >
                    <ExternalLink className="size-4" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
