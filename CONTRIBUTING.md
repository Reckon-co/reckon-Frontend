# Contributing to Reckon

Thanks for being here. Reckon is built wave-by-wave: a small set of well-specified issues open at a time, each with acceptance criteria, so your work is never guesswork.

## Sign-off (DCO)

We use the [Developer Certificate of Origin](https://developercertificate.org/). Sign your commits:

```bash
git commit -s -m "feat(web): add StaticProvider"
```

## Picking work

1. Browse issues labeled `good first issue` or `help wanted`.
2. Comment "claiming" on the issue — a maintainer will assign you (this prevents duplicate work).
3. If nobody responds within 48h during an active wave, ping again; that's our informal SLA.

Do **not** open PRs for unfiled features. Open an issue first — scope discussion is cheaper than code review.

## Frontend workflow (`web/`)

```bash
cd web
npm install
npm run dev      # local dev server
npm run build    # must pass before you open a PR
```

Rules that keep the codebase coherent:

- **All data flows through a `DataProvider`.** No `fetch()` in components or pages. If your feature needs data the provider doesn't expose, extend the interface in `src/data/provider.ts` and update `MockProvider` + fixtures in the same PR.
- **Types are the contract.** `src/data/types.ts` mirrors the Rust CLI's JSON output. Changing a type is an API change — flag it in the PR title.
- **Design tokens live in `src/theme.ts`.** No new hex values in components.
- **Fixtures must stay realistic.** If you add a field, add believable data for it.

## Rust workflow (`crates/`)

The core is in spike phase. Rust issues open in Wave 2 once the FR-2 pipeline lands. Watch the repo or the tracking issue.

## Definition of done (every PR)

- [ ] Acceptance criteria on the linked issue are met
- [ ] `npm run build` passes (web) / `cargo test` passes (crates)
- [ ] No new TypeScript errors / clippy warnings
- [ ] Docs updated if you changed a public interface
- [ ] Commits signed off (`-s`)

## Code of conduct

Be excellent to each other. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
