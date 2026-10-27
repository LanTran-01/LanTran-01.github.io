import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { MACHINES, resolveMachine } from "./machines.config";

// One explorer engine, one build per machine. `MACHINE=cubesat vite build`
// aliases `@machine` to src/machines/cubesat and writes dist/cubesat, served at
// www.lantran.dev/tech/cubesat/. scripts/publish-site.mjs copies each build into
// the repository root so GitHub Pages can serve it from `main` without a CI step.
const machine = resolveMachine(process.env.MACHINE);
const target = MACHINES[machine];

/** Fills the machine's title and description into index.html. */
function machineHtml(): Plugin {
  const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  return {
    name: "machine-html",
    // Before Vite's own %ENV% substitution, which would warn about unknown names.
    transformIndexHtml: {
      order: "pre",
      handler: (html) =>
        html
          .replaceAll("%MACHINE_TITLE%", escape(target.title))
          .replaceAll("%MACHINE_DESCRIPTION%", escape(target.description)),
    },
  };
}

export default defineConfig({
  base: target.base,
  publicDir: `public/${machine}`,
  plugins: [react(), machineHtml()],
  resolve: {
    alias: {
      "@machine": fileURLToPath(new URL(`./src/machines/${machine}`, import.meta.url)),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: `dist/${machine}`,
    emptyOutDir: true,
    assetsDir: "static",
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          r3f: ["@react-three/fiber", "@react-three/drei"],
        },
      },
    },
  },
  server: { port: machine === "gundam" ? 5173 : 5174, strictPort: false },
  preview: { port: machine === "gundam" ? 4173 : 4174 },
});
