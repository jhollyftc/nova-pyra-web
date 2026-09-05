/**
 * Verify every asset a page references actually resolves.
 *
 * Catches two things the type checker cannot: a Sanity image that failed to
 * upload or was deleted from the dataset, and a file referenced from public/
 * that is missing or misspelled. Casing bugs used to be the common case —
 * `/images/Sponsors/MO.png` resolves on Windows and 404s on Vercel's Linux
 * hosts — which is how twelve broken sponsor logos were found.
 *
 * Run it against a dev or start server:
 *   npm run check:assets            # localhost:3000
 *   PORT=3111 npm run check:assets
 */
const BASE = `http://localhost:${process.env.PORT ?? 3000}`;

const ROUTES = [
  "/", "/robot", "/engineering", "/team", "/impact",
  "/season", "/awards", "/sponsors", "/sponsors/join",
];

const seen = new Map();
let ok = 0;
let bad = 0;

for (const route of ROUTES) {
  let html;
  try {
    html = await (await fetch(BASE + route)).text();
  } catch {
    console.error(`\nNo server at ${BASE} — start one with \`npm run dev\` first.`);
    process.exit(1);
  }

  // Remote images go through Next's optimiser; hitting that URL exercises the
  // whole chain (Sanity CDN fetch, optimisation, delivery) rather than just
  // checking a string.
  for (const m of html.matchAll(/\/_next\/image\?url=[^"'\s]+/g)) {
    seen.set(m[0].replace(/&amp;/g, "&"), route);
  }
  // Direct references to files in public/ — the GLB models, mainly.
  for (const m of html.matchAll(
    /(?:src|href|poster)="(\/[^"]+?\.(?:png|jpe?g|svg|mp4|webm|glb|pdf))"/gi,
  )) {
    seen.set(m[1], route);
  }
}

for (const [url, route] of seen) {
  const res = await fetch(BASE + url);
  if (res.ok) ok++;
  else {
    console.log(`  ${res.status}  ${route}  ${url.slice(0, 120)}`);
    bad++;
  }
}

console.log(`\n${ok} assets ok, ${bad} broken, across ${ROUTES.length} routes`);
process.exit(bad === 0 ? 0 : 1);
