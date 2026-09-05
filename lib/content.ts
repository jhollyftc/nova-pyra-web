/**
 * The single boundary between the site and its content.
 *
 * Nothing in `app/` or `components/` may import a JSON file directly. Every read
 * goes through an accessor here, so Phase 2 can swap these bodies for Sanity
 * queries without touching a single component. The exported types are the
 * contract Sanity's schemas must satisfy.
 */
import configJson from "@/content/config.json";
import specsJson from "@/content/robot/specs.json";
import edpJson from "@/content/process/edp.json";
import statsJson from "@/content/outreach/stats.json";
import outreachEventsJson from "@/content/outreach/events.json";
import sponsorsJson from "@/content/outreach/sponsors.json";
import sponsorshipJson from "@/content/sponsorship.json";
import strategyJson from "@/content/robot/strategy.json";
import evolutionJson from "@/content/robot/evolution.json";
import problemsJson from "@/content/process/problems.json";
import testingJson from "@/content/process/testing.json";
import awardsJson from "@/content/story/awards.json";
import membersJson from "@/content/story/members.json";
import timelineJson from "@/content/story/timeline.json";
import teamJson from "@/content/story/team.json";
import seasonOverviewJson from "@/content/season/overview.json";
import seasonGoalsJson from "@/content/season/goals.json";
import seasonEventsJson from "@/content/season/events.json";

/**
 * Every asset path from the content JSON must pass through here.
 *
 * The pit app's JSON mixes casing — `/images/Sponsors/MO.png`, `/images/Events/PES.JPG` —
 * and the media pipeline writes everything lowercase. Windows does not care;
 * Vercel's Linux hosts return 404. Normalising centrally means a new content
 * entry cannot reintroduce the bug.
 */
const asset = <T extends string | null | undefined>(p: T): T =>
  (p ? (p.toLowerCase() as T) : p);

/* ── Types ──────────────────────────────────────────────────────────── */

export type Subsystem = {
  id: string;
  name: string;
  tagline: string;
  photo: string;
  materials: string;
  motors: string;
  rationale: string;
  tradeoffs: string;
  color: string;
  cadModelPath: string | null;
  /** Marker position on the robot photo, as a percentage of the image box. */
  hotspot: { x: number; y: number } | null;
};

export type Sponsor = {
  id: string;
  name: string;
  tier: SponsorTier;
  logo: string | null;
  description: string;
};

export type SponsorTier = "sustainer" | "firestarter" | "campfire" | "igniter" | "kindling";

export type Award = {
  season: string;
  award: string;
  event: string;
  level: "qualifier" | "state" | "worlds";
};

export type OutreachEvent = {
  id: string;
  name: string;
  date: string;
  location: string;
  reached: number;
  summary: string;
  tags: string[];
  image: string | null;
};

export type SeasonEvent = {
  id: string;
  name: string;
  date: string;
  location: string;
  rank: number;
  record: { wins: number; losses: number; ties: number };
  awards: string[];
  keyTakeaway: string;
};

export type Goal = { goal: string; progress: number; status: string; note: string };

/* ── Team & config ──────────────────────────────────────────────────── */

export const team = {
  number: configJson.team.number,
  name: configJson.team.name,
  tagline: configJson.team.tagline,
  season: configJson.team.season,
  /** Not in config.json — established in story/team.json and the sibling repos. */
  founded: teamJson.founding,
  location: "Mandeville, Louisiana",
};

export const getTeamStory = () => ({
  foundingStory: teamJson.foundingStory,
  mission: teamJson.missionStatement,
  values: teamJson.values,
  partners: teamJson.partners,
  subteams: teamJson.subteams,
});

/* ── Robot ──────────────────────────────────────────────────────────── */

export const getRobot = () => ({
  name: specsJson.name,
  philosophy: specsJson.philosophy,
  photo: asset(specsJson.photo),
  specs: specsJson.specs as Record<string, string>,
  cadModelPath: specsJson.cadModelPath,
  subsystems: getSubsystems(),
});

/**
 * The five subsystems. `photo` is the CAD render; the master-detail explorer on
 * /robot uses those.
 */
export const getSubsystems = (): Subsystem[] =>
  (specsJson.subsystems as Subsystem[]).map((s) => ({ ...s, photo: asset(s.photo) }));

/**
 * Subsystems that have a marker placed on the robot photo, for the front-page
 * hotspot explorer. Coordinates live in content/robot/specs.json so they can be
 * nudged without touching code.
 */
export const getSubsystemHotspots = () =>
  getSubsystems().filter(
    (s): s is Subsystem & { hotspot: { x: number; y: number } } => s.hotspot !== null,
  );

/** The three headline specs used on the front page, in display order. */
export const getHeadlineSpecs = () => [
  specsJson.specs.weight,
  specsJson.specs.dimensions.replace(/\s*\(.*\)$/, ""),
  specsJson.specs.driveType,
];

export const getStrategy = () => ({
  cob: strategyJson.cob,
  phases: strategyJson.phases,
});

/**
 * Design evolution. Photo paths are lowercased for the same Linux-casing reason
 * as the outreach images — `intake-gen1.JPG` on disk, lowercase in the JSON.
 */
export const getEvolution = () =>
  evolutionJson.versions.map((v) => ({
    ...v,
    // Two entries (Intake Gen 3 & 4, Shooter Gen 3) carry empty photo strings —
    // the team never added those images. Drop them rather than rendering an
    // <Image src="">, which makes the browser re-request the whole page.
    photos: (v.photos ?? []).filter((p) => p && p.trim()).map(asset),
  }));

