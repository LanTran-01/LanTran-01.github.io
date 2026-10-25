/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// `base: "./"` keeps the build relocatable: dist/ works from any sub-path
// (for example www.lantran.dev/arcana/) as well as from `vite preview`.
export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  build: {
    outDir: "dist",
    assetsDir: "static",
  },
  server: { port: 5174, strictPort: false },
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
