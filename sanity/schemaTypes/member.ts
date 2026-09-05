import { defineField, defineType } from "sanity";

export default defineType({
  name: "member",
  title: "Team member",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description:
        "First name and last initial only — e.g. 'Hailey V.' This is a deliberate " +
        "privacy practice for a public site. Do not add surnames.",
      validation: (r) =>
        r.required().custom((value) =>
          typeof value === "string" && /\s\S+[a-z]{2,}$/i.test(value.trim())
            ? "Use first name and last initial only (e.g. 'Hailey V.'), not a full surname."
            : true,
        ),
    }),
    defineField({
      name: "kind",
      title: "Student or mentor",
      type: "string",
      options: {
        list: [
          { title: "Student", value: "student" },
          { title: "Mentor / booster", value: "mentor" },
        ],
        layout: "radio",
      },
      initialValue: "student",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: "e.g. Team Captain, Build Lead, Teacher Sponsor",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "roleDescription",
      title: "What the role involves",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "interests", title: "Interests", type: "string" }),
    defineField({ name: "funFact", title: "Fun fact", type: "string" }),
    defineField({ name: "whyRobotics", title: "Why robotics?", type: "text", rows: 2 }),
    defineField({ name: "personalGoal", title: "Personal goal", type: "text", rows: 2 }),
    defineField({ name: "dreamOccupation", title: "Dream occupation", type: "string" }),
    defineField({ name: "favoriteBook", title: "Favourite book", type: "string" }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers first. Leads are usually ordered first.",
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "displayOrder",
      by: [
        { field: "order", direction: "asc" },
        { field: "name", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
});
