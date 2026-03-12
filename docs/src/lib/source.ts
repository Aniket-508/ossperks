import { cli, programDocs } from "collections/server";
import { loader } from "fumadocs-core/source";
import type { InferPageType } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";

import { buildLocaleSlugs, i18n } from "@/lib/i18n";

export const cliSource = loader({
  baseUrl: "/cli",
  i18n,
  plugins: [lucideIconsPlugin()],
  source: cli.toFumadocsSource(),
});

export const programsSource = loader({
  baseUrl: "/programs",
  i18n,
  source: programDocs.toFumadocsSource(),
});

export const getCliPageImage = (page: InferPageType<typeof cliSource>) => {
  const segments = [
    ...buildLocaleSlugs(page.locale ?? i18n.defaultLanguage, page.slugs),
    "image.webp",
  ];

  return {
    segments,
    url: `/og/cli/${segments.join("/")}`,
  };
};

export const getProgramPageImage = (
  page: InferPageType<typeof programsSource>
) => {
  const segments = [
    ...buildLocaleSlugs(page.locale ?? i18n.defaultLanguage, page.slugs),
    "image.webp",
  ];

  return {
    segments,
    url: `/og/programs/${segments.join("/")}`,
  };
};

export const getLLMText = async (
  page: InferPageType<typeof cliSource> | InferPageType<typeof programsSource>
) => {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title}\n\n${processed}`;
};
