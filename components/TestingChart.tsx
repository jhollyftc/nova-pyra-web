"use client";

import { motion, useReducedMotion } from "framer-motion";

type Datum = { label: string; value: number };

/**
 * Single-series horizontal bar chart.
 *
 * Design notes:
 * - One series, so there is no legend — the title names it — and no categorical
 *   palette, so no CVD pair validation applies. Magnitude gets one hue.
 * - Stages are chronological, so the hue steps light→bright across the series:
 *   the newest iteration is the most saturated. That encodes build order, not rank.
 * - Two of the three team charts are "lower is better" (driver inputs, standard
 *   deviation). Without an explicit direction label a reader scanning descending
 *   bars reads *declining performance*, which is backwards. The direction is an
 *   explicit field in the CMS, not inferred from whether the numbers rise.
 * - Every value is real DOM text, so the chart is legible to a screen reader
 *   without a separate table view.
 */
export default function TestingChart({
  title,
  subtitle,
  unit,
  data,
  insight,
  betterDirection,
}: {
  title: string;
  subtitle: string;
  unit: string;
  data: Datum[];
  insight: string;
  betterDirection: "higher" | "lower";
}) {
  const reduced = useReducedMotion();
  const max = Math.max(...data.map((d) => d.value));
  const lowerIsBetter = betterDirection === "lower";

  return (
    <figure className="hud-frame m-0 flex h-full flex-col p-6">
      <figcaption>
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: "16px",
            letterSpacing: "0.04em",
            lineHeight: 1.35,
          }}
        >
          {title}
        </h3>
        <p
          className="mt-2 text-[var(--color-text-muted)]"
          style={{ fontSize: "14px", lineHeight: 1.45 }}
        >
          {subtitle}
        </p>
        <p className="micro mt-3">
          {lowerIsBetter ? "↓ Lower is better" : "↑ Higher is better"}
        </p>
      </figcaption>

      <ul className="mt-6 flex flex-col gap-3">
        {data.map((d, i) => {
          // Chronological emphasis: earliest stage dimmest, final stage full.
          const strength = 0.42 + (0.58 * i) / Math.max(data.length - 1, 1);
          return (
            <li key={d.label} className="group">
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span
                  className="text-[var(--color-text-secondary)]"
                  style={{ fontSize: "14px", lineHeight: 1.3 }}
                >
                  {d.label}
                </span>
                <span
                  className="shrink-0 tabular-nums text-[var(--color-text-primary)]"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "14px",
                  }}
                >
                  {d.value}
                  {unit}
                </span>
              </div>
              <div
                className="h-2 w-full overflow-hidden rounded-[4px]"
                style={{ background: "rgba(17,115,241,0.10)" }}
              >
                <motion.div
                  className="h-full rounded-[4px] transition-[filter] group-hover:brightness-125"
                  style={{ background: `rgba(17, 115, 241, ${strength})` }}
                  initial={reduced ? false : { width: 0 }}
                  whileInView={{ width: `${(d.value / max) * 100}%` }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.85,
                    delay: i * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <p
        className="mt-auto border-t border-[var(--color-border)] pt-4 text-[var(--color-text-secondary)]"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "14px",
          lineHeight: 1.55,
        }}
      >
        <span style={{ color: "var(--color-accent)" }}>&gt; </span>
        {insight}
      </p>
    </figure>
  );
}
