/**
 * THE DATA CONTRACT.
 * These types mirror the JSON that `cargo reckon report --format json`
 * emits (and, later, the dashboard API). Changing anything here is an
 * API change — flag it in your PR title and update fixtures in the same PR.
 */

export type Verdict = "pass" | "fail";
export type CrashStatus = "open" | "acknowledged" | "fixed" | "wontfix";
/** Optional in v1 — the CI action does not auto-classify severity. */
export type Severity = "low" | "medium" | "high" | "critical";

export interface Project {
  repo: string;        // "owner/repo"
  contract: string;    // contract crate name
  sdk: string;         // e.g. "soroban-sdk 23.x"
}

export interface FuzzRun {
  id: string;
  commitSha: string;   // short sha
  startedAt: string;   // ISO 8601
  finishedAt: string;  // ISO 8601
  iterations: number;
  coveragePct: number | null;
  crashCount: number;
  verdict: Verdict;
}

export interface Crash {
  id: string;
  targetFn: string;
  dedupHash: string;          // dedup scope: project, not run
  status: CrashStatus;
  firstSeenAt: string;        // ISO 8601
  seenInRuns: number;
  reproducerPath: string | null;
  severity?: Severity;
}

export interface TrendPoint {
  commitSha: string;
  date: string;        // ISO 8601 date
  coveragePct: number;
  newCrash: boolean;   // marks amber dots on the trend chart
}

export interface Page<T> {
  items: T[];
  nextCursor: string | null;
}
