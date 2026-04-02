import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { baseOptions } from "@/components/layout/layout.shared";
import { getT } from "@/i18n/get-t";
import { getFooterPopularCategories } from "@/lib/footer-categories";

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = await getT(lang);
  const popularCategories = getFooterPopularCategories(lang, t);

  return (
    <HomeLayout className="[--fd-layout-width:var(--max-width-layout)]" {...baseOptions(lang)}>
      {children}
      <Footer
        lang={lang}
        popularCategories={popularCategories}
        translation={t.footer}
      />
    </HomeLayout>
  );
}
