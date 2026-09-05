import type { ReactNode } from "react";
import Reveal from "./Reveal";

/**
 * Top-of-page chrome shared by every route below the home page.
 *
 * Deliberately NOT given the home page's full-viewport treatment. The hero is
 * the whole point of the landing page; on a subpage a screen-filling header
 * would push the actual content below the fold, which is backwards. So this is
 * sized the other way — as compact as it can be while still reading as a title
 * block — to get the first real content band up the page.
 *
 * Sizes use `min(Xvw, Yvh)` for the same reason as the hero: on a short screen
 * width is not what runs out, and a header tuned only to width eats the fold.
 * Measured at 1366x768 this reclaims roughly 75px versus the fixed padding it
 * replaces.
 *
 * `lead` is the answer to "what should someone see first on THIS page" — the
 * robot's headline specs, the outreach numbers, the ways to give. It sits
 * inside the header so it is above the fold by construction rather than by
 * luck. Pages with nothing that qualifies simply omit it.
 */
export default function PageHeader({
  eyebrow,
  title,
  intro,
  lead,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  lead?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden border-b border-[var(--color-border)]">
      <div className="dot-grid absolute inset-0" aria-hidden="true" />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 50% 0%, rgba(17,115,241,0.16), transparent 70%)",
        }}
      />
      <div
        className="shell relative"
        style={{ paddingBlock: "clamp(28px, 5.5vh, 88px)" }}
      >
        <Reveal>
          <p className="micro">{eyebrow}</p>
          <h1
            className="glow-text text-balance"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(26px, min(6vw, 6.4vh), 64px)",
              lineHeight: 1.08,
              letterSpacing: "0.02em",
              marginTop: "clamp(8px, 1.4vh, 16px)",
            }}
          >
            {title}
          </h1>
          {intro && (
            <p
              className="max-w-2xl text-[var(--color-text-secondary)]"
              style={{
                fontSize: "clamp(15px, min(1.8vw, 1.9vh), 19px)",
                lineHeight: 1.55,
                marginTop: "clamp(12px, 2vh, 24px)",
              }}
            >
              {intro}
            </p>
          )}
        </Reveal>

        {lead && (
          <Reveal delay={0.08}>
            <div style={{ marginTop: "clamp(18px, 3vh, 36px)" }}>{lead}</div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
