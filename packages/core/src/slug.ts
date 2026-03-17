export const formatSlug = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replaceAll(/\s+/g, "-")
    .replaceAll(/[^a-z0-9-]/g, "");

export const isCanonicalSlug = (value: string): boolean =>
  value === formatSlug(value);
