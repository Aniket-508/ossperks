import { cli, programDocs } from "collections/server";
import { loader } from "fumadocs-core/source";
import type { InferPageType } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";

import { ROUTES } from "@/constants/routes";
import { i18n } from "@/lib/i18n";

export const cliSource = loader({
  baseUrl: ROUTES.CLI,
  i18n,
  plugins: [lucideIconsPlugin()],
  source: cli.toFumadocsSource(),
});

export const programsSource = loader({
  baseUrl: ROUTES.PROGRAMS,
  i18n,
  source: programDocs.toFumadocsSource(),
});

export const getCliPageImage = (page: InferPageType<typeof cliSource>) => {
  const locale = page.locale ?? i18n.defaultLanguage;
  const slugs = page.slugs ?? [];
  const path = slugs.length > 0 ? `/${slugs.join("/")}` : "";
  return {
    segments: [locale, "cli", ...slugs],
    url: `/og/${locale}${ROUTES.CLI}${path}`,
  };
};

export const getProgramPageImage = (
  page: InferPageType<typeof programsSource>
) => {
  const locale = page.locale ?? i18n.defaultLanguage;
  const [slug] = page.slugs;
  if (!slug) {
    return { segments: [], url: "" };
  }
  return {
    segments: [locale, "programs", slug],
    url: `/og/${locale}${ROUTES.PROGRAMS}/${slug}`,
  };
};

export const getLLMText = async (
  page: InferPageType<typeof cliSource> | InferPageType<typeof programsSource>
) => {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title}\n\n${processed}`;
};
