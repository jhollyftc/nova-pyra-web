import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import { getAwards, getSectionCopy, getTimeline } from "@/lib/content";

export const metadata: Metadata = {
  title: "Awards & Timeline",
  description:
    "Nova Pyra's award history — Louisiana State Champions, back-to-back Regional Champions, and Design Award 3rd Place at the FIRST World Championship.",
};

const TYPE_COLOR: Record<string, string> = {
  award: "var(--color-gold)",
  event: "var(--color-accent)",
  milestone: "var(--color-cyan)",
  outreach: "var(--color-live)",
};

export default async function AwardsPage() {
  const [awards, timeline, copy] = await Promise.all([
    getAwards(),
    getTimeline(),
    getSectionCopy(),
  ]);

  // Group awards by season, newest season first.
  const seasons = [...new Set(awards.map((a) => a.season))].reverse();

  return (
    <>
      <PageHeader
        {...copy("awards.header", { n: awards.length })}
      />

      {seasons.map((season) => (
        <Section key={season} eyebrow="Season" title={season}>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {awards
              .filter((a) => a.season === season)
              .map((a, i) => (
                <Reveal
                  as="li"
                  key={`${a.award}-${a.event}`}
                  delay={i * 0.04}
                  className="hud-frame flex flex-col gap-3 p-6"
                >
                  <span
                    className="micro"
                    style={{
                      color:
                        a.level === "worlds"
                          ? "var(--color-gold)"
                          : a.level === "state"
                            ? "var(--color-cyan)"
                            : "var(--color-accent)",
                    }}
                  >
                    {a.level === "worlds"
                      ? "World Championship"
                      : a.level === "state"
                        ? "State"
                        : "Qualifier"}
                  </span>
                  <h3
                    className="text-balance"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "17px",
                      lineHeight: 1.35,
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
                </Reveal>
              ))}
          </ul>
        </Section>
      ))}

      <Section
        {...copy("awards.timeline", { n: timeline.length })}
      >
        <ol className="relative flex flex-col gap-6 border-l border-[var(--color-border)] pl-6 sm:pl-8">
          {timeline.map((m, i) => (
            <Reveal as="li" key={`${m.year}-${m.title}`} delay={Math.min(i, 10) * 0.03}>
              <span
                className="absolute -left-[5px] mt-1.5 block h-2.5 w-2.5 rounded-full"
                style={{ background: TYPE_COLOR[m.type] ?? "var(--color-accent)" }}
                aria-hidden="true"
              />
              <p className="micro" style={{ color: TYPE_COLOR[m.type] }}>
                {m.year} · {m.type}
              </p>
              <h3
                className="mt-1.5"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: "17px",
                  letterSpacing: "0.04em",
                }}
              >
                {m.title}
              </h3>
              <p
                className="mt-1.5 max-w-2xl text-[var(--color-text-secondary)]"
                style={{ fontSize: "15px", lineHeight: 1.55 }}
              >
                {m.description}
              </p>
            </Reveal>
          ))}
        </ol>
      </Section>
    </>
  );
}
