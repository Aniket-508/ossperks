import { getPeople } from "@ossperks/data";
import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { getT } from "@/lib/get-t";
import { i18n, withLocalePrefix } from "@/lib/i18n";

export const generateStaticParams = () =>
  i18n.languages.map((lang) => ({ lang }));

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> => {
  const { lang } = await params;
  const t = await getT(lang);
  return {
    description: t.people.description,
    title: t.people.heading,
  };
};

export default async function PeoplePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = await getT(lang);
  const people = getPeople();

  return (
    <>
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">{t.people.heading}</h1>
        <p className="text-fd-muted-foreground text-lg max-w-2xl mx-auto">
          {people.length > 0
            ? `${people.length} ${t.people.description}`
            : t.people.description}
        </p>
      </div>

      {people.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-fd-muted/30 p-12 text-center">
          <p className="text-fd-muted-foreground">{t.people.empty}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {people.map(({ contact, programSlug, provider }) => {
            const programUrl = withLocalePrefix(
              lang,
              `${ROUTES.PROGRAMS}/${programSlug}`
            );

            return (
              <Card
                key={`${contact.name}-${programSlug}`}
                className="transition-colors hover:bg-fd-accent"
              >
                <CardHeader>
                  <CardTitle className="font-semibold">
                    {contact.name}
                  </CardTitle>
                  <Badge variant="secondary" className="w-fit">
                    {contact.role}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <Link
                    href={programUrl}
                    className="text-sm text-fd-primary hover:underline"
                  >
                    {provider}
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
