/** @type {import('next').NextConfig} */
// Unlike ftc-pit-app this is NOT a static export — it is a server-rendered Vercel
// app so we get ISR, generated OG images and a real sitemap.
const nextConfig = {
  images: {
    // Sanity's image CDN, wired up in Phase 2.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

module.exports = nextConfig;
