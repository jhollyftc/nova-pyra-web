import { revalidatePath } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Sanity webhook: flush the cache the moment something is published.
 *
 * Without this, freshness comes only from the time window in the root layout,
 * and every expiry replays the page's queries — so Sanity API usage scales with
 * visitor traffic rather than with editing. A full site render costs 42 queries
 * and the free plan allows 250k a month, which a busy crawler could burn through
 * on a short window.
 *
 * With it, the window can be long (an hour) because publishes no longer wait for
 * it: editors get near-instant updates AND baseline usage drops to roughly a
 * thousand queries a month. Both ends of the trade improve.
 *
 * Everything is revalidated rather than just the changed document's routes:
 * one document can appear on several pages (a sponsor shows on the front page
 * and /sponsors; a result feeds the hero telemetry), and mapping that precisely
 * would be a bug waiting to happen for a site this size.
 */
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    );

    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }

    revalidatePath("/", "layout");

    return NextResponse.json({
      revalidated: true,
      type: body?._type ?? null,
      now: Date.now(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
