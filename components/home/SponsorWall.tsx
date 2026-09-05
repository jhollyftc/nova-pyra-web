"use client";

import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import type { Sponsor } from "@/lib/content";

/**
 * Sponsor logo marquee.
 *
 * Departs from the plan's greyscale-to-colour treatment: the logos are a mix of
 * white-background JPEGs, transparent PNGs and SVGs, and this page exists to
 * recruit sponsors — who reasonably expect their brand shown properly. Each logo
 * therefore sits on a light chip in full colour.
 *
 * Under reduced motion the marquee becomes a static wrapped grid.
 */
export default function SponsorWall({
  sponsors,
  total,
}: {
  sponsors: Sponsor[];
  total: number;
}) {
  const reduced = useReducedMotion();

  const chip = (s: Sponsor, key: string) => (
    <li
      key={key}
      className="flex h-20 w-40 shrink-0 items-center justify-center rounded-md border border-[var(--color-border)] bg-white/90 p-3"
    >
      <Image
        src={s.logo as string}
        alt={s.name}
        width={160}
        height={80}
        className="max-h-full w-auto object-contain"
        sizes="160px"
      />
    </li>
  );

  return (
    <div>
      {reduced ? (
        <ul className="flex flex-wrap justify-center gap-4">
          {sponsors.map((s) => chip(s, s.id))}
        </ul>
      ) : (
        <div
          className="relative overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
          }}
        >
          <ul className="marquee flex w-max gap-4">
            {/* Duplicated once so the -50% translate loops seamlessly. */}
            {sponsors.map((s) => chip(s, `a-${s.id}`))}
            {sponsors.map((s) => chip(s, `b-${s.id}`))}
          </ul>
        </div>
      )}

      <div className="mt-12 flex flex-col items-center gap-5 text-center">
        <p
          className="max-w-xl text-[var(--color-text-secondary)]"
          style={{ fontSize: "clamp(15px, 1.6vw, 18px)" }}
        >
          {total} sponsors fund our parts, travel, and the outreach we run across St. Tammany
          Parish. Every tier — from $1 to $1,000+ — puts a student in front of a robot.
        </p>
        <Link
          href="/sponsors/join"
          className="border px-8 py-4"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(13px, 1.6vw, 15px)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--color-gold)",
            borderColor: "rgba(242,183,5,0.5)",
            boxShadow: "var(--glow-gold)",
          }}
        >
          Become a Sponsor
        </Link>
        <Link href="/sponsors" className="micro underline underline-offset-4">
          See everyone who supports us
        </Link>
      </div>
    </div>
  );
}
