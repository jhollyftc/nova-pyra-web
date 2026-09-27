import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import PostCard from "@/components/updates/PostCard";
import { getPosts, getSectionCopy } from "@/lib/content";

export const metadata: Metadata = {
  title: "Season Updates",
  description:
    "Build notes, competition recaps and outreach reports from FTC Team 25619 Nova Pyra.",
};

export default async function UpdatesPage() {
  const [posts, copy] = await Promise.all([getPosts(), getSectionCopy()]);

  const [latest, ...rest] = posts;

  return (
    <>
      <PageHeader {...copy("updates.header", { n: posts.length })} />

      <div className="shell" style={{ paddingBlock: "var(--section-gap)" }}>
        {posts.length === 0 ? (
          /*
            The honest empty state. This route exists before the team has
            written anything, and inventing a placeholder post would put words
            in their mouths on a public site. The header link is hidden until
            there is a first post, so almost nobody reaches this — but anyone
            who does should find out what the page is rather than a blank.
          */
          <Reveal className="hud-frame max-w-2xl p-8">
            <p className="micro">Nothing here yet</p>
            <p className="mt-3" style={{ fontSize: "17px", lineHeight: 1.7 }}>
              This is where the team posts build notes, competition recaps and outreach
              reports. The first update will appear here as soon as it is written.
            </p>
          </Reveal>
        ) : (
          <>
            {/* The newest post gets the wide treatment: a list where every row
                looks the same has no front page, and recency is the point. */}
            <ul className="mb-4 grid gap-4">
              <PostCard post={latest} featured />
            </ul>
            {rest.length > 0 && (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post, i) => (
                  <PostCard key={post.id} post={post} delay={i * 0.04} />
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </>
  );
}
