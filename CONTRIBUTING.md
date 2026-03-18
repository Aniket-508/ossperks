# Contribution Guidelines

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## Adding a New Program

To suggest a new OSS perk program, please submit a pull request with a single JSON file. CI will automatically generate the README entry, English MDX documentation, and translations for all supported languages.

### Add the program data

Create a JSON file at `packages/core/src/programs/<slug>.json` following the existing schema:

```json
{
  "slug": "my-program",
  "name": "My Program for Open Source",
  "provider": "My Company",
  "url": "https://example.com/open-source",
  "category": "devtools",
  "description": "A short description of what the program offers.",
  "eligibility": ["Requirement 1", "Requirement 2"],
  "perks": [
    {
      "title": "Perk title",
      "description": "What the perk includes."
    }
  ]
}
```

Validate the schema:

```bash
pnpm --filter @ossperks/core validate
```

> **Note:** You only need to add the JSON file. When your PR is opened, CI will automatically generate:
>
> - The README entry in the appropriate category
> - The English MDX documentation page
> - Translated MDX files for all 8 supported locales
> - The `programs.generated.ts` barrel file

### What makes a program "awesome"?

A program should be included only if it offers genuine, meaningful value to open-source projects. Programs must:

- Be currently active and accepting applications.
- Offer a free tier, credits, or meaningful discount specifically for open-source projects.
- Have clear eligibility criteria.
- Be from a reputable provider.

Programs that are deprecated, archived, invite-only without a public application, or that only offer trivial discounts should not be included.

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v22.20+
- [pnpm](https://pnpm.io/) v10.29+

### Getting Started

```bash
git clone https://github.com/Aniket-508/awesome-oss-perks.git
cd awesome-oss-perks

pnpm install
pnpm build
pnpm test
```

### Project Structure

```
packages/
├── cli/             # ossperks CLI tool
└── core/            # Program data and eligibility logic
docs/                # Fumadocs documentation site (Next.js)
```

### Commands

```bash
pnpm build           # Build all packages
pnpm test            # Run all tests
pnpm typecheck       # Type check everything
pnpm check           # Lint and format check
pnpm fix             # Fix lint and format issues
```

### Documentation Site

```bash
pnpm --filter docs dev              # Start dev server
pnpm --filter docs generate:i18n    # Generate + translate program MDX
pnpm generate:readme                # Regenerate README from program data
```

## Pull Requests

1. Fork the repo and create a branch from `main`.
2. Make your changes.
3. Ensure tests pass: `pnpm test`.
4. Run `pnpm check` to verify code quality.
5. Submit a PR.

For CLI changes, add a changeset:

```bash
pnpm changeset
```
