import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import SeasonPulse from "@/components/home/SeasonPulse";
import { getSeason, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "This Season",
  description:
    "Nova Pyra's 2025–2026 DECODE season: the challenge, our strategy, goals, and every event result.",
};

export default async function SeasonPage() {
  const [season, settings] = await Promise.all([getSeason(), getSettings()]);

  const tally = season.completed.reduce(
    (acc, e) => ({
      wins: acc.wins + (e.record?.wins ?? 0),
      losses: acc.losses + (e.record?.losses ?? 0),
      ties: acc.ties + (e.record?.ties ?? 0),
    }),
    { wins: 0, losses: 0, ties: 0 },
  );
  const record = `${tally.wins}-${tally.losses}-${tally.ties}`;
  const worlds = season.completed.find((e) => e.isWorlds);

  return (
    <>
      <PageHeader
        eyebrow={`${settings.season} · ${season?.gameName ?? ""}`}
        title="This season"
        intro={season?.description}
        // The record is what this page is really reporting; without it the first
        // thing on screen is a paragraph about the game.
        lead={
          <dl className="flex w-fit max-w-full flex-wrap gap-px bg-[var(--color-border)]">
            {[
              { label: "Record", value: record },
              { label: "Events", value: String(season.completed.length) },
              ...(worlds?.division
                ? [{ label: "Worlds division", value: `${worlds.division} #${worlds.rank}` }]
                : []),
            ].map((cell) => (
              <div key={cell.label} className="flex flex-col gap-1 bg-black px-5 py-3">
                <dt className="micro">{cell.label}</dt>
                <dd
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "clamp(15px, 2vw, 20px)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {cell.value}
                </dd>
              </div>
            ))}
          </dl>
        }
      />

      <Section eyebrow="Approach" title="Our strategy">
        <Reveal>
          <p
            className="max-w-3xl"
            style={{ fontSize: "clamp(16px, 1.8vw, 19px)", lineHeight: 1.7 }}
          >
            {season?.strategy}
          </p>
        </Reveal>
      </Section>

      <Section eyebrow="Progress" title="Goals & results">
        <SeasonPulse goals={season.robotGoals} events={season.completed} />
      </Section>

      <Section eyebrow="Awards" title="What we're chasing">
        <ul className="grid gap-4 sm:grid-cols-2">
          {season.awardGoals.map((g, i) => (
            <Reveal as="li" key={g.goal} delay={i * 0.05} className="hud-frame p-5">
              <div className="flex items-baseline justify-between gap-4">
                <h3 style={{ fontSize: "16px", lineHeight: 1.4 }}>{g.goal}</h3>
                <span
                  className="shrink-0 tabular-nums"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "15px",
                    color:
                      g.status === "achieved" ? "var(--color-live)" : "var(--color-accent)",
                  }}
                >
                  {g.progress}%
                </span>
              </div>
              <p
                className="mt-2 text-[var(--color-text-secondary)]"
                style={{ fontSize: "15px", lineHeight: 1.5 }}
              >
                {g.note}
              </p>
            </Reveal>
          ))}
        </ul>
      </Section>

      {season.completed.length > 0 && (
        <Section eyebrow="Detail" title="Event by event">
          <ol className="flex flex-col gap-4">
            {season.completed.map((e, i) => (
              <Reveal as="li" key={e.id} delay={i * 0.04} className="hud-frame p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 700,
                      fontSize: "18px",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {e.name}
                  </h3>
                  <span
                    className="tabular-nums"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "15px",
                      color: "var(--color-accent)",
                    }}
                  >
                    {e.division ? `${e.division.toUpperCase()} DIV · ` : ""}RANK {e.rank} ·{" "}
                    {e.record.wins}-{e.record.losses}-{e.record.ties}
                  </span>
                </div>
                <p className="micro mt-2">
                  {e.date} · {e.location}
                  {/* No "th" suffix: 91 would render "91th". */}
                  {e.overallRank ? ` · Overall rank ${e.overallRank} across all divisions` : ""}
                </p>
                {e.awards.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {e.awards.map((a) => (
                      <li
                        key={a}
                        className="border border-[var(--color-border)] px-3 py-1.5"
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "13px",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "var(--color-gold)",
                        }}
                      >
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
                <p
                  className="mt-4 text-[var(--color-text-secondary)]"
                  style={{ fontSize: "15px", lineHeight: 1.55 }}
                >
                  {e.keyTakeaway}
                </p>
              </Reveal>
            ))}
          </ol>
        </Section>
      )}
    </>
  );
}
