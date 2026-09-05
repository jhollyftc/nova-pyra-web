"use client";

import { useReducedMotion } from "framer-motion";
import type { VideoSources } from "@/lib/media";

type Props = {
  sources: VideoSources;
  className?: string;
  /** Decorative loops get aria-hidden; anything meaningful must pass a label. */
  label?: string;
  priority?: boolean;
  /**
   * Screen-blend the clip so a pure-black background drops out.
   *
   * The team logo GIF is bright artwork on opaque black (verified: RGB 0,0,0 at
   * alpha 255 — there is no transparency to preserve), so as a plain video it
   * punches a black rectangle through the hero's dot grid and glow. Screen
   * blending maps black to transparent and leaves the bright artwork untouched.
   *
   * Only use this on black-backed artwork. It would wash out photographic clips
   * such as the match footage on /robot.
   *
   * Caveat for callers: an ancestor with a transform, filter, or opacity below
   * 1 creates a stacking context that traps the blend and the black background
   * becomes visible. That rules out fade-in and slide-in entrances on any
   * wrapper — render a blended clip immediately instead of animating it in.
   */
  blend?: boolean;
};

/**
 * The only way video reaches the page. Never render a bare <video> or a GIF.
 *
 * Under `prefers-reduced-motion: reduce` this degrades to the poster frame, so
 * motion-sensitive visitors get a still image rather than a looping animation.
 */
export default function Video({ sources, className, label, priority, blend }: Props) {
  const reduced = useReducedMotion();
  // The poster frame carries the same black background, so it blends too.
  const blendStyle = blend ? { mixBlendMode: "screen" as const } : undefined;

  if (reduced) {
    // eslint-disable-next-line @next/next/no-img-element -- poster is a fixed local asset
    return (
      <img
        src={sources.poster}
        alt={label ?? ""}
        aria-hidden={label ? undefined : true}
        className={className}
        style={blendStyle}
      />
    );
  }

  return (
    <video
      className={className}
      style={blendStyle}
      poster={sources.poster}
      autoPlay
      muted
      loop
      playsInline
      preload={priority ? "auto" : "metadata"}
      aria-hidden={label ? undefined : true}
      aria-label={label}
    >
      <source src={sources.webm} type="video/webm" />
      <source src={sources.mp4} type="video/mp4" />
    </video>
  );
}
