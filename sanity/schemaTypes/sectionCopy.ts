import { defineField, defineType } from "sanity";
import { SECTION_DEFAULTS, SECTION_KEYS } from "../../lib/sectionCopy";

/**
 * The framing copy above each block of content — eyebrow, heading and the line
 * underneath.
 *
 * These used to be hardcoded in the page components, so rewording a heading
 * meant a code change. The key list comes from lib/sectionCopy.ts, which is also
 * the fallback: leaving a field empty, or deleting the document, restores the
 * original wording rather than rendering a blank heading.
 */
export default defineType({
  name: "sectionCopy",
  title: "Section heading",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "Which section",
      type: "string",
      options: {
        list: SECTION_KEYS.map((k) => ({
          title: `${k}  —  ${SECTION_DEFAULTS[k].title}`,
          value: k,
        })),
      },
      description: "Pick the section this copy belongs to. One document per section.",
      validation: (r) => r.required(),
      readOnly: ({ value }) => Boolean(value),
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description: "The small uppercase label above the heading.",
    }),
    defineField({
      name: "title",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 3,
      description: "The sentence or two under the heading. Leave empty for none.",
    }),
    defineField({
      name: "note",
      title: "Placeholders available here",
      type: "string",
      readOnly: true,
      description:
        "Some headings include values the site works out at render time, written " +
        "as {n}, {reached}, {robot} and so on. Keep them if you want the number; " +
        "delete them if you do not. Anything left unfilled is removed, never " +
        "printed as text.",
    }),
  ],
  orderings: [{ title: "Key", name: "key", by: [{ field: "key", direction: "asc" }] }],
  preview: {
    select: { key: "key", title: "title", eyebrow: "eyebrow" },
    prepare: ({ key, title, eyebrow }) => ({
      title: title || SECTION_DEFAULTS[key as keyof typeof SECTION_DEFAULTS]?.title || key,
      subtitle: `${key}${eyebrow ? ` · ${eyebrow}` : ""}`,
    }),
  },
});
