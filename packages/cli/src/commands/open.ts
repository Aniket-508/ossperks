import { Command } from "commander";

import { openUrl } from "../utils/open-url.js";
import { capture } from "../utils/telemetry.js";

const SITE_URL = "https://www.ossperks.com";

export const openCommand = new Command("open")
  .description("Open ossperks.com in your default browser")
  .action(async () => {
    capture("cli:open");

    try {
      await openUrl(SITE_URL);
    } catch {
      console.log(SITE_URL);
    }
  });
