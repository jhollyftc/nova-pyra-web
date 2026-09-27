"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { countdownLabel, daysUntil } from "@/lib/dates";

/**
 * Days until a date.
 *
 * The page is statically rendered and revalidated on a timer, so a countdown
 * baked into the HTML can be a day stale for whoever loads the cached copy.
 * The server value is still what renders first — it has to, or the number pops
 * in after hydration — and then the client recomputes against the real clock.
 * First client render deliberately reuses the server's value so the markup
 * matches; the correction lands in an effect.
 *
 * Only re-checks every minute. Nothing here changes faster than midnight.
 *
 * Two sizes, because the same component is doing two jobs. `badge` is an
 * annotation sitting beside other content. `display` is the content: it fills
 * the panel where a past event shows its reach number, and it has to carry
 * that slot on its own. The first draft used the badge in both places and the
 * card read as empty with a small pill floating in it.
 */
export default function Countdown({
  date,
  variant = "badge",
  className = "",
}: {
  date: string | null | undefined;
  variant?: "badge" | "display";
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [days, setDays] = useState(() => daysUntil(date));

  useEffect(() => {
    const tick = () => setDays(daysUntil(date));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [date]);

  if (days === null || days < 0) return null;

  // Inside a week the event stops being a diary entry and starts being news.
  const imminent = days <= 7;
  const color = imminent ? "var(--color-gold)" : "var(--color-accent)";

  const dot = (size: number) => (
    <span
      aria-hidden="true"
      className={imminent && !reduced ? "pulse-dot" : ""}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "currentColor",
        boxShadow: "0 0 8px currentColor",
      }}
    />
  );

  if (variant === "display") {
    // "Today" and "Tomorrow" have no number to enlarge, so they become the
    // display text themselves rather than being forced into a digit slot.
    const numeric = days > 1;
    return (
      <div
        className={`flex flex-col items-center justify-center gap-1 ${className}`}
        style={{ color }}
      >
        {numeric ? (
          <>
            <span
              className="glow-text tabular-nums"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "clamp(38px, 6vw, 60px)",
                lineHeight: 1,
              }}
            >
              {days}
            </span>
            <span className="micro flex items-center gap-2" style={{ color: "inherit" }}>
              {imminent && dot(6)}
              days away
            </span>
          </>
        ) : (
          <span
            className="glow-text"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(26px, 4vw, 40px)",
              lineHeight: 1.1,
            }}
          >
            {countdownLabel(days)}
          </span>
        )}
      </div>
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-2 border px-3 py-1.5 ${className}`}
      style={{
        borderColor: imminent ? "rgba(242,183,5,0.45)" : "var(--color-border)",
        color,
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: "14px",
        letterSpacing: "0.06em",
        whiteSpace: "nowrap",
      }}
    >
      {dot(7)}
      {countdownLabel(days)}
    </span>
  );
}
