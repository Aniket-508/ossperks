import { fileURLToPath } from "node:url";

import { Command } from "commander";

import { categoriesCommand } from "./commands/categories.js";
import { checkCommand } from "./commands/check.js";
import { listCommand } from "./commands/list.js";
import { searchCommand } from "./commands/search.js";
import { showCommand } from "./commands/show.js";

export const name = "ossperks";

const program = new Command()
  .name("ossperks")
  .description("Browse OSS perk programs and check if your project qualifies.")
  .version(process.env.VERSION ?? "0.0.0");

program.addCommand(listCommand);
program.addCommand(showCommand);
program.addCommand(checkCommand);
program.addCommand(searchCommand);
program.addCommand(categoriesCommand);

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  program.parse(process.argv);
}

export { program };
