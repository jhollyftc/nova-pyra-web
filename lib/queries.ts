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

/** The robot shown by default: whichever is flagged current, newest as a fallback. */
export const currentRobotQuery = groq`*[_type == "robot"] | order(isCurrent desc, order asc)[0]{
  _id, name, season, gameName, status, isCurrent, "slug": slug.current,
  philosophy, specs,
  cobDescription, cobCritical, cobOptional, cobBypass,
  phases[]{ label, color, summary, ${fileUrl("clip")}, ${img("clipPoster", 900)} }
}`;

export const robotBySlugQuery = groq`*[_type == "robot" && slug.current == $slug][0]{
  _id, name, season, gameName, status, isCurrent, "slug": slug.current,
  philosophy, specs,
  cobDescription, cobCritical, cobOptional, cobBypass,
  phases[]{ label, color, summary, ${fileUrl("clip")}, ${img("clipPoster", 900)} }
}`;

/** Just enough to build the season switcher. */
export const robotListQuery = groq`*[_type == "robot"] | order(order asc){
  "slug": slug.current, name, season, gameName, status, isCurrent
}`;

export const subsystemsQuery = groq`*[_type == "subsystem" && robot._ref == $robotId] | order(order asc){
  "id": slug.current, name, tagline, ${img("photo", 640)},
  hotspot, materials, motors, rationale, tradeoffs
}`;

export const evolutionQuery = groq`*[_type == "evolutionEntry" && robot._ref == $robotId] | order(order asc){
  name, subsystem, version, dateRange, changes, result,
  "photos": photos[].asset->url
}`;

export const processQuery = groq`*[_id == "engineeringProcess"][0]{
  steps, narrative, ${fileUrl("notebook")}
}`;

export const problemsQuery = groq`*[_type == "problemCard"] | order(order asc){
  "id": _id, problem, solution, result
}`;

export const chartsQuery = groq`*[_type == "testingChart"] | order(order asc){
  "id": _id, title, subtitle, unit, betterDirection, data, insight
}`;

export const impactQuery = groq`*[_id == "impact"][0]{
  thisSeason, allTime, ${fileUrl("recapClip")}, ${img("recapPoster", 1000)}
}`;

export const outreachQuery = groq`*[_type == "outreachEvent"] | order(date desc){
  "id": _id, name, date, location, reached, summary, tags,
  "photos": photos[].asset->url
}`;

export const sponsorsQuery = groq`*[_type == "sponsor"] | order(order asc, name asc){
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

export const membersQuery = groq`*[_type == "member"] | order(order asc, name asc){
  "id": _id, name, kind, role, roleDescription, ${img("photo", 500)},
  interests, funFact, whyRobotics, personalGoal, dreamOccupation, favoriteBook
}`;

export const awardsQuery = groq`*[_type == "award"] | order(order asc){
  award, season, event, level
}`;

export const timelineQuery = groq`*[_type == "timelineEvent"] | order(order asc){
  title, year, type, description
}`;

export const seasonQuery = groq`*[_id == "season"][0]{
  gameName, gameYear, description, strategy, robotGoals, awardGoals
}`;

export const seasonEventsQuery = groq`*[_type == "seasonEvent"] | order(order asc){
  "id": _id, name, season, date, location, status, rank, record, awards,
  keyTakeaway, isWorlds, division, overallRank
}`;
