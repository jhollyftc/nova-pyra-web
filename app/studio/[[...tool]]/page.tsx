/**
 * The embedded Sanity Studio, served at /studio.
 *
 * Sanity handles its own auth — only people invited to the project can sign in,
 * and the route renders nothing useful to anyone else. It is deliberately absent
 * from sitemap.ts.
 *
 * The config is imported lazily and only once the project id is present.
 * sanity/env.ts throws on a missing id — correct for the content path, where
 * silently rendering an empty site would be worse than failing — but a route
 * that 500s is the wrong way to say "not set up yet", so this checks first.
 */
export { metadata, viewport } from "next-sanity/studio";

export const dynamic = "force-static";

export default async function StudioPage() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return <NotConfigured />;

  const [{ NextStudio }, { default: config }] = await Promise.all([
    import("next-sanity/studio"),
    import("@/sanity.config"),
  ]);

  return <NextStudio config={config} />;
}

function NotConfigured() {
  return (
    <div className="shell flex min-h-[70vh] flex-col items-start justify-center py-24">
      <p className="micro">Studio · not configured</p>
      <h1
        className="glow-text mt-4"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontSize: "clamp(26px, 6vw, 52px)",
          lineHeight: 1.1,
        }}
      >
        CMS NOT CONNECTED
      </h1>
      <p
        className="mt-6 max-w-lg text-[var(--color-text-secondary)]"
        style={{ fontSize: "17px", lineHeight: 1.6 }}
      >
        This site is still reading content from JSON files in the repository. To turn the editor
        on, set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and{" "}
        <code>NEXT_PUBLIC_SANITY_DATASET</code> in the Vercel project&rsquo;s environment
        variables, then redeploy.
      </p>
      <p className="micro mt-6">See EDITING.md for the current way to change content.</p>
    </div>
  );
}
