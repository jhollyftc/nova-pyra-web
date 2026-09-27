import Section from "@/components/Section";
import Hero from "@/components/home/Hero";
import RobotHotspots from "@/components/home/RobotHotspots";
import ProcessRing from "@/components/home/ProcessRing";
import SeasonPulse from "@/components/home/SeasonPulse";
import SeasonArchive from "@/components/season/SeasonArchive";
import ImpactGrid from "@/components/home/ImpactGrid";
import AwardsRibbon from "@/components/home/AwardsRibbon";
import SponsorStrip from "@/components/home/SponsorStrip";
import PostCard from "@/components/updates/PostCard";
import SponsorWall from "@/components/home/SponsorWall";
import {
  getAwards,
  getEdp,
  getHeadlineSpecs,
  getImpactStats,
  getLatestPost,
  getOutreach,
  getRobot,
  getSeason,
  getSeasonArchive,
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
    telemetry, hotspots, specs, archive, outreach, sponsorLogos, sponsors, copy,
    latestPost,
  ] = await Promise.all([
    getSettings(), getRobot(), getSeason(), getImpactStats(), getEdp(), getAwards(),
    getSeasonTelemetry(), getSubsystemHotspots(), getHeadlineSpecs(),
    getSeasonArchive(),
    getOutreach(), getSponsorLogos(), getSponsors(), getSectionCopy(),
    getLatestPost(),
  ]);

  // What is next, then what just happened. The grid used to be the seven
  // events newest-first, which put two dates months away at the top with
  // nothing marking them as future — the page read as a list of things the
  // team had already done, no matter how recently anything was added.
  const homeOutreach = [...outreach.upcoming, ...outreach.past].slice(0, 6);

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

      {/* Directly under the hero, which reserves --sponsor-strip for it, so the
          logos land on the first screen rather than at the foot of the page. */}
      <SponsorStrip sponsors={sponsorLogos} />

      {/*
        The newest update, first thing after the fold.

        Everything below it describes what the team IS — the robot, the
        process, the record. This is the only band that says what the team did
        this week, so it goes where someone scrolling will hit it first. It
        disappears entirely when nothing has been published, rather than
        sitting there advertising how long it has been.
      */}
      {latestPost && (
        <Section {...copy("home.updates")} href="/updates" hrefLabel="All updates">
          <ul className="grid gap-4">
            <PostCard post={latestPost} featured />
          </ul>
        </Section>
      )}

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

      {/*
        Two different things share this slot depending on where the team is.
        Mid-season it is goals and results. In build season — no results, no
        goals written yet — SeasonPulse renders two empty columns under a
        heading, which is how the front page came to look abandoned. The
        archive goes there instead, so last season's record stays on the page
        but is labelled as last season's.
      */}
      <Section
        {...copy("home.season", { season: settings.season, game: season?.gameName ?? "" })}
        href="/season"
        hrefLabel="Season detail"
      >
        {season.robotGoals.length > 0 || season.completed.length > 0 ? (
          <SeasonPulse goals={season.robotGoals} events={season.completed} />
        ) : (
          <SeasonArchive seasons={archive} />
        )}
      </Section>

      <Section
        {...copy("home.impact", {
          reached: stats?.peopleReached ?? 0,
          events: stats?.eventsHosted ?? 0,
        })}
        href="/impact"
        hrefLabel="All outreach"
      >
        <ImpactGrid events={homeOutreach} />
      </Section>

      <Section {...copy("home.awards")} href="/awards" hrefLabel="Full history">
        <AwardsRibbon awards={awards} />
      </Section>

      <Section {...copy("home.sponsors")}>
        <SponsorWall total={sponsors.length} />
      </Section>
    </>
  );
}
