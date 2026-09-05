"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Subsystem } from "@/lib/content";

type Pinned = Subsystem & { hotspot: { x: number; y: number } };

/**
 * The front page's centrepiece: the real DRAKOS photo with a marker over each
 * subsystem. Hover on a pointer device, tap on touch.
 *
 * Below 768px the markers are hidden entirely and the same content renders as a
 * plain list — five 44px targets on a phone-width robot photo would overlap and
 * be unhittable, so the two layouts are genuinely different rather than scaled.
 *
 * Marker positions come from the subsystem`s `hotspot` field in Sanity, so they
 * can be nudged in the Studio without a code change.
 */
export default function RobotHotspots({
  subsystems,
  photo,
  specs,
  robotName,
  philosophy,
}: {
  subsystems: Pinned[];
  photo: string | null;
  specs: string[];
  robotName: string;
  philosophy: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const active = subsystems.find((s) => s.id === activeId);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
      {/* Photo + markers (pointer devices) */}
      <div
        className="relative hidden md:block"
        onMouseLeave={() => setActiveId(null)}
      >
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 65% 60% at 50% 50%, rgba(17,115,241,0.20), transparent 70%)",
          }}
        />
        {photo && (
          <Image
            src={photo}
            alt={`${robotName}, the competition robot`}
            width={900}
            height={985}
            priority
            className="relative mx-auto h-auto w-full max-w-[520px] drop-shadow-[0_0_50px_rgba(17,115,241,0.28)]"
            sizes="(max-width: 1024px) 60vw, 520px"
          />
        )}

        <div className="absolute inset-0 mx-auto max-w-[520px]">
          {subsystems.map((s) => {
            const isActive = s.id === active?.id;
            return (
              <button
                key={s.id}
                type="button"
                aria-label={`${s.name}: ${s.tagline}`}
                aria-expanded={isActive}
                onMouseEnter={() => setActiveId(s.id)}
                onFocus={() => setActiveId(s.id)}
                onClick={() => setActiveId(isActive ? null : s.id)}
                className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
                style={{ left: `${s.hotspot.x}%`, top: `${s.hotspot.y}%` }}
              >
                {/* Pulse ring */}
                {!reduced && (
                  <span
                    className="absolute h-5 w-5 animate-ping rounded-full opacity-60"
                    style={{ background: "rgba(17,115,241,0.5)" }}
                    aria-hidden="true"
                  />
                )}
                <span
                  className="relative block rounded-full transition-all"
                  style={{
                    width: isActive ? 16 : 11,
                    height: isActive ? 16 : 11,
                    background: isActive ? "var(--color-accent)" : "#000",
                    border: "2px solid var(--color-accent)",
                    boxShadow: "var(--glow-accent)",
                  }}
                />
              </button>
            );
          })}

          {/* Callout */}
          <AnimatePresence>
            {active && (
              <motion.div
                key={active.id}
                className="pointer-events-none absolute z-10 w-[min(260px,60%)]"
                style={{
                  left: `${Math.min(Math.max(active.hotspot.x, 6), 62)}%`,
                  top: `calc(${active.hotspot.y}% + 26px)`,
                }}
                initial={reduced ? false : { opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <div className="hud-frame bg-black/90 p-4 backdrop-blur-sm">
                  <p
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 700,
                      fontSize: "14px",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--color-accent)",
                    }}
                  >
                    {active.name}
                  </p>
                  <p
                    className="mt-1.5 text-[var(--color-text-secondary)]"
                    style={{ fontSize: "13.5px", lineHeight: 1.45 }}
                  >
                    {active.tagline}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="micro mt-4 text-center">Hover a marker to inspect a subsystem</p>
      </div>

      {/* Phone: photo without markers, then the same content as a list */}
      <div className="md:hidden">
        {photo && (
          <Image
            src={photo}
            alt={`${robotName}, the competition robot`}
            width={900}
            height={985}
            priority
            className="mx-auto h-auto w-full max-w-[340px] drop-shadow-[0_0_36px_rgba(17,115,241,0.28)]"
            sizes="90vw"
          />
        )}
      </div>

      <div>
        <p
          className="text-[var(--color-text-secondary)]"
          style={{ fontSize: "clamp(15px, 1.7vw, 18px)", lineHeight: 1.65 }}
        >
          {philosophy}
        </p>

        <ul className="mt-7 flex flex-col">
          {subsystems.map((s) => {
            const isActive = s.id === active?.id;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveId(s.id)}
                  onFocus={() => setActiveId(s.id)}
                  onClick={() => setActiveId(isActive ? null : s.id)}
                  className="w-full border-l-2 py-3 pl-4 pr-2 text-left transition-all"
                  style={{
                    borderColor: isActive ? "var(--color-accent)" : "var(--color-border)",
                    background: isActive
                      ? "linear-gradient(90deg, rgba(17,115,241,0.12), transparent 70%)"
                      : "transparent",
                  }}
                >
                  <span
                    className="block"
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 700,
                      fontSize: "15px",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: isActive ? "var(--color-white)" : "var(--color-text-secondary)",
                    }}
                  >
                    {s.name}
                  </span>
                  <span
                    className="mt-0.5 block text-[var(--color-text-muted)]"
                    style={{ fontSize: "13.5px", lineHeight: 1.45 }}
                  >
                    {s.tagline}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <dl className="mt-7 flex flex-wrap gap-x-5 gap-y-3">
          {specs.map((spec) => (
            <dd
              key={spec}
              className="micro border border-[var(--color-border)] px-3 py-1.5"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {spec}
            </dd>
          ))}
        </dl>

        <Link
          href="/robot"
          className="mt-8 inline-block border-b pb-1"
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-accent)",
            borderColor: "var(--color-border-active)",
          }}
        >
          Explore the robot →
        </Link>
      </div>
    </div>
  );
}
