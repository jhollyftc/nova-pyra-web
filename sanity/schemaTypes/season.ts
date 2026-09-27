import { defineField, defineType } from "sanity";

const goalArray = (title: string, description: string) =>
  defineField({
    name: title === "Robot goals" ? "robotGoals" : "awardGoals",
    title,
    description,
    type: "array",
    of: [
      {
        type: "object",
        fields: [
          defineField({ name: "goal", title: "Goal", type: "string", validation: (r) => r.required() }),
          defineField({
            name: "progress",
            title: "Progress (%)",
            type: "number",
            validation: (r) => r.min(0).max(100),
          }),
          defineField({
            name: "status",
            title: "Status",
            type: "string",
            options: {
              list: [
                { title: "Achieved", value: "achieved" },
                { title: "In progress", value: "in-progress" },
                { title: "Not started", value: "not-started" },
              ],
            },
          }),
          defineField({ name: "note", title: "Note", type: "text", rows: 2 }),
        ],
        preview: {
          select: { title: "goal", subtitle: "status", progress: "progress" },
          prepare: ({ title, subtitle, progress }) => ({ title, subtitle: `${progress ?? 0}% · ${subtitle ?? ""}` }),
        },
      },
    ],
  });

/**
 * One document per competition season.
 *
 * Was a singleton, which assumed the team only ever has a "current" season and
 * quietly made last season's results look like this season's. Now the season is
 * a document like the robot: results reference the season they belong to, so
 * rolling over to a new game archives the old one instead of overwriting it.
 */
export default defineType({
  name: "season",
  title: "Season",
  type: "document",
  fields: [
    defineField({ name: "gameName", title: "Game name", type: "string", description: "e.g. DECODE, BIOBUZZ", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: { source: "gameName", maxLength: 40 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "isCurrent",
      title: "This is the current season",
      type: "boolean",
      description:
        "Exactly one season should have this on. It drives the front page and " +
        "the season page; the others become the archive.",
      initialValue: false,
    }),
    defineField({
      name: "kickoff",
      title: "Kickoff date",
      type: "date",
      description:
        "The Saturday the game was revealed. The site counts build-season days " +
        "from it — 'Day 15' — which is the only thing it has to show before " +
        "there are results, so check it is the right date.",
    }),
    defineField({ name: "gameYear", title: "Season", type: "string", description: "e.g. 2025–2026" }),
    defineField({ name: "description", title: "The challenge", type: "text", rows: 5 }),
    defineField({ name: "strategy", title: "Our strategy", type: "text", rows: 5 }),
    goalArray("Robot goals", "Shown as progress bars on the front page."),
    goalArray("Award goals", "Shown on the season page."),
  ],
  preview: { select: { title: "gameName", subtitle: "gameYear" } },
});
