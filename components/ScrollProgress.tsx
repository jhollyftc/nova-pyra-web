"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/**
 * A hairline along the bottom edge of the sticky header showing how far down
 * the page you are.
 *
 * Earns its place twice: it is the HUD's own vocabulary — a readout, not an
 * ornament — and these pages are long enough that "how much more is there"
 * is a real question. It is the cheapest possible honest motion, because it
 * tracks something the reader is already doing.
 *
 * Spring-smoothed so a trackpad's jittery deltas do not make it twitch. Hidden
 * under reduced motion rather than snapped: a progress bar that jumps in steps
 * is worse than no progress bar.
 */
export default function ScrollProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-px origin-left"
      style={{
        scaleX: width,
        background:
          "linear-gradient(90deg, var(--color-blue-mid), var(--color-blue-bright))",
        boxShadow: "0 0 8px rgba(17,115,241,0.6)",
      }}
    />
  );
}
