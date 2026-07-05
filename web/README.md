# reckon web — the report frontend

Renders fuzz campaign results: coverage trends, run history, crash triage. Ships two ways from one codebase: a static site (GitHub Pages) and, eventually, a self-contained HTML file emitted by `cargo reckon report --format html`.

## Run it

```bash
npm install
npm run dev
```

No Rust, no Docker, no backend. The app runs on fixture data via `MockProvider`.

## Architecture — read this before your first PR

**One rule: components never fetch. Providers do.**

```
src/data/types.ts      ← the data contract (mirrors the CLI's JSON output)
src/data/provider.ts   ← the DataProvider interface
src/data/mockProvider.ts  ← fixtures implementation (the only one, today)
src/data/fixtures/     ← realistic JSON the mock serves
```

Planned providers (open issues): `StaticProvider` (fetches `runs.json` / `trend.json` published next to the site) and `ApiProvider` (Phase-2 hosted dashboard). Because every screen already talks to the interface, adding these touches zero components.

## Where things live

```
src/
├── theme.ts           # design tokens — all colors/fonts come from here
├── data/              # contract, providers, fixtures
├── components/        # VerdictChip, Stat, TrendChart, RunList, CrashTable, IssueStub
├── pages/Overview.tsx # the report page
├── App.tsx            # provider wiring
└── main.tsx
```

## Conventions

- Design tokens only — no raw hex in components (`src/theme.ts`).
- New data needs? Extend `DataProvider` + `MockProvider` + fixtures in the same PR.
- `npm run build` must pass (it type-checks via `tsc -b`).
