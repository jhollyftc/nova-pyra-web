/**
 * One-time migration of content/*.json into Sanity.
 *
 * Idempotent: every document gets a deterministic _id and is written with
 * createOrReplace, so re-running updates rather than duplicating. Uploaded
 * assets are cached by source path within a run and looked up by hash by Sanity
 * across runs, so re-running does not re-upload the same image.
 *
 * Usage:
 *   1. Put NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and
 *      SANITY_API_WRITE_TOKEN in .env.local  (see .env.local.example)
 *   2. npm run import:content
 *
 * After a successful run and a visual check of the site, content/*.json and the
 * JSON imports in lib/content.ts can be deleted — Sanity becomes the source.
 */
import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");

// Minimal .env.local reader — avoids a dependency for two variables.
for (const line of readFileSync(path.join(ROOT, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

/**
 * Reuse the Sanity CLI's existing login rather than asking for a second token.
 *
 * `npx sanity login` already stores a user token; copying it into .env.local
 * would duplicate a live credential into another file for no benefit. An
 * explicit SANITY_API_WRITE_TOKEN still wins, which is what CI would use.
 */
function cliToken() {
  const home = process.env.USERPROFILE ?? process.env.HOME;
  const file = path.join(home ?? "", ".config", "sanity", "config.json");
  if (!existsSync(file)) return undefined;
  try {
    return JSON.parse(readFileSync(file, "utf8")).authToken;
  } catch {
    return undefined;
  }
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN || cliToken();

if (!projectId) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local");
  process.exit(1);
}
if (!token) {
  console.error("No Sanity credentials. Run `npx sanity login`, or set SANITY_API_WRITE_TOKEN.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2026-09-05", useCdn: false });

const json = (rel) => JSON.parse(readFileSync(path.join(ROOT, "content", rel), "utf8"));
const slug = (s) =>
  String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

let uploads = 0;
const assetCache = new Map();

/** Upload a file from public/ and return a Sanity image/file reference. */
async function upload(publicPath, kind = "image") {
  if (!publicPath) return undefined;
  const key = `${kind}:${publicPath}`;
  if (assetCache.has(key)) return assetCache.get(key);

  const file = path.join(ROOT, "public", publicPath.replace(/^\//, ""));
  if (!existsSync(file)) {
    console.warn(`    ! missing asset, skipped: ${publicPath}`);
    return undefined;
  }

  const asset = await client.assets.upload(kind, readFileSync(file), {
    filename: path.basename(file),
  });
  uploads++;
  const ref = { _type: kind, asset: { _type: "reference", _ref: asset._id } };
  assetCache.set(key, ref);
  return ref;
}

const docs = [];
const add = (doc) => docs.push(doc);

async function build() {
  const config = json("config.json");
  const team = json("story/team.json");
  const specs = json("robot/specs.json");
  const strategy = json("robot/strategy.json");
  const evolution = json("robot/evolution.json");
  const edp = json("process/edp.json");
  const problems = json("process/problems.json");
  const testing = json("process/testing.json");
  const stats = json("outreach/stats.json");
  const outreach = json("outreach/events.json");
  const sponsors = json("outreach/sponsors.json");
  const sponsorship = json("sponsorship.json");
  const members = json("story/members.json");
  const awards = json("story/awards.json");
  const timeline = json("story/timeline.json");
  const overview = json("season/overview.json");
  const goals = json("season/goals.json");
  const seasonEvents = json("season/events.json");
  const links = json("connect/links.json");

  console.log("  site settings, story, robot…");
  add({
    _id: "siteSettings",
    _type: "siteSettings",
    teamName: config.team.name,
    teamNumber: config.team.number,
    tagline: config.team.tagline,
    season: config.team.season,
    location: "Mandeville, Louisiana",
    founded: String(team.founding ?? ""),
    logoVideo: await upload("/media/logo-animated.mp4", "file"),
    logoPoster: await upload("/media/logo-animated.jpg"),
    robotPhoto: await upload("/images/robot-drakos.png"),
    teamPhoto: await upload("/images/team-photo.jpg"),
    socials: {
      instagram: links.instagram?.url,
      youtube: links.youtube?.url,
      github: links.github?.url,
    },
  });

  add({
    _id: "teamStory",
    _type: "teamStory",
    foundingStory: team.foundingStory,
    missionStatement: team.missionStatement,
    values: (team.values ?? []).map((v, i) => ({ _key: `v${i}`, ...v })),
    subteams: (team.subteams ?? []).map((s, i) => ({ _key: `s${i}`, ...s })),
    partners: (team.partners ?? []).map((p, i) => ({ _key: `p${i}`, ...p })),
  });

  const SPEC_ORDER = [
    ["weight", "Weight"], ["dimensions", "Dimensions"], ["driveType", "Drivetrain"],
    ["driveMotors", "Drive motors"], ["topSpeed", "Top speed"],
    ["electronics", "Electronics"], ["battery", "Battery"],
  ];
  add({
    _id: "robot",
    _type: "robot",
    name: specs.name,
    philosophy: specs.philosophy,
    specs: SPEC_ORDER.filter(([k]) => specs.specs?.[k]).map(([k, label], i) => ({
      _key: `spec${i}`, label, value: specs.specs[k],
    })),
    cobDescription: strategy.cob?.description,
    cobCritical: strategy.cob?.critical,
    cobOptional: strategy.cob?.optional,
    cobBypass: strategy.cob?.bypass,
    phases: await Promise.all((strategy.phases ?? []).map(async (p, i) => ({
      _key: `ph${i}`,
      label: p.label,
      color: p.color,
      summary: p.summary,
      clip: await upload(p.gifPath?.replace(/^\/images\/(.*)\.gif$/i, "/media/$1.mp4"), "file"),
      clipPoster: await upload(p.gifPath?.replace(/^\/images\/(.*)\.gif$/i, "/media/$1.jpg")),
    }))),
  });

  console.log("  subsystems, evolution…");
  for (const [i, s] of (specs.subsystems ?? []).entries()) {
    add({
      _id: `subsystem-${slug(s.id ?? s.name)}`,
      _type: "subsystem",
      name: s.name,
      slug: { _type: "slug", current: slug(s.id ?? s.name) },
      tagline: s.tagline,
      photo: await upload(s.photo?.toLowerCase()),
      hotspot: s.hotspot ?? undefined,
      materials: s.materials,
      motors: s.motors,
      rationale: s.rationale,
      tradeoffs: s.tradeoffs,
      order: i,
    });
  }

  for (const [i, v] of (evolution.versions ?? []).entries()) {
    const photos = [];
    for (const p of (v.photos ?? []).filter((x) => x && x.trim())) {
      const img = await upload(p.toLowerCase());
      if (img) photos.push({ _key: `p${photos.length}`, ...img });
    }
    add({
      _id: `evolution-${slug(`${v.subsystem}-${v.version}`)}`,
      _type: "evolutionEntry",
      name: v.name,
      subsystem: v.subsystem,
      version: v.version,
      dateRange: v.dateRange,
      changes: v.changes,
      result: v.result,
      photos,
      order: i,
    });
  }

  console.log("  process, problems, test data…");
  add({
    _id: "engineeringProcess",
    _type: "engineeringProcess",
    steps: (edp.steps ?? []).map((s, i) => ({
      _key: `st${i}`, label: s.label, description: s.description,
    })),
    narrative: edp.narrative,
    notebook: await upload(edp.notebookPath, "file"),
  });

  (problems.cards ?? []).forEach((c, i) =>
    add({
      _id: `problem-${slug(c.id ?? i)}`,
      _type: "problemCard",
      problem: c.problem, solution: c.solution, result: c.result, order: i,
    }),
  );

  (testing.charts ?? []).forEach((c, i) =>
    add({
      _id: `chart-${slug(c.id ?? i)}`,
      _type: "testingChart",
      title: c.title,
      subtitle: c.subtitle,
      unit: c.unit,
      // Was inferred from first-vs-last at render time; now recorded explicitly.
      betterDirection:
        c.data?.[c.data.length - 1]?.value < c.data?.[0]?.value ? "lower" : "higher",
      data: (c.data ?? []).map((d, j) => ({ _key: `d${j}`, label: d.label, value: d.value })),
      insight: c.insight,
      order: i,
    }),
  );

  console.log("  outreach, sponsors…");
  add({
    _id: "impact",
    _type: "impact",
    thisSeason: {
      peopleReached: stats.thisSeason?.peopleReached,
      volunteerHours: stats.thisSeason?.volunteerHours,
      eventsHosted: stats.thisSeason?.eventsHosted,
      schoolsVisited: stats.thisSeason?.schoolsVisited,
      teamsMentored: stats.thisSeason?.teamsmentored,
    },
    allTime: {
      peopleReached: stats.allTime?.peopleReached,
      volunteerHours: stats.allTime?.volunteerHours,
      eventsHosted: stats.allTime?.eventsHosted,
      schoolsVisited: stats.allTime?.schoolsVisited,
      teamsMentored: stats.allTime?.teamsmentored,
    },
    recapClip: await upload("/media/recap.mp4", "file"),
    recapPoster: await upload("/media/recap.jpg"),
  });

  for (const e of outreach.events ?? []) {
    const photos = [];
    const img = await upload(e.image?.toLowerCase());
    if (img) photos.push({ _key: "p0", ...img });
    add({
      _id: `outreach-${slug(e.id ?? e.name)}`,
      _type: "outreachEvent",
      name: e.name,
      date: parseDate(e.date),
      location: e.location,
      reached: e.reached,
      summary: e.summary,
      tags: e.tags,
      photos,
    });
  }

  for (const [i, s] of (sponsors.sponsors ?? []).entries()) {
    add({
      _id: `sponsor-${slug(s.id ?? s.name)}`,
      _type: "sponsor",
      name: s.name,
      tier: s.tier,
      logo: await upload(s.logo?.toLowerCase()),
      description: s.description,
      order: i,
    });
  }

  add({
    _id: "sponsorship",
    _type: "sponsorship",
    intro: sponsorship.intro,
    contactEmail: sponsorship.contactEmail,
    fiscalSponsor: sponsorship.fiscalSponsor,
    checkPayableTo: sponsorship.checkPayableTo,
    taxNote: sponsorship.taxNote,
    whatItFunds: (sponsorship.whatItFunds ?? []).map((f, i) => ({ _key: `f${i}`, ...f })),
    tiers: (sponsorship.tiers ?? []).map((t, i) => ({
      _key: `t${i}`, tier: t.id, benefits: t.benefits,
    })),
  });

  console.log("  people, awards, timeline…");
  for (const [kind, list] of [["student", members.members], ["mentor", members.mentors]]) {
    for (const [i, m] of (list ?? []).entries()) {
      add({
        _id: `member-${slug(m.id ?? m.name)}`,
        _type: "member",
        name: m.name,
        kind,
        role: m.role,
        roleDescription: m.roleDescription,
        photo: await upload(m.photo?.toLowerCase()),
        interests: m.interests,
        funFact: m.funFact,
        whyRobotics: m.whyRobotics,
        personalGoal: m.personalGoal,
        dreamOccupation: m.dreamOccupation,
        favoriteBook: m.favoriteBook,
        order: i,
      });
    }
  }

  (awards.awards ?? []).forEach((a, i) =>
    add({
      _id: `award-${slug(`${a.season}-${a.award}-${a.event}`)}`,
      _type: "award",
      award: a.award, season: a.season, event: a.event, level: a.level, order: i,
    }),
  );

  (timeline.milestones ?? []).forEach((m, i) =>
    add({
      _id: `timeline-${slug(`${m.year}-${m.title}`)}`,
      _type: "timelineEvent",
      title: m.title, year: String(m.year), type: m.type, description: m.description, order: i,
    }),
  );

  console.log("  season…");
  add({
    _id: "season",
    _type: "season",
    gameName: overview.gameName,
    gameYear: String(overview.gameYear ?? config.team.season),
    description: overview.description,
    strategy: overview.strategy,
    robotGoals: (goals.robotGoals ?? []).map((g, i) => ({ _key: `rg${i}`, ...g })),
    awardGoals: (goals.awardGoals ?? []).map((g, i) => ({ _key: `ag${i}`, ...g })),
  });

  const seasonLabel = `${overview.gameYear ?? config.team.season} ${overview.gameName ?? ""}`.trim();
  for (const [status, list] of [["completed", seasonEvents.completed], ["upcoming", seasonEvents.upcoming]]) {
    for (const [i, e] of (list ?? []).entries()) {
      add({
        _id: `result-${slug(e.id ?? e.name)}`,
        _type: "seasonEvent",
        name: e.name,
        season: seasonLabel,
        date: e.date,
        location: e.location,
        status,
        rank: e.rank,
        record: e.record,
        awards: e.awards,
        keyTakeaway: e.keyTakeaway,
        isWorlds: /world/i.test(e.name ?? ""),
        order: i,
      });
    }
  }
}

/** "December 13, 2025" -> "2025-12-13". Returns undefined if unparseable. */
function parseDate(s) {
  if (!s) return undefined;
  const d = new Date(s.replace(/(\d+)\s*[–-]\s*\d+,/, "$1,"));
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}

async function main() {
  console.log(`\nImporting into ${projectId}/${dataset}\n`);
  await build();

  const tx = docs.reduce((t, doc) => t.createOrReplace(doc), client.transaction());
  await tx.commit();

  const byType = docs.reduce((m, d) => ({ ...m, [d._type]: (m[d._type] ?? 0) + 1 }), {});
  console.log("\n  documents written:");
  for (const [type, n] of Object.entries(byType).sort()) {
    console.log(`    ${String(n).padStart(3)}  ${type}`);
  }
  console.log(`\n  ${docs.length} documents, ${uploads} assets uploaded\n`);
}

main().catch((e) => {
  console.error("\nImport failed:", e.message);
  process.exit(1);
});
