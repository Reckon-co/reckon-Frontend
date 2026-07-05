import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" so the same build works on GitHub Pages subpaths
// and inside the single-file report (issue #45).
export default defineConfig({
  plugins: [react()],
  base: "./",
});
