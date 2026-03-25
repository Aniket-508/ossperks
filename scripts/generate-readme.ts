#!/usr/bin/env node
/**
 * Rebuilds the program lists in README.md from the JSON data files.
 * Categories are derived from CATEGORY_LABELS in @ossperks/core — adding
 * a new category to the schema automatically creates a new README section.
 * Run via: pnpm generate:readme
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { Category, Program } from "@ossperks/core/schema";
import { CATEGORY_LABELS } from "@ossperks/core/schema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const PROGRAMS_DIR = path.join(ROOT, "packages", "core", "src", "programs");
const README_PATH = path.join(ROOT, "README.md");

interface ProgramEntry extends Pick<
  Program,
  "provider" | "description" | "category"
> {
  url: string;
}

const programs: ProgramEntry[] = fs
  .readdirSync(PROGRAMS_DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(PROGRAMS_DIR, f), "utf8")));

const byCategory = new Map<string, string[]>();
for (const p of programs) {
  const list = byCategory.get(p.category) ?? [];
  list.push(`- [${p.provider}](${p.url}) - ${p.description}`);
  byCategory.set(p.category, list);
}

for (const list of byCategory.values()) {
  list.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
}

const labelToAnchor = (label: string): string =>
  label
    .toLowerCase()
    .replaceAll("&", "")
    .replaceAll(/[^\w\s-]/g, "")
    .replaceAll(/\s/g, "-")
    .replaceAll(/(^-|-$)/g, "");

const sortedCategories = (
  Object.entries(CATEGORY_LABELS) as [Category, string][]
)
  .filter(([slug]) => byCategory.has(slug))
  .toSorted(([, a], [, b]) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );

const tocLines = sortedCategories.map(
  ([, label]) => `- [${label}](#${labelToAnchor(label)})`,
);

const sectionBlocks = sortedCategories.map(([slug, label]) => {
  const entries = byCategory.get(slug) ?? [];
  return `## ${label}\n\n${entries.join("\n")}`;
});

const generatedContent = [
  "## Contents",
  "",
  ...tocLines,
  "",
  sectionBlocks.join("\n\n"),
  "",
].join("\n");

let readme = fs.readFileSync(README_PATH, "utf8");

const contentsStart = readme.indexOf("## Contents");
const contributingStart = readme.indexOf("## Contributing");

if (contentsStart === -1 || contributingStart === -1) {
  console.error(
    "Could not find ## Contents or ## Contributing markers in README.md",
  );
  process.exit(1);
}

readme =
  readme.slice(0, contentsStart) +
  generatedContent +
  readme.slice(contributingStart);

fs.writeFileSync(README_PATH, readme, "utf8");
console.log(
  `✔ Updated README.md with ${programs.length} programs across ${sortedCategories.length} categories.`,
);
