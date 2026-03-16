import { programs } from "./index";

console.log(`Validated ${programs.length} programs:`);
for (const p of programs) {
  console.log(`  - ${p.slug} (${p.provider})`);
}
console.log("All programs valid.");
