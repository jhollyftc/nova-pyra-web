/**
 * Every section heading on the site, in one place.
 *
 * These were hardcoded in the page components, so changing a line of framing
 * copy meant a code edit and a deploy. They are content, and the people who
 * write them should not need a terminal.
 *
 * This file is the fallback layer AND the list of what is editable: the Studio
 * builds its key dropdown from `SECTION_KEYS`, so an editor cannot invent a key
 * that nothing reads, and a missing document renders the text below rather than
 * an empty heading.
 *
 * `{token}` placeholders are filled by the page — counts and names it works out
 * at render time. An editor can move a token around or drop it; anything left
 * unfilled is stripped rather than printed raw.
 */
export type SectionCopy = { eyebrow: string; title: string; intro?: string };

export const SECTION_DEFAULTS = {
  /* ── Home ─────────────────────────────────────────────────────────── */
  "home.robot": {
    eyebrow: "The Robot",
    title: "Meet {robot}",
  },
  "home.engineering": {
    eyebrow: "Engineering Process",
    title: "How we engineer",
    intro:
      "Every decision — including the ones we reject — is documented, so the reasoning behind the robot is traceable.",
  },
  "home.season": {
    eyebrow: "{season} · {game}",
    title: "This season",
  },
  "home.impact": {
    eyebrow: "Outreach & Impact",
    title: "What we do off the field",
    intro: "{reached} people reached across {events} events this season.",
  },
  "home.awards": {
    eyebrow: "Trophy Case",
    title: "Awards",
  },
  "home.sponsors": {
    eyebrow: "Our Sponsors",
    title: "Built by our community",
  },

  /* ── Robot ────────────────────────────────────────────────────────── */
  "robot.specs": { eyebrow: "Specifications", title: "At a glance" },
  "robot.subsystems": { eyebrow: "Subsystems", title: "How it works" },
  "robot.detail": { eyebrow: "Detail", title: "Design rationale" },
  "robot.strategy": { eyebrow: "Game Strategy", title: "Critical, optional, bypass" },
  "robot.cad": {
    eyebrow: "CAD",
    title: "Explore in 3D",
    intro: "The same models we design and iterate in — rendered in your browser.",
  },
  "robot.evolution": {
    eyebrow: "Design Evolution",
    title: "What we changed, and why",
    intro: "Each entry records what changed and what it bought us.",
  },

  /* ── Engineering ──────────────────────────────────────────────────── */
  "engineering.header": {
    eyebrow: "Engineering Process",
    title: "How we engineer",
    intro:
      "Every decision, including the ones we reject, is documented with its reasoning — a traceable record, and how new members learn why the robot looks the way it does.",
  },
  "engineering.cycle": { eyebrow: "The Cycle", title: "Engineering design process" },
  "engineering.problems": {
    eyebrow: "Problem → Solution",
    title: "What went wrong, and what we did",
    intro:
      "The failures are the interesting part. Each of these cost us matches before it cost us a redesign.",
  },
  "engineering.testing": {
    eyebrow: "Testing & Data",
    title: "We measured it",
    intro: "Every claim about the robot traces back to a number we recorded.",
  },

  /* ── Team ─────────────────────────────────────────────────────────── */
  "team.header": {
    eyebrow: "Our Story",
    title: "Who we are",
    intro: "FIRST Tech Challenge Team {teamNumber}, founded {founded} in {location}.",
  },
  "team.mission": { eyebrow: "What drives us", title: "Mission" },
  "team.values": { eyebrow: "What we stand for", title: "Values" },
  "team.subteams": { eyebrow: "How we organise", title: "Subteams" },
  "team.students": { eyebrow: "Students", title: "The team · {n} members" },
  "team.mentors": { eyebrow: "Mentors & Boosters", title: "Behind the team · {n}" },
  "team.alumni": {
    eyebrow: "Past members",
    title: "Alumni",
    intro: "Students who moved on. They built the robots that came before this one.",
  },
  "team.partners": { eyebrow: "FIRST & Industry", title: "Partners" },

  /* ── Impact ───────────────────────────────────────────────────────── */
  "impact.header": {
    eyebrow: "Outreach & Impact",
    title: "What we do off the field",
    intro: "Robots are the excuse. The point is getting more kids in front of engineering.",
  },
  "impact.allTime": { eyebrow: "All time", title: "Since we started" },
  "impact.events": { eyebrow: "Events", title: "Where we showed up" },

  /* ── Season ───────────────────────────────────────────────────────── */
  "season.strategy": { eyebrow: "Approach", title: "Our strategy" },
  "season.progress": { eyebrow: "Progress", title: "Goals & results" },
  "season.awardGoals": { eyebrow: "Awards", title: "What we're chasing" },
  "season.detail": { eyebrow: "Detail", title: "Event by event" },

  /* ── Awards ───────────────────────────────────────────────────────── */
  "awards.header": {
    eyebrow: "Trophy Case",
    title: "Awards & timeline",
    intro:
      "{n} awards across two seasons — including Louisiana State Champions and a Design Award 3rd Place at the FIRST World Championship.",
  },
  "awards.timeline": {
    eyebrow: "History",
    title: "Team timeline",
    intro: "{n} milestones since the team was founded.",
  },

  /* ── Sponsors ─────────────────────────────────────────────────────── */
  "sponsors.header": {
    eyebrow: "Thank You",
    title: "Built by our community",
    intro:
      "{n} sponsors fund our parts, our travel, and the outreach we run across St. Tammany Parish.",
  },
  "sponsors.join": { eyebrow: "Join them", title: "Support Nova Pyra" },
  "sponsorsJoin.header": { eyebrow: "Sponsor Us", title: "Put your name on a robot" },
  "sponsorsJoin.reach": { eyebrow: "Reach", title: "What your support buys" },
  "sponsorsJoin.tiers": {
    eyebrow: "Tiers & giving",
    title: "Choose a level",
    intro: "{n} sponsors already back the team — from $1 to $1,000+.",
  },
  "sponsorsJoin.contact": { eyebrow: "Get in touch", title: "Talk to us" },
} as const satisfies Record<string, SectionCopy>;

export type SectionKey = keyof typeof SECTION_DEFAULTS;

export const SECTION_KEYS = Object.keys(SECTION_DEFAULTS) as SectionKey[];

/**
 * Fill `{token}` placeholders. Unknown or unsupplied tokens are removed rather
 * than printed, so an editor who leaves a stray `{n}` gets a slightly short
 * heading instead of literal braces on the live site.
 */
export function fillTokens(text: string, vars: Record<string, string | number> = {}) {
  return text
    .replace(/\{(\w+)\}/g, (_, key) => (key in vars ? String(vars[key]) : ""))
    .replace(/\s{2,}/g, " ")
    .trim();
}