/* ── Engineering process ────────────────────────────────────────────── */

export const getProblems = () => problemsJson.cards;
export const getTestingCharts = () => testingJson.charts;

export const getEdp = () => ({
  steps: edpJson.steps,
  narrative: edpJson.narrative,
  notebookPath: edpJson.notebookPath,
});

/* ── Season ─────────────────────────────────────────────────────────── */

export const getSeason = () => ({
  gameName: seasonOverviewJson.gameName,
  gameYear: seasonOverviewJson.gameYear,
  description: seasonOverviewJson.description,
  strategy: seasonOverviewJson.strategy,
  robotGoals: seasonGoalsJson.robotGoals as Goal[],
  awardGoals: seasonGoalsJson.awardGoals as Goal[],
  completed: seasonEventsJson.completed as SeasonEvent[],
  upcoming: seasonEventsJson.upcoming as SeasonEvent[],
});

/**
 * Cumulative record across every completed event this season, and the Worlds
 * placement. Both appear in the hero telemetry strip, so they are derived once
 * here rather than being retyped into a config file that can drift.
 */
export const getSeasonTelemetry = () => {
  const completed = seasonEventsJson.completed as SeasonEvent[];
  const record = completed.reduce(
    (acc, e) => ({
      wins: acc.wins + e.record.wins,
      losses: acc.losses + e.record.losses,
      ties: acc.ties + e.record.ties,
    }),
    { wins: 0, losses: 0, ties: 0 },
  );
  const worlds = completed.find((e) => e.name.includes("World"));
  return {
    game: seasonOverviewJson.gameName,
    robot: specsJson.name,
    record: `${record.wins}-${record.losses}-${record.ties}`,
    worldsRank: worlds ? `#${worlds.rank}` : null,
  };
};

/* ── Outreach & impact ──────────────────────────────────────────────── */

export const getImpactStats = () => statsJson.thisSeason;
export const getAllTimeStats = () => statsJson.allTime;

/**
 * Image paths are lowercased to match the media pipeline's output. The pit app's
 * JSON still says `/images/Events/LATM.jpg`, which resolves on Windows but 404s
 * on Vercel's Linux hosts.
 *
 * Only 2 of the 7 events currently have a photo, so consumers must handle a null.
 */
export const getOutreachEvents = (): OutreachEvent[] =>
  (outreachEventsJson.events as OutreachEvent[]).map((e) => ({
    ...e,
    image: asset(e.image),
  }));

/* ── Awards ─────────────────────────────────────────────────────────── */

export const getAwards = () => awardsJson.awards as Award[];

/* ── People & timeline ──────────────────────────────────────────────── */

/**
 * Members are stored first-name + last-initial. That is a deliberate
 * minor-privacy convention carried over from the pit app and must not regress
 * on a public site — do not add surnames here or in the CMS.
 */
export const getMembers = () => ({
  students: membersJson.members.map((m) => ({ ...m, photo: asset(m.photo) })),
  mentors: membersJson.mentors.map((m) => ({ ...m, photo: asset(m.photo) })),
});

export const getTimeline = () => timelineJson.milestones;

/* ── Sponsors ───────────────────────────────────────────────────────── */

/** Tier labels and thresholds. Hard-coded in the pit app's OutreachSection. */
export const SPONSOR_TIERS: { id: SponsorTier; label: string; amount: string }[] = [
  { id: "sustainer",   label: "Sustainer",   amount: "$1,000+"  },
  { id: "firestarter", label: "Firestarter", amount: "$500–999" },
  { id: "campfire",    label: "Campfire",    amount: "$200–499" },
  { id: "igniter",     label: "Igniter",     amount: "$50–199"  },
  { id: "kindling",    label: "Kindling",    amount: "$1–49"    },
];

export const getSponsors = (): Sponsor[] =>
  (sponsorsJson.sponsors as Sponsor[]).map((s) => ({ ...s, logo: asset(s.logo) }));

/**
 * The sponsorship pitch. Tiers, amounts and benefits are the team's real
 * published commitments, transcribed from novapyra.org/sponsor-us.html.
 */
export const getSponsorship = () => {
  const byId = new Map(sponsorshipJson.tiers.map((t) => [t.id, t.benefits]));
  return {
    intro: sponsorshipJson.intro,
    whatItFunds: sponsorshipJson.whatItFunds,
    contactEmail: sponsorshipJson.contactEmail,
    contactEmailVerified: sponsorshipJson.contactEmailVerified,
    fiscalSponsor: sponsorshipJson.fiscalSponsor,
    checkPayableTo: sponsorshipJson.checkPayableTo,
    taxNote: sponsorshipJson.taxNote,
    tiers: SPONSOR_TIERS.map((tier) => ({
      ...tier,
      benefits: byId.get(tier.id) ?? [],
      currentCount: (sponsorsJson.sponsors as Sponsor[]).filter((s) => s.tier === tier.id)
        .length,
    })),
  };
};

export const getSponsorsByTier = () =>
  SPONSOR_TIERS.map((tier) => ({
    ...tier,
    sponsors: getSponsors().filter((s) => s.tier === tier.id),
  }));

/** Sponsors that have a logo, for the front-page marquee. */
export const getSponsorLogos = () => getSponsors().filter((s) => s.logo);
