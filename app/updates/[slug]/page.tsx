import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import PostBody from "@/components/updates/PostBody";
import { getAdjacentPosts, getPost, getPosts } from "@/lib/content";
import { timeAgo } from "@/lib/dates";

type Params = { params: Promise<{ slug: string }> };

/** One static route per published update, like every other page on the site. */
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Season Update" };

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    // These are the pages most likely to be shared as links, so they carry a
    // real article card rather than falling back to the site-wide OG image.
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt ?? undefined,
      publishedTime: post.publishedAt,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

export default async function UpdatePage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const { newer, older } = await getAdjacentPosts(post.publishedAt);
  const recent = timeAgo(post.publishedAt);

  return (
    <article>
      <header className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="dot-grid absolute inset-0" aria-hidden="true" />
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 50% 0%, rgba(17,115,241,0.16), transparent 70%)",
          }}
        />
        <div className="shell relative" style={{ paddingBlock: "clamp(28px, 5.5vh, 88px)" }}>
          <Reveal>
            <p className="micro">
              <Link href="/updates" className="hover:text-[var(--color-accent)]">
                Season updates
              </Link>
              {" · "}
              <time dateTime={post.publishedAt}>{post.dateLabel}</time>
              {recent && <span style={{ color: "var(--color-accent)" }}> · {recent}</span>}
            </p>
            <h1
              className="glow-text text-balance"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "clamp(24px, min(5vw, 5.6vh), 52px)",
                lineHeight: 1.1,
                letterSpacing: "0.02em",
                marginTop: "clamp(8px, 1.4vh, 16px)",
              }}
            >
              {post.title}
            </h1>
            {post.excerpt && (
              <p
                className="mt-4 max-w-[62ch] text-[var(--color-text-secondary)]"
                style={{ fontSize: "clamp(16px, 1.8vw, 19px)", lineHeight: 1.6 }}
              >
                {post.excerpt}
              </p>
            )}
          </Reveal>
        </div>
      </header>

      <div className="shell" style={{ paddingBlock: "clamp(40px, 8vh, 96px)" }}>
        {post.coverImage && (
          <Reveal className="hud-frame scanlines relative mb-10 max-w-[68ch] overflow-hidden">
            <Image
              src={post.coverImage}
              alt=""
              width={1400}
              height={788}
              className="h-auto w-full"
              sizes="(max-width: 768px) 100vw, 720px"
              priority
            />
          </Reveal>
        )}

        <PostBody body={post.body} />

        {/* A post read from a shared link is otherwise a dead end. */}
        {(newer || older) && (
          <nav
            className="mt-14 grid max-w-[68ch] gap-px border-t border-[var(--color-border)] pt-8 sm:grid-cols-2"
            aria-label="More updates"
          >
            {[
              { post: newer, label: "Newer" },
              { post: older, label: "Older" },
            ].map(({ post: p, label }) =>
              p ? (
                <Link
                  key={label}
                  href={`/updates/${p.slug}`}
                  className="group flex flex-col gap-1.5 py-2"
                >
                  <span className="micro">{label}</span>
                  <span
                    className="transition-colors group-hover:text-[var(--color-accent)]"
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 700,
                      fontSize: "17px",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {p.title}
                  </span>
                </Link>
              ) : (
                <span key={label} />
              ),
            )}
          </nav>
        )}
      </div>
    </article>
  );
}
