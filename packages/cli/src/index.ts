import { Command } from "commander";

import { categoriesCommand } from "./commands/categories.js";
import { checkCommand } from "./commands/check.js";
import { listCommand } from "./commands/list.js";
import { openCommand } from "./commands/open.js";
import { searchCommand } from "./commands/search.js";
import { showCommand } from "./commands/show.js";
import { checkForUpdates } from "./utils/check-updates.js";
import { printBanner, printUsage } from "./utils/intro-banner.js";
import { printCta } from "./utils/outro-cta.js";
import { captureError, flush } from "./utils/telemetry.js";

const program = new Command()
  .name("ossperks")
  .description(
    "Browse OSS perk programs and check if your project qualifies.\n" +
      "Anonymous usage stats are collected. Set DO_NOT_TRACK=1 to opt out.",
  )
  .version(process.env["VERSION"] ?? "0.0.0")
  .action(() => {
    if (process.stdout.isTTY) {
      printUsage();
      return;
    }
    program.outputHelp();
  });

program.addCommand(listCommand);
program.addCommand(showCommand);
program.addCommand(checkCommand);
program.addCommand(searchCommand);
program.addCommand(categoriesCommand);
program.addCommand(openCommand);

program.hook("postAction", (_hookedCommand, actionCommand) => {
  if (!process.stdout.isTTY) {
    return;
  }
  const opts = actionCommand.opts() as { json?: boolean };
  if (opts.json) {
    return;
  }
  printCta();
  checkForUpdates();
});

const run = async (): Promise<void> => {
  printBanner();
  try {
    await program.parseAsync(process.argv);
  } catch (error) {
    const command = process.argv[2] ?? "unknown";
    captureError(command, error);
    const message = error instanceof Error ? error.message : String(error);
    console.error(`\n  error: ${message}\n`);
    process.exit(1);
  } finally {
    await flush();
  }
};

await run();

export { program };
