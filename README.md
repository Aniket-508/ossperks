# OSS Perks

A website that aggregates open-source software perks, plus a CLI that checks whether your project qualifies for a particular OSS program based on its guidelines.

- **Docs / website**: [docs](docs/) — Fumadocs-based site (run with `pnpm --filter docs dev`). Replace with your deployed URL when ready.
- **CLI**: `ossperks` — run in your project to check eligibility for OSS programs.

## CLI

Install and run:

```sh
pnpm add -g ossperks
ossperks check
```

Or use without installing:

```sh
npx ossperks
```

CLI behavior (program definitions and eligibility checks) is in development.

## Development

```sh
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for full development guidelines.

## License

[MIT](./LICENSE)
