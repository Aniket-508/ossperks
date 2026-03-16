import { programs, getProgramBySlug } from "@ossperks/core";
import { Command } from "commander";

import { programDetail, error } from "../utils/format.js";

const slugScore = (a: string, b: string): number => {
  const maxLen = Math.max(a.length, b.length);
  let score = 0;
  for (let i = 0; i < maxLen; i += 1) {
    if (a[i] !== b[i]) {
      score += 1;
    }
  }
  return score + Math.abs(a.length - b.length);
};

const closest = (slug: string): string | null => {
  let best: string | null = null;
  let bestScore = Infinity;
  const target = slug.toLowerCase();
  for (const p of programs) {
    const score = slugScore(target, p.slug.toLowerCase());
    if (score < bestScore) {
      bestScore = score;
      best = p.slug;
    }
  }
  return bestScore <= 5 ? best : null;
};

export const showCommand = new Command("show")
  .description("Show details for a specific OSS perk program")
  .argument("<slug>", "program slug (e.g. vercel, sentry, github-copilot)")
  .option("--json", "output as JSON")
  .action((slug: string, opts: { json?: boolean }) => {
    const program = getProgramBySlug(slug);

    if (!program) {
      const suggestion = closest(slug);
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
