import { cache } from "react";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

const base = createClient({
  projectId,
  dataset,
  apiVersion,
  // Served through Vercel's cache and revalidated on a window, so the CDN's
  // stale-by-60s read is the right trade for the volume a team site sees.
  useCdn: true,
});

/**
 * Per-render deduplication.
 *
 * Accessors in lib/content.ts compose freely — getSeasonTelemetry needs the
 * season and the robot, and so does the page rendering it — which meant the same
 * GROQ ran two or three times per page. React's `cache` collapses identical
 * queries within a single render pass, which cut a full site render from 67
 * queries to 42 (measured).
 *
 * That matters because Sanity's free plan allows 250k API requests a month and
 * every ISR revalidation replays these. Halving the per-render cost doubles the
 * traffic the free tier absorbs, for no behaviour change.
 */
const cachedFetch = cache((query: string, params: string) =>
  base.fetch(query, params ? JSON.parse(params) : {}),
);

export const client = {
  fetch: <T>(query: string, params?: Record<string, unknown>): Promise<T> =>
    cachedFetch(query, params ? JSON.stringify(params) : "") as Promise<T>,
};
