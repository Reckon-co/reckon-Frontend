import { useState } from "react";
import { T } from "../theme";
import type { StubIssue } from "../data/issues";

/** Signature element: unbuilt features rendered as claimable issue stubs. */
export function IssueStub({ issue, repoUrl }: { issue: StubIssue; repoUrl: string }) {
  const [hover, setHover] = useState(false);
  const labelColor = issue.label.startsWith("good") ? T.pass : issue.label.startsWith("blocked") ? T.faint : T.signal;
  return (
    <a
      href={`${repoUrl}/issues/${issue.n}`}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "block",
        borderRadius: 8,
        padding: 16,
        border: `1px dashed ${T.line}`,
        background: hover ? T.panel : "transparent",
        textDecoration: "none",
        transition: "background 120ms",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
        <span style={{ fontFamily: T.mono, fontSize: 11, color: T.faint }}>#{issue.n}</span>
        <span style={{ fontFamily: T.mono, fontSize: 11, padding: "2px 8px", borderRadius: 999, color: labelColor, border: `1px solid ${T.line}` }}>
          {issue.label}
        </span>
        <span style={{ fontFamily: T.mono, fontSize: 11, marginLeft: "auto", color: T.faint }}>{issue.area}</span>
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.4, color: T.dim }}>{issue.title}</div>
      <div style={{ fontFamily: T.mono, fontSize: 11, marginTop: 12, color: T.faint }}>→ not built yet. claim it.</div>
    </a>
  );
}
