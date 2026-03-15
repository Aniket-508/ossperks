import "./global.css";
import { headers } from "next/headers";

import { publicSans } from "@/lib/fonts";
import { baseMetadata } from "@/seo/metadata";

export const metadata = baseMetadata;

export default async function Layout({ children }: LayoutProps<"/">) {
  const headersList = await headers();
  const locale = headersList.get("x-next-locale") ?? "en";

  return (
    <html
      lang={locale}
      className={publicSans.variable}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen">{children}</body>
    </html>
  );
}
