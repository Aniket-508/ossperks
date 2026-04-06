import { getPeople, getPersonSlug, programs } from "@ossperks/core";
import { Plus } from "lucide-react";
import type { Metadata } from "next";
import { ViewTransition } from "react";

import { ContactSubmissionDialog } from "@/components/people/contact-submission-dialog";
import { PersonCard } from "@/components/people/person-card";
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { generateLangParams } from "@/i18n/config";
import { getT } from "@/i18n/get-t";
import { withLocalePrefix } from "@/i18n/navigation";
import { getUnavatarUrl } from "@/lib/unavatar";
import { BreadcrumbJsonLd, PeopleIndexItemListJsonLd } from "@/seo/json-ld";
import { createMetadata } from "@/seo/metadata";

export const generateStaticParams = generateLangParams;

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
  const peopleForJsonLd = people.map(({ contact }) => ({
    name: contact.name,
    slug: getPersonSlug(contact.name),
  }));

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
        ]}
        lang={lang}
      />
      {peopleForJsonLd.length > 0 ? (
        <PeopleIndexItemListJsonLd
          lang={lang}
          listName={t.people.heading}
          people={peopleForJsonLd}
        />
      ) : null}
      <div className="view-container flex w-full flex-1 flex-col px-4 py-12">
        <PageBreadcrumb
          homeHref={withLocalePrefix(lang, ROUTES.HOME)}
          homeLabel={t.common.breadcrumbHome}
          segments={[{ current: true, label: t.people.heading }]}
        />
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
              const avatarUrl = contact.url
                ? getUnavatarUrl(contact.url)
                : null;

              return (
                <PersonCard
                  key={`${contact.name}-${provider}`}
                  avatarUrl={avatarUrl}
                  contact={contact}
                  href={withLocalePrefix(
                    lang,
                    `/people/${slug}` as `/${string}`,
                  )}
                  subtitle={roleText}
                />
              );
            })}
          </div>
        )}
      </div>
    </ViewTransition>
  );
}
