import {
  getCategories,
  CATEGORY_LABELS,
  getProgramsByCategory,
} from "@ossperks/core";
import { Command } from "commander";
import pc from "picocolors";

import { header } from "../utils/format.js";

export const categoriesCommand = new Command("categories")
  .description("List all available program categories")
  .option("--json", "output as JSON")
  .action((opts: { json?: boolean }) => {
    const categories = getCategories();

    if (opts.json) {
      console.log(
        JSON.stringify(
          categories.map((c) => ({
            count: getProgramsByCategory(c).length,
            id: c,
            label: CATEGORY_LABELS[c],
          })),
          null,
          2
        )
      );
      return;
    }

    header(`OSS Perks — ${categories.length} categories`);
    console.log();

    for (const category of categories) {
      const count = getProgramsByCategory(category).length;
      const label = CATEGORY_LABELS[category].padEnd(30);
      console.log(
        `  ${pc.bold(category.padEnd(16))} ${pc.dim(label)} ${pc.dim(`(${count})`)}`
      );
    }
    console.log();
  });
