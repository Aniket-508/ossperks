import { autocomplete, cancel, isCancel } from "@clack/prompts";
import { getProgramBySlug, programs } from "@ossperks/core";
import type { Program } from "@ossperks/core";
import { Command } from "commander";

import {
  error,
  printProgramListTable,
  programDetail,
} from "../utils/format.js";
import { capture } from "../utils/telemetry.js";

const matchesQuery = (p: Program, q: string): boolean =>
  p.name.toLowerCase().includes(q) ||
  p.slug.toLowerCase().includes(q) ||
  p.description.toLowerCase().includes(q) ||
  p.provider.toLowerCase().includes(q) ||
  p.category.toLowerCase().includes(q) ||
  (p.tags ?? []).some((t) => t.toLowerCase().includes(q)) ||
  p.perks.some(
    (k) =>
      k.title.toLowerCase().includes(q) ||
      k.description.toLowerCase().includes(q),
  );

const printSearchTable = (query: string, results: Program[]): void => {
  printProgramListTable(
    results,
    `Search results for "${query}" — ${results.length} program${results.length === 1 ? "" : "s"}`,
    "No programs matched your query.",
  );
};

const runInteractiveSearch = async (): Promise<void> => {
  const chosen = await autocomplete({
    filter: (search, option) => {
      if (!search) {
        return true;
      }
      const program = getProgramBySlug(option.value);
      return program ? matchesQuery(program, search.toLowerCase()) : false;
    },
    message: "Search programs (type to filter)",
    options: programs.map((p) => ({
      hint: p.provider,
      label: p.name,
      value: p.slug,
    })),
    placeholder: "e.g. hosting, vercel, ci/cd...",
  });

  if (isCancel(chosen)) {
    cancel("Cancelled.");
    process.exit(0);
  }

  capture("cli:search", { interactive: true, queryLength: 0, resultCount: 1 });

  const program = getProgramBySlug(chosen);
  if (program) {
    programDetail(program);
  }
};

export const searchCommand = new Command("search")
  .alias("find")
  .alias("s")
  .description("Search programs by name, description, tags, or perks")
  .argument("[query]", "search query (omit for interactive search)")
  .option("--json", "output as JSON")
  .action(async (query: string | undefined, opts: { json?: boolean }) => {
    if (query === undefined) {
      if (!process.stdout.isTTY) {
        error("Search query is required in non-interactive mode.");
        process.exit(1);
      }
      await runInteractiveSearch();
      return;
    }

    const q = query.toLowerCase();
    const results = programs.filter((p) => matchesQuery(p, q));

    capture("cli:search", {
      queryLength: query.length,
      resultCount: results.length,
    });

    if (opts.json) {
      console.log(JSON.stringify(results, null, 2));
      return;
    }

    printSearchTable(query, results);
  });
