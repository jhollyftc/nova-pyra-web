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
import { countdownLabel, daysUntil, formatDate, formatRange, isUpcoming } from "./dates";
import {
  SECTION_DEFAULTS,
  fillTokens,
  type SectionCopy,
  type SectionKey,
} from "./sectionCopy";

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
  /** `YYYY-MM-DD` — sortable, and what the countdown counts to. */
  date: string;
  /** The same date written out. Derived, never stored. */
  dateLabel: string;
  location: string | null;
  reached: number | null;
  summary: string | null;
  tags: string[] | null;
  photos: string[] | null;
};

export type SeasonEvent = {
  id: string;
  name: string;
  /** `YYYY-MM-DD`. The written range shown on the site is derived from it. */
  startDate: string | null;
  endDate: string | null;
  /** Formatted by the content layer, never stored — see `lib/dates.ts`. */
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
  _id: string;
  slug: string;
  isCurrent: boolean;
  kickoff: string | null;
  gameName: string;
  gameYear: string;
  description: string;
  strategy: string;
  robotGoals: Goal[];
  awardGoals: Goal[];
  explainerVideo: string | null;
  explainerPoster: string | null;
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
  status?: "active" | "alumni";
  classOf?: string;
  nowDoing?: string;
  yearsOnTeam?: string;
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

/**
 * Site settings, with the season year derived rather than typed.
 *
 * `siteSettings.season` is a free-text field that used to be the only record of
 * which season it is. Now that seasons are documents, keeping both means two
 * places to update at rollover and one of them silently going stale — so the
 * current season document wins and the typed value is only a fallback.
 */
export async function getSettings() {
  const [settings, season] = await Promise.all([
    client.fetch<Settings>(Q.settingsQuery),
    client.fetch<SeasonDoc>(Q.currentSeasonQuery),
  ]);
  return { ...settings, season: season?.gameYear ?? settings?.season ?? "" };
}

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
  const active = all.filter((m) => m.status !== "alumni");
  // Students only. Mentors marked alumni are intentionally rendered nowhere
  // until the team decides how to present them — their documents still exist
  // and are listed in the Studio, they are just held back from the site.
  const alumni = all.filter((m) => m.status === "alumni" && m.kind === "student");
  return {
    students: active.filter((m) => m.kind === "student"),
    mentors: active.filter((m) => m.kind === "mentor"),
    alumni,
  };
}

export const getTimeline = () => client.fetch<TimelineEntry[]>(Q.timelineQuery);
export const getAwards = () => client.fetch<Award[]>(Q.awardsQuery);

/* ── Robot ──────────────────────────────────────────────────────────── */

export type RobotSummary = {
  slug: string;
  name: string;
  season: string;
  gameName: string;
  status: "competed" | "in-development";
  isCurrent: boolean;
  /** Has specs or subsystems — i.e. there is something to put on a page. */
  documented: boolean;
};

