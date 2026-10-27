#!/usr/bin/env node
/**
 * Assembles www.lantran.dev into the repository root, which GitHub Pages
 * serves from `main` without a CI step:
 *
 *   home/       →  /               hand-written landing page (index.html, assets/, favicon.svg)
 *   explorer/   →  /tech/gundam/   Ξ Hardware Explorer   (explorer/dist/gundam)
 *               →  /tech/cubesat/  CubeSat Systems Explorer (explorer/dist/cubesat)
 *                                  one engine, one build per machine (see explorer/machines.config.ts)
 *   arcana/     →  /tarot/         ARCANA, built with a relocatable base
 *   gundam/index.html              forwards the explorer's previous home, /gundam/, to /tech/gundam/
 *   404.html                       routes deep links (/tech/cubesat/explore/imu) back into the right app
 *
 *   node scripts/publish-site.mjs              build every app, then publish
 *   node scripts/publish-site.mjs --skip-build publish the existing dist/ folders
 *
 * Only paths recorded in .site-manifest.json by the previous publish are
 * removed, so sources (explorer/, arcana/, home/, scripts/), CNAME and README.md
 * are never touched.
 */
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, ".site-manifest.json");
const PROTECTED = new Set([
  ".git", ".gitignore", ".nojekyll", ".site-manifest.json", "CNAME", "README.md",
  "arcana", "explorer", "home", "scripts",
]);

/** `npm run build` in explorer/ builds every machine. */
const projects = ["explorer", "arcana"];
const apps = [
  { name: "explorer (gundam)", dist: join(root, "explorer", "dist", "gundam"), target: "tech/gundam" },
  { name: "explorer (cubesat)", dist: join(root, "explorer", "dist", "cubesat"), target: "tech/cubesat" },
  { name: "arcana", dist: join(root, "arcana", "dist"), target: "tarot" },
];

if (!process.argv.includes("--skip-build")) {
  for (const project of projects) {
    console.log(`\n▸ building ${project}`);
    const r = spawnSync("npm", ["run", "build"], { cwd: join(root, project), stdio: "inherit" });
    if (r.status !== 0) {
      console.error(`${project} build failed; nothing was published.`);
      process.exit(r.status ?? 1);
    }
  }
}

for (const app of apps) {
  if (!existsSync(join(app.dist, "index.html"))) {
    console.error(`${app.name}: ${app.dist}/index.html is missing. Run without --skip-build.`);
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
  const target = join(root, app.target);
  rmSync(target, { recursive: true, force: true });
  mkdirSync(dirname(target), { recursive: true });
  cpSync(app.dist, target, { recursive: true });
}

// 4. /gundam/ was the explorer's home before the Tech section; forward it (and its
//    query and hash) to /tech/gundam/. Deeper /gundam/… paths go through 404.html.
mkdirSync(join(root, "gundam"), { recursive: true });
writeFileSync(
  join(root, "gundam", "index.html"),
  `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Moved to /tech/gundam/</title>
<link rel="canonical" href="/tech/gundam/" />
<meta name="robots" content="noindex" />
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#080808;color:#a6a6a6;font:14px system-ui,sans-serif}a{color:#f5f5f5}</style>
<script>
  (function () {
    var r = new URLSearchParams(location.search).get("redirect");
    if (r && /^\\/gundam(\\/|$)/.test(r)) location.replace("/tech/gundam/?redirect=" + encodeURIComponent("/tech" + r));
    else location.replace("/tech/gundam/" + location.search + location.hash);
  })();
</script>
<noscript><meta http-equiv="refresh" content="0; url=/tech/gundam/" /></noscript>
</head>
<body><p><a href="/tech/gundam/">The Ξ Hardware Explorer has moved to /tech/gundam/</a></p></body>
</html>
`,
);

// 5. 404.html: GitHub Pages serves it (with HTTP 404) for any path without a file.
//    Explorer deep links bounce to /tech/<machine>/?redirect=<path>; the explorer's
//    index.html restores the URL before the router starts. Older explorer URLs
//    (/explore/…, /systems, then /gundam/…) are forwarded to /tech/gundam/…, and
//    /tech itself opens the Tech section of the home page.
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
    if (/^\\/(explore|systems)(\\/|$)/.test(path)) path = "/tech/gundam" + path;
    else if (/^\\/(gundam|cubesat)(\\/|$)/.test(path)) path = "/tech" + path;
    var app = path.match(/^\\/tech\\/(gundam|cubesat)(\\/|$)/);
    if (app) location.replace("/tech/" + app[1] + "/?redirect=" + encodeURIComponent(path + rest));
    else if (/^\\/tech\\/?$/.test(path)) location.replace("/#tech");
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

const written = ["index.html", "favicon.svg", "assets", "tech", "tarot", "gundam", "404.html"];
writeFileSync(manifestPath, JSON.stringify({ note: "Written by scripts/publish-site.mjs", entries: written }, null, 2) + "\n");
console.log(`\npublished ${written.join(", ")} to ${root}`);
