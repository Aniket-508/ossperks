const PRINT_WIDTH = 80;

export const collapseShortArrays = (json: string): string =>
  json.replaceAll(
    /^( +)"([^"]+)": \[\n((?:\1 {2}"[^\n]*",?\n)+)\1\]/gm,
    (match, indent: string, key: string, items: string) => {
      const values = items
        .trim()
        .split("\n")
        .map((l) => l.trim().replace(/,$/, ""));
      const collapsed = `${indent}"${key}": [${values.join(", ")}]`;
      return collapsed.length <= PRINT_WIDTH ? collapsed : match;
    },
  );
