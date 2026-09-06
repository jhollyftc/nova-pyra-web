import { defineField, defineType } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export default defineType({
  name: "evolutionEntry",
  title: "Design evolution entry",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", description: "e.g. Vector Wheel Intake", validation: (r) => r.required() }),
    defineField({ name: "subsystem", title: "Subsystem", type: "string", description: "e.g. Intake, Shooter", validation: (r) => r.required() }),
    defineField({ name: "version", title: "Version", type: "string", description: "e.g. Gen 2" }),
    defineField({ name: "dateRange", title: "When", type: "string" }),
    defineField({ name: "changes", title: "What changed", type: "text", rows: 3 }),
    defineField({
      name: "result",
      title: "What it bought us",
      type: "text",
      rows: 2,
      description: "The measured outcome, with a number where possible.",
    }),
    defineField({
      name: "photos",
      title: "Photos",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (r) => r.max(2),
    }),
    defineField({
      name: "robot",
      title: "Robot",
      type: "reference",
      to: [{ type: "robot" }],
      description: "Which season's robot this evolution entry belongs to.",
      validation: (r) => r.required(),
    }),
    orderRankField({ type: "evolutionEntry" }),
  ],
  orderings: [
    orderRankOrdering],
  preview: {
    select: { title: "name", subtitle: "subsystem", version: "version", media: "photos.0" },
    prepare: ({ title, subtitle, version, media }) => ({ title, subtitle: `${subtitle} · ${version ?? ""}`, media }),
  },
});
