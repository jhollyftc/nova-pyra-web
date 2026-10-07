import Reveal from "@/components/Reveal";

/**
 * The BIOBUZZ field guide — a real video, meant to be watched with sound.
 *
 * Deliberately NOT built on `components/Video.tsx`. That component is for
 * ambient background loops: autoplay, muted, looping, degrading to a poster
 * under reduced motion because nothing it shows is information a visitor
 * would miss. This is the opposite of that — a 56-second explainer with a
 * soundtrack, narration-by-graphics, and an ending. Autoplaying it would be
 * an uninvited video blaring sound at anyone who scrolls past, and looping it
 * would restart a finished explanation as though it were wallpaper. Native
 * controls and a poster frame instead: nothing plays until someone asks it to,
 * which is also why this needs no reduced-motion branch — a video no one has
 * pressed play on is not motion happening to the visitor.
 *
 * `preload="none"`: there is a poster to look at, so no part of an 18 MB file
 * is worth fetching before someone decides to watch it.
 *
 * Single MP4, no WebM alternative. The bandwidth argument for a second,
 * smaller format is about what loads for every visitor automatically — moot
 * here, since this only downloads for someone who chose to press play.
 *
 * No copy underneath. A fact sheet about the video's own runtime and contents
 * is a note for whoever produced it, not for a sponsor or a parent looking at
 * the page — the title card and sixty seconds of narration already say what
 * it is far better than a caption could.
 */
export default function FieldGuideVideo({
  src,
  poster,
}: {
  src: string;
  poster: string | null;
}) {
  return (
    <Reveal variant="settle" className="hud-frame scanlines relative overflow-hidden bg-black">
      {/* No <track> for captions: there is no dialogue to transcribe — every
          beat is on-screen text over a music bed. */}
      <video
        src={src}
        poster={poster ?? undefined}
        controls
        playsInline
        preload="none"
        className="block aspect-video w-full"
        aria-label="BIOBUZZ field guide: a one-minute explainer of the game, built by the team"
      />
    </Reveal>
  );
}
