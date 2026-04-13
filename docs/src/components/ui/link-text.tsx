import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";

interface LinkTextProps {
  children: ReactNode;
  href: string;
  showExternalIcon?: boolean;
}

export const LinkText = ({
  children,
  href,
  showExternalIcon = true,
}: LinkTextProps) => (
  <a
    href={href}
    rel="noopener noreferrer"
    target="_blank"
    className="decoration-fd-primary/40 hover:decoration-fd-primary inline-flex items-center gap-2 underline underline-offset-4"
  >
    {children}
    {showExternalIcon && (
      <ExternalLink aria-hidden className="size-5 shrink-0 opacity-50" />
    )}
  </a>
);
