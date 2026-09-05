import { defineField, defineType } from "sanity";

export default defineType({
  name: "testingChart",
  title: "Test data chart",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "subtitle",
      title: "Method",
      type: "string",
      description: "How it was measured — e.g. '50+ repetitions from a fixed field position'.",
    }),
    defineField({ name: "unit", title: "Unit", type: "string", description: "e.g. %, \" or ' inputs'" }),
    defineField({
      name: "betterDirection",
      title: "Which direction is better?",
      type: "string",
      description:
        "Stated explicitly rather than inferred. Two of our charts measure things where lower " +
        "is better, and without this a reader sees falling bars and assumes we got worse.",
      options: {
        list: [
          { title: "Higher is better", value: "higher" },
          { title: "Lower is better", value: "lower" },
        ],
        layout: "radio",
      },
      initialValue: "higher",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "data",
      title: "Data points",
      type: "array",
      description: "In chronological order — the chart shades later stages brighter.",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Stage", type: "string", validation: (r) => r.required() }),
            defineField({ name: "value", title: "Value", type: "number", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        },
      ],
      validation: (r) => r.min(2),
    }),
    defineField({
      name: "insight",
      title: "Insight",
      type: "text",
      rows: 2,
      description: "The one sentence a judge should take away.",
    }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "insight" } },
});
