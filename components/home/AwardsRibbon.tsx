import type { Award } from "@/lib/content";

const LEVEL: Record<Award["level"], { label: string; color: string }> = {
  qualifier: { label: "Qualifier", color: "var(--color-accent)" },
  state: { label: "State", color: "var(--color-cyan)" },
  worlds: { label: "World Championship", color: "var(--color-gold)" },
};

/**
 * Horizontally scrolling trophy case. `overflow-x: auto` is on this element
 * alone so a long award list never makes the page itself scroll sideways.
 */
export default function AwardsRibbon({ awards }: { awards: Award[] }) {
  // Most significant first: worlds, then state, then qualifiers.
  const order: Award["level"][] = ["worlds", "state", "qualifier"];
  const sorted = [...awards].sort(
    (a, b) => order.indexOf(a.level) - order.indexOf(b.level),
  );

  return (
    <div
      className="-mx-[var(--page-gutter)] overflow-x-auto px-[var(--page-gutter)] pb-4"
      style={{ scrollSnapType: "x mandatory" }}
      tabIndex={0}
      role="region"
      aria-label="Award history — scrollable"
    >
      <ul className="flex gap-4" style={{ width: "max-content" }}>
        {sorted.map((a, i) => {
          const level = LEVEL[a.level];
          return (
            <li
              key={`${a.award}-${a.event}-${i}`}
              className="hud-frame flex w-[min(320px,78vw)] shrink-0 flex-col gap-3 p-6"
              style={{ scrollSnapAlign: "start" }}
            >
              <span className="micro" style={{ color: level.color }}>
                {level.label}
              </span>
              <h3
                className="text-balance"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "18px",
                  lineHeight: 1.3,
                  letterSpacing: "0.02em",
                }}
              >
                {a.award}
              </h3>
              <p
                className="mt-auto text-[var(--color-text-secondary)]"
                style={{ fontSize: "14px", lineHeight: 1.45 }}
              >
                {a.event}
              </p>
              <p className="micro">{a.season}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
