"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/** The blue ember palette from ftc-pit-app/components/AttractMode.tsx. */
const PALETTE = ["#1173F1", "#4592f7", "#6aaeff", "#a8d0ff"];

type Ember = { x: number; y: number; r: number; vy: number; vx: number; a: number; c: string };

/**
 * Ambient ember drift behind the hero. Ported from the kiosk's AttractMode
 * canvas at roughly half density, since here it sits under live text rather
 * than filling an idle screen.
 *
 * Never runs under reduced motion, and pauses when the tab is hidden or the
 * hero scrolls out of view so it costs nothing on the rest of the page.
 */
export default function EmberField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let embers: Ember[] = [];
    let raf = 0;
    let running = true;
    /** Scroll impulse, decayed every frame. See `frame`. */
    let boost = 0;
    let lastScrollY = window.scrollY;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const seed = () => {
      // Density scales with area so a phone does not run the desktop count.
      const count = Math.round(Math.min(70, (width * height) / 26000));
      embers = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.7 + 0.5,
        vy: -(Math.random() * 0.28 + 0.06),
        vx: (Math.random() - 0.5) * 0.14,
        a: Math.random() * 0.5 + 0.12,
        c: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const frame = () => {
      if (!running) return;

      /**
       * Scroll makes the embers streak.
       *
       * The field is otherwise the same drift whatever you do, which is
       * pleasant and completely inert — it never acknowledges the person
       * looking at it. Bleeding scroll velocity into the particles is the
       * cheapest interaction on the site and the most convincing, because it
       * responds to something the visitor is already doing rather than asking
       * them to do something new.
       *
       * The impulse decays about 8% a frame, so a flick ripples and settles in
       * well under a second instead of leaving the field permanently agitated.
       */
      boost *= 0.92;
      if (Math.abs(boost) < 0.01) boost = 0;

      ctx.clearRect(0, 0, width, height);
      for (const e of embers) {
        // Heavier particles are pushed less, which stops the whole field from
        // moving as one sheet and gives the streak some depth.
        const drag = e.r * 0.9;
        const shove = boost * drag;
        e.y += e.vy + shove;
        e.x += e.vx;
        // Recycle off whichever edge it left, so a fast scroll does not empty
        // the top or the bottom of the field.
        if (e.y < -8) {
          e.y = height + 8;
          e.x = Math.random() * width;
        } else if (e.y > height + 8) {
          e.y = -8;
          e.x = Math.random() * width;
        }
        if (e.x < -8) e.x = width + 8;
        if (e.x > width + 8) e.x = -8;

        ctx.globalAlpha = e.a;
        ctx.fillStyle = e.c;

        // Above a threshold each ember is drawn as a capsule along its travel,
        // which is what reads as a streak rather than a faster dot.
        const trail = Math.min(Math.abs(shove) * 2.4, 26);
        if (trail > 1.5) {
          ctx.lineWidth = e.r * 2;
          ctx.lineCap = "round";
          ctx.strokeStyle = e.c;
          ctx.beginPath();
          ctx.moveTo(e.x, e.y);
          ctx.lineTo(e.x, e.y - Math.sign(shove) * trail);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    raf = requestAnimationFrame(frame);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Pause when scrolled away or the tab is backgrounded.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    /**
     * Reads scroll delta only. The listener does no layout work and no
     * drawing — it accumulates a number that the existing animation frame
     * consumes — so it cannot make scrolling janky. `passive` says as much to
     * the browser. Clamped because a trackpad fling or a jump to an anchor can
     * report hundreds of pixels in one event, which would fire every ember off
     * the screen at once.
     */
    const onScroll = () => {
      const delta = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      boost += Math.max(-24, Math.min(24, delta)) * 0.06;
      boost = Math.max(-3, Math.min(3, boost));
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced]);

  if (reduced) return null;

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
