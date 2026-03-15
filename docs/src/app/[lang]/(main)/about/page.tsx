import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GITHUB_CONFIG } from "@/constants/links";
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
    description: t.about.intro,
    title: t.about.heading,
  };
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = await getT(lang);

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4">{t.about.heading}</h1>
        <p className="text-fd-muted-foreground text-lg leading-relaxed">
          {t.about.intro}
        </p>
      </div>

      <Separator className="mb-10" />

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-6">
          {t.about.principles.title}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {t.about.principles.items.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle className="text-base">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-fd-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="mb-10" />

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          {t.about.maintainer.heading}
        </h2>
        <p className="text-fd-muted-foreground mb-4">
          {t.about.maintainer.description}{" "}
          <a
            href={`https://github.com/${GITHUB_CONFIG.user}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fd-primary hover:underline font-medium"
          >
            @{GITHUB_CONFIG.user}
          </a>
        </p>
      </section>

      <Separator className="mb-10" />

      <section>
        <h2 className="text-2xl font-semibold mb-4">{t.about.cta.heading}</h2>
        <p className="text-fd-muted-foreground mb-4">
          Ready to find perks for your open-source project?
        </p>
        <Button
          variant="default"
          size="lg"
          nativeButton={false}
          render={
            <Link href={withLocalePrefix(lang, ROUTES.PROGRAMS)}>
              {t.about.cta.linkText}
            </Link>
          }
        />
      </section>
    </>
  );
}
