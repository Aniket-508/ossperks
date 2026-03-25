import { programs } from "@ossperks/core";

export const slugScore = (a: string, b: string): number => {
  const maxLen = Math.max(a.length, b.length);
  let score = 0;
  for (let i = 0; i < maxLen; i += 1) {
    if (a[i] !== b[i]) {
      score += 1;
    }
  }
  return score + Math.abs(a.length - b.length);
};

export const closestSlug = (slug: string): string | null => {
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
