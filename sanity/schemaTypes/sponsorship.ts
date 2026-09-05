import { defineField, defineType } from "sanity";
import { SPONSOR_TIERS } from "./sponsor";

export default defineType({
  name: "sponsorship",
  title: "Sponsorship pitch",
  type: "document",
  description: "What a prospective sponsor reads. These are public commitments once published.",
  fields: [
    defineField({ name: "intro", title: "Intro", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({
      name: "contactEmail",
      title: "Contact email",
      type: "string",
      description: "Where sponsorship enquiries go. The call-to-action mails this address.",
      validation: (r) => r.required().email(),
    }),
    defineField({ name: "fiscalSponsor", title: "Fiscal sponsor", type: "string" }),
    defineField({ name: "checkPayableTo", title: "Cheques payable to", type: "string" }),
    defineField({ name: "taxNote", title: "Tax note", type: "string" }),
    defineField({
      name: "whatItFunds",
      title: "What sponsorship funds",
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
    }),
    defineField({
      name: "tiers",
      title: "Tier benefits",
      type: "array",
      description: "One entry per tier. Higher tiers should offer strictly more than lower ones.",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "tier",
              title: "Tier",
              type: "string",
              options: { list: SPONSOR_TIERS },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "benefits",
              title: "Benefits",
              type: "array",
              of: [{ type: "string" }],
              validation: (r) => r.min(1),
            }),
          ],
          preview: {
            select: { title: "tier", benefits: "benefits" },
            prepare: ({ title, benefits }) => ({
              title,
              subtitle: `${benefits?.length ?? 0} benefits`,
            }),
          },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Sponsorship pitch" }) },
});
