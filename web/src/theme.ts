// Design tokens — the ONLY place colors and fonts are defined.
export const T = {
  ink: "#0F141C",
  panel: "#151C27",
  panelUp: "#1B2432",
  line: "#243040",
  text: "#E9EDF3",
  dim: "#8B98AA",
  faint: "#5A6779",
  health: "#3FD0C9", // coverage / teal
  signal: "#E8A33D", // crashes / amber
  pass: "#4CC38A",
  fail: "#E5484D",
  mono: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  disp: "'Space Grotesk', system-ui, sans-serif",
} as const;
