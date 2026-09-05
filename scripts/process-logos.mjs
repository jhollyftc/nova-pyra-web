/**
 * Sponsor logo normalisation.
 *
 * The supplied logos are a mess of formats: mostly opaque rasters with a white
 * background baked in, one true-alpha PNG, two white-filled SVGs, and one that
 * is a photograph of two people rather than a logo at all. Dropped onto a dark
 * page as-is, the opaque ones show as white rectangles and the white SVGs
 * disappear entirely.
 *
 * A global white colour key is NOT safe here — Chipotle's lettering is white
 * and would be punched into holes. So this does a flood fill inwards from the
 * border instead: only background connected to the edge is removed, and white
 * enclosed by the artwork survives.
 *
 * Output: every logo becomes a trimmed, transparent PNG that sits directly on
 * the page's dark tile with no white plate behind it. Runs as the last step of
 * `npm run media`, after the originals have been copied across.
 */
import { spawn } from "node:child_process";
import { readdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(HERE, "../public/images/sponsors");

/** How far from pure white still counts as background. */
const WHITE_TOLERANCE = 26;
/** Below this share of bright pixels, a logo needs a human to look at it. */
const BRIGHT_SHARE_FLOOR = 0.1;

const capture = (cmd, args, input) =>
  new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: [input ? "pipe" : "ignore", "pipe", "pipe"] });
    const out = [];
    let err = "";
    p.stdout.on("data", (d) => out.push(d));
    p.stderr.on("data", (d) => (err += d));
    p.on("error", reject);
    p.on("close", (code) =>
      code === 0 ? resolve(Buffer.concat(out)) : reject(new Error(`${cmd} ${code}: ${err.slice(-600)}`)),
    );
    if (input) {
      p.stdin.write(input);
      p.stdin.end();
    }
  });

async function probeSize(file) {
  const out = await capture("ffprobe", ["-v", "error", "-select_streams", "v:0",
    "-show_entries", "stream=width,height", "-of", "csv=p=0", file]);
  const [w, h] = out.toString().trim().split(",").map(Number);
  return { w, h };
}

const isBackgroundish = (r, g, b, a) =>
  a < 250 || (r > 255 - WHITE_TOLERANCE && g > 255 - WHITE_TOLERANCE && b > 255 - WHITE_TOLERANCE);

/**
 * Clear every background-coloured pixel reachable from the image border.
 * Iterative stack, not recursion — these are up to 600x600.
 */
function floodFillFromEdges(px, w, h) {
  const seen = new Uint8Array(w * h);
  const stack = [];

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const i = y * w + x;
    if (seen[i]) return;
    const o = i * 4;
    if (!isBackgroundish(px[o], px[o + 1], px[o + 2], px[o + 3])) return;
    seen[i] = 1;
    stack.push(i);
  };

  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }

  while (stack.length) {
    const i = stack.pop();
    const x = i % w;
    const y = (i - x) / w;
    px[i * 4 + 3] = 0;
    push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
  }
}

/** Bounding box of pixels that survived, with a little breathing room. */
function contentBox(px, w, h) {
  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (px[(y * w + x) * 4 + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return { x: 0, y: 0, w, h };
  const pad = 2;
  const x = Math.max(0, minX - pad);
  const y = Math.max(0, minY - pad);
  return {
    x, y,
    w: Math.min(w - x, maxX - minX + 1 + pad * 2),
    h: Math.min(h - y, maxY - minY + 1 + pad * 2),
  };
}

/**
 * Share of the artwork that is bright enough to read against the dark tile.
 *
 * Mean ink luminance is the wrong test — Chipotle's mean is dark because of its
 * red ring, yet it reads perfectly on black thanks to its white lettering. What
 * matters is whether *enough* of the logo is light.
 */
function brightShare(px, w, h) {
  let bright = 0, opaque = 0;
  for (let i = 0; i < w * h; i++) {
    const o = i * 4;
    if (px[o + 3] < 250) continue;
    opaque++;
    if (0.2126 * px[o] + 0.7152 * px[o + 1] + 0.0722 * px[o + 2] > 140) bright++;
  }
  return opaque ? bright / opaque : 0;
}

export default async function processLogos() {
  for (const file of readdirSync(DIR).sort()) {
    const id = file.replace(/\.[^.]+$/, "");

    // SVGs are vector and left untouched. Both of ours are filled white, which
    // is why they must sit on the dark tile — on a light one they vanish.
    if (file.endsWith(".svg")) {
      const white = /fill="(white|#fff|#ffffff)"/i.test(readFileSync(path.join(DIR, file), "utf8"));
      console.log(`  ${file.padEnd(36)} SVG · ${white ? "white artwork" : "coloured"} · untouched`);
      continue;
    }

    const src = path.join(DIR, file);
    const { w, h } = await probeSize(src);
    const raw = await capture("ffmpeg", ["-v", "error", "-i", src,
      "-vf", "format=rgba", "-frames:v", "1", "-f", "rawvideo", "-"]);
    const px = Buffer.from(raw);

    floodFillFromEdges(px, w, h);
    const box = contentBox(px, w, h);
    const bright = brightShare(px, w, h);

    const out = path.join(DIR, `${id}.png`);
    await capture("ffmpeg", ["-y", "-v", "error",
      "-f", "rawvideo", "-pix_fmt", "rgba", "-s", `${w}x${h}`, "-i", "pipe:0",
      "-vf", `crop=${box.w}:${box.h}:${box.x}:${box.y}`,
      "-c:v", "png", "-pix_fmt", "rgba", out], px);

    // Everything is served as PNG; drop the superseded source so the directory
    // does not accumulate two copies of each logo.
    if (src !== out) rmSync(src);

    const warn = bright < BRIGHT_SHARE_FLOOR ? "  <-- CHECK: may be too dark on the tile" : "";
    console.log(
      `  ${file.padEnd(36)} ${w}x${h} -> ${box.w}x${box.h} · ` +
      `${Math.round(bright * 100)}% bright${warn}`,
    );
  }
}

// pathToFileURL, not string-building: on Windows argv[1] is a drive path and a
// hand-built file:// URL has one slash too few to ever match import.meta.url.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  processLogos().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
