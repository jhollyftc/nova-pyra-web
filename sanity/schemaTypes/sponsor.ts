import { defineField, defineType } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

/** Tier ids match content/outreach/sponsors.json so the import is a straight map. */
export const SPONSOR_TIERS = [
  { title: "Sustainer — $1,000+", value: "sustainer" },
  { title: "Firestarter — $500–999", value: "firestarter" },
  { title: "Campfire — $200–499", value: "campfire" },
  { title: "Igniter — $50–199", value: "igniter" },
  { title: "Kindling — $1–49", value: "kindling" },
];

export default defineType({
  name: "sponsor",
  title: "Sponsor",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tier",
      title: "Tier",
      type: "string",
      options: { list: SPONSOR_TIERS, layout: "radio" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      description:
        "Ask the sponsor for a PNG with a transparent background, or an SVG. " +
        "Logos sit directly on a dark tile, so a white background will show as a " +
        "white box. Leave empty and the sponsor is listed by name only.",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "One-line description",
      type: "string",
      description: "Who they are, in a sentence. Shown under the logo.",
    }),
    defineField({
      name: "url",
      title: "Website",
      type: "url",
    }),
    // Drag-and-drop position. Hidden: it is set by reordering the list, not
    // by typing a number.
    orderRankField({ type: "sponsor" }),
  ],
  orderings: [
    orderRankOrdering,
    {
      title: "Tier, then name",
      name: "tierName",
      by: [
        { field: "tier", direction: "asc" },
        { field: "name", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "tier", media: "logo" },
  },
});
