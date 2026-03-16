#!/usr/bin/env node
/**
 * Generates content/programs/en/*.mdx from @ossperks/data JSON.
 * Run via: pnpm generate:programs
 * Full i18n: pnpm generate:i18n (runs this first, then lingo.dev)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PROGRAMS_SRC = path.join(
  __dirname,
  "..",
  "..",
  "packages",
  "core",
  "src",
  "programs"
);
const OUT_DIR = path.join(__dirname, "..", "content", "programs", "en");

const programs = fs
  .readdirSync(PROGRAMS_SRC)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(PROGRAMS_SRC, f), "utf8")));

fs.mkdirSync(OUT_DIR, { recursive: true });

const buildMetaSection = (p) => {
  const meta = [
    `- **Provider**: ${p.provider}`,
    `- **Category**: ${p.category}`,
    ...(p.duration ? [`- **Duration**: ${p.duration}`] : []),
    ...(p.url ? [`- **Website**: [${p.url}](${p.url})`] : []),
    ...(p.applicationUrl && p.applicationUrl !== p.url
      ? [`- **Apply**: [${p.applicationUrl}](${p.applicationUrl})`]
      : []),
  ];
  return meta.join("\n");
};

const buildPerksSection = (p) =>
  p.perks?.length
    ? `## Perks\n\n${p.perks.map((perk) => `- **${perk.title}**: ${perk.description}`).join("\n")}`
    : null;

const buildEligibilitySection = (p) =>
  p.eligibility?.length
    ? `## Eligibility\n\n${p.eligibility.map((e) => `- ${e}`).join("\n")}`
    : null;

const buildRequirementsSection = (p) =>
  p.requirements?.length
    ? `## Requirements\n\n${p.requirements.map((r) => `- ${r}`).join("\n")}`
    : null;

const buildApplicationProcessSection = (p) =>
  p.applicationProcess?.length
    ? `## How to apply\n\n${p.applicationProcess.map((step, i) => `${i + 1}. ${step}`).join("\n")}`
    : null;

const buildTagsSection = (p) =>
  p.tags?.length
    ? `## Tags\n\n${p.tags.map((t) => `\`${t}\``).join(", ")}`
    : null;

const buildMarkdownBody = (p) => {
  const sections = [
    buildMetaSection(p),
    buildPerksSection(p),
    buildEligibilitySection(p),
    buildRequirementsSection(p),
    buildApplicationProcessSection(p),
    buildTagsSection(p),
  ].filter(Boolean);
  return sections.join("\n\n");
};

let count = 0;
for (const p of programs) {
  const frontmatter = [
    "---",
    `title: ${p.name}`,
    `description: ${p.description}`,
    "---",
  ].join("\n");

  const body = buildMarkdownBody(p);
  const content = `${frontmatter}\n\n${body}\n`;
  const outPath = path.join(OUT_DIR, `${p.slug}.mdx`);
  fs.writeFileSync(outPath, content, "utf8");
  count += 1;
}

console.log(`✔ Generated ${count} program MDX files in content/programs/en/`);
