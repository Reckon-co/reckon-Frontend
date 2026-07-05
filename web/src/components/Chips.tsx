import { T } from "../theme";
import type { Verdict, CrashStatus } from "../data/types";

export function VerdictChip({ verdict }: { verdict: Verdict }) {
  const pass = verdict === "pass";
  return (
    <span
      style={{
        fontFamily: T.mono,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.05em",
        padding: "2px 8px",
        borderRadius: 4,
        color: pass ? T.pass : T.fail,
        background: pass ? "rgba(76,195,138,0.12)" : "rgba(229,72,77,0.12)",
        border: `1px solid ${pass ? "rgba(76,195,138,0.35)" : "rgba(229,72,77,0.35)"}`,
      }}
    >
      {pass ? "PASS" : "CRASH"}
    </span>
  );
}

const statusStyles: Record<CrashStatus, { c: string; bg: string }> = {
  open: { c: T.signal, bg: "rgba(232,163,61,0.12)" },
  acknowledged: { c: T.health, bg: "rgba(63,208,201,0.10)" },
  fixed: { c: T.pass, bg: "rgba(76,195,138,0.10)" },
  wontfix: { c: T.faint, bg: "rgba(90,103,121,0.15)" },
};

export function StatusChip({ status }: { status: CrashStatus }) {
  const s = statusStyles[status];
  return (
    <span style={{ fontFamily: T.mono, fontSize: 11, padding: "2px 8px", borderRadius: 4, color: s.c, background: s.bg }}>
      {status}
    </span>
  );
}
