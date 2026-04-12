import { getAllPeopleSlugs, getPersonBySlug } from "@ossperks/core";
import type { Program } from "@ossperks/core";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";

import { XIcon, LinkedInIcon } from "@/components/icons";
import { ProgramCard } from "@/components/programs/program-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { generateLangParamsWithPerson } from "@/i18n/config";
import { getT } from "@/i18n/get-t";
import { withLocalePrefix } from "@/i18n/navigation";
import { getProgram } from "@/lib/programs";
import { getUnavatarUrl } from "@/lib/unavatar";
import { absoluteUrl } from "@/lib/utils";
import { BreadcrumbJsonLd, PersonPageJsonLd } from "@/seo/json-ld";
import { createMetadata } from "@/seo/metadata";

export default async function PersonPage({
  params,
}: {
  params: Promise<{ lang: string; person: string }>;
}) {
  const { lang, person: personSlug } = await params;
  const person = getPersonBySlug(personSlug);
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
    <ViewTransition
      enter={{
        default: "none",
        "nav-back": "nav-back",
        "nav-forward": "nav-forward",
      }}
      exit={{
        default: "none",
        "nav-back": "nav-back",
        "nav-forward": "nav-forward",
      }}
      default="none"
    >
      <BreadcrumbJsonLd
        items={[
          { name: t.common.breadcrumbHome, path: "/" },
          { name: t.people.heading, path: ROUTES.PEOPLE },
          {
            name: contact.name,
            path: `${ROUTES.PEOPLE}/${personSlug}` as `/${string}`,
          },
        ]}
        lang={lang}
      />
      <PersonPageJsonLd
        name={contact.name}
        profilePageUrl={absoluteUrl(
          withLocalePrefix(lang, `${ROUTES.PEOPLE}/${personSlug}`),
        )}
        role={contact.role}
        sameAs={contact.url}
      />
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-12">
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
          <p className="text-fd-muted-foreground">
            {t.people.detail.noPrograms}
          </p>
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
                  categoryLabel={categoryLabel}
                  key={program.slug}
                  learnMore={t.programs.learnMore}
                  more={t.programs.more}
                  program={program}
                  programHref={programHref}
                />
              );
            })}
          </div>
        )}
      </div>
    </ViewTransition>
  );
}

export const generateStaticParams = () =>
  generateLangParamsWithPerson(getAllPeopleSlugs);

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ lang: string; person: string }>;
}): Promise<Metadata> => {
  const { lang, person: personSlug } = await params;
  const person = getPersonBySlug(personSlug);
  if (!person) {
    notFound();
  }

  const personPath = `${ROUTES.PEOPLE}/${personSlug}` as `/${string}`;
  const primaryProvider = person.programs[0]?.provider ?? "";
  const roleDesc = person.contact.role
    ? `${person.contact.role} at ${primaryProvider}`
    : primaryProvider;
  const programNames = person.programs.map((p) => p.name).join(", ");
  const description = programNames
    ? `${person.contact.name} is ${roleDesc}. Contact for ${programNames} on OSS Perks.`
    : `${person.contact.name} — ${roleDesc}`;

  return createMetadata({
    description,
    lang,
    path: personPath,
    title: person.contact.name,
  });
};
