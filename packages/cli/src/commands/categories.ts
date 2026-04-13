import { autocomplete, cancel, isCancel } from "@clack/prompts";
import {
  CATEGORY_LABELS,
  getCategories,
  getProgramsByCategory,
} from "@ossperks/core";
import type { Category } from "@ossperks/core";
import { Command } from "commander";

import { header, printProgramListTable } from "../utils/format.js";
import { highlighter } from "../utils/highlighter.js";
import { capture } from "../utils/telemetry.js";

const printCategoriesTable = (categories: Category[]): void => {
  header(`${categories.length} categories`);
  console.log();

  const counts = categories.map((c) => getProgramsByCategory(c).length);
  const padName =
    Math.max(
      ...categories.map((c) => CATEGORY_LABELS[c].length),
      "NAME".length,
    ) + 2;
  const padCount = Math.max(
    "COUNT".length,
    ...counts.map((n) => String(n).length),
  );

  console.log(
    `  ${highlighter.dim("NAME".padEnd(padName))}  ${highlighter.dim("COUNT".padStart(padCount))}`,
  );

  for (const [index, category] of categories.entries()) {
    const count = counts[index] ?? 0;
    const label = CATEGORY_LABELS[category];
    console.log(
      `  ${label.padEnd(padName)}  ${highlighter.dim(String(count).padStart(padCount))}`,
    );
  }
  console.log();
};

const runInteractiveCategories = async (): Promise<void> => {
  const categories = getCategories();

  const chosen = await autocomplete({
    filter: (search, option) => {
      if (!search) {
        return true;
      }
      const q = search.toLowerCase();
      const cat = option.value as Category;
      const label = CATEGORY_LABELS[cat];
      return cat.toLowerCase().includes(q) || label.toLowerCase().includes(q);
    },
    message: "Pick a category (type to filter)",
    options: categories.map((c) => {
      const count = getProgramsByCategory(c).length;
      return {
        hint: `${count} program${count === 1 ? "" : "s"}`,
        label: `${CATEGORY_LABELS[c]} (${count})`,
        value: c,
      };
    }),
    placeholder: "e.g. hosting, ci, security...",
  });

  if (isCancel(chosen)) {
    cancel("Cancelled.");
    process.exit(0);
  }

  capture("cli:categories", { interactive: true });

  const category = chosen as Category;
  const programsInCat = getProgramsByCategory(category);
  const label = CATEGORY_LABELS[category];
  const plural = programsInCat.length === 1 ? "" : "s";
  printProgramListTable(
    programsInCat,
    `${programsInCat.length} program${plural} in "${label}"`,
  );
};

export const categoriesCommand = new Command("categories")
  .alias("cats")
  .description("List all available program categories")
  .option("--json", "output as JSON")
  .action(async (opts: { json?: boolean }) => {
    const categories = getCategories();

    if (opts.json) {
      capture("cli:categories");
      console.log(
        JSON.stringify(
          categories.map((c) => ({
            count: getProgramsByCategory(c).length,
            id: c,
            label: CATEGORY_LABELS[c],
          })),
          null,
          2,
        ),
      );
      return;
    }

    if (process.stdout.isTTY) {
      await runInteractiveCategories();
      return;
    }

    capture("cli:categories");
    printCategoriesTable(categories);
  });
