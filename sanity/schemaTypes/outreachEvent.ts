import { defineField, defineType } from "sanity";

export default defineType({
  name: "outreachEvent",
  title: "Outreach event",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Event name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      options: { dateFormat: "MMMM D, YYYY" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "reached",
      title: "People reached",
      type: "number",
      description:
        "Roughly how many people we spoke to. This feeds the impact totals sponsors read.",
      validation: (r) => r.min(0),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description: "Two or three sentences on what we did and who we met.",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "photos",
      title: "Photos",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      description:
        "Upload straight from a phone — images are resized automatically when served.",
    }),
  ],
  orderings: [
    { title: "Newest first", name: "dateDesc", by: [{ field: "date", direction: "desc" }] },
  ],
  preview: {
    select: { title: "name", date: "date", reached: "reached", media: "photos.0" },
    prepare: ({ title, date, reached, media }) => ({
      title,
      subtitle: [date, reached ? `${reached} reached` : null].filter(Boolean).join(" · "),
      media,
    }),
  },
});
