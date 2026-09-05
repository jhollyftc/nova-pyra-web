/**
 * Prepare a sponsor logo for upload to Sanity.
 *
 * Sponsor logos sit directly on a dark tile with no white plate behind them, so
 * a logo with a white background shows as a white box. Sanity's image CDN
 * resizes and reformats but will not remove a background, so that has to happen
 * before upload.
 *
 * A global white colour key is NOT safe: Chipotle's lettering is white and would
 * be punched into holes, and the Yacht Club pennant would lose its "P". This
 * flood-fills inward from the border instead, so only background connected to an
 * edge is cleared and white enclosed by artwork survives. It also trims to the
 * content box, which matters — one supplied logo was 600x600 of mostly empty
 * margin and became 408x120.
 *
 * Usage:
 *   node scripts/clean-logo.mjs <file> [more files...]
 *
 * Writes <name>-clean.png beside each input. Upload that to the Studio.
 * Always prefer asking the sponsor for a transparent PNG or an SVG first.
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

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
      code === 0
        ? resolve(Buffer.concat(out))
        : reject(new Error(`${cmd} exited ${code}: ${err.slice(-600)}`)),
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

/** Clear background-coloured pixels reachable from the border. Iterative stack. */
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

/** Bounding box of surviving pixels, with a little breathing room. */
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
 * Share of artwork bright enough to read against the dark tile.
 *
 * Mean luminance is the wrong test — Chipotle's mean is dark because of its red
 * ring, yet it reads perfectly on black thanks to its white lettering.
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

async function clean(file) {
  if (!existsSync(file)) {
    console.error(`  not found: ${file}`);
    return;
  }
  if (file.endsWith(".svg")) {
    console.log(`  ${path.basename(file)} is already a vector — upload it as-is.`);
    return;
  }

  const { w, h } = await probeSize(file);
  const raw = await capture("ffmpeg", ["-v", "error", "-i", file,
    "-vf", "format=rgba", "-frames:v", "1", "-f", "rawvideo", "-"]);
  const px = Buffer.from(raw);

  floodFillFromEdges(px, w, h);
  const box = contentBox(px, w, h);
  const bright = brightShare(px, w, h);

  const out = path.join(
    path.dirname(file),
    `${path.basename(file, path.extname(file))}-clean.png`,
  );
  await capture("ffmpeg", ["-y", "-v", "error",
    "-f", "rawvideo", "-pix_fmt", "rgba", "-s", `${w}x${h}`, "-i", "pipe:0",
    "-vf", `crop=${box.w}:${box.h}:${box.x}:${box.y}`,
    "-c:v", "png", "-pix_fmt", "rgba", out], px);

  const warn = bright < BRIGHT_SHARE_FLOOR
    ? "  <-- CHECK: may be too dark to read on the tile"
    : "";
  console.log(
    `  ${path.basename(file)}  ${w}x${h} -> ${box.w}x${box.h} · ` +
    `${Math.round(bright * 100)}% bright${warn}\n     wrote ${out}`,
  );
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Usage: node scripts/clean-logo.mjs <file> [more files...]");
  process.exit(1);
}
for (const f of files) await clean(f);
