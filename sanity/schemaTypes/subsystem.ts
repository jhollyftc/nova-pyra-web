import { defineField, defineType } from "sanity";

export default defineType({
  name: "subsystem",
  title: "Robot subsystem",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      description: "Stable id. Used to match the CAD model and the front-page marker.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "One line with a number in it if possible — this is what the front-page marker shows.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "photo", title: "CAD render or photo", type: "image", options: { hotspot: true } }),
    defineField({
      name: "hotspot",
      title: "Marker position on the robot photo",
      type: "object",
      description:
        "Where this subsystem's marker sits on the front-page robot photo, as a percentage " +
        "from the top-left. Leave empty to hide the marker.",
      fields: [
        defineField({ name: "x", title: "X (%)", type: "number", validation: (r) => r.min(0).max(100) }),
        defineField({ name: "y", title: "Y (%)", type: "number", validation: (r) => r.min(0).max(100) }),
      ],
    }),
    defineField({ name: "materials", title: "Materials", type: "text", rows: 2 }),
    defineField({ name: "motors", title: "Motors / actuation", type: "text", rows: 2 }),
    defineField({
      name: "rationale",
      title: "Design rationale",
      type: "text",
      rows: 3,
      description: "Why it is built this way. Judges read this.",
    }),
    defineField({
      name: "tradeoffs",
      title: "Tradeoffs considered",
      type: "text",
      rows: 3,
      description: "What was rejected and why. Judges read this too.",
    }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "tagline", media: "photo" } },
});
