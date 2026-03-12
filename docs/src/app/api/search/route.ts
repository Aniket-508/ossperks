import { createFromSource } from "fumadocs-core/search/server";

import { cliSource } from "@/lib/source";

// CLI docs are fully indexed for search.
// Programs are browseable via /programs and discoverable via /llms.txt.
export const { GET } = createFromSource(cliSource, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: "english",
});
