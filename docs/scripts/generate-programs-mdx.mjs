#!/usr/bin/env node
/**
 * Generates content/programs/en/*.mdx from @ossperks/data JSON.
 * Run via: pnpm generate:programs
 * Full i18n: pnpm generate:i18n (runs this first, then lingo.dev)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { programs } from "@ossperks/data";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "content", "programs", "en");

fs.mkdirSync(OUT_DIR, { recursive: true });

const q = (s) => JSON.stringify(String(s));

const serializeField = (key, value) => {
  if (value === null || value === undefined) {
    return `${key}: ~`;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return `${key}: []`;
    }
    if (typeof value[0] === "string") {
      return `${key}:\n${value.map((v) => `  - ${q(v)}`).join("\n")}`;
    }
    // array of objects (perks)
    const items = value
      .map((obj) => {
        const entries = Object.entries(obj)
          .map(([k, v]) => `    ${k}: ${q(String(v))}`)
          .join("\n");
        return `  -\n${entries}`;
      })
      .join("\n");
    return `${key}:\n${items}`;
  }
  return `${key}: ${q(String(value))}`;
};

const buildFrontmatter = (fields) =>
  Object.entries(fields)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => serializeField(k, v))
    .join("\n");

let count = 0;
for (const p of programs) {
  const fields = {
    applicationProcess: p.applicationProcess ?? [],
    applicationUrl: p.applicationUrl ?? null,
    category: p.category,
    description: p.description,
    duration: p.duration ?? null,
    eligibility: p.eligibility,
    perks: p.perks,
    provider: p.provider,
    requirements: p.requirements ?? [],
    tags: p.tags ?? [],
    title: p.name,
    url: p.url,
  };

  const content = `---\n${buildFrontmatter(fields)}\n---\n`;
  const outPath = path.join(OUT_DIR, `${p.slug}.mdx`);
  fs.writeFileSync(outPath, content, "utf8");
  count += 1;
}

console.log(`✔ Generated ${count} program MDX files in content/programs/en/`);
