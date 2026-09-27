/**
 * Date formatting for content dates.
 *
 * Every date in Sanity is a plain `YYYY-MM-DD` with no time and no zone — a
 * competition is on the 13th wherever you read about it. So these functions
 * work on the string's parts rather than going through `new Date(...)`, which
 * would parse it as UTC midnight and render "December 12" for anyone west of
 * Greenwich. That bug only shows up for some visitors, which is the worst kind.
 */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type Parts = { y: number; m: number; d: number };

function parts(iso: string | null | undefined): Parts | null {
  if (!iso) return null;
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return null;
  return { y, m, d };
}

/** "December 13, 2025" */
export function formatDate(iso: string | null | undefined): string {
  const p = parts(iso);
  return p ? `${MONTHS[p.m - 1]} ${p.d}, ${p.y}` : "";
}

/** "Dec 13" — for tight spaces where the year is already established. */
export function formatShort(iso: string | null | undefined): string {
  const p = parts(iso);
  return p ? `${MONTHS[p.m - 1].slice(0, 3)} ${p.d}` : "";
}

/**
 * A date range written the way a person would: "February 27–28, 2026",
 * "April 29 – May 2, 2026", "December 13, 2025".
 */
export function formatRange(
  start: string | null | undefined,
  end?: string | null,
): string {
  const a = parts(start);
  if (!a) return "";
  const b = parts(end);
  if (!b || (b.y === a.y && b.m === a.m && b.d === a.d)) return formatDate(start);

  if (a.y === b.y && a.m === b.m) return `${MONTHS[a.m - 1]} ${a.d}–${b.d}, ${a.y}`;
  if (a.y === b.y) return `${MONTHS[a.m - 1]} ${a.d} – ${MONTHS[b.m - 1]} ${b.d}, ${a.y}`;
  return `${formatDate(start)} – ${formatDate(end)}`;
}

/** Whole days from today to `iso`. Negative once the date has passed. */
export function daysUntil(iso: string | null | undefined, now = new Date()): number | null {
  const p = parts(iso);
  if (!p) return null;
  const target = Date.UTC(p.y, p.m - 1, p.d);
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target - today) / 86_400_000);
}

/**
 * "Today", "Tomorrow", "In 48 days", "3 days ago".
 *
 * Deliberately plain. A countdown is only worth showing if it is instantly
 * readable, and "T-48" is HUD styling at the cost of meaning.
 */
export function countdownLabel(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";
  if (days > 0) return `In ${days} day${days === 1 ? "" : "s"}`;
  return `${-days} days ago`;
}

/**
 * Which day of the build season it is, counting kickoff itself as day 1 —
 * which is how a team says it. Null before kickoff, or with no date set.
 *
 * Goes through `daysUntil` rather than subtracting two `Date`s, so the answer
 * does not shift by one depending on the reader's timezone.
 */
export function buildDay(kickoff: string | null | undefined, now = new Date()): number | null {
  const d = daysUntil(kickoff, now);
  if (d === null || d > 0) return null;
  return 1 - d;
}

/**
 * True while an event is still ahead of us, counting a multi-day event as
 * upcoming until its last day is over.
 */
export function isUpcoming(
  start: string | null | undefined,
  end?: string | null,
  now = new Date(),
): boolean {
  const d = daysUntil(end || start, now);
  return d !== null && d >= 0;
}
