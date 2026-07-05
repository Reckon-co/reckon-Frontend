import { T } from "../theme";
import { StatusChip } from "./Chips";
import type { Crash, CrashStatus } from "../data/types";

const FILTERS: Array<CrashStatus | "all"> = ["all", "open", "fixed"];

export function CrashTable({
  crashes, filter, onFilter,
}: { crashes: Crash[]; filter: CrashStatus | "all"; onFilter: (f: CrashStatus | "all") => void }) {
  return (
    <div>
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => onFilter(f)}
            style={{
              fontFamily: T.mono, fontSize: 11, padding: "2px 8px", borderRadius: 4, cursor: "pointer",
              color: filter === f ? T.ink : T.dim,
              background: filter === f ? T.health : "transparent",
              border: `1px solid ${filter === f ? T.health : T.line}`,
            }}
          >
            {f}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {crashes.map((c) => (
          <div key={c.id} style={{ borderRadius: 6, padding: "8px 12px", background: T.ink, border: `1px solid ${T.line}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
              <span style={{ fontFamily: T.mono, fontSize: 13, fontWeight: 500, color: T.signal }}>{c.targetFn}()</span>
              <StatusChip status={c.status} />
              <span style={{ fontFamily: T.mono, fontSize: 11, marginLeft: "auto", color: T.faint }}>
                seen in {c.seenInRuns} run{c.seenInRuns > 1 ? "s" : ""}
              </span>
            </div>
            <div style={{ fontFamily: T.mono, fontSize: 11, color: T.faint, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {c.dedupHash} · first seen {c.firstSeenAt}
            </div>
            {c.reproducerPath && (
              <div style={{ fontFamily: T.mono, fontSize: 11, marginTop: 4, color: T.dim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {c.reproducerPath}
              </div>
            )}
          </div>
        ))}
        {crashes.length === 0 && (
          <div style={{ fontFamily: T.mono, fontSize: 11, padding: "24px 0", textAlign: "center", color: T.faint }}>
            no crashes with this status — run a deeper campaign to be sure
          </div>
        )}
      </div>
    </div>
  );
}
