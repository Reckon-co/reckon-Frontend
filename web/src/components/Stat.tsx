import { T } from "../theme";

export function Stat({ label, value, accent, sub }: { label: string; value: string | number; accent?: string; sub?: string }) {
  return (
    <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 8, padding: 16, flex: 1, minWidth: 140 }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8, color: T.faint, fontFamily: T.mono }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 600, color: accent ?? T.text, fontFamily: T.disp }}>{value}</div>
      {sub && <div style={{ fontSize: 11, marginTop: 4, color: T.dim, fontFamily: T.mono }}>{sub}</div>}
    </div>
  );
}
