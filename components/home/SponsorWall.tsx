import Link from "next/link";

/**
 * The closing sponsorship ask.
 *
 * This used to carry the logo marquee, but the logos moved up to SponsorStrip so
 * they land on the first screen — "name/logo on website" is something the team
 * has promised every sponsor, and it was being delivered at the very bottom of
 * the page.
 *
 * What is left here is the ask itself, aimed at someone who has just read the
 * whole page. Repeating the wall would be decoration; the complete listing, with
 * names, tiers and descriptions, is on /sponsors.
 */
export default function SponsorWall({ total }: { total: number }) {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
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
          fontSize: "clamp(15px, 1.6vw, 17px)",
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
  );
}
