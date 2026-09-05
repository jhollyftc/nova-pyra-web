import { defineField, defineType } from "sanity";

export default defineType({
  name: "timelineEvent",
  title: "Timeline milestone",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "year",
      title: "Year or period",
      type: "string",
      description: "e.g. 2024 or Spring 2026",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Milestone", value: "milestone" },
          { title: "Event", value: "event" },
          { title: "Award", value: "award" },
          { title: "Outreach", value: "outreach" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "order", title: "Order", type: "number", description: "Lower numbers first." }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "title", subtitle: "year", type: "type" },
    prepare: ({ title, subtitle, type }) => ({ title, subtitle: `${subtitle} · ${type}` }),
  },
});
