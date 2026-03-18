import { readdirSync, watch, writeFileSync } from "node:fs";
import { join } from "node:path";

const programsDir = join(import.meta.dirname, "programs");
const outPath = join(import.meta.dirname, "programs.generated.ts");

const slugToCamelCase = (slug: string): string => {
  const parts = slug.replace(/\.json$/, "").split("-");
  if (/^\d/.test(parts[0])) {
    parts[0] = `_${parts[0]}`;
  }
  return parts
    .map((part, i) =>
      i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join("");
};

const generate = () => {
  const files = readdirSync(programsDir)
    .filter((f) => f.endsWith(".json"))
    .toSorted();

  const imports = files.map((f) => {
    const varName = slugToCamelCase(f);
    return `import ${varName} from "./programs/${f}" with { type: "json" };`;
  });

  const varNames = files.map((f) => slugToCamelCase(f));

  const output = `${imports.join("\n")}

export const rawPrograms = [
  ${varNames.join(",\n  ")},
];
`;

  writeFileSync(outPath, output);
  console.log(`Generated programs.generated.ts with ${files.length} programs.`);
};

generate();

if (process.argv.includes("--watch")) {
  let timeout: ReturnType<typeof setTimeout>;
  watch(programsDir, (_event, filename) => {
    if (!filename?.endsWith(".json")) {
      return;
    }
    clearTimeout(timeout);
    timeout = setTimeout(generate, 100);
  });
  console.log("Watching packages/core/src/programs/ for changes...");
}
