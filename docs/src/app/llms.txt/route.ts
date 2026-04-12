import { llms } from "fumadocs-core/source";

import { cliSource, programsSource } from "@/lib/source";

export const revalidate = false;

export const GET = () => {
  const cliIndex = llms(cliSource).index();
  const programEntries = programsSource
    .getPages()
    .filter((p) => !p.locale || p.locale === "en")
    .map(
      (p) =>
        `- [${p.data.title}](${p.url})${p.data.description ? `: ${p.data.description}` : ""}`,
    )
    .join("\n");

  return new Response(`${cliIndex}\n\n## Programs\n\n${programEntries}`);
};
