/**
 * Copy the HIVE Shot Envelope simulator into the site, correcting its document
 * head on the way through.
 *
 * The sim is authored as one self-contained HTML file and is iterated on
 * outside this repo. It is copied rather than ported: it is 1400 lines of
 * projectile integration, envelope solving and three.js, it owns the full
 * viewport by design, and rewriting it as React components would fork the
 * team's tool and put its physics at risk for no gain the visitor can see.
 *
 * This runs it through a fixer rather than a plain copy because the source
 * file has no document head at all — it opens straight at `<title>`. That
 * works when you double-click it and is wrong on a server:
 *
 *   - No DOCTYPE puts the browser in quirks mode.
 *   - No charset, with UTF-8 throughout, leaves the encoding to whatever the
 *     host happens to send.
 *   - No viewport meta means a phone lays the page out at ~980px and zooms
 *     out, so the sim's own 760px breakpoint can never fire. Its mobile
 *     layout exists and was simply never reachable.
 *
 * Fixing it here rather than by hand means a re-sync after the team edits the
 * simulator never loses the corrections. They are worth fixing at source too.
 *
 * Usage:
 *   node scripts/sync-shot-sim.mjs
 *   node scripts/sync-shot-sim.mjs "D:/some/other/index.html"
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import os from "node:os";

const SOURCE =
  process.argv[2] ??
  path.join(os.homedir(), "Desktop", "nova-pyra-shot-sim", "index.html");

const DEST = path.resolve("public/tools/shot-sim/index.html");

const HEAD = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="An interactive model of every launch angle and exit speed that scores in the BIOBUZZ HIVE, built by FTC Team 25619 Nova Pyra.">
<meta name="theme-color" content="#14161A">
`;

/**
 * A way back to the site.
 *
 * The simulator is served at its own URL outside the site's header and footer,
 * because it sizes itself to the viewport and nesting it in a page with chrome
 * of its own would give it two headers and a scrollbar inside a scrollbar. The
 * cost of that is a visitor who follows a shared link to it has no way back,
 * so the tool's own header gets one. Styled from the sim's tokens, not Nova
 * Pyra's — inside this document its design system is the one that applies.
 */
const BACK_LINK = `<a href="/season" style="margin-left:auto;font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink-3);text-decoration:none;border-bottom:1px solid var(--hairline);padding-bottom:2px">&larr; Nova Pyra</a>`;

const src = await readFile(SOURCE, "utf8");

if (/<!doctype/i.test(src)) {
  console.warn("Source already has a DOCTYPE — check this script is still needed.");
}

let out = HEAD + src;

// Close the head at the first element that belongs in the body. The source
// puts <title>, <link> and <script> at the top, then goes straight into
// <header>, so that tag is the boundary.
const bodyStart = out.indexOf("<header>");
if (bodyStart === -1) throw new Error("Could not find <header> — the sim's structure changed.");
out = out.slice(0, bodyStart) + "</head>\n<body>\n" + out.slice(bodyStart);

// The sim's header ends with a `spacer` element that already pushes content
// right; the back link goes after it so it lands at the far edge.
const stamp = /(<span class="spacer eyebrow" id="geomStamp">[^<]*<\/span>)/;
if (!stamp.test(out)) throw new Error("Could not find the header stamp — the sim's structure changed.");
out = out.replace(stamp, `$1\n  ${BACK_LINK}`);

out += "\n</body>\n</html>\n";

await mkdir(path.dirname(DEST), { recursive: true });
await writeFile(DEST, out, "utf8");

console.log(`${SOURCE}\n  → ${DEST}`);
console.log(`${(Buffer.byteLength(out) / 1024).toFixed(0)} KB · doctype, charset, viewport and back link added`);
