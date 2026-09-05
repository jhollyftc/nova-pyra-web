import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import StatCounter from "@/components/StatCounter";
import Hero from "@/components/home/Hero";
import RobotHotspots from "@/components/home/RobotHotspots";
import ProcessRing from "@/components/home/ProcessRing";
import SeasonPulse from "@/components/home/SeasonPulse";
import ImpactGrid from "@/components/home/ImpactGrid";
import AwardsRibbon from "@/components/home/AwardsRibbon";
import SponsorWall from "@/components/home/SponsorWall";
import { video } from "@/lib/media";
import {
  team,
  getAwards,
  getEdp,
  getHeadlineSpecs,
  getImpactStats,
  getOutreachEvents,
  getRobot,
  getSeason,
  getSeasonTelemetry,
  getSponsorLogos,
  getSponsors,
  getSubsystemHotspots,
} from "@/lib/content";

export default function HomePage() {
  const robot = getRobot();
  const season = getSeason();
  const stats = getImpactStats();
  const edp = getEdp();
  const awards = getAwards();

  return (
    <>
      <Hero
        logo={video("logo-animated")}
        telemetry={getSeasonTelemetry()}
        tagline={team.tagline}
        teamNumber={team.number}
        location={team.location}
      />

      {/* 2 — Proof. Placed early: the most persuasive screen for sponsors and judges alike. */}
      <section className="shell py-[calc(var(--section-gap)/2)]">
        <Reveal>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            <StatCounter value={stats.peopleReached} label="People reached" />
            <StatCounter value={stats.volunteerHours} label="Volunteer hours" />
            <StatCounter value={awards.length} label="Awards won" />
            <StatCounter value={stats.teamsmentored} label="Teams mentored" />
          </div>
        </Reveal>
      </section>

      <Section
        eyebrow="The Robot"
        title={`Meet ${robot.name}`}
        href="/robot"
        hrefLabel="Full breakdown"
        id="robot"
      >
        <RobotHotspots
          subsystems={getSubsystemHotspots()}
          photo={robot.photo}
          specs={getHeadlineSpecs()}
          robotName={robot.name}
          philosophy={robot.philosophy}
        />
      </Section>

      <Section
        eyebrow="Engineering Process"
        title="How we engineer"
        intro="Every decision — including the ones we reject — is documented, so the reasoning behind the robot is traceable."
        href="/engineering"
        hrefLabel="Our process"
      >
        <ProcessRing
          steps={edp.steps}
          narrative={edp.narrative}
          notebookPath={edp.notebookPath}
        />
      </Section>

      <Section
        eyebrow={`${team.season} · ${season.gameName}`}
        title="This season"
        href="/season"
        hrefLabel="Season detail"
      >
        <SeasonPulse goals={season.robotGoals} events={season.completed} />
      </Section>

      <Section
        eyebrow="Outreach & Impact"
        title="What we do off the field"
        intro={`${stats.peopleReached} people reached across ${stats.eventsHosted} events this season.`}
        href="/impact"
        hrefLabel="All outreach"
      >
        <ImpactGrid events={getOutreachEvents()} />
      </Section>

      <Section
        eyebrow="Trophy Case"
        title="Awards"
        href="/awards"
        hrefLabel="Full history"
      >
        <AwardsRibbon awards={awards} />
      </Section>

      <Section eyebrow="Our Sponsors" title="Built by our community">
        <SponsorWall sponsors={getSponsorLogos()} total={getSponsors().length} />
      </Section>
    </>
  );
}
