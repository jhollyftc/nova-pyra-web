import { defineField, defineType } from "sanity";

/**
 * A competition result.
 *
 * The hero's record and Worlds rank are summed from these documents rather than
 * typed anywhere, so adding an event here updates the front page by itself.
 */
export default defineType({
  name: "seasonEvent",
  title: "Competition result",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Event name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "season",
      title: "Season",
      type: "string",
      description: "e.g. 2025–2026 Decode",
      validation: (r) => r.required(),
    }),
    defineField({ name: "date", title: "Date", type: "string", description: "e.g. December 13, 2025" }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Completed", value: "completed" },
          { title: "Upcoming", value: "upcoming" },
        ],
        layout: "radio",
      },
      initialValue: "completed",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "rank",
      title: "Qualification rank",
      type: "number",
      description:
        "Rank within the division at the World Championship, or overall at any other event. " +
        "Set 'Division' below so the site labels it correctly.",
      hidden: ({ document }) => document?.status !== "completed",
    }),
    defineField({
      name: "division",
      title: "Division",
      type: "string",
      description:
        "World Championship only — e.g. 'Jackson'. Teams are split into divisions there and " +
        "compete within one, so a division rank must never be shown as an overall rank.",
      hidden: ({ document }) => !document?.isWorlds,
    }),
    defineField({
      name: "overallRank",
      title: "Overall rank across all divisions",
      type: "number",
      description: "World Championship only. Optional, and shown alongside the division rank.",
      hidden: ({ document }) => !document?.isWorlds,
    }),
    defineField({
      name: "record",
      title: "Record",
      type: "object",
      hidden: ({ document }) => document?.status !== "completed",
      fields: [
        defineField({ name: "wins", title: "Wins", type: "number", initialValue: 0 }),
        defineField({ name: "losses", title: "Losses", type: "number", initialValue: 0 }),
        defineField({ name: "ties", title: "Ties", type: "number", initialValue: 0 }),
      ],
    }),
    defineField({
      name: "awards",
      title: "Awards won here",
      type: "array",
      of: [{ type: "string" }],
      description: "Award names as they should read, e.g. 'Innovate Award Winner'.",
    }),
    defineField({
      name: "keyTakeaway",
      title: "Key takeaway",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "isWorlds",
      title: "This is the World Championship",
      type: "boolean",
      description: "Drives the 'Worlds rank' figure in the site header telemetry.",
      initialValue: false,
    }),
    defineField({ name: "order", title: "Order", type: "number", description: "Lower numbers first." }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name", status: "status", rank: "rank", w: "record.wins", l: "record.losses", t: "record.ties" },
    prepare: ({ title, status, rank, w, l, t }) => ({
      title,
      subtitle:
        status === "completed"
          ? `Rank ${rank ?? "?"} · ${w ?? 0}-${l ?? 0}-${t ?? 0}`
          : "Upcoming",
    }),
  },
});
