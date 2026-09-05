import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import ProcessRing from "@/components/home/ProcessRing";
import TestingChart from "@/components/TestingChart";
import { getEdp, getProblems, getTestingCharts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Engineering Process",
  description:
    "How Nova Pyra engineers: the design cycle, problems solved, test data, and our engineering portfolio.",
};

export default function EngineeringPage() {
  const edp = getEdp();

  return (
    <>
      <PageHeader
        eyebrow="Engineering Process"
        title="How we engineer"
        intro="Every decision, including the ones we reject, is documented with its reasoning — a traceable record, and how new members learn why the robot looks the way it does."
      />

      <Section eyebrow="The Cycle" title="Engineering design process">
        <ProcessRing
          steps={edp.steps}
          narrative={edp.narrative}
          notebookPath={edp.notebookPath}
        />
      </Section>

      <Section
        eyebrow="Problem → Solution"
        title="What went wrong, and what we did"
        intro="The failures are the interesting part. Each of these cost us matches before it cost us a redesign."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {getProblems().map((c, i) => (
            <Reveal key={c.id} delay={i * 0.05} className="hud-frame flex flex-col gap-4 p-6">
              <div>
                <p className="micro" style={{ color: "var(--color-danger)" }}>
                  Problem
                </p>
                <p className="mt-1.5" style={{ fontSize: "15px", lineHeight: 1.55 }}>
                  {c.problem}
                </p>
              </div>
              <div>
                <p className="micro" style={{ color: "var(--color-accent)" }}>
                  Solution
                </p>
                <p
                  className="mt-1.5 text-[var(--color-text-secondary)]"
                  style={{ fontSize: "15px", lineHeight: 1.55 }}
                >
                  {c.solution}
                </p>
              </div>
              <div className="mt-auto">
                <p className="micro" style={{ color: "var(--color-live)" }}>
                  Result
                </p>
                <p className="mt-1.5" style={{ fontSize: "15px", lineHeight: 1.55 }}>
                  {c.result}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Testing & Data"
        title="We measured it"
        intro="Every claim about the robot traces back to a number we recorded."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {getTestingCharts().map((chart, i) => (
            <Reveal key={chart.id} delay={i * 0.06}>
              <TestingChart
                title={chart.title}
                subtitle={chart.subtitle}
                unit={chart.unit}
                data={chart.data}
                insight={chart.insight}
              />
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
