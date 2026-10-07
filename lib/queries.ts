import { groq } from "next-sanity";

/**
 * GROQ queries, one per page's needs.
 *
 * Images are projected to a plain `url` here rather than returned as refs, so
 * components keep receiving strings and did not need rewriting for the CMS
 * swap. `w=` caps the source width; next/image still handles responsive sizes.
 */
const img = (field: string, w: number) =>
  `"${field}": ${field}.asset->url + "?w=${w}&auto=format"`;

const fileUrl = (field: string) => `"${field}": ${field}.asset->url`;

export const settingsQuery = groq`*[_id == "siteSettings"][0]{
  teamName, teamNumber, tagline, season, location, founded,
  ${fileUrl("logoVideo")},
  ${img("logoPoster", 900)},
  ${img("robotPhoto", 900)},
  ${img("teamPhoto", 1600)},
  socials, scouting
}`;

/**
 * Whether a robot has anything to show yet.
 *
 * Between kickoff and the first build, a season's robot exists as a name and
 * nothing else. Callers need to know that, because a page built around a robot
 * with no specs, no subsystems and no photo is just a heading.
 */
const documented = `"documented": count(specs) > 0
  || count(*[_type == "subsystem" && robot._ref == ^._id]) > 0`;

const robotFields = `
  _id, name, season, gameName, status, isCurrent, "slug": slug.current,
  ${documented},
  philosophy, specs,
  cobDescription, cobCritical, cobOptional, cobBypass,
  phases[]{ label, color, summary, ${fileUrl("clip")}, ${img("clipPoster", 900)} }`;

/** The robot belonging to the season in progress, built or not. */
export const currentRobotQuery = groq`*[_type == "robot"] | order(isCurrent desc, orderRank)[0]{
  _id, name, season, gameName, status, isCurrent, "slug": slug.current,
  ${documented},
  philosophy, specs,
  cobDescription, cobCritical, cobOptional, cobBypass,
  phases[]{ label, color, summary, ${fileUrl("clip")}, ${img("clipPoster", 900)} }
}`;

export const robotBySlugQuery = groq`*[_type == "robot" && slug.current == $slug][0]{${robotFields}
}`;

/**
 * The most recent robot there is actually something to say about.
 *
 * `/robot` is the site's showpiece and it followed whichever robot was flagged
 * current — so the moment BIOBUZZ became the current season the page turned
 * into a robot called TBD with no photo, no specs and no subsystems. Until the
 * team builds it, the page shows the newest robot that IS documented, labelled
 * with its own season so nobody mistakes it for this year's machine.
 */
export const featuredRobotQuery = groq`*[_type == "robot" && (
  count(specs) > 0 || count(*[_type == "subsystem" && robot._ref == ^._id]) > 0
)] | order(season desc, orderRank)[0]{${robotFields}
}`;

/** Just enough to build the season switcher. */
export const robotListQuery = groq`*[_type == "robot"] | order(orderRank){
  "slug": slug.current, name, season, gameName, status, isCurrent,
  ${documented}
}`;

export const subsystemsQuery = groq`*[_type == "subsystem" && robot._ref == $robotId] | order(orderRank){
  "id": slug.current, name, tagline, ${img("photo", 640)},
  hotspot, materials, motors, rationale, tradeoffs
}`;

export const evolutionQuery = groq`*[_type == "evolutionEntry" && robot._ref == $robotId] | order(orderRank){
  name, subsystem, version, dateRange, changes, result,
  "photos": photos[].asset->url
}`;

export const processQuery = groq`*[_id == "engineeringProcess"][0]{
  steps, narrative, ${fileUrl("notebook")}
}`;

export const problemsQuery = groq`*[_type == "problemCard"] | order(orderRank){
  "id": _id, problem, solution, result
}`;

export const chartsQuery = groq`*[_type == "testingChart"] | order(orderRank){
  "id": _id, title, subtitle, unit, betterDirection, data, insight
}`;

export const impactQuery = groq`*[_id == "impact"][0]{
  thisSeason, allTime, ${fileUrl("recapClip")}, ${img("recapPoster", 1000)}
}`;

export const outreachQuery = groq`*[_type == "outreachEvent"] | order(date desc){
  "id": _id, name, date, location, reached, summary, tags,
  "photos": photos[].asset->url
}`;

