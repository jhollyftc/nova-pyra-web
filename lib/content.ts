/**
 * The single boundary between the site and its content.
 *
 * Content lives in Sanity. Nothing in `app/` or `components/` talks to Sanity
 * directly — every read goes through an accessor here, which is what let the
 * CMS swap happen without rewriting a single page.
 *
 * All accessors are async. Pages are server components, so they simply await;
 * the two client components that need team details (the header and footer)
 * receive them as props from the layout.
 */
import { client } from "@/sanity/lib/client";
import * as Q from "./queries";

/* ── Types ──────────────────────────────────────────────────────────── */

export type Subsystem = {
  id: string;
  name: string;
  tagline: string;
  photo: string | null;
  materials: string;
  motors: string;
  rationale: string;
  tradeoffs: string;
  hotspot: { x: number; y: number } | null;
};

export type SponsorTier = "sustainer" | "firestarter" | "campfire" | "igniter" | "kindling";

export type Sponsor = {
  id: string;
  name: string;
  tier: SponsorTier;
  logo: string | null;
  description: string | null;
  url: string | null;
};

export type Award = {
  award: string;
  season: string;
  event: string;
  level: "qualifier" | "state" | "worlds";
};

export type OutreachEvent = {
  id: string;
  name: string;
  date: string;
  location: string | null;
  reached: number | null;
  summary: string | null;
  tags: string[] | null;
  photos: string[] | null;
};

export type SeasonEvent = {
  id: string;
  name: string;
  date: string;
  location: string;
  status: "completed" | "upcoming";
  rank: number;
  record: { wins: number; losses: number; ties: number };
  awards: string[];
  keyTakeaway: string;
  isWorlds: boolean;
  /** World Championship only: teams are split into divisions and compete within one. */
  division: string | null;
  /** World Championship only: placing across every division. */
  overallRank: number | null;
};

export type Goal = { goal: string; progress: number; status: string; note: string };

export type Value = { icon: string; label: string; description: string };
export type Subteam = { icon: string; name: string; goal: string; challenge: string };
export type Partner = { name: string; type: string; description: string };
export type Story = {
  foundingStory: string;
  missionStatement: string;
  values: Value[];
  subteams: Subteam[];
  partners: Partner[];
};
export type TimelineEntry = { title: string; year: string; type: string; description: string };
export type ProblemCard = { id: string; problem: string; solution: string; result: string };
export type EdpDoc = {
  steps: { _key?: string; label: string; description: string }[];
  narrative: string;
  notebook: string | null;
};
export type EvolutionEntry = {
  name: string;
  subsystem: string;
  version: string;
  dateRange: string;
  changes: string;
  result: string;
  photos: string[] | null;
};
export type SeasonDoc = {
  gameName: string;
  gameYear: string;
  description: string;
  strategy: string;
  robotGoals: Goal[];
  awardGoals: Goal[];
};

export type Member = {
  id: string;
  name: string;
  kind: "student" | "mentor";
  role: string;
  roleDescription?: string;
  photo: string | null;
  interests?: string;
  funFact?: string;
  whyRobotics?: string;
  personalGoal?: string;
  dreamOccupation?: string;
  favoriteBook?: string;
};

export type Settings = {
  teamName: string;
  teamNumber: string;
  tagline: string;
  season: string;
  location: string;
  founded: string;
  logoVideo: string | null;
  logoPoster: string | null;
  robotPhoto: string | null;
  teamPhoto: string | null;
  socials: {
    instagram?: string;
    youtube?: string;
    facebook?: string;
    github?: string;
    cad?: string;
  } | null;
  /** Third-party sites carrying the team's official results. */
  scouting: {
    ftcEvents?: string;
    ftcScout?: string;
    ftcStats?: string;
  } | null;
};

export type TestingChart = {
  id: string;
  title: string;
  subtitle: string;
  unit: string;
  betterDirection: "higher" | "lower";
  data: { label: string; value: number }[];
  insight: string;
};

