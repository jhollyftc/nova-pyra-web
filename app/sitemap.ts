import type { MetadataRoute } from "next";

const BASE = "https://novapyra.app";

const ROUTES = [
  { path: "/", priority: 1 },
  { path: "/robot", priority: 0.9 },
  { path: "/engineering", priority: 0.8 },
  { path: "/team", priority: 0.8 },
  { path: "/impact", priority: 0.8 },
  { path: "/season", priority: 0.7 },
  { path: "/awards", priority: 0.7 },
  { path: "/sponsors", priority: 0.8 },
  { path: "/sponsors/join", priority: 0.9 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map(({ path, priority }) => ({
    url: `${BASE}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}
