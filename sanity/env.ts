/**
 * Sanity connection settings.
 *
 * `apiVersion` is a date, and pinning it is the point — Sanity ships breaking
 * query behaviour behind new dates, so this must only move when someone
 * deliberately tests the change.
 */
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-09-05";

export const dataset = required(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "NEXT_PUBLIC_SANITY_DATASET",
);

export const projectId = required(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
);

/**
 * Fail loudly and early. A missing project id silently returning no content
 * would publish an empty site, which is worse than not building at all.
 */
function required(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy .env.local.example to .env.local and fill it in ` +
        `(see EDITING.md), or set it in the Vercel project's environment variables.`,
    );
  }
  return value;
}
