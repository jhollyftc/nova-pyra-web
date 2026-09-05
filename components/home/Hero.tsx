"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import Video from "@/components/Video";
import EmberField from "@/components/EmberField";
import StatCounter from "@/components/StatCounter";
import type { VideoSources } from "@/components/Video";

type Telemetry = {
  game: string;
  robot: string;
  record: string;
  /**
   * Label and value arrive together from the content layer. At the World
   * Championship a rank is within a division, not overall, so the two must be
   * written as one unit or the number ends up overstating the result.
   */
  worlds: { label: string; value: string } | null;
};

/**
 * The hero, sized to the viewport HEIGHT rather than only its width.
 *
 * Everything here used to be sized in `vw` with fixed vertical padding, so on a
 * short screen — a 1366x768 laptop, or a 1080p monitor at 125% scaling — the
 * telemetry strip and the stats fell below the fold. Width was the only thing
 * the layout reacted to, and width is not what runs out.
 *
 * So: the section claims one viewport height (minus the sticky header) and every
 * internal size is `min(Xvw, Yvh)`, which means the shorter axis wins. On a wide
 * short screen the logo and headline shrink instead of overflowing.
 *
 * The stats live in here rather than in a section below, because "both are
 * visible without scrolling" is only enforceable if they share one box. It is a
 * min-height, never a fixed height, so nothing is ever clipped — on a very short
 * window the page simply scrolls as normal.
 *
 * `svh` not `vh`: on mobile `vh` measures the viewport as if browser chrome were
 * hidden, which pushes content off-screen until the user scrolls.
 */
export default function Hero({
  logo,
  telemetry,
  tagline,
  teamName,
  teamNumber,
  location,
  stats,
}: {
  logo: VideoSources | null;
  telemetry: Telemetry;
  tagline: string;
  teamName: string;
  teamNumber: string;
  location: string;
  stats: { value: number; label: string }[];
}) {
  const reduced = useReducedMotion();

  const cells = [
    { label: "Season", value: telemetry.game },
    { label: "Robot", value: telemetry.robot },
    { label: "Record", value: telemetry.record },
    ...(telemetry.worlds ? [telemetry.worlds] : []),
  ];

  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  const ctaStyle = {
    fontFamily: "var(--font-heading)",
    fontWeight: 700,
    fontSize: "clamp(13px, 1.7vh, 15px)",
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    padding: "clamp(9px, 1.4vh, 12px) clamp(18px, 2.4vw, 24px)",
  };

  return (
    <section
      className="relative flex flex-col overflow-hidden border-b border-[var(--color-border)]"
      style={{ minHeight: "calc(100svh - var(--header-height))" }}
    >
      {/* Ground: dot grid, a single radial bloom, drifting embers */}
      <div className="dot-grid absolute inset-0" aria-hidden="true" />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 38%, rgba(17,115,241,0.20), transparent 70%)",
        }}
      />
      <EmberField className="absolute inset-0 h-full w-full" />

      <div
        className="shell relative flex flex-1 flex-col items-center justify-center text-center"
        style={{
          paddingBlock: "clamp(20px, 4vh, 64px)",
          gap: "clamp(10px, 2vh, 26px)",
        }}
      >
        <motion.p className="micro" {...rise(0.05)}>
          FIRST Tech Challenge · Team {teamNumber} · {location}
        </motion.p>

        {/*
          The logo gets NO entrance animation, deliberately.

          `mix-blend-mode` only blends against the backdrop of the nearest
          ancestor stacking context. Any wrapper with a transform, a filter, or
          opacity below 1 creates one and traps the blend — so while the logo
          faded in, its black background was briefly visible as a rectangle over
          the dot grid, snapping transparent the moment opacity reached 1.
          A `y` transform does the same thing. There is no fade that avoids this.

          It is also the LCP element, so rendering it immediately is the right
          call regardless. The surrounding text and telemetry still stagger in.
        */}
        {logo && (
          <div className="flex w-full justify-center">
            <Video
              sources={logo}
              label={`${teamName} — FTC Team ${teamNumber}`}
              priority
              blend
              // Capped on both axes so the shorter one wins; auto on both
              // dimensions lets the browser preserve the aspect ratio.
              style={{
                width: "auto",
                height: "auto",
                maxWidth: "min(560px, 84vw)",
                maxHeight: "min(28vh, 300px)",
              }}
            />
          </div>
        )}

        <motion.h1
          className="glow-text text-balance"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "clamp(22px, min(5.2vw, 5.4vh), 58px)",
            lineHeight: 1.1,
            letterSpacing: "0.02em",
          }}
          {...rise(0.28)}
        >
          {tagline}
        </motion.h1>

        <motion.div className="flex flex-wrap items-center justify-center gap-3" {...rise(0.4)}>
          <Link
            href="/robot"
            className="glow-box border transition-colors"
            style={{
              ...ctaStyle,
              color: "var(--color-accent)",
              borderColor: "var(--color-border-active)",
            }}
          >
            See the Robot
          </Link>
          <Link
            href="/sponsors/join"
            className="border transition-colors"
            style={{
              ...ctaStyle,
              color: "var(--color-gold)",
              borderColor: "rgba(242,183,5,0.45)",
              boxShadow: "var(--glow-gold)",
            }}
          >
            Sponsor Us
          </Link>
        </motion.div>

        {/* Telemetry strip — every value is derived from season content, not typed in */}
        <motion.dl
          className="hud-frame grid w-full grid-cols-2 gap-px overflow-hidden bg-[var(--color-border)] sm:grid-cols-4"
          style={{ marginTop: "clamp(4px, 1vh, 14px)" }}
          {...rise(0.52)}
        >
          {cells.map((cell, i) => (
            <motion.div
              key={cell.label}
              className="flex flex-col items-center gap-1 bg-black"
              style={{ padding: "clamp(9px, 1.6vh, 20px) 12px" }}
              {...(reduced
                ? {}
                : {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    transition: { duration: 0.4, delay: 0.62 + i * 0.08 },
                  })}
            >
              <dt className="micro">{cell.label}</dt>
              <dd
                className="text-[var(--color-white)]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "clamp(14px, min(2.2vw, 2.4vh), 20px)",
                  letterSpacing: "0.06em",
                }}
              >
                {cell.value}
              </dd>
            </motion.div>
          ))}
        </motion.dl>

        {/*
          Proof, deliberately inside the hero rather than in a section below: it
          is the most persuasive thing on the page for a sponsor or a judge, and
          "visible without scrolling" is only enforceable while it shares this
          height-bounded box with everything above it.
        */}
        <motion.div
          className="grid w-full grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4"
          style={{ marginTop: "clamp(4px, 1.2vh, 18px)" }}
          {...rise(0.66)}
        >
          {stats.map((s) => (
            <StatCounter key={s.label} value={s.value} label={s.label} compact />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
