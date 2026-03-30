import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { baseOptions } from "@/components/layout/layout.shared";
import { getT } from "@/i18n/get-t";

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const translation = await getT(lang);

  return (
    <HomeLayout {...baseOptions(lang)}>
      {children}
      <Footer translation={translation.footer} />
    </HomeLayout>
  );
}
