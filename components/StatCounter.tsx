"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Ported from ftc-pit-app/components/StatCounter.tsx. Two changes for the web:
 * type scale re-tuned for a 360px–2560px range rather than a fixed 1920x1080,
 * and the count-up is skipped under reduced motion (the pit app had no such path).
 */
export default function StatCounter({
  value,
  label,
  suffix = "",
  duration = 1800,
}: {
  value: number;
  label: string;
  suffix?: string;
  duration?: number;
}) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    if (!inView || hasStarted.current) return;
    hasStarted.current = true;

    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value, duration, reduced]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div
        className="glow-text text-[var(--color-accent)] leading-none tabular-nums"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(38px, 7vw, 76px)",
          fontWeight: 900,
        }}
      >
        {display.toLocaleString()}
        {suffix}
      </div>
      <div
        className="text-center leading-tight text-[var(--color-text-secondary)]"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(12px, 1.2vw, 15px)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
}
