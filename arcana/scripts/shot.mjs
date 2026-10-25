#!/usr/bin/env node
/**
 * Headless screenshot + console check (adapted from explorer/scripts/shot.mjs).
 *
 *   node scripts/shot.mjs <url> <out.png> [options]
 *
 * Options:
 *   --w 1440 --h 900       viewport (use --w 390 --h 844 --mobile for phones)
 *   --mobile               touch + mobile UA
 *   --full                 capture the full scrollable page
 *   --reduced              emulate prefers-reduced-motion: reduce
 *   --wait 800             ms to wait after load
 *   --click "x,y"          click at viewport coords (repeatable; executed in order)
 *   --clicksel "css"       click the first element matching a selector (repeatable)
 *   --press "Key"          keyboard press, e.g. Tab, Enter (repeatable)
 *   --type "text"          type text into the focused element
 *   --eval "js"            evaluate JS in the page; result is printed
 *   --step-wait 900        ms to wait after each interaction
 *
 * Prints every console error / page error / failed request. Exit code 2 when any occurred.
 */
import { chromium } from "playwright";

const [, , url, out, ...rest] = process.argv;
if (!url || !out) {
  console.error("usage: node scripts/shot.mjs <url> <out.png> [--w --h --mobile --full --reduced --wait --click --clicksel --press --type --eval]");
  process.exit(1);
}

const opts = { w: 1440, h: 900, wait: 800, stepWait: 900, mobile: false, full: false, reduced: false, actions: [] };
for (let i = 0; i < rest.length; i++) {
  const k = rest[i];
  const v = rest[i + 1];
  switch (k) {
    case "--w": opts.w = +v; i++; break;
    case "--h": opts.h = +v; i++; break;
    case "--wait": opts.wait = +v; i++; break;
    case "--step-wait": opts.stepWait = +v; i++; break;
    case "--mobile": opts.mobile = true; break;
    case "--full": opts.full = true; break;
    case "--reduced": opts.reduced = true; break;
    case "--click": case "--clicksel": case "--press": case "--type": case "--eval":
      opts.actions.push([k.slice(2), v]); i++; break;
    default: console.error("unknown option", k); process.exit(1);
  }
}

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: opts.w, height: opts.h },
  deviceScaleFactor: opts.mobile ? 2 : 1,
  isMobile: opts.mobile,
  hasTouch: opts.mobile,
  reducedMotion: opts.reduced ? "reduce" : "no-preference",
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
  } else if (kind === "press") {
    await page.keyboard.press(arg);
  } else if (kind === "type") {
    await page.keyboard.type(arg);
  } else if (kind === "eval") {
    const r = await page.evaluate(arg);
    console.log("[eval]", JSON.stringify(r));
  }
  await page.waitForTimeout(opts.stepWait);
}

await page.screenshot({ path: out, fullPage: opts.full });
console.log(`[shot] ${out} (${opts.w}x${opts.h})`);
for (const p of problems) console.log(p);
await browser.close();
process.exit(problems.some((p) => !p.startsWith("[console.warning]")) ? 2 : 0);
