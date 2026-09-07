"use client";

import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import type { Sponsor } from "@/lib/content";

/**
 * A slim band of sponsor logos, sized to sit in the last strip of the first
 * screen.
 *
 * "Name/logo on website" is a benefit in every sponsorship tier, so leaving the
 * logos at the very bottom of the page under-delivered something the team has
 * actually promised — and it is the strongest social proof a prospective sponsor
 * can see. The hero gives up `--sponsor-strip` of its claimed viewport height so
 * this lands above the fold rather than one scroll down.
 *
 * Kept deliberately thin. It is recognition, not a section: small logos reading
 * as a credibility line, rather than a wall of advertising above the team's own
 * work. The full listing, with names and tiers, is on /sponsors.
 *
 * Under reduced motion it becomes a static wrapped row — the strip grows and the
 * page scrolls a little, which is the right trade: every sponsor stays visible
 * rather than being clipped off the end of a row that no longer moves.
 */
export default function SponsorStrip({ sponsors }: { sponsors: Sponsor[] }) {
  const reduced = useReducedMotion();

  const logo = (s: Sponsor, key: string) => (
    <li key={key} className="flex shrink-0 items-center justify-center px-5">
      <Image
        src={s.logo as string}
        alt={s.name}
        width={150}
        height={44}
        className="w-auto object-contain opacity-85 transition-opacity hover:opacity-100"
        style={{ maxHeight: "clamp(28px, 4.2vh, 40px)" }}
        sizes="150px"
      />
    </li>
  );

  if (sponsors.length === 0) return null;

  return (
    <section
      className="relative border-b border-[var(--color-border)] bg-black"
      aria-label="Our sponsors"
      style={{ minHeight: "var(--sponsor-strip)" }}
    >
      <div className="shell flex h-full items-center gap-6 py-3">
        <Link href="/sponsors" className="micro shrink-0 whitespace-nowrap hover:underline">
          Backed by
        </Link>

        {reduced ? (
          <ul className="flex flex-wrap items-center gap-y-3">
            {sponsors.map((s) => logo(s, s.id))}
          </ul>
        ) : (
          <div
            className="relative min-w-0 flex-1 overflow-hidden"
            style={{
              maskImage: "linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent)",
              WebkitMaskImage:
                "linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent)",
            }}
          >
            {/* Duplicated once so the -50% translate loops seamlessly. */}
            <ul className="marquee flex w-max items-center">
              {sponsors.map((s) => logo(s, `a-${s.id}`))}
              {sponsors.map((s) => logo(s, `b-${s.id}`))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
