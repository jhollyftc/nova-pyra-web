"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Subsystem } from "@/lib/content";

/**
 * Master-detail explorer over the five subsystems.
 *
 * The plan originally called for hotspots pinned to a straight-on robot photo,
 * but no such photo exists in the pit app's assets. The five CAD renders do,
 * and they have transparent backgrounds, so they sit directly on the black
 * ground with no knockout needed.
 */
export default function RobotExplorer({
  subsystems,
  specs,
  robotName,
  philosophy,
}: {
  subsystems: Subsystem[];
  specs: string[];
  robotName: string;
  philosophy: string;
}) {
  const [activeId, setActiveId] = useState(subsystems[0]?.id);
  const reduced = useReducedMotion();
  const active = subsystems.find((s) => s.id === activeId) ?? subsystems[0];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12">
      {/* Selector */}
      <div>
        <p
          className="mb-6 text-[var(--color-text-secondary)]"
          style={{ fontSize: "clamp(15px, 1.6vw, 17px)" }}
        >
          {philosophy}
        </p>

        <ul className="flex flex-col" role="tablist" aria-label={`${robotName} subsystems`}>
          {subsystems.map((s) => {
            const isActive = s.id === active?.id;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveId(s.id)}
                  className="w-full border-l-2 py-3.5 pl-4 pr-2 text-left transition-all"
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
                      fontSize: "clamp(15px, 1.8vw, 18px)",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: isActive ? "var(--color-white)" : "var(--color-text-secondary)",
                    }}
                  >
                    {s.name}
                  </span>
                  <span
                    className="mt-1 block text-[var(--color-text-muted)]"
                    style={{ fontSize: "15px", lineHeight: 1.45 }}
                  >
                    {s.tagline}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <dl className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
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
            fontSize: "14px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-accent)",
            borderColor: "var(--color-border-active)",
          }}
        >
          Explore the robot →
        </Link>
      </div>

      {/* CAD viewport */}
      <div
        className="hud-frame relative flex min-h-[320px] items-center justify-center overflow-hidden p-6 sm:min-h-[440px]"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(17,115,241,0.14), transparent 72%)",
        }}
      >
        <div className="dot-grid absolute inset-0 opacity-60" aria-hidden="true" />

        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.id}
              className="relative flex w-full flex-col items-center"
              initial={reduced ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {active.photo && (
              <Image
                src={active.photo}
                alt={`${active.name} — CAD render`}
                width={640}
                height={560}
                className="h-auto w-full max-w-[420px] object-contain drop-shadow-[0_0_36px_rgba(17,115,241,0.35)]"
                sizes="(max-width: 1024px) 90vw, 420px"
              />
              )}
              <p className="micro mt-5 text-center" style={{ color: "var(--color-cyan)" }}>
                {active.name}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
