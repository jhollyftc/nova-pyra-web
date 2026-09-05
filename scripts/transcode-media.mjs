/**
 * Phase 0 — media pipeline.
 *
 * ftc-pit-app/public is 364 MB, 303 MB of which is 13 GIFs (teleop.gif alone is 42 MB).
 * That is fine for a local Electron kiosk and unusable on the web. This script is the
 * only thing that should ever move assets across; never hand-copy from the pit app.
 *
 *   GIF   -> MP4 (h264) + WebM (VP9) + JPEG poster, capped at 1280px wide
 *   still -> copied with a lowercased path (three files in the pit app are .JPG but are
 *            referenced lowercase, which works on Windows and 404s on Vercel's Linux hosts)
 *   GLB   -> copied as-is; loaded lazily behind a button, never on page load
 *
 * Usage: npm run media
 */
import { spawn } from "node:child_process";
import { mkdir, readdir, copyFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import processLogos from "./process-logos.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(HERE, "../../ftc-pit-app/public");
const OUT = path.resolve(HERE, "../public");
/** Originals supplied directly by the team, not sourced from the pit app. */
const LOCAL = path.resolve(HERE, "../assets-src");

const MAX_WIDTH = 1280;

/** Stills we deliberately do not carry over: create-next-app boilerplate. */
const SKIP = new Set(["file.svg", "globe.svg", "next.svg", "vercel.svg", "window.svg"]);

/** Raster stills get a downscale pass. SVG and GLB are copied untouched. */
const STILL = /\.(png|jpe?g)$/;

const run = (cmd, args) =>
  new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: ["ignore", "ignore", "pipe"] });
    let err = "";
    p.stderr.on("data", (d) => (err += d));
    p.on("error", reject);
    p.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}\n${err.slice(-1500)}`)),
    );
  });

/** Like `run`, but captures stdout as a Buffer (for probing pixel data). */
const runCapture = (cmd, args) =>
  new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    const chunks = [];
    let err = "";
    p.stdout.on("data", (d) => chunks.push(d));
    p.stderr.on("data", (d) => (err += d));
    p.on("error", reject);
    p.on("close", (code) =>
      code === 0
        ? resolve({ stdout: Buffer.concat(chunks) })
        : reject(new Error(`${cmd} exited ${code}\n${err.slice(-800)}`)),
    );
  });

const mb = (bytes) => `${(bytes / 1048576).toFixed(1)} MB`;
const sizeOf = async (f) => (await stat(f)).size;

/** Recursively list files relative to `dir`. */
async function walk(dir, base = dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full, base)));
    else out.push(path.relative(base, full));
  }
  return out;
}

/**
 * Lowercase every path segment. Fixes images/Events/PES.JPG and the two
 * evolution/*.JPG files, whose JSON references are already lowercase.
 */
const normalize = (rel) => rel.split(path.sep).join("/").toLowerCase();

// `scale` keeps aspect ratio and forces even dimensions, which yuv420p requires.
const SCALE = `scale='min(${MAX_WIDTH},iw)':-2:flags=lanczos`;

async function transcodeGif(srcFile, outBase) {
  const mp4 = `${outBase}.mp4`;
  const webm = `${outBase}.webm`;
  const poster = `${outBase}.jpg`;

  // -an: these are GIFs, there is no audio to carry and an empty track confuses Safari.
  await run("ffmpeg", ["-y", "-i", srcFile, "-vf", SCALE, "-c:v", "libx264", "-crf", "26",
    "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", mp4]);

  // GIF carries an alpha channel, so scaling yields gbrap, which libvpx-vp9 refuses.
  // Force yuv420p to match the h264 pass above.
  await run("ffmpeg", ["-y", "-i", srcFile, "-vf", SCALE, "-c:v", "libvpx-vp9", "-crf", "34",
    "-b:v", "0", "-row-mt", "1", "-deadline", "good", "-cpu-used", "3",
    "-pix_fmt", "yuv420p", "-an", webm]);

  await run("ffmpeg", ["-y", "-i", srcFile, "-vf", SCALE, "-frames:v", "1", "-q:v", "4", poster]);

  return { mp4, webm, poster };
}

/**
 * Does this image already carry real transparency?
 *
 * A PNG can be rgba and still be fully opaque, so the pixel data has to be
 * checked rather than the pixel format. Decoded small — enough to answer the
 * question without reading a full-size frame.
 */
async function hasAlpha(file) {
  const { stdout } = await runCapture("ffmpeg", ["-v", "error", "-i", file,
    "-vf", "scale=80:-1,format=rgba", "-frames:v", "1", "-f", "rawvideo", "-"]);
  for (let i = 3; i < stdout.length; i += 4) if (stdout[i] < 250) return true;
  return false;
}

/**
 * Team-supplied originals in assets-src/.
 *
 * The robot photo is only keyed if it still has an opaque studio background.
 * The first version arrived on flat #DFDFDF; once that is knocked out upstream,
 * keying again would be destructive, so it is skipped. When keying is needed,
 * similarity stays at 0.08 — at 0.16 it starts eating the robot's own silver
 * aluminium frame.
 */
async function processLocalAssets() {
  const imagesOut = path.join(OUT, "images");
  await mkdir(imagesOut, { recursive: true });

  const robotSrc = path.join(LOCAL, "robot.png");
  const robotOut = path.join(imagesOut, "robot-drakos.png");
  const alreadyCut = await hasAlpha(robotSrc);
  const scale = "scale='min(900,iw)':-2:flags=lanczos";

  process.stdout.write(
    alreadyCut ? "  robot.png (already transparent) ... " : "  keying  robot.png ... ",
  );
  await run("ffmpeg", ["-y", "-i", robotSrc,
    "-vf", alreadyCut ? scale : `colorkey=0xDFDFDF:0.08:0.06,${scale}`,
    "-c:v", "png", "-pix_fmt", "rgba", robotOut]);
  console.log(`${mb(await sizeOf(robotOut))}  -> /images/robot-drakos.png`);

  // The original has a lot of empty boardwalk under the team; crop it back so
  // the people fill the frame at a 16:9-ish ratio.
  const teamSrc = path.join(LOCAL, "team-photo.jpg");
  const teamOut = path.join(imagesOut, "team-photo.jpg");
  process.stdout.write("  cropping team-photo.jpg ... ");
  await run("ffmpeg", ["-y", "-i", teamSrc,
    "-vf", "crop=iw:ih*0.80:0:0,scale='min(1600,iw)':-2:flags=lanczos", "-q:v", "3", teamOut]);
  console.log(`${mb(await sizeOf(teamOut))}  -> /images/team-photo.jpg`);
}

async function main() {
  const files = await walk(SRC);
  const manifest = { videos: {}, generated: new Date().toISOString() };
  let srcTotal = 0;
  let outTotal = 0;

  for (const rel of files) {
    const srcFile = path.join(SRC, rel);
    const bytes = await sizeOf(srcFile);
    srcTotal += bytes;

    const norm = normalize(rel);
    const name = path.basename(norm);
    if (SKIP.has(name)) continue;

    // Draco decoder ships beside the models; keep its exact casing-free layout.
    const isGif = norm.endsWith(".gif");
    const dest = path.join(OUT, isGif ? path.join("media", path.basename(norm, ".gif")) : norm);

    await mkdir(path.dirname(dest), { recursive: true });

    if (isGif) {
      const key = path.basename(norm, ".gif");
      process.stdout.write(`  transcoding ${norm} (${mb(bytes)}) ... `);
      const { mp4, webm, poster } = await transcodeGif(srcFile, dest);
      const after = (await sizeOf(mp4)) + (await sizeOf(webm)) + (await sizeOf(poster));
      outTotal += after;
      manifest.videos[key] = {
        mp4: `/media/${key}.mp4`,
        webm: `/media/${key}.webm`,
        poster: `/media/${key}.jpg`,
      };
      console.log(`${mb(after)}  (-${(100 - (after / bytes) * 100).toFixed(0)}%)`);
    } else if (STILL.test(norm)) {
      // Downscale oversized stills. Next/Image re-optimizes at request time, but
      // there is no reason to keep a 1.6 MB sponsor logo in the repo.
      const cap = norm.includes("/sponsors/") ? 600 : norm.includes("/members/") ? 900 : 1600;
      await run("ffmpeg", ["-y", "-i", srcFile,
        "-vf", `scale='min(${cap},iw)':-2:flags=lanczos`, "-q:v", "3", dest]);
      const after = await sizeOf(dest);
      outTotal += after;
      if (after < bytes * 0.9) console.log(`  resized  ${norm}  ${mb(bytes)} -> ${mb(after)}`);
    } else {
      await copyFile(srcFile, dest);
      outTotal += bytes;
    }
  }

  await processLocalAssets();

  // Last: sponsor logos need the originals already copied into public/.
  await processLogos();

  await writeFile(path.join(OUT, "media", "manifest.json"), JSON.stringify(manifest, null, 2));

  console.log(`\n  source: ${mb(srcTotal)}`);
  console.log(`  output: ${mb(outTotal)}`);
  console.log(`  saved:  ${mb(srcTotal - outTotal)}\n`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
