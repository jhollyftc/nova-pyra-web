import { defineField, defineType } from "sanity";

export default defineType({
  name: "problemCard",
  title: "Problem → solution",
  type: "document",
  fields: [
    defineField({ name: "problem", title: "Problem", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "solution", title: "Solution", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({
      name: "result",
      title: "Result",
      type: "text",
      rows: 2,
      description: "What measurably improved.",
    }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "problem", subtitle: "result" },
    prepare: ({ title, subtitle }) => ({ title: String(title).slice(0, 60), subtitle }),
  },
});