export const sponsorsQuery = groq`*[_type == "sponsor"] | order(orderRank){
  "id": _id, name, tier, description, url, ${img("logo", 400)}
}`;

export const sponsorshipQuery = groq`*[_id == "sponsorship"][0]{
  intro, contactEmail, donateUrl, fiscalSponsor, checkPayableTo, taxNote,
  "sponsorLetter": sponsorLetter.asset->url,
  whatItFunds, tiers
}`;

export const storyQuery = groq`*[_id == "teamStory"][0]{
  foundingStory, missionStatement, values, subteams, partners
}`;

export const membersQuery = groq`*[_type == "member"] | order(orderRank){
  "id": _id, name, kind, role, roleDescription, ${img("photo", 500)},
  status, classOf, nowDoing, yearsOnTeam,
  interests, funFact, whyRobotics, personalGoal, dreamOccupation, favoriteBook
}`;

export const awardsQuery = groq`*[_type == "award"] | order(orderRank){
  award, season, event, level
}`;

export const timelineQuery = groq`*[_type == "timelineEvent"] | order(orderRank){
  title, year, type, description
}`;

const seasonFields = `
  _id, gameName, gameYear, "slug": slug.current, isCurrent, kickoff,
  description, strategy, robotGoals, awardGoals,
  ${fileUrl("explainerVideo")}, ${img("explainerPoster", 1600)}`;

/** The season shown by default: whichever is flagged current. */
export const currentSeasonQuery = groq`*[_type == "season"] | order(isCurrent desc, gameYear desc)[0]{${seasonFields}
}`;

/** Every season, for the archive and the switcher. */
export const seasonListQuery = groq`*[_type == "season"] | order(gameYear desc){
  "slug": slug.current, gameName, gameYear, isCurrent
}`;

export const seasonEventsQuery = groq`*[_type == "seasonEvent" && season._ref == $seasonId] | order(orderRank){
  "id": _id, name, startDate, endDate, location, status, rank, record, awards,
  keyTakeaway, isWorlds, division, overallRank
}`;

/* ── Season updates ─────────────────────────────────────────────────
   The one document type the team writes freely, rather than filling in
   fields. Drafts are excluded everywhere: `_id` beginning `drafts.` is how
   Sanity stores unpublished work, and the site must never show it.
   ------------------------------------------------------------------- */
const postFields = `
  "id": _id, title, "slug": slug.current, publishedAt, excerpt,
  ${img("coverImage", 1400)}`;

export const postsQuery = groq`*[_type == "post" && !(_id in path("drafts.**"))]
  | order(publishedAt desc){${postFields}
}`;

export const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug
  && !(_id in path("drafts.**"))][0]{${postFields},
  body[]{
    ...,
    // Inline images are resolved to a URL here for the same reason every other
    // image is: components receive strings, never Sanity refs.
    _type == "image" => { "url": asset->url + "?w=1400&auto=format", alt }
  }
}`;

/** Neighbours for the "next update" link at the foot of a post. */
export const adjacentPostsQuery = groq`{
  "newer": *[_type == "post" && !(_id in path("drafts.**")) && publishedAt > $publishedAt]
    | order(publishedAt asc)[0]{ title, "slug": slug.current },
  "older": *[_type == "post" && !(_id in path("drafts.**")) && publishedAt < $publishedAt]
    | order(publishedAt desc)[0]{ title, "slug": slug.current }
}`;

export const sectionCopyQuery = groq`*[_type == "sectionCopy"]{ key, eyebrow, title, intro }`;

/**
 * Every season with its completed results, for the archive.
 *
 * The per-season record is summed from the results rather than stored, for the
 * same reason the current record is: a total typed in one place and results
 * entered in another will disagree within a season.
 */
export const seasonArchiveQuery = groq`*[_type == "season"] | order(gameYear desc){
  "id": _id, gameName, gameYear, isCurrent, "slug": slug.current,
  "events": *[_type == "seasonEvent" && season._ref == ^._id && status == "completed"]
    | order(startDate asc){ name, startDate, rank, record, awards, isWorlds, division }
}`;

/** The strongest finish from any previous season, used as a credential. */
export const bestPastResultQuery = groq`*[_type == "seasonEvent" && status == "completed"
  && season->isCurrent != true && defined(rank)] | order(isWorlds desc, rank asc)[0]{
  rank, division, isWorlds, "season": season->gameYear, "game": season->gameName
}`;
