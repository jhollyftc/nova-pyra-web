import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import Video from "@/components/Video";
import CadViewer from "@/components/CadViewer";
import RobotExplorer from "@/components/home/RobotExplorer";
import { video, hasVideo } from "@/lib/media";
import {
  getRobot,
  getStrategy,
  getEvolution,
  getSubsystems,
  getHeadlineSpecs,
} from "@/lib/content";

const SPEC_LABELS: Record<string, string> = {
  weight: "Weight",
  dimensions: "Dimensions",
  driveType: "Drivetrain",
  driveMotors: "Drive motors",
  topSpeed: "Top speed",
  electronics: "Electronics",
  battery: "Battery",
};

export const metadata: Metadata = {
  title: "The Robot",
  description:
    "DRAKOS — the Nova Pyra competition robot for the DECODE season. Specs, subsystems, strategy, CAD and design evolution.",
};

export default function RobotPage() {
  const robot = getRobot();
  const strategy = getStrategy();
  const evolution = getEvolution();
  const subsystems = getSubsystems();

  const models = [
    { id: "full", label: "Full robot", src: robot.cadModelPath },
    ...subsystems
      .filter((s) => s.cadModelPath && s.cadModelPath !== robot.cadModelPath)
      .map((s) => ({ id: s.id, label: s.name, src: s.cadModelPath as string })),
  ];

  return (
    <>
      <PageHeader eyebrow="The Robot" title={robot.name} intro={robot.philosophy} />

      <Section eyebrow="Specifications" title="At a glance">
        <Reveal>
          <dl className="grid gap-px border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(robot.specs).map(([key, value]) => (
              <div key={key} className="bg-black p-5">
                <dt className="micro">{SPEC_LABELS[key] ?? key}</dt>
                <dd
                  className="mt-2"
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 600,
                    fontSize: "16px",
                    lineHeight: 1.4,
                  }}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Section>

      <Section eyebrow="Subsystems" title="How it works">
        <RobotExplorer
          subsystems={subsystems}
          specs={getHeadlineSpecs()}
          robotName={robot.name}
          philosophy={robot.philosophy}
        />
      </Section>

      <Section eyebrow="Detail" title="Design rationale">
        <div className="grid gap-4 md:grid-cols-2">
          {subsystems.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.04} className="hud-frame flex flex-col gap-4 p-6">
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    fontSize: "17px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {s.name}
                </h3>
                <p className="micro mt-1" style={{ color: "var(--color-cyan)" }}>
                  {s.tagline}
                </p>
              </div>
              {[
                { label: "Materials", value: s.materials },
                { label: "Motors", value: s.motors },
                { label: "Design rationale", value: s.rationale },
                { label: "Tradeoffs considered", value: s.tradeoffs },
              ]
                .filter((f) => f.value)
                .map((f) => (
                  <div key={f.label}>
                    <p className="micro">{f.label}</p>
                    <p
                      className="mt-1 text-[var(--color-text-secondary)]"
                      style={{ fontSize: "14px", lineHeight: 1.55 }}
                    >
                      {f.value}
                    </p>
                  </div>
                ))}
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Game Strategy"
        title="Critical, optional, bypass"
        intro={strategy.cob.description}
      >
        <Reveal>
          <div className="mb-10 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Critical", value: strategy.cob.critical, color: "var(--color-cyan)" },
              { label: "Optional", value: strategy.cob.optional, color: "var(--color-warn)" },
              { label: "Bypass", value: strategy.cob.bypass, color: "var(--color-danger)" },
            ].map((c) => (
              <div key={c.label} className="hud-frame p-6">
                <p className="micro" style={{ color: c.color }}>
                  {c.label}
                </p>
                <p className="mt-3" style={{ fontSize: "16px", lineHeight: 1.45 }}>
                  {c.value}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-3">
          {strategy.phases.map((phase, i) => (
            <Reveal key={phase.id} delay={i * 0.06} className="hud-frame overflow-hidden">
              {phase.gifPath && hasVideo(phase.gifPath) && (
                <div className="scanlines">
                  <Video sources={video(phase.gifPath)} className="w-full" />
                </div>
              )}
              <div className="border-t border-[var(--color-border)] p-5">
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: "15px",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: phase.color,
                  }}
                >
                  {phase.label}
                </p>
                <p
                  className="mt-2 text-[var(--color-text-secondary)]"
                  style={{ fontSize: "14px", lineHeight: 1.55 }}
                >
                  {phase.summary}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="CAD"
        title="Explore in 3D"
        intro="The same models we design and iterate in — rendered in your browser."
      >
        <Reveal>
          <CadViewer models={models} />
        </Reveal>
      </Section>

      <Section
        eyebrow="Design Evolution"
        title="What we changed, and why"
        intro="Six generations of intake and shooter. Each entry records what changed and what it bought us."
      >
        <ol className="flex flex-col gap-4">
          {evolution.map((v, i) => (
            <Reveal as="li" key={`${v.subsystem}-${v.version}`} delay={i * 0.03}>
              <article className="hud-frame grid gap-6 p-6 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
                {v.photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 self-start">
                    {v.photos.map((p) => (
                      <Image
                        key={p}
                        src={p}
                        alt={`${v.name} — ${v.version}`}
                        width={320}
                        height={240}
                        className="h-auto w-full border border-[var(--color-border)] object-cover"
                        sizes="(max-width: 768px) 45vw, 160px"
                      />
                    ))}
                  </div>
                )}
                <div>
                  <p className="micro">
                    {v.subsystem} · {v.version} · {v.dateRange}
                  </p>
                  <h3
                    className="mt-2"
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 700,
                      fontSize: "18px",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {v.name}
                  </h3>
                  <p
                    className="mt-3 text-[var(--color-text-secondary)]"
                    style={{ fontSize: "15px", lineHeight: 1.55 }}
                  >
                    {v.changes}
                  </p>
                  <p
                    className="mt-3"
                    style={{ fontSize: "15px", lineHeight: 1.55, color: "var(--color-accent)" }}
                  >
                    {v.result}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </ol>
      </Section>
    </>
  );
}
