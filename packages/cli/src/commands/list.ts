import {
  programs,
  getProgramsByCategory,
  getCategories,
  CATEGORY_LABELS,
} from "@ossperks/core";
import type { Category } from "@ossperks/core";
import { Command } from "commander";

import { header, programRow, maxSlugLength, error } from "../utils/format.js";

export const listCommand = new Command("list")
  .description("List all OSS perk programs")
  .option("-c, --category <category>", "filter by category")
  .option("--json", "output as JSON")
  .action((opts: { category?: string; json?: boolean }) => {
    let results = programs;

    if (opts.category) {
      const categories = getCategories() as string[];
      if (!categories.includes(opts.category)) {
        error(
          `Unknown category "${opts.category}". Valid categories: ${categories.join(", ")}`
        );
        process.exit(1);
      }
      results = getProgramsByCategory(opts.category as Category);
    }

    if (opts.json) {
      console.log(JSON.stringify(results, null, 2));
      return;
    }

    const plural = results.length === 1 ? "" : "s";
    const title = opts.category
      ? `OSS Perks — ${results.length} program${plural} in "${CATEGORY_LABELS[opts.category as Category] ?? opts.category}"`
      : `OSS Perks — ${results.length} programs`;

    header(title);
    console.log();

    const pad = maxSlugLength(results);
    for (const program of results) {
      console.log(programRow(program, pad));
    }
    console.log();
  });