/* ── Settings ───────────────────────────────────────────────────────── */

export const getSettings = () => client.fetch<Settings>(Q.settingsQuery);

/* ── Story & people ─────────────────────────────────────────────────── */

export const getTeamStory = () => client.fetch<Story>(Q.storyQuery);

/**
 * Students and mentors, split.
 *
 * Names are stored first-name + last-initial. That is a deliberate privacy
 * practice for minors on a public site, and the Studio's `member` schema
 * validates against surnames rather than trusting it.
 */
export async function getMembers() {
  const all = await client.fetch<Member[]>(Q.membersQuery);
  return {
    students: all.filter((m) => m.kind === "student"),
    mentors: all.filter((m) => m.kind === "mentor"),
  };
}

export const getTimeline = () => client.fetch<TimelineEntry[]>(Q.timelineQuery);
export const getAwards = () => client.fetch<Award[]>(Q.awardsQuery);

/* ── Robot ──────────────────────────────────────────────────────────── */

type RobotDoc = {
  name: string;
  philosophy: string;
  specs: { label: string; value: string }[];
  cobDescription: string;
  cobCritical: string;
  cobOptional: string;
  cobBypass: string;
  phases: {
    label: string;
    color: string;
    summary: string;
    clip: string | null;
    clipPoster: string | null;
  }[];
};

export const getRobot = () => client.fetch<RobotDoc>(Q.robotQuery);
export const getSubsystems = () => client.fetch<Subsystem[]>(Q.subsystemsQuery);
export const getEvolution = () => client.fetch<EvolutionEntry[]>(Q.evolutionQuery);

/** Subsystems with a marker placed on the front-page robot photo. */
export async function getSubsystemHotspots() {
  const all = await getSubsystems();
  return all.filter(
    (s): s is Subsystem & { hotspot: { x: number; y: number } } =>
      s.hotspot != null && typeof s.hotspot.x === "number",
  );
}

/** The first three specs, shown on the front page. Order is editable in Sanity. */
export async function getHeadlineSpecs() {
  const robot = await getRobot();
  return (robot?.specs ?? []).slice(0, 3).map((s) => s.value.replace(/\s*\(.*\)$/, ""));
}

/* ── Engineering process ────────────────────────────────────────────── */

export const getEdp = () => client.fetch<EdpDoc>(Q.processQuery);
export const getProblems = () => client.fetch<ProblemCard[]>(Q.problemsQuery);
export const getTestingCharts = () => client.fetch<TestingChart[]>(Q.chartsQuery);

/* ── Season ─────────────────────────────────────────────────────────── */

export async function getSeason() {
  const [season, events] = await Promise.all([
    client.fetch<SeasonDoc>(Q.seasonQuery),
    client.fetch<SeasonEvent[]>(Q.seasonEventsQuery),
  ]);
  return {
    ...season,
    robotGoals: (season?.robotGoals ?? []) as Goal[],
    awardGoals: (season?.awardGoals ?? []) as Goal[],
    completed: events.filter((e) => e.status === "completed"),
    upcoming: events.filter((e) => e.status === "upcoming"),
  };
}

/**
 * The hero's telemetry strip.
 *
 * The record and Worlds rank are summed from the competition results rather
 * than typed anywhere, so adding an event in the Studio updates the front page
 * by itself.
 */
