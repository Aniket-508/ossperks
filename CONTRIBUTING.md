# Contributing to ossperks

Thanks for your interest in contributing to **ossperks**! This project is a monorepo containing:

- **`@ossperks/data`** — Program definitions: JSON files for every OSS perk program.
- **`ossperks` CLI** — A CLI that lists programs and checks whether a project qualifies, using live GitHub/GitLab API data.
- **`docs`** — A Fumadocs + Next.js site with programs browsing, CLI documentation, and full i18n support.

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v22.20+
- [pnpm](https://pnpm.io/) v10.29+ (package manager)

### Getting Started

```bash
# Clone the repo
git clone https://github.com/Aniket-508/ossperks.git
cd ossperks

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run all tests
pnpm test
```

## Project Structure

```
packages/
├── cli/             # ossperks — CLI tool (publishable)
└── data/            # @ossperks/data — program JSON (private, bundled into CLI)
docs/                # Fumadocs documentation site (Next.js)
```

## Package overview

- **`@ossperks/data`**: Program definitions. All JSON files live in `packages/data/src/programs/`. This package is private (not published to npm) and is bundled directly into the CLI.
- **`ossperks` (CLI)**: The published CLI. Add commands and eligibility logic here. Depends on `@ossperks/data` at build time (bundled via `tsdown`).
- **`docs`**: The Fumadocs-powered website. Includes `/programs` (browseable program cards), `/cli` (full CLI documentation), and a home page — all with i18n support for 9 languages.

## Development Commands

```bash
# Build all packages
pnpm build

# Run all tests
pnpm test

# Type check everything
pnpm typecheck

# Lint and format check (ultracite)
pnpm check

# Fix lint and format issues (ultracite)
pnpm fix

# Run tests for the CLI package
pnpm --filter ossperks test
```

### Documentation site

```bash
# Generate program MDX files and start the dev server
pnpm --filter docs dev

# Generate program MDX files only
pnpm --filter docs generate:programs

# Generate programs MDX + translate to all supported languages (requires LINGO_API_KEY)
pnpm --filter docs generate:i18n

# Re-translate CLI docs and locale dictionary without regenerating programs
pnpm --filter docs i18n:run
```

> **Note:** `pnpm --filter docs dev` automatically runs `generate:programs` before starting the server, so `content/programs/en/` is always up to date.

## Adding a new OSS program

1. Add a JSON file at `packages/data/src/programs/<slug>.json` following the existing schema (slug, name, provider, url, category, description, perks, eligibility, tags, etc.)

2. Validate the schema locally:

   ```bash
   pnpm --filter @ossperks/data validate
   ```

3. Generate the MDX files and translate to all supported languages:

   ```bash
   cd docs && pnpm generate:i18n
   ```

   _(requires `LINGO_API_KEY` env var — see `.env.example`)_

4. Commit everything:
   ```bash
   git add packages/data/src/programs/<slug>.json
   git add docs/content/programs/
   git commit -m "feat(data): add <slug> program"
   ```

## Adding or editing CLI documentation

1. Edit or create MDX files in `docs/content/cli/en/`

2. Translate to all supported languages:

   ```bash
   cd docs && pnpm i18n:run
   ```

3. Commit the changes:
   ```bash
   git add docs/content/cli/
   git commit -m "docs(cli): <describe change>"
   ```

## Supported languages

The site supports 9 locales. Translations are generated automatically by [lingo.dev](https://lingo.dev):

| Code    | Language         |
| ------- | ---------------- |
| `en`    | English (source) |
| `es`    | Español          |
| `zh-CN` | 中文             |
| `fr`    | Français         |
| `de`    | Deutsch          |
| `pt-BR` | Português (BR)   |
| `ja`    | 日本語           |
| `ko`    | 한국어           |
| `ru`    | Русский          |

Manual translation PRs are welcome for corrections — edit the appropriate file in `docs/content/cli/<locale>/`, `docs/content/programs/<locale>/`, or `docs/src/locales/<locale>.ts`.

## Code Style

We use `oxfmt` and `oxlint` (via `ultracite`) for linting and formatting. Run `pnpm fix` to auto-fix most issues.

## Pull Requests

1. Fork the repo and create a branch from `main`
2. Make your changes
3. Ensure tests pass: `pnpm test`
4. Run `pnpm check` to verify code quality
5. Submit a PR

### Changesets

For any user-facing changes to the `ossperks` CLI, add a changeset:

```bash
pnpm changeset
```

Follow the prompts to select the affected package and provide a brief description of the change.

## Questions?

Feel free to open an issue or start a discussion if you have questions!
