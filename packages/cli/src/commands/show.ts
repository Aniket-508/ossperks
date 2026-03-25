import { getProgramBySlug } from "@ossperks/core";
import { Command } from "commander";

import { programDetail, error } from "../utils/format.js";
import { closestSlug } from "../utils/slug.js";

export const showCommand = new Command("show")
  .description("Show details for a specific OSS perk program")
  .argument("<slug>", "program slug (e.g. vercel, sentry, github-copilot)")
  .option("--json", "output as JSON")
  .action((slug: string, opts: { json?: boolean }) => {
    const program = getProgramBySlug(slug);

    if (!program) {
      const suggestion = closestSlug(slug);
      const hint = suggestion === null ? "" : ` Did you mean "${suggestion}"?`;
      error(`Unknown program slug "${slug}".${hint}`);
      process.exit(1);
    }

    if (opts.json) {
      console.log(JSON.stringify(program, null, 2));
      return;
    }

    programDetail(program);
  });
