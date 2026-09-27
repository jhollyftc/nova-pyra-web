"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { countdownLabel, daysUntil } from "@/lib/dates";

/**
 * Days until a date, as a badge.
 *
 * The page is statically rendered and revalidated on a timer, so a countdown
 * baked into the HTML can be a day stale for whoever loads the cached copy.
 * The server value is still what renders first — it has to, or the number pops
 * in after hydration — and then the client recomputes against the real clock.
 * First client render deliberately reuses the server's value so the markup
 * matches; the correction lands in an effect.
 *
 * Only re-checks every minute. Nothing here changes faster than midnight.
 */
export default function Countdown({
  date,
  className = "",
}: {
  date: string | null | undefined;
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

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-2 border px-3 py-1.5 ${className}`}
      style={{
        borderColor: imminent ? "rgba(242,183,5,0.45)" : "var(--color-border)",
        color: imminent ? "var(--color-gold)" : "var(--color-accent)",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: "14px",
        letterSpacing: "0.06em",
        whiteSpace: "nowrap",
      }}
    >
      <span
        aria-hidden="true"
        className={imminent && !reduced ? "pulse-dot" : ""}
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "currentColor",
          boxShadow: "0 0 8px currentColor",
        }}
      />
      {countdownLabel(days)}
    </span>
  );
}
