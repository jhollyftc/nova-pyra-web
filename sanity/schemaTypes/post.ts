import { defineField, defineType } from "sanity";

/**
 * Season updates. New with the CMS — there was no equivalent in the pit app,
 * but the outreach-hub goal needs somewhere to publish to.
 */
export default defineType({
  name: "post",
  title: "Season update",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 2,
      description: "One or two sentences, shown in listings and link previews.",
    }),
    defineField({ name: "coverImage", title: "Cover image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
  ],
  orderings: [
    { title: "Newest first", name: "newest", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: { select: { title: "title", subtitle: "publishedAt", media: "coverImage" } },
});
