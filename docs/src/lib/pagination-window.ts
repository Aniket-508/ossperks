export type PaginationWindowEntry =
  | { key: string; type: "ellipsis" }
  | { key: string; page: number; type: "page" };

export const getPaginationWindow = (
  current: number,
  total: number,
): PaginationWindowEntry[] => {
  if (total <= 1) {
    return [];
  }
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => ({
      key: `p-${i + 1}`,
      page: i + 1,
      type: "page" as const,
    }));
  }
  const pages = new Set<number>([1, total]);
  for (let i = current - 1; i <= current + 1; i += 1) {
    if (i >= 1 && i <= total) {
      pages.add(i);
    }
  }
  const sorted = [...pages].toSorted((a, b) => a - b);
  const result: PaginationWindowEntry[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev > 0 && p > prev + 1) {
      result.push({
        key: `e-${prev}-${p}`,
        type: "ellipsis",
      });
    }
    result.push({ key: `p-${p}`, page: p, type: "page" });
    prev = p;
  }
  return result;
};
