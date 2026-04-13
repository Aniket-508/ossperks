import fs from "node:fs";

import { defineConfig } from "tsdown";

const packageJson = JSON.parse(
  fs.readFileSync(new URL("package.json", import.meta.url), "utf8"),
) as {
  version: string;
};

const sharedConfig = {
  banner: { js: "#!/usr/bin/env node" },
  deps: {
    alwaysBundle: ["@ossperks/core", "@ossperks/data"],
    externals: ["license-similarity"],
    onlyBundle: false,
  },
  dts: true,
  env: {
    POSTHOG_API_KEY: process.env.POSTHOG_API_KEY ?? "",
    VERSION: process.env.VERSION ?? packageJson.version,
  },
  fixedExtension: false,
};

export default defineConfig([
  {
    ...sharedConfig,
    clean: true,
    entry: {
      index: "./src/index.ts",
    },
  },
]);
