import { defineField, defineType } from "sanity";

export default defineType({
  name: "engineeringProcess",
  title: "Engineering process",
  type: "document",
  fields: [
    defineField({
      name: "steps",
      title: "Design cycle steps",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "label", subtitle: "description" } },
        },
      ],
      validation: (r) => r.min(3),
    }),
    defineField({ name: "narrative", title: "Narrative", type: "text", rows: 6 }),
    defineField({
      name: "notebook",
      title: "Engineering portfolio (PDF)",
      type: "file",
      options: { accept: ".pdf" },
      description: "Linked, never embedded — it is a large file.",
    }),
  ],
  preview: { prepare: () => ({ title: "Engineering process" }) },
});
