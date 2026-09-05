import { defineField, defineType } from "sanity";

const counts = () => [
  defineField({ name: "peopleReached", title: "People reached", type: "number" }),
  defineField({ name: "volunteerHours", title: "Volunteer hours", type: "number" }),
  defineField({ name: "eventsHosted", title: "Events", type: "number" }),
  defineField({ name: "schoolsVisited", title: "Schools visited", type: "number" }),
  defineField({ name: "teamsMentored", title: "Teams mentored", type: "number" }),
];

export default defineType({
  name: "impact",
  title: "Outreach totals",
  type: "document",
  description: "The numbers sponsors and judges read first.",
  fields: [
    defineField({
      name: "thisSeason",
      title: "This season",
      type: "object",
      fields: counts(),
    }),
    defineField({
      name: "allTime",
      title: "All time",
      type: "object",
      fields: counts(),
    }),
    defineField({ name: "recapClip", title: "Season recap clip", type: "file", description: "MP4. No GIFs." }),
  ],
  preview: { prepare: () => ({ title: "Outreach totals" }) },
});
