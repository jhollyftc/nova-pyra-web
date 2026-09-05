import { defineField, defineType } from "sanity";

export default defineType({
  name: "robot",
  title: "The robot",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Robot name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "philosophy",
      title: "Design philosophy",
      type: "text",
      rows: 4,
      description: "The idea behind the machine, in a short paragraph.",
    }),
    defineField({
      name: "specs",
      title: "Specifications",
      type: "array",
      description: "Shown in order. The first three also appear on the front page.",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "value", title: "Value", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        },
      ],
    }),
    defineField({
      name: "cobDescription",
      title: "Strategy framework — intro",
      type: "text",
      rows: 3,
    }),
    defineField({ name: "cobCritical", title: "Critical", type: "string" }),
    defineField({ name: "cobOptional", title: "Optional", type: "string" }),
    defineField({ name: "cobBypass", title: "Bypass", type: "string" }),
    defineField({
      name: "phases",
      title: "Match phases",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", description: "AUTO, TELEOP, ENDGAME" }),
            defineField({ name: "color", title: "Accent colour", type: "string", description: "A CSS colour, e.g. #22C55E" }),
            defineField({ name: "summary", title: "Summary", type: "text", rows: 3 }),
            defineField({ name: "clip", title: "Clip", type: "file", description: "MP4 loop. No GIFs." }),
          ],
          preview: { select: { title: "label", subtitle: "summary" } },
        },
      ],
    }),
  ],
  preview: { select: { title: "name" }, prepare: ({ title }) => ({ title: `Robot — ${title ?? ""}` }) },
});
