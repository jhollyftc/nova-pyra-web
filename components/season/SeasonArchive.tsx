import Reveal from "@/components/Reveal";
import type { ArchivedSeason } from "@/lib/content";

/**
 * Past seasons and what they finished with.
 *
 * Shown when the current season has nothing to report yet. A team in build
 * season has no record, but it has a history, and "23-5-0 · 2025–2026 DECODE"
 * is both honest and the strongest thing a sponsor can read on the page.
 */
export default function SeasonArchive({ seasons }: { seasons: ArchivedSeason[] }) {
  const past = seasons.filter((s) => !s.isCurrent && s.events > 0);
  if (past.length === 0) return null;

  return (
    // One past season should not sit in a half-width column with dead space
    // beside it — with a single card the grid is one column and the card fills
    // the measure. The team will have two soon enough.
    <ul className={`grid gap-4 ${past.length > 1 ? "sm:grid-cols-2" : "max-w-2xl"}`}>
      {past.map((s, i) => (
        <Reveal as="li" key={s.id} delay={i * 0.06} className="hud-frame p-6">
          <p className="micro">{s.gameYear}</p>
          <h3
            className="glow-text mt-1"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(20px, 3vw, 28px)",
              letterSpacing: "0.04em",
            }}
          >
            {s.gameName}
          </h3>

          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
            {/*
              No award count here on purpose. The per-event award lists include
              alliance finishes ("Winning Alliance Captain"), so counting them
              gives 7 for DECODE while the trophy case on /awards counts 4 —
              two numbers on the same site that disagree. /awards is the one
              that is right, so this card does not compete with it.
            */}
            {[
              { label: "Record", value: s.record },
              { label: "Events", value: String(s.events) },
            ].map((cell) => (
              <div key={cell.label}>
                <dt className="micro">{cell.label}</dt>
                <dd
                  className="tabular-nums"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "18px",
                    color: "var(--color-accent)",
                  }}
                >
                  {cell.value}
                </dd>
              </div>
            ))}
          </dl>

          {s.best && (
            <p className="micro mt-4" style={{ color: "var(--color-gold)" }}>
              {s.best}
            </p>
          )}
        </Reveal>
      ))}
    </ul>
  );
}
