import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Served from Vercel's CDN and revalidated on publish, so the stale-by-60s
  // CDN cache is the right trade for the read volume a team site sees.
  useCdn: true,
});
