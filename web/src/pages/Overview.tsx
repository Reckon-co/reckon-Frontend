import { useEffect, useState } from "react";
import { T } from "../theme";
import type { DataProvider } from "../data/provider";
import type { Project, FuzzRun, Crash, CrashStatus, TrendPoint } from "../data/types";
import { OPEN_ISSUES } from "../data/issues";
import { Stat } from "../components/Stat";
import { TrendChart } from "../components/TrendChart";
import { RunList } from "../components/RunList";
import { CrashTable } from "../components/CrashTable";
import { IssueStub } from "../components/IssueStub";

const REPO_URL = "https://github.com/OWNER/reckon"; // TODO: set once the repo exists

const panel: React.CSSProperties = { background: T.panel, border: `1px solid ${T.line}`, borderRadius: 8, padding: 20 };
const h2: React.CSSProperties = { fontSize: 13, fontWeight: 600, letterSpacing: "0.02em", fontFamily: T.disp, margin: 0 };

export function Overview({ provider }: { provider: DataProvider }) {
  const [project, setProject] = useState<Project | null>(null);
  const [runs, setRuns] = useState<FuzzRun[]>([]);
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [crashes, setCrashes] = useState<Crash[]>([]);
  const [filter, setFilter] = useState<CrashStatus | "all">("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([provider.getProject(), provider.getRuns(), provider.getCoverageTrend()])
      .then(([p, r, t]) => { setProject(p); setRuns(r.items); setTrend(t); })
      .catch(() => setError("Couldn't load report data. If you're developing locally, check the provider wiring in App.tsx."));
  }, [provider]);

  useEffect(() => {
    provider.getCrashes(filter === "all" ? undefined : filter).then(setCrashes).catch(() => {});
  }, [provider, filter]);

  if (error) {
    return <div style={{ fontFamily: T.mono, fontSize: 13, color: T.fail, padding: 40 }}>{error}</div>;
  }
  if (!project) {
    return <div style={{ fontFamily: T.mono, fontSize: 13, color: T.faint, padding: 40 }}>loading report…</div>;
  }

  const latest = runs[0];
  const openCrashes = crashes.filter((c) => c.status === "open").length;
  const lifetimeIters = runs.reduce((s, r) => s + r.iterations, 0);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
      {/* Header — reads like the CLI that produced it */}
      <header style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: T.mono, fontSize: 11, marginBottom: 12, color: T.faint }}>
          $ cargo reckon report --format html
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.02em", fontFamily: T.disp, margin: 0 }}>
            reckon<span style={{ color: T.health }}>.</span>
          </h1>
          <span style={{ fontFamily: T.mono, fontSize: 13, color: T.dim }}>{project.repo}</span>
          <span style={{ fontFamily: T.mono, fontSize: 11, padding: "2px 8px", borderRadius: 4, color: T.faint, border: `1px solid ${T.line}` }}>
            {project.sdk}
          </span>
        </div>
        {latest && (
          <p style={{ marginTop: 8, fontSize: 13, maxWidth: 560, color: T.dim, lineHeight: 1.5 }}>
            Property-based fuzz report for <span style={{ fontFamily: T.mono, color: T.text }}>{project.contract}</span>.
            Latest campaign: {latest.iterations.toLocaleString()} iterations against commit{" "}
            <span style={{ fontFamily: T.mono }}>{latest.commitSha}</span>.
          </p>
        )}
      </header>

      {/* Stats */}
      {latest && (
        <section style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
          <Stat label="coverage" value={`${latest.coveragePct ?? "—"}%`} accent={T.health} sub="latest run" />
          <Stat label="open crashes" value={openCrashes} accent={openCrashes ? T.signal : T.pass} sub={openCrashes ? "needs triage" : "all clear"} />
          <Stat label="iterations" value={`${Math.round(lifetimeIters / 1000)}k`} sub={`across ${runs.length} runs shown`} />
          <Stat label="latest verdict" value={latest.verdict === "pass" ? "PASS" : "CRASH"} accent={latest.verdict === "pass" ? T.pass : T.fail} />
        </section>
      )}

      {/* Trend */}
      <section style={{ ...panel, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={h2}>Coverage trend</h2>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.faint }}>per commit · {trend.length} runs</span>
        </div>
        <TrendChart data={trend} />
        <div style={{ fontFamily: T.mono, fontSize: 11, marginTop: 8, color: T.faint }}>
          <span style={{ color: T.signal }}>●</span> amber dot — new crash found on that commit
        </div>
      </section>

      {/* Runs + crashes */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24, marginBottom: 40 }}>
        <div style={panel}>
          <h2 style={{ ...h2, marginBottom: 16 }}>Recent runs</h2>
          <RunList runs={runs} />
        </div>
        <div style={panel}>
          <h2 style={{ ...h2, marginBottom: 16 }}>Crash triage</h2>
          <CrashTable crashes={crashes} filter={filter} onFilter={setFilter} />
        </div>
      </section>

      {/* Contributor funnel */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, fontFamily: T.disp, margin: "0 0 4px" }}>
          Not built yet <span style={{ color: T.signal }}>— on purpose.</span>
        </h2>
        <p style={{ fontSize: 13, marginBottom: 16, maxWidth: 640, color: T.dim, lineHeight: 1.5 }}>
          Everything above works against fixture data. Everything below is an open issue with acceptance criteria — pick one, and this page grows.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
          {OPEN_ISSUES.map((i) => <IssueStub key={i.n} issue={i} repoUrl={REPO_URL} />)}
        </div>
      </section>

      <footer style={{ borderTop: `1px solid ${T.line}`, paddingTop: 24, display: "flex", gap: 8, flexWrap: "wrap", fontFamily: T.mono, fontSize: 11, color: T.faint }}>
        <span>reckon v0.1.0-dev</span><span>·</span><span>MIT</span><span>·</span><span>data: MockProvider (fixtures)</span>
        <span style={{ marginLeft: "auto", color: T.health }}>fuzzed with reckon ▮</span>
      </footer>
    </div>
  );
}
