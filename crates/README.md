# crates/ — Rust core (spike in progress)

This directory will hold:

- `reckon-cli` — `cargo reckon init | gen | fuzz | report`
- `reckon-proptest` — Soroban-type proptest strategies
- `reckon-core` — shared types & config parsing

**Current status:** the FR-2 spike (wasm → `contractspecv0` extraction → XDR deserialization → generated fuzz target) is being proven end-to-end on a fixture contract before any Rust issues open. Rust contribution waves start once the spike lands — watch the pinned tracking issue.

The JSON that `cargo reckon report --format json` will emit is specified today by the frontend's types: see [`web/src/data/types.ts`](../web/src/data/types.ts). That file is the contract between the two halves of this project.
