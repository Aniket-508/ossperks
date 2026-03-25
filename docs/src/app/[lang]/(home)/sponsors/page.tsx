import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LINK } from "@/constants/links";
import { generateLangParams } from "@/i18n/config";
import { getT } from "@/i18n/get-t";
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
    description: t.sponsors.intro,
    lang,
    path: "/sponsors",
    title: t.sponsors.heading,
  });
};

export default async function SponsorsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = await getT(lang);

  return (
    <div className="container mx-auto flex w-full flex-1 flex-col px-4 py-12">
      <div className="mb-10">
        <h1 className="mb-4 text-4xl font-bold">{t.sponsors.heading}</h1>
        <p className="text-fd-muted-foreground text-lg leading-relaxed">
          {t.sponsors.intro}
        </p>
      </div>

      <Separator className="mb-10" />

      <section className="mb-10">
        <h2 className="mb-6 text-2xl font-semibold">
          {t.sponsors.tiers.gold.name}
        </h2>
        <p className="text-fd-muted-foreground mb-4">
          {t.sponsors.tiers.gold.description}
        </p>
        <Card>
          <CardContent>
            <p className="text-fd-muted-foreground text-center">
              No gold sponsors yet
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-10">
        <h2 className="mb-6 text-2xl font-semibold">
          {t.sponsors.tiers.silver.name}
        </h2>
        <p className="text-fd-muted-foreground mb-4">
          {t.sponsors.tiers.silver.description}
        </p>
        <Card>
          <CardContent>
            <p className="text-fd-muted-foreground text-center">
              No silver sponsors yet
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-10">
        <h2 className="mb-6 text-2xl font-semibold">
          {t.sponsors.tiers.bronze.name}
        </h2>
        <p className="text-fd-muted-foreground mb-4">
          {t.sponsors.tiers.bronze.description}
        </p>
        <Card>
          <CardContent>
            <p className="text-fd-muted-foreground text-center">
              No bronze sponsors yet
            </p>
          </CardContent>
        </Card>
      </section>

      <Separator className="mb-10" />

      <section>
        <h2 className="mb-4 text-2xl font-semibold">
          {t.sponsors.cta.heading}
        </h2>
        <p className="text-fd-muted-foreground mb-4">
          {t.sponsors.cta.description}
        </p>
        <Button
          variant="default"
          size="lg"
          nativeButton={false}
          render={
            <a href={LINK.SPONSOR} target="_blank" rel="noopener noreferrer">
              {t.sponsors.cta.linkText}
            </a>
          }
        />
      </section>
    </div>
  );
}
