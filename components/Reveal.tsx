"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Scroll-driven entrance. Nearly every card, list and section on the site
 * arrives through this, so its feel is the site's feel.
 *
 * Three variants, because "fade up" applied to everything is what made the
 * page read as one long uniform list:
 *
 * - `rise`    the default. Up, in, and very slightly toward you.
 * - `wipe`    revealed by a clip-path edge travelling across, which suits
 *             headings: it reads as a readout being drawn rather than a card
 *             appearing, which is the HUD's own idiom.
 * - `settle`  scales down into place from slightly large. For hero images and
 *             single focal elements, where rising looks like a list item.
 *
 * The scale on `rise` is deliberately tiny (0.985). Large entrance scales look
 * expensive for one element and seasick applied to a grid of twelve.
 *
 * `once: true` throughout: content that re-animates every time it re-enters the
 * viewport is actively annoying to anyone scrolling back to re-read something.
 *
 * NOTE: this creates a stacking context (it animates opacity and transform).
 * Never wrap the hero logo in it — that traps its `mix-blend-mode` and flashes
 * a black rectangle. See Hero.tsx.
 */
export type RevealVariant = "rise" | "wipe" | "settle";

const VARIANTS = {
  rise: {
    initial: { opacity: 0, y: 24, scale: 0.985 },
    animate: { opacity: 1, y: 0, scale: 1 },
  },
  wipe: {
    initial: { opacity: 0, clipPath: "inset(0 100% 0 0)", y: 8 },
    animate: { opacity: 1, clipPath: "inset(0 0% 0 0)", y: 0 },
  },
  settle: {
    initial: { opacity: 0, scale: 1.04 },
    animate: { opacity: 1, scale: 1 },
  },
} as const;

export default function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  variant = "rise",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li";
  variant?: RevealVariant;
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as];

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  const v = VARIANTS[variant];

  return (
    <Tag
      className={className}
      initial={v.initial}
      whileInView={v.animate}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        // The wipe needs longer: a clip edge travelling the width of a heading
        // at 550ms reads as a glitch rather than a sweep.
        duration: variant === "wipe" ? 0.85 : 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </Tag>
  );
}
