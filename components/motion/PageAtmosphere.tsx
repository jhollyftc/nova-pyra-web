"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * The room the whole site sits in.
 *
 * Below the hero, every page was flat black behind the content — the dot grid
 * and the blue bloom existed only in the hero and the page headers, so the
 * moment you scrolled past them the site stopped having any depth at all and
 * became a column of cards on a void. This is the layer that keeps going.
 *
 * It is fixed rather than scrolled, and what moves is the artwork inside it, at
 * rates unrelated to the content. That is what reads as depth: the page is
 * travelling through a space rather than the space scrolling with the page.
 *
 * Three things respond to scroll:
 *
 * - The grid fades UP as you leave the hero. The hero draws its own grid, so
 *   this one starting at zero avoids two grids moiréing against each other,
 *   and the hand-off doubles as the page's first transformation.
 * - The grid drifts, wrapped modulo its own 36px cell, so the drift is endless
 *   and seamless however long the page is.
 * - Two blooms travel at different rates and in opposite directions, which is
 *   the parallax proper. They are large, slow and dim on purpose: this must
 *   never compete with the content sitting on it.
 *
 * `z-index: -1` puts it above the page background and below everything else,
 * and it is inert to the pointer and to screen readers.
 *
 * Renders nothing at all under reduced motion — a static duplicate of the
 * hero's grid would be visual noise with none of the purpose.
 */
export default function PageAtmosphere() {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();

  // Fades in across the first screen, which is roughly where the hero ends.
  const gridOpacity = useTransform(scrollY, [0, 220, 700], [0, 0, 1]);

  // Modulo the 36px cell: the grid drifts forever without ever jumping.
  const gridY = useTransform(scrollY, (v) => `${(-v * 0.05) % 36}px`);

  const bloomAY = useTransform(scrollY, [0, 4000], ["0vh", "-55vh"]);
  const bloomBY = useTransform(scrollY, [0, 4000], ["0vh", "38vh"]);
  const bloomBX = useTransform(scrollY, [0, 4000], ["0vw", "-14vw"]);

  if (reduced) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: -1 }}
    >
      <motion.div
        className="dot-grid absolute"
        // Oversized so the drift never exposes an edge.
        style={{ inset: "-80px", y: gridY, opacity: gridOpacity }}
      />

      <motion.div
        className="absolute"
        style={{
          y: bloomAY,
          top: "10vh",
          left: "-10vw",
          width: "70vw",
          height: "70vh",
          background:
            "radial-gradient(ellipse at center, rgba(17,115,241,0.15), transparent 70%)",
        }}
      />
      <motion.div
        className="absolute"
        style={{
          y: bloomBY,
          x: bloomBX,
          bottom: "-20vh",
          right: "-15vw",
          width: "75vw",
          height: "75vh",
          background:
            "radial-gradient(ellipse at center, rgba(10,79,179,0.18), transparent 70%)",
        }}
      />
    </div>
  );
}
