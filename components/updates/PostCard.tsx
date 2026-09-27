import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { timeAgo } from "@/lib/dates";
import type { PostSummary } from "@/lib/content";

/**
 * One season update in a listing.
 *
 * The whole card is the link. A title-only hit area is a fiddly target on a
 * phone, and these are the most likely thing on the site to be opened on one.
 *
 * `featured` gives the newest post a wider, image-led treatment — a list where
 * every row is identical has no front page, and the point of this section is
 * that something happened recently.
 */
export default function PostCard({
  post,
  featured = false,
  delay = 0,
}: {
  post: PostSummary;
  featured?: boolean;
  delay?: number;
}) {
  const recent = timeAgo(post.publishedAt);

  return (
    <Reveal as="li" delay={delay} className="hud-frame group relative flex flex-col">
      {post.coverImage && (
        <div
          className="scanlines relative w-full overflow-hidden"
          style={{ aspectRatio: featured ? "21 / 9" : "16 / 10" }}
        >
          <Image
            src={post.coverImage}
            alt=""
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            sizes={featured ? "(max-width: 768px) 100vw, 900px" : "(max-width: 768px) 100vw, 420px"}
          />
        </div>
      )}

      <div
        className={`flex flex-1 flex-col gap-2 p-6 ${
          post.coverImage ? "border-t border-[var(--color-border)]" : ""
        }`}
      >
        <p className="micro flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>{post.dateLabel}</span>
          {recent && (
            <span
              className="inline-flex items-center gap-1.5"
              style={{ color: "var(--color-accent)" }}
            >
              <span
                aria-hidden="true"
                className="pulse-dot"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "currentColor",
                  boxShadow: "0 0 8px currentColor",
                }}
              />
              {recent}
            </span>
          )}
        </p>

        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: featured ? "clamp(20px, 3vw, 28px)" : "18px",
            letterSpacing: "0.03em",
            lineHeight: 1.3,
          }}
        >
          {/*
            Stretched link: the anchor covers the card, so the whole thing is
            clickable while the accessible name stays just the title. An
            overlay div would take the click without ever being a link.
          */}
          <Link
            href={`/updates/${post.slug}`}
            className="after:absolute after:inset-0 after:content-[''] hover:text-[var(--color-accent)]"
          >
            {post.title}
          </Link>
        </h3>

        {post.excerpt && (
          <p
            className="text-[var(--color-text-secondary)]"
            style={{ fontSize: featured ? "16px" : "15px", lineHeight: 1.6 }}
          >
            {post.excerpt}
          </p>
        )}
      </div>
    </Reveal>
  );
}
