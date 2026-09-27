"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * A single beam that sweeps down the viewport when a route arrives.
 *
 * Two constraints shaped this into a sweep rather than the obvious fade.
 *
 * It must not animate the page content. `mix-blend-mode` only blends against
 * the nearest ancestor stacking context, and any wrapper with opacity below 1
 * or a transform creates one — so fading the content would trap the hero
 * logo's `screen` blend and flash its black background as a rectangle on every
 * navigation home. That bug is why the logo has no entrance animation at all.
 *
 * And it must never be able to hide the page. An overlay that starts opaque
 * and fades out is server-rendered opaque, so if hydration is slow — a cheap
 * phone on school wifi, which is exactly this audience — the visitor stares at
 * a black screen until the JavaScript arrives. This starts and ends fully
 * transparent, so the worst case of it never running is that nothing happens.
 */
export default function RouteTransition() {
  const reduced = useReducedMotion();
  const pathname = usePathname();

  if (reduced) return null;

  return (
    <motion.div
      // Keyed by route so it replays on each navigation rather than once.
      key={pathname}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50"
      style={{
        height: "38vh",
        background:
          "linear-gradient(180deg, transparent, rgba(17,115,241,0.16) 45%, rgba(17,115,241,0.42) 70%, rgba(230,240,255,0.5) 76%, transparent 78%)",
      }}
      // Only `y` animates. At -40vh the band's bottom edge is just above the
      // viewport and at 100vh its top edge is just below, so it is off-screen
      // at both ends and no opacity keyframes are needed — which also means
      // the server-rendered transform already parks it out of sight.
      initial={{ y: "-40vh" }}
      animate={{ y: "100vh" }}
      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
    />
  );
}
