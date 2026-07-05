/** Unbuilt features rendered in-page as claimable stubs — the contributor funnel. */
export interface StubIssue {
  n: number;
  title: string;
  label: "good first issue" | "help wanted" | "blocked · phase 2";
  area: string;
}

export const OPEN_ISSUES: StubIssue[] = [
  { n: 41, title: "Run detail view — per-function iteration & coverage breakdown", label: "good first issue", area: "web" },
  { n: 42, title: "Crash triage filters — status, target fn, date range", label: "good first issue", area: "web" },
  { n: 43, title: "StaticProvider — fetch runs.json / trend.json from GitHub Pages", label: "help wanted", area: "web" },
  { n: 44, title: "Badge SVG generator — render 'Fuzzed with Reckon' from latest run", label: "good first issue", area: "web" },
  { n: 45, title: "Single-file build target for cargo reckon report --format html", label: "help wanted", area: "web · cli" },
  { n: 46, title: "ApiProvider — Phase-2 dashboard API adapter behind DataProvider", label: "blocked · phase 2", area: "web" },
];
