import "./global.css";
import { Public_Sans } from "next/font/google";

const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-sans" });

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={publicSans.variable} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">{children}</body>
    </html>
  );
}
