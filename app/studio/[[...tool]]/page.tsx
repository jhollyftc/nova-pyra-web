/**
 * The embedded Sanity Studio, served at /studio.
 *
 * Sanity handles its own auth — only people invited to the project can sign in,
 * and the route renders nothing useful to anyone else. It is deliberately not
 * in sitemap.ts, and the metadata below keeps it out of search results.
 */
import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
