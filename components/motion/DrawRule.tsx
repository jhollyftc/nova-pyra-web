"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * A hairline that draws itself from the left when it scrolls into view, with a
 * brighter head at the leading edge.
 *
 * This is the HUD's own gesture — a trace being plotted — and it does something
 * a static divider cannot: it gives every section boundary a direction and a
 * moment, so scrolling feels like advancing through a system rather than
 * sliding down a document.
 *
 * Under reduced motion it renders as the plain hairline it is standing in for,
 * because the divider is genuinely useful even when it cannot move.
 */
export default function DrawRule({ delay = 0 }: { delay?: number }) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className="mt-6 h-px w-full bg-[var(--color-border)]" aria-hidden="true" />;
  }

  return (
    <div className="relative mt-6 h-px w-full overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute inset-0 origin-left"
        style={{
          background:
            "linear-gradient(90deg, var(--color-border-active), rgba(17,115,241,0.55) 45%, rgba(17,115,241,0.12) 85%, transparent)",
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