export async function getSeasonTelemetry() {
  const [season, events, robot] = await Promise.all([
    client.fetch<{ gameName: string }>(Q.seasonQuery),
    client.fetch<SeasonEvent[]>(Q.seasonEventsQuery),
    client.fetch<{ name: string }>(Q.robotQuery),
  ]);

  const completed = events.filter((e) => e.status === "completed");
  const record = completed.reduce(
    (acc, e) => ({
      wins: acc.wins + (e.record?.wins ?? 0),
      losses: acc.losses + (e.record?.losses ?? 0),
      ties: acc.ties + (e.record?.ties ?? 0),
    }),
    { wins: 0, losses: 0, ties: 0 },
  );
  const worlds = completed.find((e) => e.isWorlds);

  return {
    game: season?.gameName ?? "",
    robot: robot?.name ?? "",
    record: `${record.wins}-${record.losses}-${record.ties}`,
    // At the World Championship teams are split into divisions and ranked within
    // one, so a bare "#17" reads as an overall placing and overstates the result
    // — the team's overall rank was 91st. Label and value are built together so
    // they cannot drift apart.
    worlds: worlds
      ? worlds.division
        ? { label: "Worlds division", value: `${worlds.division} #${worlds.rank}` }
        : { label: "Worlds", value: `Rank #${worlds.rank}` }
      : null,
  };
}

/* ── Outreach & impact ──────────────────────────────────────────────── */

type ImpactCounts = {
  peopleReached: number;
  volunteerHours: number;
  eventsHosted: number;
  schoolsVisited: number;
  teamsMentored: number;
};

const getImpact = () =>
  client.fetch<{
    thisSeason: ImpactCounts;
    allTime: ImpactCounts;
    recapClip: string | null;
    recapPoster: string | null;
  }>(Q.impactQuery);

export const getImpactStats = async () => (await getImpact()).thisSeason;
export const getAllTimeStats = async () => (await getImpact()).allTime;
export const getRecapClip = async () => (await getImpact()).recapClip;
export const getRecapPoster = async () => (await getImpact()).recapPoster;
export const getOutreachEvents = () => client.fetch<OutreachEvent[]>(Q.outreachQuery);

/* ── Sponsors ───────────────────────────────────────────────────────── */

export const SPONSOR_TIERS: { id: SponsorTier; label: string; amount: string }[] = [
  { id: "sustainer", label: "Sustainer", amount: "$1,000+" },
  { id: "firestarter", label: "Firestarter", amount: "$500–999" },
  { id: "campfire", label: "Campfire", amount: "$200–499" },
  { id: "igniter", label: "Igniter", amount: "$50–199" },
  { id: "kindling", label: "Kindling", amount: "$1–49" },
];

export const getSponsors = () => client.fetch<Sponsor[]>(Q.sponsorsQuery);

export async function getSponsorsByTier() {
  const sponsors = await getSponsors();
  return SPONSOR_TIERS.map((tier) => ({
    ...tier,
    sponsors: sponsors.filter((s) => s.tier === tier.id),
  }));
}

export const getSponsorLogos = async () => (await getSponsors()).filter((s) => s.logo);

export async function getSponsorship() {
  const [doc, sponsors] = await Promise.all([
    client.fetch<{
      intro: string;
      contactEmail: string;
      donateUrl: string | null;
      sponsorLetter: string | null;
      fiscalSponsor: string;
      checkPayableTo: string;
      taxNote: string;
      whatItFunds: { label: string; description: string }[];
      tiers: { tier: SponsorTier; benefits: string[] }[];
    }>(Q.sponsorshipQuery),
    getSponsors(),
  ]);

  const benefits = new Map((doc?.tiers ?? []).map((t) => [t.tier, t.benefits]));

  return {
    intro: doc?.intro ?? "",
    contactEmail: doc?.contactEmail ?? "",
    donateUrl: doc?.donateUrl ?? null,
    sponsorLetter: doc?.sponsorLetter ?? null,
    fiscalSponsor: doc?.fiscalSponsor ?? "",
    checkPayableTo: doc?.checkPayableTo ?? "",
    taxNote: doc?.taxNote ?? "",
    whatItFunds: doc?.whatItFunds ?? [],
    tiers: SPONSOR_TIERS.map((tier) => ({
      ...tier,
      benefits: benefits.get(tier.id) ?? [],
      currentCount: sponsors.filter((s) => s.tier === tier.id).length,
    })),
  };
}
