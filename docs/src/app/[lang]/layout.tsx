import "../global.css";
import { Analytics } from "@vercel/analytics/react";
import { Public_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { RootProvider } from "@/components/root-provider";
import { generateLangParams, isLocale } from "@/i18n/config";
import { provider } from "@/i18n/ui";
import { JsonLdScripts } from "@/seo/json-ld";
import { baseMetadata } from "@/seo/metadata";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

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
        <RootProvider i18n={provider(lang)}>{children}</RootProvider>
        <Analytics />
      </body>
    </html>
  );
}

export const generateStaticParams = generateLangParams;
