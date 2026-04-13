import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";

import { baseOptions } from "@/components/layout/layout.shared";
import { cliSource } from "@/lib/source";

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const { links: _omitLinksForCLI, ...docsLayoutOptions } = baseOptions(lang);

  return (
    <DocsLayout tree={cliSource.getPageTree(lang)} {...docsLayoutOptions}>
      {children}
    </DocsLayout>
  );
}
