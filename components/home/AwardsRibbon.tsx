import Reveal from "@/components/Reveal";
import type { Award } from "@/lib/content";

const LEVEL: Record<Award["level"], { label: string; color: string }> = {
  qualifier: { label: "Qualifier", color: "var(--color-accent)" },
  state: { label: "State", color: "var(--color-cyan)" },
  worlds: { label: "World Championship", color: "var(--color-gold)" },
};

/**
 * The trophy case.
 *
 * Was a horizontally scrolling row, which is a poor way to show an award list:
 * sideways scrolling is easy to miss entirely, so the most significant awards
 * could sit off-screen with nothing indicating they exist. A wrapping grid shows
 * every award at once and reflows instead of hiding.
 *
 * Ordered by significance — Worlds, then state, then qualifiers — so the
 * strongest results lead rather than being buried mid-scroll.
 */
export default function AwardsRibbon({ awards }: { awards: Award[] }) {
  const order: Award["level"][] = ["worlds", "state", "qualifier"];
  const sorted = [...awards].sort((a, b) => order.indexOf(a.level) - order.indexOf(b.level));

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sorted.map((a, i) => {
        const level = LEVEL[a.level];
        return (
          <Reveal
            as="li"
            key={`${a.award}-${a.event}-${i}`}
            delay={Math.min(i, 6) * 0.04}
            className="hud-frame flex flex-col gap-3 p-6"
          >
            <span className="micro" style={{ color: level.color }}>
              {level.label}
            </span>
            <h3
              className="text-balance"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(16px, 1.8vw, 19px)",
                lineHeight: 1.3,
                letterSpacing: "0.02em",
              }}
            >
              {a.award}
            </h3>
            <p
              className="mt-auto text-[var(--color-text-secondary)]"
              style={{ fontSize: "15px", lineHeight: 1.45 }}
            >
              {a.event}
            </p>
            <p className="micro">{a.season}</p>
          </Reveal>
        );
      })}
    </ul>
  );
}
