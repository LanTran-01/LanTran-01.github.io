#!/usr/bin/env node
/**
 * Assembles www.lantran.dev into the repository root, which GitHub Pages
 * serves from `main` without a CI step:
 *
 *   home/       →  /          hand-written landing page (index.html, assets/, favicon.svg)
 *   explorer/   →  /gundam/   Ξ Hardware Explorer, built with base /gundam/
 *   arcana/     →  /tarot/    ARCANA, built with a relocatable base
 *   404.html                  routes deep links (/gundam/explore/head) back into the right app
 *
 *   node scripts/publish-site.mjs              build both apps, then publish
 *   node scripts/publish-site.mjs --skip-build publish the existing dist/ folders
 *
 * Only paths recorded in .site-manifest.json by the previous publish are
 * removed, so sources (explorer/, arcana/, home/, scripts/), CNAME and README.md
 * are never touched.
 */
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, ".site-manifest.json");
const PROTECTED = new Set([
  ".git", ".gitignore", ".nojekyll", ".site-manifest.json", "CNAME", "README.md",
  "arcana", "explorer", "home", "scripts",
]);

const apps = [
  { name: "explorer", dist: join(root, "explorer", "dist"), target: "gundam" },
  { name: "arcana", dist: join(root, "arcana", "dist"), target: "tarot" },
];

if (!process.argv.includes("--skip-build")) {
  for (const app of apps) {
    console.log(`\n▸ building ${app.name}`);
    const r = spawnSync("npm", ["run", "build"], { cwd: join(root, app.name), stdio: "inherit" });
    if (r.status !== 0) {
      console.error(`${app.name} build failed; nothing was published.`);
      process.exit(r.status ?? 1);
    }
  }
}

for (const app of apps) {
  if (!existsSync(join(app.dist, "index.html"))) {
    console.error(`${app.name}/dist/index.html is missing. Run without --skip-build.`);
    process.exit(1);
  }
}

// 1. remove what the previous publish wrote
if (existsSync(manifestPath)) {
  const previous = JSON.parse(readFileSync(manifestPath, "utf8"));
  for (const entry of previous.entries ?? []) {
    if (PROTECTED.has(entry)) continue;
    rmSync(join(root, entry), { recursive: true, force: true });
  }
}

// 2. home page at the root
cpSync(join(root, "home", "index.html"), join(root, "index.html"));
cpSync(join(root, "home", "favicon.svg"), join(root, "favicon.svg"));
cpSync(join(root, "home", "assets"), join(root, "assets"), { recursive: true });

// 3. the apps in their folders
for (const app of apps) {
  rmSync(join(root, app.target), { recursive: true, force: true });
  cpSync(app.dist, join(root, app.target), { recursive: true });
}

// 4. 404.html: GitHub Pages serves it (with HTTP 404) for any path without a file.
//    Explorer deep links bounce to /gundam/?redirect=<path>; its index.html restores
//    the URL before the router starts. URLs from before the explorer moved
//    (/explore/…, /systems) are forwarded to their /gundam/ equivalents.
writeFileSync(
  join(root, "404.html"),
  `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Redirecting…</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#080808;color:#a6a6a6;font:14px system-ui,sans-serif}a{color:#f5f5f5}</style>
<script>
  (function () {
    var path = location.pathname;
    var rest = location.search + location.hash;
    if (/^\\/(explore|systems)(\\/|$)/.test(path)) path = "/gundam" + path;
    if (path.indexOf("/gundam/") === 0) location.replace("/gundam/?redirect=" + encodeURIComponent(path + rest));
    else if (path.indexOf("/tarot/") === 0) location.replace("/tarot/" + location.hash);
    else location.replace("/");
  })();
</script>
</head>
<body><p><a href="/">Continue to lantran.dev</a></p></body>
</html>
`,
);
writeFileSync(join(root, ".nojekyll"), "");

const written = ["index.html", "favicon.svg", "assets", ...apps.map((a) => a.target), "404.html"];
writeFileSync(manifestPath, JSON.stringify({ note: "Written by scripts/publish-site.mjs", entries: written }, null, 2) + "\n");
console.log(`\npublished ${written.join(", ")} to ${root}`);
