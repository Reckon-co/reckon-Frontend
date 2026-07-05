import { T } from "../theme";
import { VerdictChip } from "./Chips";
import type { FuzzRun } from "../data/types";

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" });
}

export function RunList({ runs }: { runs: FuzzRun[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {runs.map((r) => (
        <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, borderRadius: 6, padding: "8px 12px", background: T.ink, border: `1px solid ${T.line}` }}>
          <span style={{ fontFamily: T.mono, fontSize: 11, width: 64, flexShrink: 0, color: T.health }}>{r.commitSha}</span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontFamily: T.mono, fontSize: 11, color: T.dim, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {fmtDate(r.startedAt)}
            </div>
            <div style={{ fontFamily: T.mono, fontSize: 11, color: T.faint }}>
              {(r.iterations / 1000).toFixed(0)}k iters · {r.coveragePct ?? "—"}%
            </div>
          </div>
          <VerdictChip verdict={r.verdict} />
        </div>
      ))}
    </div>
  );
}
