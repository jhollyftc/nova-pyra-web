/**
 * Screenshot the running site so changes can be judged by looking at them.
 *
 * This exists because the rest of the verification in this repo — tsc, eslint,
 * `next build`, check-assets — proves the site WORKS and says nothing about
 * whether it looks right. Layout and motion work was being shipped on
 * reasoning alone. A hero that lands two pixels under the fold, a grid that
 * moires against another grid, an animation that never fires: all of it passes
 * every other check.
 *
 * Drives the copy of Chrome already installed on the machine via
 * `channel: "chrome"`, so `playwright-core` is the only dependency and no
 * browser is downloaded.
 *
 * Scroll positions matter as much as routes here: most of this site's motion
 * is scroll-driven, and a screenshot at the top of the page shows none of it.
 * Each shot scrolls, waits for the animation to settle, and then captures.
 *
 * Usage:
 *   node scripts/shoot.mjs                        # desktop, key routes
 *   node scripts/shoot.mjs --mobile               # 390x844
 *   node scripts/shoot.mjs --reduced              # prefers-reduced-motion
 *   node scripts/shoot.mjs --routes=/,/season     # specific routes
 *   node scripts/shoot.mjs --full                 # full-page, no scroll series
 *   PORT=3111 node scripts/shoot.mjs
 */
import { chromium } from "playwright-core";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";

const PORT = process.env.PORT ?? "3111";
const BASE = `http://localhost:${PORT}`;
const OUT = path.resolve("screenshots");

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f) => args.find((a) => a.startsWith(`${f}=`))?.split("=").slice(1).join("=");

const mobile = has("--mobile");
const reduced = has("--reduced");
const fullPage = has("--full");

const routes = (val("--routes") ?? "/,/robot,/season,/impact,/team,/sponsors/join")
  .split(",")
  .map((r) => r.trim())
  .filter(Boolean);

/**
 * Where to stop on the way down. Fractions of the scrollable height rather
 * than pixels, so the same series is meaningful on a short page and a long one.
 */
const STOPS = [0, 0.12, 0.3, 0.55, 0.85];

const slug = (r) => (r === "/" ? "home" : r.replace(/^\//, "").replace(/\//g, "-"));

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({
  viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  isMobile: mobile,
  hasTouch: mobile,
});

// Emulating this is the only way to check the reduced-motion path renders at
// all — every animated component branches on it, so half the code is otherwise
// never exercised by any check in this repo.
await page.emulateMedia({ reducedMotion: reduced ? "reduce" : "no-preference" });

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const suffix = [mobile ? "mobile" : "desktop", reduced ? "reduced" : null]
  .filter(Boolean)
  .join("-");

const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(`${page.url()} — ${m.text()}`);
});
page.on("pageerror", (e) => errors.push(`${page.url()} — ${e.message}`));

for (const route of routes) {
  const res = await page.goto(BASE + route, { waitUntil: "load" });
  if (!res?.ok()) {
    errors.push(`${route} — HTTP ${res?.status()}`);
    continue;
  }
  // Fonts settle late and shift every heading when they land.
  await page.evaluate(() => document.fonts.ready);

  if (fullPage) {
    await page.waitForTimeout(900);
    await page.screenshot({
      path: path.join(OUT, `${slug(route)}-${suffix}-full.png`),
      fullPage: true,
    });
    console.log(`${route} → full`);
    continue;
  }

  const height = await page.evaluate(
    () => document.documentElement.scrollHeight - window.innerHeight,
  );

  for (const [i, stop] of STOPS.entries()) {
    const y = Math.round(height * stop);
    await page.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), y);
    // Long enough for a whileInView reveal (~600-850ms) to finish. Without
    // this every card is caught mid-fade and every shot looks broken.
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(OUT, `${slug(route)}-${suffix}-${i}-y${y}.png`),
    });
  }
  console.log(`${route} → ${STOPS.length} shots (scroll height ${height}px)`);
}

await browser.close();

if (errors.length) {
  console.log(`\n${errors.length} console/page error(s):`);
  for (const e of errors) console.log("  " + e);
} else {
  console.log("\nno console errors");
}
console.log(`\nwrote to ${OUT}`);
