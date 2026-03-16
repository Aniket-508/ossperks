import fs from "node:fs";

import { defineConfig } from "tsdown";

const packageJson = JSON.parse(
  fs.readFileSync(new URL("package.json", import.meta.url), "utf8")
) as {
  version: string;
};

const sharedConfig = {
  banner: { js: "#!/usr/bin/env node" },
  deps: {
    alwaysBundle: ["@ossperks/core"],
    onlyAllowBundle: false,
  },
  dts: true,
  env: {
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
