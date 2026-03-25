import { getAllPeopleSlugs, getPersonBySlug } from "@ossperks/core";
import type { Program } from "@ossperks/core";
import { ArrowLeftIcon, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { XIcon, LinkedInIcon } from "@/components/icons";
import { ProgramCard } from "@/components/programs/program-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { i18n } from "@/i18n/config";
import { getT } from "@/i18n/get-t";
import { withLocalePrefix } from "@/i18n/navigation";
import { getProgram } from "@/lib/programs";
import { getUnavatarUrl } from "@/lib/unavatar";
import { createMetadata } from "@/seo/metadata";

export default async function PersonPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const person = getPersonBySlug(slug);
  if (!person) {
    notFound();
  }
  const [t, translatedPrograms] = await Promise.all([
    getT(lang),
    Promise.all(person.programs.map((p) => getProgram(p.slug, lang))),
  ]);
  const programs = translatedPrograms.filter(
    (p): p is Program => p !== undefined,
  );

  const { contact } = person;
  const primaryProvider = person.programs[0]?.provider ?? "";
  const roleText = contact.role
    ? t.people.roleAt
        .replace("{role}", contact.role)
        .replace("{provider}", primaryProvider)
    : primaryProvider;

  const isTwitterUrl =
    contact.url &&
    (contact.url.includes("x.com") || contact.url.includes("twitter.com"));

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-12">
      <div className="mb-8">
        <Button
          variant="link"
          size="sm"
          nativeButton={false}
          render={
            <Link href={withLocalePrefix(lang, ROUTES.PEOPLE)}>
              <ArrowLeftIcon />
              {t.people.backToPeople}
            </Link>
          }
        />
      </div>

      {/* Profile header */}
      <div className="mb-8 flex items-start gap-6">
        <Avatar className="ring-fd-primary/20 size-16 ring-2">
          {contact.url &&
            (() => {
              const avatarUrl = getUnavatarUrl(contact.url);
              return avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={contact.name} />
              ) : null;
            })()}
          <AvatarFallback className="text-xl">
            {contact.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold">{contact.name}</h1>
          <p className="text-fd-muted-foreground mt-1">{roleText}</p>
          <div className="mt-3 flex items-center gap-3">
            {contact.url && isTwitterUrl && (
              <a
                href={contact.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                aria-label="X (Twitter)"
              >
                <XIcon className="size-4" />
              </a>
            )}
            {contact.linkedin && (
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="size-4" />
              </a>
            )}
            {contact.url && !isTwitterUrl && (
              <a
                href={contact.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                aria-label="Website"
              >
                <ExternalLink className="size-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* About */}
      {contact.bio && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">{t.people.detail.about}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-fd-muted-foreground">{contact.bio}</p>
          </CardContent>
        </Card>
      )}

      {/* Associated programs */}
      <div className="mb-2">
        <h2 className="text-lg font-semibold">{t.people.associatedWith}</h2>
      </div>

      {programs.length === 0 ? (
        <p className="text-fd-muted-foreground">{t.people.detail.noPrograms}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {programs.map((program) => {
            const categoryLabel =
              t.common.categories[
                program.category as keyof typeof t.common.categories
              ] ?? program.category;
            const programHref = withLocalePrefix(
              lang,
              `${ROUTES.PROGRAMS}/${program.slug}` as `/${string}`,
            );
            return (
              <ProgramCard
                key={program.slug}
                program={program}
                programHref={programHref}
                categoryLabel={categoryLabel}
                learnMore={t.programs.learnMore}
                more={t.programs.more}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export const generateStaticParams = () =>
  i18n.languages.flatMap((lang) =>
    getAllPeopleSlugs().map((slug) => ({ lang, slug })),
  );

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> => {
  const { lang, slug } = await params;
  const person = getPersonBySlug(slug);
  if (!person) {
    notFound();
  }

  const personPath = `${ROUTES.PEOPLE}/${slug}` as `/${string}`;
  return createMetadata({
    description: `${person.contact.name} — ${person.contact.role ?? person.programs[0]?.provider ?? ""}`,
    lang,
    path: personPath,
    title: person.contact.name,
  });
};
