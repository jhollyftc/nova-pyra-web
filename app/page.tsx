import Section from "@/components/Section";
import Hero from "@/components/home/Hero";
import RobotHotspots from "@/components/home/RobotHotspots";
import ProcessRing from "@/components/home/ProcessRing";
import SeasonPulse from "@/components/home/SeasonPulse";
import ImpactGrid from "@/components/home/ImpactGrid";
import AwardsRibbon from "@/components/home/AwardsRibbon";
import SponsorWall from "@/components/home/SponsorWall";
import {
  getAwards,
  getEdp,
  getHeadlineSpecs,
  getImpactStats,
  getOutreachEvents,
  getRobot,
  getSeason,
  getSeasonTelemetry,
  getSettings,
  getSponsorLogos,
  getSponsors,
  getSubsystemHotspots,
} from "@/lib/content";

export default async function HomePage() {
  // One await, in parallel — these are independent queries.
  const [
    settings, robot, season, stats, edp, awards,
    telemetry, hotspots, specs, outreach, sponsorLogos, sponsors,
  ] = await Promise.all([
    getSettings(), getRobot(), getSeason(), getImpactStats(), getEdp(), getAwards(),
    getSeasonTelemetry(), getSubsystemHotspots(), getHeadlineSpecs(),
    getOutreachEvents(), getSponsorLogos(), getSponsors(),
  ]);

  return (
    <>
      <Hero
        logo={
          settings.logoVideo
            ? { mp4: settings.logoVideo, poster: settings.logoPoster }
            : null
        }
        telemetry={telemetry}
        tagline={settings.tagline}
        teamName={settings.teamName}
        teamNumber={settings.teamNumber}
        location={settings.location}
        stats={[
          { value: stats?.peopleReached ?? 0, label: "People reached" },
          { value: stats?.volunteerHours ?? 0, label: "Volunteer hours" },
          { value: awards.length, label: "Awards won" },
          { value: stats?.teamsMentored ?? 0, label: "Teams mentored" },
        ]}
      />

      <Section
        eyebrow="The Robot"
        title={`Meet ${robot?.name ?? "our robot"}`}
        href="/robot"
        hrefLabel="Full breakdown"
        id="robot"
      >
        <RobotHotspots
          subsystems={hotspots}
          photo={settings.robotPhoto}
          specs={specs}
          robotName={robot?.name ?? ""}
          philosophy={robot?.philosophy ?? ""}
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
          steps={edp?.steps ?? []}
          narrative={edp?.narrative ?? ""}
          notebookPath={edp?.notebook ?? null}
        />
      </Section>

      <Section
        eyebrow={`${settings.season} · ${season?.gameName ?? ""}`}
        title="This season"
        href="/season"
        hrefLabel="Season detail"
      >
        <SeasonPulse goals={season.robotGoals} events={season.completed} />
      </Section>

      <Section
        eyebrow="Outreach & Impact"
        title="What we do off the field"
        intro={`${stats?.peopleReached ?? 0} people reached across ${stats?.eventsHosted ?? 0} events this season.`}
        href="/impact"
        hrefLabel="All outreach"
      >
        <ImpactGrid events={outreach} />
      </Section>

      <Section eyebrow="Trophy Case" title="Awards" href="/awards" hrefLabel="Full history">
        <AwardsRibbon awards={awards} />
      </Section>

      <Section eyebrow="Our Sponsors" title="Built by our community">
        <SponsorWall sponsors={sponsorLogos} total={sponsors.length} />
      </Section>
    </>
  );
}
