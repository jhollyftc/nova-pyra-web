import manifest from "@/public/media/manifest.json";

export type VideoSources = { mp4: string; webm: string; poster: string };

const videos = manifest.videos as Record<string, VideoSources>;

/**
 * Resolve a video by its original GIF stem.
 *
 * The content JSON still points at kiosk-era paths like `/images/drakos2.gif`.
 * Nothing renders a GIF on this site, so those paths are translated here to the
 * MP4/WebM/poster set produced by `npm run media`.
 */
export function video(key: string): VideoSources {
  const stem = key.replace(/^.*\//, "").replace(/\.gif$/i, "");
  const found = videos[stem];
  if (!found) throw new Error(`No transcoded video for "${key}". Run: npm run media`);
  return found;
}

export const hasVideo = (key: string) =>
  Boolean(videos[key.replace(/^.*\//, "").replace(/\.gif$/i, "")]);
