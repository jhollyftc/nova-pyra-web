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
  getSectionCopy,
  getSubsystemHotspots,
} from "@/lib/content";

export default async function HomePage() {
  // One await, in parallel — these are independent queries.
  const [
    settings, robot, season, stats, edp, awards,
    telemetry, hotspots, specs, outreach, sponsorLogos, sponsors, copy,
  ] = await Promise.all([
    getSettings(), getRobot(), getSeason(), getImpactStats(), getEdp(), getAwards(),
    getSeasonTelemetry(), getSubsystemHotspots(), getHeadlineSpecs(),
    getOutreachEvents(), getSponsorLogos(), getSponsors(), getSectionCopy(),
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
        {...copy("home.robot", { robot: robot?.name ?? "our robot" })}
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
        {...copy("home.engineering")}
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
        {...copy("home.season", { season: settings.season, game: season?.gameName ?? "" })}
        href="/season"
        hrefLabel="Season detail"
      >
        <SeasonPulse goals={season.robotGoals} events={season.completed} />
      </Section>

      <Section
        {...copy("home.impact", {
          reached: stats?.peopleReached ?? 0,
          events: stats?.eventsHosted ?? 0,
        })}
        href="/impact"
        hrefLabel="All outreach"
      >
        <ImpactGrid events={outreach} />
      </Section>

      <Section {...copy("home.awards")} href="/awards" hrefLabel="Full history">
        <AwardsRibbon awards={awards} />
      </Section>

      <Section {...copy("home.sponsors")}>
        <SponsorWall sponsors={sponsorLogos} total={sponsors.length} />
      </Section>
    </>
  );
}
