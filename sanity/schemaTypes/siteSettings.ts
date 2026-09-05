import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "teamName", title: "Team name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "teamNumber", title: "Team number", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "The headline on the front page and in link previews.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "season", title: "Current season", type: "string", description: "e.g. 2025–2026" }),
    defineField({ name: "location", title: "Location", type: "string", description: "e.g. Mandeville, Louisiana" }),
    defineField({ name: "founded", title: "Founded", type: "string" }),
    defineField({
      name: "logoVideo",
      title: "Animated logo",
      type: "file",
      description:
        "The hero logo. Bright artwork on a solid black background — it is screen-blended so " +
        "the black drops out. MP4, ideally under 2 MB.",
    }),
    defineField({
      name: "robotPhoto",
      title: "Robot photo",
      type: "image",
      description:
        "Used on the front page with the subsystem markers over it. Needs a transparent " +
        "background — it sits directly on black.",
      options: { hotspot: true },
    }),
    defineField({ name: "teamPhoto", title: "Team photo", type: "image", options: { hotspot: true } }),
    defineField({
      name: "scouting",
      title: "Team record links",
      description:
        "Third-party sites that carry the team's official results. Useful to judges and to " +
        "other teams scouting us.",
      type: "object",
      fields: [
        defineField({ name: "ftcEvents", title: "FTC Events", type: "url" }),
        defineField({ name: "ftcScout", title: "FTCScout", type: "url" }),
        defineField({ name: "ftcStats", title: "FTCStats", type: "url" }),
      ],
    }),
    defineField({
      name: "socials",
      title: "Social links",
      type: "object",
      fields: [
        defineField({ name: "instagram", title: "Instagram", type: "url" }),
        defineField({ name: "youtube", title: "YouTube", type: "url" }),
        defineField({ name: "facebook", title: "Facebook", type: "url" }),
        defineField({ name: "github", title: "GitHub", type: "url" }),
        defineField({ name: "cad", title: "CAD (Onshape)", type: "url" }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
