import { defineField, defineType } from "sanity";

/**
 * One document per season's robot.
 *
 * Was a singleton, which quietly assumed the team would only ever have one
 * machine. Making it a collection is what lets INTO THE DEEP, DECODE and next
 * season's BIOBUZZ robot all live on the site, with the current one leading.
 */
export default defineType({
  name: "robot",
  title: "Robot",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Robot name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: { source: "name", maxLength: 60 },
      description: "Its address on the site, e.g. /robot/drakos.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "season",
      title: "Season",
      type: "string",
      description: "e.g. 2025–2026",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "gameName",
      title: "Game",
      type: "string",
      description: "e.g. DECODE, INTO THE DEEP, BIOBUZZ",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "isCurrent",
      title: "This is the current robot",
      type: "boolean",
      description:
        "Exactly one robot should have this on. It is the one /robot shows by " +
        "default and the one named in the front page telemetry.",
      initialValue: false,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Competed", value: "competed" },
          { title: "In development", value: "in-development" },
        ],
        layout: "radio",
      },
      initialValue: "competed",
      description:
        "An in-development robot can be published with only a name and a game — " +
        "specs and subsystems can be filled in as the season goes.",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Newest first. Lower numbers appear earlier in the season switcher.",
    }),
    defineField({
      name: "philosophy",
      title: "Design philosophy",
      type: "text",
      rows: 4,
      description: "The idea behind the machine, in a short paragraph.",
    }),
    defineField({
      name: "specs",
      title: "Specifications",
      type: "array",
      description: "Shown in order. The first three also appear on the front page.",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "value", title: "Value", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        },
      ],
    }),
    defineField({
      name: "cobDescription",
      title: "Strategy framework — intro",
      type: "text",
      rows: 3,
    }),
    defineField({ name: "cobCritical", title: "Critical", type: "string" }),
    defineField({ name: "cobOptional", title: "Optional", type: "string" }),
    defineField({ name: "cobBypass", title: "Bypass", type: "string" }),
    defineField({
      name: "phases",
      title: "Match phases",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", description: "AUTO, TELEOP, ENDGAME" }),
            defineField({ name: "color", title: "Accent colour", type: "string", description: "A CSS colour, e.g. #22C55E" }),
            defineField({ name: "summary", title: "Summary", type: "text", rows: 3 }),
            defineField({ name: "clip", title: "Clip", type: "file", description: "MP4 loop. No GIFs." }),
            defineField({ name: "clipPoster", title: "Clip still frame", type: "image" }),
          ],
          preview: { select: { title: "label", subtitle: "summary" } },
        },
      ],
    }),
  ],
  orderings: [{ title: "Newest first", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name", season: "season", game: "gameName", current: "isCurrent" },
    prepare: ({ title, season, game, current }) => ({
      title: current ? `${title} (current)` : title,
      subtitle: [season, game].filter(Boolean).join(" · "),
    }),
  },
});
