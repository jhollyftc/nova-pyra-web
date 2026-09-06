import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import ProcessRing from "@/components/home/ProcessRing";
import NotebookLink from "@/components/NotebookLink";
import TestingChart from "@/components/TestingChart";
import { getEdp, getProblems, getSectionCopy, getTestingCharts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Engineering Process",
  description:
    "How Nova Pyra engineers: the design cycle, problems solved, test data, and our engineering portfolio.",
};

export default async function EngineeringPage() {
  const [edp, problems, charts, copy] = await Promise.all([
    getEdp(),
    getProblems(),
    getTestingCharts(),
    getSectionCopy(),
  ]);

  return (
    <>
      <PageHeader
        {...copy("engineering.header")}
        lead={edp?.notebook ? <NotebookLink href={edp.notebook} /> : null}
      />

      <Section {...copy("engineering.cycle")}>
        <ProcessRing
          steps={edp?.steps ?? []}
          narrative={edp?.narrative ?? ""}
          notebookPath={edp?.notebook ?? null}
          showNotebook={false}
        />
      </Section>

      <Section
        {...copy("engineering.problems")}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {problems.map((c, i) => (
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
        {...copy("engineering.testing")}
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {charts.map((chart, i) => (
            <Reveal key={chart.id} delay={i * 0.06}>
              <TestingChart
                title={chart.title}
                subtitle={chart.subtitle}
                unit={chart.unit}
                betterDirection={chart.betterDirection}
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
