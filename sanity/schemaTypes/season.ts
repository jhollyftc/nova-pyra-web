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

export default defineType({
  name: "season",
  title: "Current season",
  type: "document",
  fields: [
    defineField({ name: "gameName", title: "Game name", type: "string", description: "e.g. DECODE", validation: (r) => r.required() }),
    defineField({ name: "gameYear", title: "Season", type: "string", description: "e.g. 2025–2026" }),
    defineField({ name: "description", title: "The challenge", type: "text", rows: 5 }),
    defineField({ name: "strategy", title: "Our strategy", type: "text", rows: 5 }),
    goalArray("Robot goals", "Shown as progress bars on the front page."),
    goalArray("Award goals", "Shown on the season page."),
  ],
  preview: { select: { title: "gameName", subtitle: "gameYear" } },
});
