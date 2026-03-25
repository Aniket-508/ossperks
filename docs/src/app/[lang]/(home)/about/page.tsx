import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GITHUB_CONFIG } from "@/constants/links";
import { ROUTES } from "@/constants/routes";
import { generateLangParams } from "@/i18n/config";
import { getT } from "@/i18n/get-t";
import { withLocalePrefix } from "@/i18n/navigation";
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
    description: t.about.intro,
    lang,
    path: "/about",
    title: t.about.heading,
  });
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = await getT(lang);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-12">
      <div className="mb-10">
        <h1 className="mb-4 text-4xl font-bold">{t.about.heading}</h1>
        <p className="text-fd-muted-foreground text-lg leading-relaxed">
          {t.about.intro}
        </p>
      </div>

      <Separator className="mb-10" />

      <section className="mb-10">
        <h2 className="mb-6 text-2xl font-semibold">
          {t.about.principles.title}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {t.about.principles.items.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle className="text-base">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-fd-muted-foreground text-sm">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="mb-10" />

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold">
          {t.about.maintainer.heading}
        </h2>
        <p className="text-fd-muted-foreground mb-4">
          {t.about.maintainer.description}{" "}
          <a
            href={`https://github.com/${GITHUB_CONFIG.user}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fd-primary font-medium hover:underline"
          >
            @{GITHUB_CONFIG.user}
          </a>
        </p>
      </section>

      <Separator className="mb-10" />

      <section>
        <h2 className="mb-4 text-2xl font-semibold">{t.about.cta.heading}</h2>
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
    </div>
  );
}
