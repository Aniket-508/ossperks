import { getPeople, getPersonSlug, programs } from "@ossperks/core";
import { ExternalLink, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { ContactSubmissionDialog } from "@/components/people/contact-submission-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { i18n } from "@/i18n/config";
import { getT } from "@/i18n/get-t";
import { withLocalePrefix } from "@/i18n/navigation";
import { getUnavatarUrl } from "@/lib/unavatar";
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
    <div className="container mx-auto flex w-full flex-1 flex-col px-4 py-12">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold">{t.people.heading}</h1>
          <p className="text-fd-muted-foreground max-w-2xl text-lg">
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
        <div className="bg-fd-muted/30 rounded-lg border border-dashed p-12 text-center">
          <p className="text-fd-muted-foreground">{t.people.empty}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {people.map(({ contact, provider }) => {
            const slug = getPersonSlug(contact.name);
            const roleText = contact.role
              ? t.people.roleAt
                  .replace("{role}", contact.role)
                  .replace("{provider}", provider)
              : provider;

            return (
              <Link
                key={`${contact.name}-${provider}`}
                href={withLocalePrefix(lang, `/people/${slug}` as `/${string}`)}
                className="group block"
              >
                <div className="ring-foreground/10 hover:bg-fd-accent flex items-center gap-4 rounded-xl p-4 ring-1 transition-colors">
                  <Avatar className="size-12">
                    {contact.url &&
                      (() => {
                        const avatarUrl = getUnavatarUrl(contact.url);
                        return avatarUrl ? (
                          <AvatarImage src={avatarUrl} alt={contact.name} />
                        ) : null;
                      })()}
                    <AvatarFallback className="text-lg">
                      {contact.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="group-hover:text-fd-primary truncate font-semibold transition-colors">
                      {contact.name}
                    </p>
                    <p className="text-fd-muted-foreground truncate text-sm">
                      {roleText}
                    </p>
                  </div>
                  {contact.url && (
                    <span className="text-fd-muted-foreground group-hover:text-fd-foreground shrink-0 transition-colors">
                      <ExternalLink className="size-4" />
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
