import { defineField, defineType } from "sanity";

export default defineType({
  name: "teamStory",
  title: "Our story",
  type: "document",
  fields: [
    defineField({ name: "foundingStory", title: "Founding story", type: "text", rows: 6, validation: (r) => r.required() }),
    defineField({ name: "missionStatement", title: "Mission statement", type: "text", rows: 4 }),
    defineField({
      name: "values",
      title: "Values",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "icon", title: "Emoji", type: "string" }),
            defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "label", subtitle: "description" } },
        },
      ],
    }),
    defineField({
      name: "subteams",
      title: "Subteams",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "icon", title: "Emoji", type: "string" }),
            defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "goal", title: "Goal", type: "text", rows: 2 }),
            defineField({ name: "challenge", title: "Biggest challenge", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "name", subtitle: "goal" } },
        },
      ],
    }),
    defineField({
      name: "partners",
      title: "FIRST & industry partners",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "type", title: "Relationship", type: "string", description: "e.g. Sister Team, Industry" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "name", subtitle: "type" } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Our story" }) },
});
