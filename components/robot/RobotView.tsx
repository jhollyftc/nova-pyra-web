import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import Video from "@/components/Video";
import CadViewer from "@/components/CadViewer";
import RobotExplorer from "@/components/home/RobotExplorer";
import RobotSwitcher from "@/components/robot/RobotSwitcher";
import type {
  EvolutionEntry,
  RobotDoc,
  RobotSummary,
  SectionCopyResolver,
  Subsystem,
} from "@/lib/content";

/**
 * CAD models stay in public/, not Sanity.
 *
 * They are 6.9-16.5 MB Draco-compressed binaries that change once a season, and
 * pushing them through the CMS would burn asset storage for no editing benefit.
 * They are also loaded only behind an explicit button, so they never affect page
 * weight.
 *
 * Keyed by robot slug: each season's machine has its own models, and a robot
 * with none simply shows no CAD section.
 */
const CAD_MODELS: Record<string, { id: string; label: string; src: string }[]> = {
  drakos: [
    { id: "full", label: "Full robot", src: "/robot-draco.glb" },
    { id: "intake", label: "Intake", src: "/intake-draco.glb" },
    { id: "shooter", label: "Shooter", src: "/shooter-draco.glb" },
  ],
};

/**
 * One season's robot. Shared by /robot (the current one) and /robot/[slug].
 *
 * Sections render only when there is something in them, so a robot still being
 * built can be published with just a name and a game and the page stays
 * coherent rather than showing a row of empty headings.
 */
export default function RobotView({
  robot,
  robots,
  subsystems,
  evolution,
  headlineSpecs,
  copy,
}: {
  robot: RobotDoc;
  robots: RobotSummary[];
  subsystems: Subsystem[];
  evolution: EvolutionEntry[];
  headlineSpecs: string[];
  copy: SectionCopyResolver;
}) {
  const cob = [
    { label: "Critical", value: robot.cobCritical, color: "var(--color-cyan)" },
    { label: "Optional", value: robot.cobOptional, color: "var(--color-warn)" },
    { label: "Bypass", value: robot.cobBypass, color: "var(--color-danger)" },
  ].filter((c) => c.value);

  const models = CAD_MODELS[robot.slug] ?? [];
  const inDevelopment = robot.status === "in-development";

  return (
    <>
      <PageHeader
        eyebrow={`${robot.season} · ${robot.gameName}`}
        title={robot.name}
        intro={robot.philosophy}
        // Weight, size and drivetrain answer "what is this machine" before any
        // scrolling. The full spec table is still the first section below.
        lead={
          <div className="flex flex-col gap-5">
            <RobotSwitcher robots={robots} activeSlug={robot.slug} />
            {inDevelopment && (
              <p className="micro" style={{ color: "var(--color-warn)" }}>
                In development · this season&rsquo;s machine is still being built
              </p>
            )}
            <dl className="flex flex-wrap gap-x-3 gap-y-2">
              {headlineSpecs.map((spec) => (
                <dd
                  key={spec}
                  className="micro border border-[var(--color-border)] px-3 py-1.5"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {spec}
                </dd>
              ))}
            </dl>
          </div>
        }
      />

{robot.specs?.length > 0 && (
      <Section {...copy("robot.specs")}>
        <Reveal>
          <dl className="grid gap-px border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
            {(robot.specs ?? []).map((spec) => (
              <div key={spec.label} className="bg-black p-5">
                <dt className="micro">{spec.label}</dt>
                <dd
                  className="mt-2"
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 600,
                    fontSize: "16px",
                    lineHeight: 1.4,
                  }}
                >
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Section>
      )}

{subsystems.length > 0 && (
      <Section {...copy("robot.subsystems")}>
        <RobotExplorer
          subsystems={subsystems}
          specs={headlineSpecs}
          robotName={robot.name ?? ""}
          philosophy={robot.philosophy ?? ""}
        />
      </Section>
      )}

{subsystems.length > 0 && (
      <Section {...copy("robot.detail")}>
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
                      style={{ fontSize: "15px", lineHeight: 1.55 }}
                    >
                      {f.value}
                    </p>
                  </div>
                ))}
            </Reveal>
          ))}
        </div>
      </Section>
      )}

{(cob.length > 0 || robot.phases?.length > 0) && (
      <Section
        {...copy("robot.strategy")}
        intro={robot.cobDescription}
      >
        {cob.length > 0 && (
          <Reveal>
            <div className="mb-10 grid gap-4 sm:grid-cols-3">
              {cob.map((c) => (
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
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {(robot.phases ?? []).map((phase, i) => (
            <Reveal key={phase.label} delay={i * 0.06} className="hud-frame overflow-hidden">
              {phase.clip && (
                <div className="scanlines">
                  <Video
                    sources={{ mp4: phase.clip, poster: phase.clipPoster }}
                    className="w-full"
                  />
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
                  style={{ fontSize: "15px", lineHeight: 1.55 }}
                >
                  {phase.summary}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
      )}

{models.length > 0 && (
      <Section
        {...copy("robot.cad")}
      >
        <Reveal>
          <CadViewer models={models} />
        </Reveal>
      </Section>
      )}

{evolution.length > 0 && (
      <Section
        {...copy("robot.evolution")}
      >
        <ol className="flex flex-col gap-4">
          {evolution.map((v, i) => (
            <Reveal as="li" key={`${v.subsystem}-${v.version}`} delay={i * 0.03}>
              <article className="hud-frame grid gap-6 p-6 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
                {(v.photos ?? []).length > 0 && (
                  <div className="grid grid-cols-2 gap-2 self-start">
                    {(v.photos ?? []).map((p: string) => (
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
      )}
    </>
  );
}
