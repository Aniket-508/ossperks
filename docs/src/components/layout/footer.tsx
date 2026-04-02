import { RssIcon } from "lucide-react";
import Link from "next/link";

import { GitHubIcon, LlmsIcon, XIcon } from "@/components/icons";
import { LogoMark } from "@/components/logo";
import { LINK } from "@/constants/links";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { withLocalePrefix } from "@/i18n/navigation";
import type { FooterTranslations } from "@/locales/en/footer";

interface FooterProps {
  lang: string;
  popularCategories: { count: number; href: string; label: string }[];
  translation: FooterTranslations;
}

const footerLinkClass =
  "text-fd-muted-foreground hover:text-fd-foreground block py-1 text-sm transition-colors";

const columnHeadingClass =
  "text-fd-foreground mb-4 text-sm font-semibold tracking-tight";

const iconLinkClass =
  "text-fd-muted-foreground hover:text-fd-foreground inline-flex size-9 items-center justify-center rounded-md transition-colors";

export const Footer = ({
  lang,
  popularCategories,
  translation,
}: FooterProps) => {
  const p = (route: `/${string}`) => withLocalePrefix(lang, route);
  const llmsHref = p(ROUTES.LLMS_FULL);
  const homeHref = p(ROUTES.HOME);

  const browseLinks = [
    { href: p(ROUTES.PROGRAMS), label: translation.programs },
    { href: p(ROUTES.CATEGORIES), label: translation.categories },
    { href: p(ROUTES.PEOPLE), label: translation.people },
    { href: p(ROUTES.TAGS), label: translation.tags },
    { href: p(ROUTES.CLI), label: translation.cli },
  ] as const;

  const quickLinks = [
    {
      external: false as const,
      href: p(ROUTES.CHECK),
      label: translation.checkEligibility,
    },
    {
      external: false as const,
      href: p(ROUTES.SUBMIT_PROGRAM),
      label: translation.submit,
    },
    {
      external: false as const,
      href: p(ROUTES.ABOUT),
      label: translation.aboutUs,
    },
    {
      external: true as const,
      href: LINK.SPONSOR,
      label: translation.sponsor,
    },
  ] as const;

  const otherProducts = [
    {
      href: LINK.PRODUCT_VERCEL_DOCTOR,
      label: translation.productVercelDoctor,
    },
    {
      href: LINK.PRODUCT_HEROICONS_ANIMATED,
      label: translation.productHeroiconsAnimated,
    },
  ] as const;

  return (
    <footer className="border-fd-border bg-fd-background mt-auto border-t">
      <div className="view-container w-full px-4 py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-16 md:gap-6">
          <div className="col-span-full md:col-span-6">
            <Link
              className="text-fd-foreground mb-4 inline-flex items-center gap-2.5 font-semibold tracking-tight"
              href={homeHref}
            >
              <LogoMark aria-hidden className="h-6 shrink-0" />
              <span className="text-base">{SITE.NAME}</span>
            </Link>
            <div className="flex flex-wrap items-center gap-1">
              <Link
                aria-label={translation.rssFeed}
                className={iconLinkClass}
                href={p(ROUTES.RSS)}
              >
                <RssIcon className="size-4" />
              </Link>
              <a
                aria-label={translation.github}
                className={iconLinkClass}
                href={LINK.GITHUB}
                rel="noopener noreferrer"
                target="_blank"
              >
                <GitHubIcon className="size-4" />
              </a>
              <a
                aria-label={translation.twitter}
                className={iconLinkClass}
                href={LINK.TWITTER}
                rel="noopener noreferrer"
                target="_blank"
              >
                <XIcon className="size-4" />
              </a>
              <a
                aria-label={translation.llms}
                className={iconLinkClass}
                href={llmsHref}
              >
                <LlmsIcon className="size-4" />
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className={columnHeadingClass}>{translation.browse}</h3>
            <ul>
              {browseLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link className={footerLinkClass} href={href}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className={columnHeadingClass}>{translation.quickLinks}</h3>
            <ul>
              {quickLinks.map(({ href, label, external }) => (
                <li key={href}>
                  {external ? (
                    <a
                      className={footerLinkClass}
                      href={href}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link className={footerLinkClass} href={href}>
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className={columnHeadingClass}>{translation.otherProducts}</h3>
            <ul>
              {otherProducts.map(({ href, label }) => (
                <li key={href}>
                  <a
                    className={footerLinkClass}
                    href={href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-fd-muted-foreground mt-12 flex flex-col gap-4 pt-2 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p className="flex min-w-0 flex-wrap items-center gap-x-1 gap-y-1">
            <span className="whitespace-nowrap">
              {translation.awesomeListStarterPrefix}
              <a
                className="text-fd-foreground font-medium underline underline-offset-4"
                href={LINK.AWESOME_LIST_STARTER}
                rel="noopener noreferrer"
                target="_blank"
              >
                {translation.awesomeListStarterLink}
              </a>
              .
            </span>{" "}
            <span className="whitespace-nowrap">
              {translation.hostedOn}{" "}
              <a
                className="text-fd-foreground font-medium underline underline-offset-4"
                href={LINK.VERCEL}
                rel="noopener noreferrer"
                target="_blank"
              >
                Vercel
              </a>
              .
            </span>{" "}
            <span className="whitespace-nowrap">
              {translation.translationsBy}{" "}
              <a
                className="text-fd-foreground font-medium underline underline-offset-4"
                href={LINK.LINGO}
                rel="noopener noreferrer"
                target="_blank"
              >
                Lingo.dev
              </a>
              .
            </span>
          </p>
          <p className="shrink-0 sm:text-right">
            {translation.madeBy}{" "}
            <a
              className="text-fd-foreground font-medium underline underline-offset-4"
              href={LINK.PORTFOLIO}
              rel="noopener noreferrer"
              target="_blank"
            >
              {SITE.AUTHOR.NAME}
            </a>
            .
          </p>
        </div>

        {popularCategories.length > 0 ? (
          <div className="border-fd-border mt-10 border-t pt-10">
            <h3 className={columnHeadingClass}>
              {translation.popularCategories}
            </h3>
            <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
              {popularCategories.map((item) => (
                <Link
                  className="group/tile text-fd-muted-foreground hover:[[href]]:text-fd-foreground flex min-w-0 items-center justify-between gap-2"
                  href={item.href}
                  key={item.href}
                >
                  <span className="truncate text-sm">{item.label}</span>
                  <hr className="border-fd-border group-hover/tile:border-fd-primary min-w-2 flex-1 border-0 border-t" />
                  <span className="text-fd-muted-foreground shrink-0 text-xs tabular-nums max-sm:hidden">
                    {item.count}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </footer>
  );
};
