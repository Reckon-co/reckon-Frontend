import type { Project, FuzzRun, Crash, CrashStatus, TrendPoint, Page } from "./types";

/**
 * Every screen reads through this interface — components never fetch.
 *
 * Implementations:
 *  - MockProvider   (fixtures)             ✅ built
 *  - EmbeddedProvider (JSON injected by `cargo reckon report`)  → issue #45
 *  - StaticProvider (JSON on GitHub Pages) → issue #43
 *  - ApiProvider    (Phase-2 dashboard)    → issue #46
 */
export interface DataProvider {
  getProject(): Promise<Project>;
  getRuns(limit?: number, cursor?: string): Promise<Page<FuzzRun>>;
  getCoverageTrend(): Promise<TrendPoint[]>;
  getCrashes(status?: CrashStatus): Promise<Crash[]>;
}
