import { XIcon, LlmsIcon } from "@/components/icons";
import { LINK } from "@/constants/links";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import type { FooterTranslations } from "@/locales/en/footer";

interface FooterProps {
  translation: FooterTranslations;
}

export const Footer = ({ translation }: FooterProps) => (
  <footer className="border-t border-fd-border mt-auto">
    <div className="mx-auto flex max-w-fd-container flex-col items-center justify-between gap-4 px-4 md:px-12 py-6 text-sm text-fd-muted-foreground sm:flex-row">
      <p className="text-center sm:text-left">
        {translation.builtBy}{" "}
        <a
          href={LINK.PORTFOLIO}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-fd-foreground underline underline-offset-4"
        >
          {SITE.AUTHOR.NAME}
        </a>
        . {translation.hostedOn}{" "}
        <a
          href={LINK.VERCEL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-fd-foreground underline underline-offset-4"
        >
          Vercel
        </a>
        . {translation.translationsBy}{" "}
        <a
          href={LINK.LINGO}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-fd-foreground underline underline-offset-4"
        >
          Lingo.dev
        </a>
        .
      </p>

      <div className="flex items-center gap-4">
        <a
          href={LINK.TWITTER}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-fd-foreground"
          aria-label={translation.twitter}
        >
          <XIcon className="size-4" />
        </a>
        <a
          href={ROUTES.LLMS_FULL}
          className="transition-colors hover:text-fd-foreground"
          aria-label={translation.llms}
        >
          <LlmsIcon className="size-4" />
        </a>
      </div>
    </div>
  </footer>
);
