#!/usr/bin/env node
/**
 * Headless screenshot + console check.
 *
 *   node scripts/shot.mjs <url> <out.png> [options]
 *
 * Options:
 *   --w 1440 --h 900       viewport (use --w 390 --h 844 --mobile for phones)
 *   --mobile               touch + mobile UA
 *   --wait 2500            ms to wait after load (after network idle)
 *   --click "x,y"          click at viewport coords (repeatable; executed in order)
 *   --clicksel "css"       click the first element matching a selector (repeatable)
 *   --drag "x1,y1,x2,y2"   left-drag (orbit) between two points
 *   --wheel "x,y,dy"       mouse-wheel at a point
 *   --hover "x,y"          move pointer to a point
 *   --eval "js"            evaluate JS in the page; result is printed
 *   --step-wait 900        ms to wait after each interaction
 *
 * Prints every console error / page error / failed request. Exit code 2 when any occurred.
 */
import { chromium } from "playwright";

const [, , url, out, ...rest] = process.argv;
if (!url || !out) {
  console.error("usage: node scripts/shot.mjs <url> <out.png> [--w --h --mobile --wait --click --clicksel --drag --wheel --hover --eval]");
  process.exit(1);
}

const opts = { w: 1440, h: 900, wait: 2500, stepWait: 900, mobile: false, actions: [] };
for (let i = 0; i < rest.length; i++) {
  const k = rest[i];
  const v = rest[i + 1];
  switch (k) {
    case "--w": opts.w = +v; i++; break;
    case "--h": opts.h = +v; i++; break;
    case "--wait": opts.wait = +v; i++; break;
    case "--step-wait": opts.stepWait = +v; i++; break;
    case "--mobile": opts.mobile = true; break;
    case "--click": case "--clicksel": case "--drag": case "--wheel": case "--hover": case "--eval":
      opts.actions.push([k.slice(2), v]); i++; break;
    default: console.error("unknown option", k); process.exit(1);
  }
}

const browser = await chromium.launch({
  args: ["--ignore-gpu-blocklist", "--enable-webgl", "--use-angle=metal", "--enable-unsafe-swiftshader"],
});
const context = await browser.newContext({
  viewport: { width: opts.w, height: opts.h },
  deviceScaleFactor: opts.mobile ? 2 : 1,
  isMobile: opts.mobile,
  hasTouch: opts.mobile,
});
const page = await context.newPage();
const problems = [];
page.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning") problems.push(`[console.${m.type()}] ${m.text()}`);
});
page.on("pageerror", (e) => problems.push(`[pageerror] ${e.message}`));
page.on("requestfailed", (r) => problems.push(`[requestfailed] ${r.url()} ${r.failure()?.errorText}`));
page.on("response", (r) => {
  if (r.status() >= 400 && !r.url().endsWith("favicon.ico")) problems.push(`[http ${r.status()}] ${r.url()}`);
});

await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(opts.wait);

for (const [kind, arg] of opts.actions) {
  if (kind === "click") {
    const [x, y] = arg.split(",").map(Number);
    await page.mouse.click(x, y);
  } else if (kind === "clicksel") {
    await page.locator(arg).first().click();
  } else if (kind === "hover") {
    const [x, y] = arg.split(",").map(Number);
    await page.mouse.move(x, y, { steps: 4 });
  } else if (kind === "drag") {
    const [x1, y1, x2, y2] = arg.split(",").map(Number);
    await page.mouse.move(x1, y1);
    await page.mouse.down();
    await page.mouse.move(x2, y2, { steps: 12 });
    await page.mouse.up();
  } else if (kind === "wheel") {
    const [x, y, dy] = arg.split(",").map(Number);
    await page.mouse.move(x, y);
    await page.mouse.wheel(0, dy);
  } else if (kind === "eval") {
    const r = await page.evaluate(arg);
    console.log("[eval]", JSON.stringify(r));
  }
  await page.waitForTimeout(opts.stepWait);
}

await page.screenshot({ path: out });
const gl = await page.evaluate(() => {
  const c = document.createElement("canvas");
  const g = c.getContext("webgl2");
  if (!g) return "no-webgl2";
  const ext = g.getExtension("WEBGL_debug_renderer_info");
  return ext ? g.getParameter(ext.UNMASKED_RENDERER_WEBGL) : "webgl2";
});
console.log(`[shot] ${out} (${opts.w}x${opts.h}) renderer=${gl}`);
for (const p of problems) console.log(p);
await browser.close();
process.exit(problems.some((p) => !p.startsWith("[console.warning]")) ? 2 : 0);
