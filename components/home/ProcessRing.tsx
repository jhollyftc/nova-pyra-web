"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Step = { _key?: string; label: string; description: string };

/**
 * The six-step engineering design cycle as a ring on wide screens and a plain
 * numbered list on narrow ones — a 400px ring with six labels is unreadable on
 * a phone, so the two layouts are genuinely different rather than scaled.
 */
export default function ProcessRing({
  steps,
  narrative,
  notebookPath,
}: {
  steps: Step[];
  narrative: string;
  notebookPath: string | null;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const reduced = useReducedMotion();
  const active = steps[activeIdx];

  const R = 150;
  const C = 200;
  // Start at 12 o'clock and go clockwise.
  const pointAt = (i: number) => {
    const angle = (i / steps.length) * Math.PI * 2 - Math.PI / 2;
    return { x: C + R * Math.cos(angle), y: C + R * Math.sin(angle) };
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
      {/* Ring — wide screens only */}
      <div className="relative hidden sm:block">
        <svg viewBox="0 0 400 400" className="w-full" role="presentation">
          <circle
            cx={C}
            cy={C}
            r={R}
            fill="none"
            stroke="var(--color-border)"
            strokeDasharray="3 7"
          />
          {steps.map((step, i) => {
            const { x, y } = pointAt(i);
            const isActive = i === activeIdx;
            return (
              <g key={step._key ?? step.label}>
                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? 13 : 9}
                  fill={isActive ? "var(--color-accent)" : "#000"}
                  stroke="var(--color-accent)"
                  strokeWidth={1.5}
                  style={{ transition: "all 250ms ease" }}
                />
                <text
                  x={x}
                  y={y - 24}
                  textAnchor="middle"
                  fill={isActive ? "var(--color-white)" : "var(--color-text-muted)"}
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 15,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {step.label}
                </text>
                {/* Generous invisible hit target over the small node */}
                <circle
                  cx={x}
                  cy={y}
                  r={30}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setActiveIdx(i)}
                  onFocus={() => setActiveIdx(i)}
                  onClick={() => setActiveIdx(i)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${step.label}: ${step.description}`}
                />
              </g>
            );
          })}
        </svg>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-20">
          <motion.div
            key={active.label}
            className="text-center"
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
          >
            <p
              className="glow-text"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "22px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
              }}
            >
              {active.label}
            </p>
            <p
              className="mt-2 text-[var(--color-text-secondary)]"
              style={{ fontSize: "14px", lineHeight: 1.5 }}
            >
              {active.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* List — narrow screens */}
      <ol className="flex flex-col gap-4 sm:hidden">
        {steps.map((step, i) => (
          <li key={step._key ?? step.label} className="flex gap-4">
            <span
              className="shrink-0 tabular-nums"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "15px",
                color: "var(--color-accent)",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: "16px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {step.label}
              </p>
              <p
                className="mt-1 text-[var(--color-text-secondary)]"
                style={{ fontSize: "15px", lineHeight: 1.5 }}
              >
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div>
        <p
          className="text-[var(--color-text-secondary)]"
          style={{ fontSize: "clamp(15px, 1.6vw, 17px)" }}
        >
          {narrative}
        </p>

        {/* The pit app embedded this 16.4 MB PDF in an iframe. On the web it is a link. */}
        {notebookPath && (
        <a
          href={notebookPath}
          target="_blank"
          rel="noopener noreferrer"
          className="hud-frame mt-8 flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[rgba(17,115,241,0.06)]"
        >
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
              style={{ background: "var(--color-live)" }}
            />
            <span
              className="relative inline-flex h-2.5 w-2.5 rounded-full"
              style={{ background: "var(--color-live)" }}
            />
          </span>
          <span>
            <span
              className="block"
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "15px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Engineering Portfolio
            </span>
            <span className="micro" style={{ letterSpacing: "0.12em" }}>
              Live document · opens the PDF
            </span>
          </span>
        </a>
        )}
      </div>
    </div>
  );
}
