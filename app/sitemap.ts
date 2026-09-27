import type { MetadataRoute } from "next";
import { getPosts, getRobot, getRobotList } from "@/lib/content";

const BASE = "https://novapyra.app";

const ROUTES = [
  { path: "/", priority: 1 },
  { path: "/robot", priority: 0.9 },
  { path: "/engineering", priority: 0.8 },
  { path: "/team", priority: 0.8 },
  { path: "/impact", priority: 0.8 },
  { path: "/season", priority: 0.7 },
  // The shot simulator is a real page at its own URL (a rewrite onto a static
  // file), and the kind of thing worth finding.
  { path: "/season/shot-sim", priority: 0.7 },
  { path: "/awards", priority: 0.7 },
  { path: "/sponsors", priority: 0.8 },
  { path: "/sponsors/join", priority: 0.9 },
];

/**
 * Static routes plus the CMS-driven ones.
 *
 * Updates and past robots have their own URLs and are exactly the pages worth
 * indexing — a season update is the only thing here that gets shared as a
 * link — so the sitemap is generated rather than hand-listed. Each update
 * carries its real publish date, so a recrawl is triggered by the post rather
 * than by a build happening to run.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [posts, robots, featured] = await Promise.all([
    getPosts(),
    getRobotList(),
    getRobot(),
  ]);

  return [
    ...ROUTES.map(({ path, priority }) => ({
      url: `${BASE}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority,
    })),
    ...(posts.length > 0
      ? [
          {
            url: `${BASE}/updates`,
            lastModified: new Date(posts[0].publishedAt),
            changeFrequency: "weekly" as const,
            priority: 0.8,
          },
        ]
      : []),
    ...posts.map((p) => ({
      url: `${BASE}/updates/${p.slug}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    // The featured robot is served at /robot; its slug only redirects there.
    ...robots
      .filter((r) => r.slug && r.slug !== featured?.slug)
      .map((r) => ({
        url: `${BASE}/robot/${r.slug}`,
        lastModified: now,
        changeFrequency: "yearly" as const,
        priority: 0.6,
      })),
  ];
}
