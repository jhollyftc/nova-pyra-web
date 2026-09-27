/**
 * Date formatting for content dates.
 *
 * Two kinds of value arrive here and they need different handling:
 *
 * Sanity `date` fields are a plain `YYYY-MM-DD` with no time and no zone — a
 * competition is on the 13th wherever you read about it. Those are read as
 * literal parts rather than through `new Date(...)`, which would treat them as
 * UTC midnight and render "December 12" for every visitor west of Greenwich.
 *
 * Sanity `datetime` fields (a post's `publishedAt`) are a real instant in UTC,
 * and an instant only becomes a calendar day once you pick a zone. Taking the
 * UTC day means anything the team posts after about 6pm is dated tomorrow.
 * They are resolved in the team's own zone instead, which is the day the
 * person writing the post would say it was.
 *
 * Everything downstream — countdowns, "3 days ago", build-season day — works
 * off `day()`, so the whole site agrees on what day it is.
 */

/** Where the team is. Their evening must not roll the date over. */
const TEAM_TZ = "America/Chicago";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** `en-CA` formats as YYYY-MM-DD, which is what the rest of this file parses. */
const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TEAM_TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** The calendar day a value falls on, in the team's zone: `YYYY-MM-DD`. */
export function day(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  if (typeof value === "string") {
    // A plain date field is already a calendar day and must not be shifted.
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : dayFormatter.format(parsed);
  }
  return dayFormatter.format(value);
}

type Parts = { y: number; m: number; d: number };

function parts(iso: string | Date | null | undefined): Parts | null {
  const s = day(iso);
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return null;
  return { y, m, d };
}

/** "December 13, 2025" */
export function formatDate(iso: string | Date | null | undefined): string {
  const p = parts(iso);
  return p ? `${MONTHS[p.m - 1]} ${p.d}, ${p.y}` : "";
}

/** "Dec 13" — for tight spaces where the year is already established. */
export function formatShort(iso: string | Date | null | undefined): string {
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

/**
 * Whole days from today to `iso`. Negative once the date has passed.
 *
 * Both sides are reduced to a calendar day in the team's zone first, so the
 * answer does not depend on where the server happens to be — Vercel runs in
 * UTC, and comparing a UTC "today" against a Central date is a reliable way to
 * be one day out for six hours of every day.
 */
export function daysUntil(
  iso: string | Date | null | undefined,
  now = new Date(),
): number | null {
  const p = parts(iso);
  const t = parts(now);
  if (!p || !t) return null;
  const target = Date.UTC(p.y, p.m - 1, p.d);
  const today = Date.UTC(t.y, t.m - 1, t.d);
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
 * How long ago something was published: "Today", "3 days ago", "2 weeks ago".
 *
 * Returns null past about two months, where a relative age stops being useful
 * and starts being evasive — "9 weeks ago" is harder to place than the date
 * itself, and on a team site it reads like hiding how quiet things have been.
 */
export function timeAgo(iso: string | Date | null | undefined, now = new Date()): string | null {
  const d = daysUntil(iso, now);
  if (d === null || d > 0) return null;
  const ago = -d;
  if (ago === 0) return "Today";
  if (ago === 1) return "Yesterday";
  if (ago < 7) return `${ago} days ago`;
  if (ago < 14) return "Last week";
  if (ago < 60) return `${Math.floor(ago / 7)} weeks ago`;
  return null;
}

/**
 * Which day of the build season it is, counting kickoff itself as day 1 —
 * which is how a team says it. Null before kickoff, or with no date set.
 *
 * Goes through `daysUntil` rather than subtracting two `Date`s, so the answer
 * does not shift by one depending on the reader's timezone.
 */
export function buildDay(kickoff: string | Date | null | undefined, now = new Date()): number | null {
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
