import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { ReactNode } from "react";

import { Footer } from "@/components/footer";
import { getT } from "@/lib/get-t";
import { baseOptions } from "@/lib/layout.shared";

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
      <div className="max-w-(--fd-layout-width) flex-1 flex flex-col w-full py-12 px-4 mx-auto">
        {children}
      </div>
      <Footer translation={translation.footer} />
    </HomeLayout>
  );
}
