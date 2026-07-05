<div align="center">

# reckon-web

</div>

> [!NOTE]
> **The demo runs entirely on hardcoded fixture data.** Every run, crash,
> and coverage number you see comes from mock JSON in
> [`src/data/fixtures/`](src/data/fixtures/) served by `MockProvider` —
> not from a real fuzz campaign. `scripted/reckon-demo-vault` and its
> `liquidity_vault` contract are fictional. This is deliberate: the UI is
> built and demoable before the Rust core lands, and the fixtures double
> as the reference spec for the JSON the CLI will emit. Real data arrives
> via the providers listed below.

---

## What this is

Reckon is a toolkit that auto-generates fuzz harnesses for Soroban contracts by reading the contract's own interface out of its compiled `.wasm` (SEP-48). When a fuzz campaign finishes, `cargo reckon report` emits JSON — **this app is what turns that JSON into something humans read**:

- 📈 **Coverage trend** per commit, with amber markers on commits where new crashes appeared
- 🧪 **Run history** — iterations, coverage, pass/crash verdict per campaign
- 🐛 **Crash triage** — dedup'd crashes with status (`open` / `acknowledged` / `fixed` / `wontfix`), first-seen dates, and reproducer paths

It ships two ways from one codebase:

1. **Static site** — deployed to GitHub Pages/Vercel, reading published JSON (this repo's demo)
2. **Self-contained HTML file** — embedded into `cargo reckon report --format html` output, so a single file attached to a PR *is* the full report (planned — see issues)

## Run it

```bash
git clone https://github.com/OWNER/reckon-web.git
cd reckon-web
npm install
npm run dev        # → http://localhost:5173
```

That's the entire setup. **No Rust, no Docker, no API keys, no backend.** The app runs on realistic fixture data out of the box.

```bash
npm run build      # tsc -b && vite build — this must pass before any PR
```

## The one architectural rule

> **Components never fetch. Providers do.**

Every screen reads through a single interface:

```ts
interface DataProvider {
  getProject(): Promise<Project>;
  getRuns(limit?, cursor?): Promise<Page<FuzzRun>>;
  getCoverageTrend(): Promise<TrendPoint[]>;
  getCrashes(status?): Promise<Crash[]>;
}
```

| Provider | Reads from | Status |
|---|---|---|
| `MockProvider` | hardcoded fixture JSON in `src/data/fixtures/` (what the demo runs on) | ✅ built |
| `EmbeddedProvider` | a `<script id="reckon-data">` JSON island injected by the Rust CLI | 📋 open issue |
| `StaticProvider` | `runs.json` / `trend.json` published next to the site | 📋 open issue |
| `ApiProvider` | the Phase-2 hosted dashboard API | 🔒 blocked (phase 2) |

Because components only know the interface, adding a provider touches **zero UI code** — the swap is one line in `App.tsx`. If a PR calls `fetch()` inside a component, it will be asked to move it. This rule is what keeps the app deployable as both a static site and an offline single-file report without forking the codebase.

## Project structure

```
src/
├── theme.ts               # design tokens — ALL colors & fonts live here, nowhere else
├── data/
│   ├── types.ts           # ⭐ THE DATA CONTRACT — mirrors the Rust CLI's JSON output
│   ├── provider.ts        # the DataProvider interface
│   ├── mockProvider.ts    # fixtures implementation
│   ├── issues.ts          # registry of in-page issue stubs (see below)
│   └── fixtures/          # realistic mock JSON
├── components/
│   ├── TrendChart.tsx     # recharts area chart + crash-marker dots
│   ├── RunList.tsx
│   ├── CrashTable.tsx     # with status filters
│   ├── Chips.tsx          # VerdictChip, StatusChip
│   ├── Stat.tsx
│   └── IssueStub.tsx      # the contributor-funnel panels
├── pages/Overview.tsx     # the report page
├── App.tsx                # provider wiring — the ONLY place a provider is instantiated
└── main.tsx
```

### `types.ts` is load-bearing

That file isn't just frontend typing — it's the **specification for the JSON the Rust CLI will emit**. The Rust side is being built to match it. Changing a type here is an API change: flag it in your PR title, and update `MockProvider` + fixtures in the same PR so the demo never breaks.

## Contributing

This app practices what it preaches: **the unbuilt features are rendered in the live demo as dashed "issue stub" panels**, each linking to a GitHub issue with acceptance criteria. Open the demo, find a stub that interests you, claim the issue.

Current open work:

| # | Task | Label |
|---|---|---|
| 1 | Run detail view — per-function iteration & coverage breakdown | `good first issue` |
| 2 | Crash triage filters — target fn + date range | `good first issue` |
| 3 | `StaticProvider` — fetch published JSON from GitHub Pages | `help wanted` |
| 4 | Badge SVG generator — "Fuzzed with Reckon" from latest run | `good first issue` |
| 5 | Single-file build target (`vite-plugin-singlefile`) for the CLI's HTML report | `help wanted` |
| 6 | `ApiProvider` — Phase-2 dashboard adapter | `blocked · phase 2` |

**Workflow:** comment "claiming" on an issue → get assigned → branch → PR with signed-off commits (`git commit -s`, we use [DCO](https://developercertificate.org/)).

**Definition of done, every PR:**
- [ ] Acceptance criteria on the linked issue met
- [ ] `npm run build` passes (it type-checks — TS strict mode)
- [ ] No `fetch()` outside a provider
- [ ] No raw hex colors in components — tokens come from `theme.ts`
- [ ] Fixtures updated if you touched `types.ts`

## Conventions

- **Stack:** React 18 + TypeScript (strict) + Vite + Recharts. Deliberately boring — every choice is one you already know.
- **Styling:** inline styles driven by `theme.ts` tokens. No CSS framework dependency, no styled-components — keeps the single-file build target (issue #5) simple.
- **`base: "./"` in Vite config** — don't change it; it's what lets the same build work on GitHub Pages subpaths *and* inside the offline HTML report.
- **Fixtures must stay believable.** Adding a field to a type means adding realistic data for it.

## Relationship to the main project

This repo is the reporting layer of the Reckon toolkit (CLI + proptest strategy library + GitHub Action, Rust). It will be absorbed into the main monorepo as `web/` once the core lands — contribution history carries over. Reckon targets the dynamic-testing gap in Soroban tooling, complementing [Scout](https://github.com/CoinFabrik/scout-soroban) (static analysis) — not competing with it.

## License

MIT