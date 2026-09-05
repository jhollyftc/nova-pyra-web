"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import Video from "@/components/Video";
import EmberField from "@/components/EmberField";
import type { VideoSources } from "@/components/Video";

type Telemetry = {
  game: string;
  robot: string;
  record: string;
  worldsRank: string | null;
};

/**
 * The hero "boot sequence": the frame rules draw outward, the logo fades up and
 * the telemetry cells stagger in, reading as a HUD initializing.
 *
 * The text is server-rendered final — the animation only touches opacity and
 * transform, so it never gates the LCP or leaves anything unreadable with JS off.
 */
export default function Hero({
  logo,
  telemetry,
  tagline,
  teamName,
  teamNumber,
  location,
}: {
  logo: VideoSources | null;
  telemetry: Telemetry;
  tagline: string;
  teamName: string;
  teamNumber: string;
  location: string;
}) {
  const reduced = useReducedMotion();

  const cells = [
    { label: "Season", value: telemetry.game },
    { label: "Robot", value: telemetry.robot },
    { label: "Record", value: telemetry.record },
    ...(telemetry.worldsRank
      ? [{ label: "Worlds", value: `Rank ${telemetry.worldsRank}` }]
      : []),
  ];

  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)]">
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

      <div className="shell relative flex flex-col items-center py-16 text-center sm:py-24">
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
        <div className="mt-8 w-full" style={{ maxWidth: "min(620px, 88vw)" }}>
          {logo && (
            <Video
              sources={logo}
              label={`${teamName} — FTC Team ${teamNumber}`}
              priority
              blend
              className="w-full"
            />
          )}
        </div>

        <motion.h1
          className="glow-text mt-6 text-balance"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "clamp(26px, 5.2vw, 58px)",
            lineHeight: 1.1,
            letterSpacing: "0.02em",
          }}
          {...rise(0.28)}
        >
          {tagline}
        </motion.h1>

        <motion.div
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
          {...rise(0.4)}
        >
          <Link
            href="/robot"
            className="glow-box border px-6 py-3 transition-colors"
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "14px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              borderColor: "var(--color-border-active)",
            }}
          >
            See the Robot
          </Link>
          <Link
            href="/sponsors/join"
            className="border px-6 py-3 transition-colors"
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "14px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
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
          className="hud-frame mt-14 grid w-full grid-cols-2 gap-px overflow-hidden bg-[var(--color-border)] sm:grid-cols-4"
          {...rise(0.52)}
        >
          {cells.map((cell, i) => (
            <motion.div
              key={cell.label}
              className="flex flex-col items-center gap-1.5 bg-black px-3 py-5"
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
                  fontSize: "clamp(14px, 2.2vw, 20px)",
                  letterSpacing: "0.06em",
                }}
              >
                {cell.value}
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
