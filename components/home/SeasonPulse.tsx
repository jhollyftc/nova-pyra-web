"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Goal, SeasonEvent } from "@/lib/content";

const statusColor = (status: string) =>
  status === "achieved"
    ? "var(--color-live)"
    : status === "in-progress"
      ? "var(--color-accent)"
      : "var(--color-warn)";

export default function SeasonPulse({
  goals,
  events,
}: {
  goals: Goal[];
  events: SeasonEvent[];
}) {
  const reduced = useReducedMotion();

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
      <div>
        <h3 className="micro mb-6">Robot goals</h3>
        <ul className="flex flex-col gap-5">
          {goals.map((g) => (
            <li key={g.goal}>
              <div className="mb-2 flex items-baseline justify-between gap-4">
                <span style={{ fontSize: "15px", lineHeight: 1.4 }}>{g.goal}</span>
                <span
                  className="shrink-0 tabular-nums"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "14px",
                    color: statusColor(g.status),
                  }}
                >
                  {g.progress}%
                </span>
              </div>
              <div
                className="h-1 w-full overflow-hidden"
                style={{ background: "rgba(17,115,241,0.15)" }}
                role="progressbar"
                aria-valuenow={g.progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={g.goal}
              >
                <motion.div
                  className="h-full"
                  style={{ background: statusColor(g.status) }}
                  initial={reduced ? false : { width: 0 }}
                  whileInView={{ width: `${g.progress}%` }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="micro mb-6">Event results</h3>
        <ul className="flex flex-col gap-3">
          {events.map((e) => (
            <li key={e.id} className="hud-frame px-5 py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    fontSize: "15px",
                    letterSpacing: "0.04em",
                  }}
                >
                  {e.name}
                </span>
                <span
                  className="tabular-nums"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "14px",
                    color: "var(--color-accent)",
                  }}
                >
                  RANK {e.rank} · {e.record.wins}-{e.record.losses}-{e.record.ties}
                </span>
              </div>
              {e.awards.length > 0 && (
                <p className="micro mt-2" style={{ color: "var(--color-text-secondary)" }}>
                  {e.awards.join(" · ")}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
