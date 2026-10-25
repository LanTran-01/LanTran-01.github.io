import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// Served at www.lantran.dev/gundam/. The build is copied into /gundam by
// scripts/publish-site.mjs at the repository root, so GitHub Pages can serve it
// from `main` without a CI step.
export default defineConfig({
  base: "/gundam/",
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  build: {
    outDir: "dist",
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
  server: { port: 5173, strictPort: false },
});
