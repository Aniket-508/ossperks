import { cancel, isCancel, select } from "@clack/prompts";
import { getProgramBySlug, programs } from "@ossperks/core";
import { Command } from "commander";

import { programDetail, error } from "../utils/format.js";
import { closestId } from "../utils/id.js";
import { capture } from "../utils/telemetry.js";

export const showCommand = new Command("show")
  .alias("info")
  .description("Show details for a specific OSS perk program")
  .argument("[id]", "program id (e.g. vercel, sentry, github-copilot)")
  .option("--json", "output as JSON")
  .action(async (id: string | undefined, opts: { json?: boolean }) => {
    let resolvedId = id;

    if (resolvedId === undefined) {
      if (!process.stdout.isTTY) {
        error(
          "Program id is required in non-interactive mode.\n" +
            "  Example: ossperks show vercel",
        );
        process.exit(1);
      }

      const chosen = await select({
        message: "Pick a program to view",
        options: programs.map((p) => ({
          hint: p.provider,
          label: p.name,
          value: p.slug,
        })),
      });

      if (isCancel(chosen)) {
        cancel("Cancelled.");
        process.exit(0);
      }

      resolvedId = chosen;
    }

    const program = getProgramBySlug(resolvedId);

    if (!program) {
      const suggestion = closestId(resolvedId);
      const hint = suggestion === null ? "" : ` Did you mean "${suggestion}"?`;
      error(`Unknown program id "${resolvedId}".${hint}`);
      process.exit(1);
    }

    capture("cli:show");

    if (opts.json) {
      console.log(JSON.stringify(program, null, 2));
      return;
    }

    programDetail(program);
  });
