#!/usr/bin/env node
/**
 * Copies explorer/dist into the repository root so GitHub Pages can serve the
 * site from `main` without a build step in CI.
 *
 * Only paths listed in the previous manifest (plus the new build) are touched;
 * CNAME, README.md, .git and explorer/ itself are never removed.
 */
import { cpSync, existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const explorer = resolve(here, "..");
const dist = join(explorer, "dist");
const root = resolve(explorer, "..");
const manifestPath = join(root, ".site-manifest.json");
const PROTECTED = new Set(["CNAME", "README.md", ".git", ".gitignore", "explorer", ".site-manifest.json", ".nojekyll"]);

if (!existsSync(join(dist, "index.html"))) {
  console.error("dist/index.html missing — run `npm run build` first.");
  process.exit(1);
}

// 1. remove what the previous publish wrote
if (existsSync(manifestPath)) {
  const previous = JSON.parse(readFileSync(manifestPath, "utf8"));
  for (const entry of previous.entries ?? []) {
    if (PROTECTED.has(entry)) continue;
    rmSync(join(root, entry), { recursive: true, force: true });
  }
}

// 2. copy the new build
const entries = readdirSync(dist);
for (const entry of entries) {
  if (PROTECTED.has(entry)) {
    console.warn(`skipping protected path in dist: ${entry}`);
    continue;
  }
  cpSync(join(dist, entry), join(root, entry), { recursive: true });
}

// 3. SPA fallback: GitHub Pages serves 404.html (with HTTP 404) for paths such as
//    /explore/head. Bounce to the index with the path in ?redirect= so the page the
//    visitor lands on is a clean 200; index.html restores the URL before React boots.
writeFileSync(
  join(root, "404.html"),
  `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Redirecting…</title>
<script>
  var p = location.pathname + location.search + location.hash;
  location.replace("/?redirect=" + encodeURIComponent(p));
</script>
</head>
<body><a href="/">Continue to the explorer</a></body>
</html>
`,
);
writeFileSync(join(root, ".nojekyll"), "");

const written = [...entries.filter((e) => !PROTECTED.has(e)), "404.html"];
writeFileSync(manifestPath, JSON.stringify({ note: "Written by explorer/scripts/publish.mjs", entries: written }, null, 2) + "\n");
console.log(`published ${written.length} entries to ${root}: ${written.join(", ")}`);
