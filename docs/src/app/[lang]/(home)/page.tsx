import Link from "next/link";

import { getT } from "@/lib/get-t";
import { withLocalePrefix } from "@/lib/i18n";

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
        <Link
          href={withLocalePrefix(lang, "/programs")}
          className="rounded-lg bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground hover:opacity-90 transition-opacity"
        >
          {t.home.programsLink}
        </Link>
        <Link
          href={withLocalePrefix(lang, "/cli")}
          className="rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-fd-accent transition-colors"
        >
          {t.home.cliLink}
        </Link>
      </div>
    </div>
  );
}
