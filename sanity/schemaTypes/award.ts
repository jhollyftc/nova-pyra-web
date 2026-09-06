import { defineField, defineType } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export default defineType({
  name: "award",
  title: "Award",
  type: "document",
  fields: [
    defineField({
      name: "award",
      title: "Award",
      type: "string",
      description: "e.g. Innovate Award sponsored by RTX",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "season",
      title: "Season",
      type: "string",
      description: "e.g. 2025–2026 Decode",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "event",
      title: "Event",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "level",
      title: "Level",
      type: "string",
      options: {
        list: [
          { title: "Qualifier", value: "qualifier" },
          { title: "State / Regional Championship", value: "state" },
          { title: "World Championship", value: "worlds" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    orderRankField({ type: "award" }),
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: { title: "award", subtitle: "event", level: "level" },
    prepare: ({ title, subtitle, level }) => ({ title, subtitle: `${level} · ${subtitle}` }),
  },
});
