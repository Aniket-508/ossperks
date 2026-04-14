# ossperks

## 0.4.0

### Minor Changes

- 47f258e: Interactive prompts for `search`, `show`, `check`, and `categories` via `@clack/prompts`; category flow lists programs after pick. Program tables show name and URL only; `open` uses `execa`; check command split into smaller modules; update notice and styling helpers refactored.

  Underlying core package adds shared relative-time helpers and tighter fetch utilities used by the CLI.

## 0.3.3

### Patch Changes

- 036b4a7: - Add **Cossistant** open source program (support category) — free Pro plan with credits, dofollow listing, guest blog post, and integration help
  - Add **cubic** open source program — free AI code reviews in GitHub + CLI for open-source teams

## 0.3.2

### Patch Changes

- f04e82e: - Enhance README with logo, correct CC0-1.0 license badge, expanded command examples, environment variables reference, and auto-detected vs. manual-review eligibility criteria

## 0.3.1

### Patch Changes

- 320081f: - Mark `license-similarity` as an external dependency in the CLI build and add it as a direct runtime dependency

## 0.3.0

### Minor Changes

- c4998b6: - Add keyword-set intent classification for eligibility rules, replacing brittle regex matching
  - Add SPDX/OSI license detection via `license-similarity` and `spdx-license-list`
  - Add program `configFiles` support for auto-verifying hosting requirements (e.g. `vercel.json`)
  - Fix dependency scanning on Codeberg/Gitea by paginating the recursive git tree API so large repos no longer miss `package.json` files beyond the first page
  - Reduce GitLab tree API overhead by requesting 100 entries per page instead of the default 20
  - Fix empty bullets and reason formatting inconsistencies in the docs check page

## 0.2.0

### Minor Changes

- e76a00f:
  - Add Codeberg and Gitea as supported repository providers alongside GitHub and GitLab
  - Add technology stack detection — programs can now declare required npm packages via `techPackages` to auto-verify technology requirements
  - Add monorepo dependency scanning — all `package.json` files across workspaces are scanned, not just the root

## 0.1.4

### Patch Changes

- 807e48a: Fix GitLab repo check: request license data via API and pass through topics

## 0.1.3

### Patch Changes

- 2e64494: Add PostHog for Open Source program and fix perk title serialization in submission API

## 0.1.2

### Patch Changes

- aac4ed8: Fix CLI not executing when installed via npx

## 0.1.1

### Patch Changes

- b5a1008: Fix missing dist files in published package

## 0.1.0

### Minor Changes

- Initial release
- List, search, and browse 15 OSS perk programs (Vercel, Sentry, JetBrains, GitHub Copilot, Cloudflare, and more)
- Check your repo's eligibility across all programs with `ossperks check`
- Auto-detect GitHub/GitLab repos from package.json or git config
- Support for `--json` output
- Commands: `list`, `show`, `search`, `check`, `categories`
