import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LINK } from "@/constants/links";
import { getT } from "@/lib/get-t";
import { i18n } from "@/lib/i18n";

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
    description: t.sponsors.intro,
    openGraph: {
      description: t.sponsors.intro,
      images: [
        {
          alt: t.sponsors.heading,
          height: 630,
          url: `/og/${lang}/sponsors`,
          width: 1200,
        },
      ],
      title: t.sponsors.heading,
    },
    title: t.sponsors.heading,
    twitter: {
      card: "summary_large_image",
      description: t.sponsors.intro,
      images: [`/og/${lang}/sponsors`],
      title: t.sponsors.heading,
    },
  };
};

export default async function SponsorsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = await getT(lang);

  return (
    <div className="container flex-1 flex flex-col w-full py-12 px-4 mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4">{t.sponsors.heading}</h1>
        <p className="text-fd-muted-foreground text-lg leading-relaxed">
          {t.sponsors.intro}
        </p>
      </div>

      <Separator className="mb-10" />

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-6">
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
        <h2 className="text-2xl font-semibold mb-6">
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
        <h2 className="text-2xl font-semibold mb-6">
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
        <h2 className="text-2xl font-semibold mb-4">
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
