import type { DataProvider } from "./provider";
import type { Project, FuzzRun, Crash, CrashStatus, TrendPoint, Page } from "./types";
import project from "./fixtures/project.json";
import runs from "./fixtures/runs.json";
import trend from "./fixtures/trend.json";
import crashes from "./fixtures/crashes.json";

/** Fixture-backed provider. The only implementation today — see provider.ts for the roadmap. */
export class MockProvider implements DataProvider {
  async getProject(): Promise<Project> {
    return project as Project;
  }

  async getRuns(limit = 20): Promise<Page<FuzzRun>> {
    const items = (runs as FuzzRun[]).slice(0, limit);
    return { items, nextCursor: null };
  }

  async getCoverageTrend(): Promise<TrendPoint[]> {
    return trend as TrendPoint[];
  }

  async getCrashes(status?: CrashStatus): Promise<Crash[]> {
    const all = crashes as Crash[];
    return status ? all.filter((c) => c.status === status) : all;
  }
}
