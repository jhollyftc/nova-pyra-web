import { defineField, defineType } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

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
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Alumni", value: "alumni" },
        ],
        layout: "radio",
      },
      initialValue: "active",
      description:
        "Switch to Alumni when someone leaves the team, rather than deleting them — " +
        "the people who built the earlier robots should stay on the site. Note that " +
        "only alumni STUDENTS appear on the team page at the moment; alumni mentors " +
        "are kept here but not shown anywhere yet.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "classOf",
      title: "Class of",
      type: "string",
      description: "Graduation year, e.g. 2026. Shown on the alumni card.",
      hidden: ({ document }) => document?.status !== "alumni",
    }),
    defineField({
      name: "nowDoing",
      title: "What they are doing now",
      type: "string",
      description:
        "Optional, and the most interesting thing on an alumni card — where they " +
        "went, what they are studying.",
      hidden: ({ document }) => document?.status !== "alumni",
    }),
    defineField({
      name: "yearsOnTeam",
      title: "Years on the team",
      type: "string",
      description: "e.g. 2024–2026",
      hidden: ({ document }) => document?.status !== "alumni",
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
    // Drag-and-drop position. Hidden: it is set by reordering the list, not
    // by typing a number.
    orderRankField({ type: "member" }),
  ],
  orderings: [
    orderRankOrdering,
    {
      title: "Name",
      name: "byName",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo", status: "status" },
    prepare: ({ title, subtitle, media, status }) => ({
      title: status === "alumni" ? `${title} (alumni)` : title,
      subtitle,
      media,
    }),
  },
});
