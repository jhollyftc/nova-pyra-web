import { defineField, defineType } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

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
    orderRankField({ type: "problemCard" }),
  ],
  orderings: [
    orderRankOrdering],
  preview: {
    select: { title: "problem", subtitle: "result" },
    prepare: ({ title, subtitle }) => ({ title: String(title).slice(0, 60), subtitle }),
  },
});
