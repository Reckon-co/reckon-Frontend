import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from "recharts";
import { T } from "../theme";
import type { TrendPoint } from "../data/types";

function shortDate(iso: string) {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", timeZone: "UTC" });
}

function Tip({ active, payload }: { active?: boolean; payload?: Array<{ payload: TrendPoint }> }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div style={{ background: T.panelUp, border: `1px solid ${T.line}`, borderRadius: 4, padding: "8px 12px", fontFamily: T.mono, fontSize: 11 }}>
      <div style={{ color: T.health }}>{p.coveragePct}% coverage</div>
      <div style={{ color: T.dim }}>{p.commitSha} · {shortDate(p.date)}</div>
      {p.newCrash && <div style={{ color: T.signal }}>new crash on this commit</div>}
    </div>
  );
}

/** Amber dots mark commits where a new crash was found. */
function CrashDot(props: { cx?: number; cy?: number; payload?: TrendPoint }) {
  const { cx, cy, payload } = props;
  if (!payload?.newCrash || cx == null || cy == null) return null;
  return <circle cx={cx} cy={cy} r={4} fill={T.signal} stroke={T.ink} strokeWidth={2} />;
}

export function TrendChart({ data }: { data: TrendPoint[] }) {
  const chartData = data.map((p) => ({ ...p, label: shortDate(p.date) }));
  return (
    <div style={{ height: 224 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="cov" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={T.health} stopOpacity={0.28} />
              <stop offset="100%" stopColor={T.health} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={T.line} strokeDasharray="3 6" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: T.faint, fontSize: 11, fontFamily: T.mono }} axisLine={{ stroke: T.line }} tickLine={false} />
          <YAxis domain={[30, 90]} tick={{ fill: T.faint, fontSize: 11, fontFamily: T.mono }} axisLine={false} tickLine={false} unit="%" />
          <Tooltip content={<Tip />} cursor={{ stroke: T.faint, strokeDasharray: "3 3" }} />
          <Area type="monotone" dataKey="coveragePct" stroke={T.health} strokeWidth={2} fill="url(#cov)" dot={<CrashDot />} activeDot={{ r: 4, fill: T.health }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
