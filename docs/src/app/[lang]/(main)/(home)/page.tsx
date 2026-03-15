import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { getT } from "@/lib/get-t";
import { i18n, withLocalePrefix } from "@/lib/i18n";

export const generateStaticParams = () =>
  i18n.languages.map((lang) => ({ lang }));

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = await getT(lang);

  return (
    <div className="flex flex-col justify-center text-center flex-1 px-4">
      <h1 className="text-4xl font-bold mb-4">{t.home.heading}</h1>
      <p className="text-fd-muted-foreground text-lg max-w-xl mx-auto mb-8">
        {t.home.description}
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          variant="default"
          size="lg"
          nativeButton={false}
          render={
            <Link href={withLocalePrefix(lang, ROUTES.PROGRAMS)}>
              {t.home.programsLink}
            </Link>
          }
        />
        <Button
          variant="outline"
          size="lg"
          nativeButton={false}
          render={
            <Link href={withLocalePrefix(lang, ROUTES.CLI)}>
              {t.home.cliLink}
            </Link>
          }
        />
      </div>
    </div>
  );
}