export type RobotDoc = RobotSummary & {
  _id: string;
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

/** The robot belonging to the season in progress — which may not exist yet. */
export const getCurrentRobot = () => client.fetch<RobotDoc>(Q.currentRobotQuery);

/**
 * The robot to put in front of people.
 *
 * Normally this is the current one. During build season it is not: a robot
 * that has not been built has no specs, no subsystems and no photo, and
 * pointing the showpiece page at it empties the page. So the site features the
 * newest documented robot and falls back to the current one only if nothing
 * has ever been documented. `RobotView` already prints the robot's own season
 * as its eyebrow, so this can never read as a claim about this year.
 */
export async function getRobot() {
  const featured = await client.fetch<RobotDoc | null>(Q.featuredRobotQuery);
  return featured ?? (await getCurrentRobot());
}

export const getRobotBySlug = (slug: string) =>
  client.fetch<RobotDoc | null>(Q.robotBySlugQuery, { slug });

/** Every robot, for the season switcher. */
export const getRobotList = () => client.fetch<RobotSummary[]>(Q.robotListQuery);

// Subsystems and evolution entries belong to one robot, so they cannot be
// fetched without knowing which.
export const getSubsystems = (robotId: string) =>
  client.fetch<Subsystem[]>(Q.subsystemsQuery, { robotId });

export const getEvolution = (robotId: string) =>
  client.fetch<EvolutionEntry[]>(Q.evolutionQuery, { robotId });

/** Subsystems with a marker placed on the front-page robot photo. */
export async function getSubsystemHotspots() {
  const robot = await getRobot();
  const all = robot ? await getSubsystems(robot._id) : [];
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

/**
 * Competition results for one season, with their display dates formatted.
 *
 * `status` is a field someone sets by hand and forgets, so it is not trusted on
 * its own: an event whose last day has passed counts as completed regardless,
 * which is what stops "Upcoming" sitting over a date in the past.
 */
async function seasonEvents(seasonId: string) {
  const rows = await client.fetch<SeasonEvent[]>(Q.seasonEventsQuery, { seasonId });
  const events = rows.map((e) => ({ ...e, date: formatRange(e.startDate, e.endDate) }));
  const ahead = (e: SeasonEvent) =>
    e.status === "upcoming" && isUpcoming(e.startDate, e.endDate);
  return {
    all: events,
    completed: events.filter((e) => !ahead(e)),
    // Soonest first: an upcoming list is read from the top, and the next event
    // is the one that matters.
    upcoming: events
      .filter(ahead)
      .sort((a, b) => (a.startDate ?? "").localeCompare(b.startDate ?? "")),
  };
}

export async function getSeason() {
  const season = await client.fetch<SeasonDoc>(Q.currentSeasonQuery);
  const events = season
    ? await seasonEvents(season._id)
    : { all: [], completed: [], upcoming: [] };
  return {
    ...season,
    robotGoals: (season?.robotGoals ?? []) as Goal[],
    awardGoals: (season?.awardGoals ?? []) as Goal[],
    completed: events.completed,
    upcoming: events.upcoming,
  };
}

export type ArchivedSeason = {
  id: string;
  slug: string | null;
  gameName: string;
  gameYear: string;
  isCurrent: boolean;
  record: string;
  events: number;
  /**
   * Awards and alliance finishes listed on that season's results. Not the
   * trophy-case count — those are separate `award` documents, and /awards is
   * the page that reports them.
   */
  awards: number;
  /** The best finish that season, already written out for display. */
  best: string | null;
};

/**
 * Past seasons with their records, newest first.
 *
 * Exists because the site now has more than one season in it. Rolling over to
 * BIOBUZZ moved 23-5-0 and the Worlds run out of "this season" — true, but the
 * team's record is the most persuasive thing a sponsor reads, and it should not
 * disappear from the site the week a new game is announced. It just has to be
 * labelled with the season it belongs to.
 */
export async function getSeasonArchive(): Promise<ArchivedSeason[]> {
  type Row = Omit<ArchivedSeason, "record" | "events" | "awards" | "best"> & {
    events: {
      rank: number | null;
      record: { wins: number; losses: number; ties: number } | null;
      awards: string[] | null;
      isWorlds: boolean;
      division: string | null;
    }[];
  };
  const rows = await client.fetch<Row[]>(Q.seasonArchiveQuery);

  return rows.map((s) => {
    const tally = s.events.reduce(
      (acc, e) => ({
        wins: acc.wins + (e.record?.wins ?? 0),
        losses: acc.losses + (e.record?.losses ?? 0),
        ties: acc.ties + (e.record?.ties ?? 0),
      }),
      { wins: 0, losses: 0, ties: 0 },
    );
    const worlds = s.events.find((e) => e.isWorlds);
    const bestRank = s.events
      .filter((e) => typeof e.rank === "number")
      .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))[0];

    return {
      id: s.id,
      slug: s.slug,
      gameName: s.gameName,
      gameYear: s.gameYear,
      isCurrent: s.isCurrent,
      record: `${tally.wins}-${tally.losses}-${tally.ties}`,
      events: s.events.length,
      awards: s.events.reduce((n, e) => n + (e.awards?.length ?? 0), 0),
      best: worlds
        ? worlds.division
          ? `${worlds.division} Division #${worlds.rank} at Worlds`
          : `Worlds rank #${worlds.rank}`
        : bestRank
          ? `Rank #${bestRank.rank}`
          : null,
    };
  });
}

