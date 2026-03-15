import "./global.css";
import { Public_Sans } from "next/font/google";

import { cn } from "@/lib/utils";

const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-sans" });

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("font-sans", publicSans.variable)}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen">{children}</body>
    </html>
  );
}
