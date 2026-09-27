/** @type {import('next').NextConfig} */
// Unlike ftc-pit-app this is NOT a static export — it is a server-rendered Vercel
// app so we get ISR, generated OG images and a real sitemap.
const nextConfig = {
  images: {
    // Sanity's image CDN, wired up in Phase 2.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },

  /**
   * The HIVE Shot Envelope simulator is a standalone HTML document served from
   * `public/`, so its real path is `/tools/shot-sim/index.html`. This gives it
   * the address it deserves.
   *
   * It is not a React route because it sizes itself to the viewport and brings
   * its own design system; nesting it in a page with the site's header and
   * footer would mean two headers and a scrollbar inside a scrollbar. It gets
   * its own full-screen URL instead, and the site links to it.
   */
  async rewrites() {
    return [{ source: "/season/shot-sim", destination: "/tools/shot-sim/index.html" }];
  },
};

module.exports = nextConfig;