/**
 * The hero's telemetry strip.
 *
 * The record and Worlds rank are summed from the competition results rather
 * than typed anywhere, so adding an event in the Studio updates the front page
 * by itself.
 */
export type PastResult = {
  rank: number;
  division: string | null;
  isWorlds: boolean;
  season: string;
  game: string;
} | null;

export async function getSeasonTelemetry() {
  const [season, robot, best, outreach] = await Promise.all([
    client.fetch<SeasonDoc>(Q.currentSeasonQuery),
    // The telemetry strip reports the season in progress, so it names the
    // CURRENT robot even when the showpiece page is still featuring the last
    // one. An undocumented robot is reported as such rather than by whatever
    // placeholder name is sitting in the CMS.
    getCurrentRobot(),
    client.fetch<PastResult>(Q.bestPastResultQuery),
    getOutreach(),
  ]);
  const events = season
    ? await seasonEvents(season._id)
    : { all: [], completed: [], upcoming: [] };

  const completed = events.completed;

  /**
   * The next thing on the calendar, whichever kind it is.
   *
   * For most of a season the team's next appearance is an outreach event, not a
   * competition — during build season there are no competitions at all. Looking
   * only at results meant the front page had nothing to say for months at a
   * time while the team was demonstrably busy.
   */
  const nextUp = [
    ...events.upcoming.map((e) => ({ name: e.name, date: e.startDate })),
    ...outreach.upcoming.map((e) => ({ name: e.name, date: e.date })),
  ]
    .filter((e): e is { name: string; date: string } => Boolean(e.date))
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  const record = completed.reduce(
    (acc, e) => ({
      wins: acc.wins + (e.record?.wins ?? 0),
      losses: acc.losses + (e.record?.losses ?? 0),
      ties: acc.ties + (e.record?.ties ?? 0),
    }),
    { wins: 0, losses: 0, ties: 0 },
  );
  const worlds = completed.find((e) => e.isWorlds);

  // A season that has not competed yet has no record worth printing: "0-0-0"
  // reads as a losing team rather than an early one. In that case the strip
  // looks forward — what is next — and keeps the best past finish as a
  // credential, clearly labelled with the season it belongs to.
  const fresh = completed.length === 0;

  return {
    game: season?.gameName ?? "",
    robot: robot?.documented ? robot.name : "In design",
    fresh,
    // The countdown is the value and the event name the detail line: a date in
    // the future is the part that reads as alive, and "In 48 days" is legible
    // at a glance in a way a long event name is not.
    next: nextUp
      ? {
          label: "Next up",
          value: countdownLabel(daysUntil(nextUp.date) ?? 0),
          detail: nextUp.name,
        }
      : null,
    kickoff: season?.kickoff ?? null,
    past:
      best && best.rank
        ? {
            label: `${best.season} ${best.isWorlds ? "Worlds" : "best"}`,
            value: best.isWorlds && best.division
              ? `${best.division} #${best.rank}`
              : `Rank #${best.rank}`,
          }
        : null,
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
export async function getOutreachEvents() {
  const events = await client.fetch<OutreachEvent[]>(Q.outreachQuery);
  // Sanity stores `2026-11-19`; nobody wants to read that on a card.
  return events.map((e) => ({ ...e, dateLabel: formatDate(e.date) }));
}

/**
 * Outreach split by whether it has happened yet.
 *
 * The events list is ordered newest-first, which quietly buries anything
 * scheduled: two school STEM nights booked for November sat at the top of a
 * page headed "Where we showed up", reading as things the team had already
 * done. A date in the future is the most alive thing a team site can show, so
 * it gets its own list rather than being sorted in among the history.
 */
export async function getOutreach() {
  const events = await getOutreachEvents();
  const ahead = events.filter((e) => isUpcoming(e.date));
  return {
    all: events,
    past: events.filter((e) => !isUpcoming(e.date)),
    upcoming: ahead.slice().sort((a, b) => a.date.localeCompare(b.date)),
  };
}

/* ── Season updates ─────────────────────────────────────────────────── */

export type PostSummary = {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt: string | null;
  coverImage: string | null;
  /** The published date written out, derived rather than stored. */
  dateLabel: string;
};

/** A Portable Text block, plus the inline images we resolve to URLs. */
export type PostBlock = Record<string, unknown> & { _type: string; _key: string };

export type Post = PostSummary & { body: PostBlock[] | null };

export type PostLink = { title: string; slug: string } | null;

const withDate = <T extends { publishedAt: string }>(p: T) => ({
  ...p,
  dateLabel: formatDate(p.publishedAt),
});

/**
 * Season updates, newest first.
 *
 * This is the only content the team writes rather than fills in, and the only
 * thing on the site whose whole point is that it is recent. Everything else
 * describes a state; these describe a moment.
 */
export async function getPosts(): Promise<PostSummary[]> {
  const posts = await client.fetch<Omit<PostSummary, "dateLabel">[]>(Q.postsQuery);
  return posts.map(withDate);
}

export async function getPost(slug: string): Promise<Post | null> {
  const post = await client.fetch<Omit<Post, "dateLabel"> | null>(Q.postBySlugQuery, { slug });
  return post ? withDate(post) : null;
}

/** The one shown on the front page, if there is one. */
export async function getLatestPost(): Promise<PostSummary | null> {
  const posts = await getPosts();
  return posts[0] ?? null;
}

/**
 * The posts either side of this one by date.
 *
 * Read on its own a post is a dead end; a team's updates are only really a
 * story when you can walk them. Newer first, because that is the direction
 * someone arriving from a shared link wants to travel.
 */
export const getAdjacentPosts = (publishedAt: string) =>
  client.fetch<{ newer: PostLink; older: PostLink }>(Q.adjacentPostsQuery, { publishedAt });

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

/* ── Section headings ───────────────────────────────────────────────── */

/**
 * Returns a lookup for the framing copy above each block of content.
 *
 * CMS values win field by field, so clearing one field in the Studio falls back
 * to the built-in wording for that field alone rather than blanking the
 * heading. `vars` fills the {token} placeholders the page works out at render
 * time — counts, the current robot's name.
 *
 * One query serves a whole page; React's cache dedupes it across components.
 */
export type SectionCopyResolver = (
  key: SectionKey,
  vars?: Record<string, string | number>,
) => { eyebrow: string; title: string; intro?: string };

export async function getSectionCopy(): Promise<SectionCopyResolver> {
  const rows = await client.fetch<(SectionCopy & { key: SectionKey })[]>(Q.sectionCopyQuery);
  const overrides = new Map(rows.map((r) => [r.key, r]));

  return (key: SectionKey, vars: Record<string, string | number> = {}) => {
    const base = SECTION_DEFAULTS[key];
    const over = overrides.get(key);
    const pick = (field: "eyebrow" | "title" | "intro") => {
      const raw = over?.[field]?.trim() || (base as SectionCopy)[field];
      return raw ? fillTokens(raw, vars) : undefined;
    };
    return {
      eyebrow: pick("eyebrow") ?? "",
      title: pick("title") ?? "",
      intro: pick("intro"),
    };
  };
}
