import "../global.css";
import { Analytics } from "@vercel/analytics/react";
import { notFound } from "next/navigation";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";

import { HotkeysProvider } from "@/components/providers/hotkeys-provider";
import { RootProvider } from "@/components/providers/root-provider";
import { generateLangParams, isLocale } from "@/i18n/config";
import { provider } from "@/i18n/ui";
import { publicSans } from "@/lib/fonts";
import { JsonLdScripts } from "@/seo/json-ld";
import { baseMetadata } from "@/seo/metadata";

export const metadata = baseMetadata;

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) {
    notFound();
  }

  return (
    <html lang={lang} className={publicSans.variable} suppressHydrationWarning>
      <head>
        <JsonLdScripts />
      </head>
      <body className="flex min-h-screen flex-col">
        <NuqsAdapter>
          <HotkeysProvider>
            <RootProvider i18n={provider(lang)}>{children}</RootProvider>
          </HotkeysProvider>
        </NuqsAdapter>
        <Analytics />
      </body>
    </html>
  );
}

export const generateStaticParams = generateLangParams;
