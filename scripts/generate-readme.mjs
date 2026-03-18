#!/usr/bin/env node
/**
 * Rebuilds the program lists in README.md from the JSON data files.
 * Run via: pnpm generate:readme
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const PROGRAMS_DIR = path.join(ROOT, "packages", "core", "src", "programs");
const README_PATH = path.join(ROOT, "README.md");

const CATEGORY_HEADINGS = {
  ai: "## AI & Machine Learning",
  analytics: "## Analytics",
  "ci-cd": "## CI/CD",
  communication: "## Communication",
  credentials: "## Credentials & Secrets",
  devtools: "## Developer Tools",
  funding: "## Funding",
  hosting: "## Hosting & Deployment",
  infrastructure: "## Infrastructure",
  monitoring: "## Monitoring & Observability",
  security: "## Security",
  testing: "## Testing",
};

const programs = fs
  .readdirSync(PROGRAMS_DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(PROGRAMS_DIR, f), "utf8")));

const byCategory = new Map();
for (const p of programs) {
  const list = byCategory.get(p.category) ?? [];
  list.push(`- [${p.provider}](${p.url}) - ${p.description}`);
  byCategory.set(p.category, list);
}

for (const list of byCategory.values()) {
  list.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
}

let readme = fs.readFileSync(README_PATH, "utf8");

for (const [category, heading] of Object.entries(CATEGORY_HEADINGS)) {
  const entries = byCategory.get(category);
  if (!entries?.length) {
    continue;
  }

  const headingIndex = readme.indexOf(heading);
  if (headingIndex === -1) {
    continue;
  }

  const afterHeading = readme.indexOf("\n", headingIndex) + 1;
  const rest = readme.slice(afterHeading);
  const nextSectionMatch = rest.search(/^## /m);
  const sectionEnd =
    nextSectionMatch === -1
      ? readme.length
      : afterHeading + nextSectionMatch - 1;

  const newSection = `\n${entries.join("\n")}\n`;
  readme =
    readme.slice(0, afterHeading) + newSection + readme.slice(sectionEnd);
}

fs.writeFileSync(README_PATH, readme, "utf8");
console.log(
  `✔ Updated README.md with ${programs.length} programs across ${byCategory.size} categories.`
);
