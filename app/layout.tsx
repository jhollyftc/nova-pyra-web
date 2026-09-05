import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getSettings } from "@/lib/content";

const orbitron = localFont({
  src: [
    { path: "./fonts/orbitron-700.woff2", weight: "700" },
    { path: "./fonts/orbitron-900.woff2", weight: "900" },
  ],
  display: "swap",
  variable: "--font-orbitron",
});

const rajdhani = localFont({
  src: [
    { path: "./fonts/rajdhani-400.woff2", weight: "400" },
    { path: "./fonts/rajdhani-600.woff2", weight: "600" },
    { path: "./fonts/rajdhani-700.woff2", weight: "700" },
  ],
  display: "swap",
  variable: "--font-rajdhani",
});

/** Built from the CMS, so the title and description follow a tagline change. */
export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL("https://novapyra.app"),
    title: {
      default: `${s.teamName} · FTC ${s.teamNumber}`,
      template: `%s · ${s.teamName} FTC ${s.teamNumber}`,
    },
    description: `FIRST Tech Challenge Team ${s.teamNumber} from ${s.location}. ${s.tagline}`,
    openGraph: {
      type: "website",
      siteName: `${s.teamName} · FTC ${s.teamNumber}`,
      locale: "en_US",
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // The header and footer are client components (drawer state, pathname), so
  // settings are fetched here and passed down rather than fetched by them.
  const settings = await getSettings();

  return (
    <html lang="en" className={`${orbitron.variable} ${rajdhani.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:text-black"
        >
          Skip to content
        </a>
        <SiteHeader teamNumber={settings.teamNumber} />
        <main id="main">{children}</main>
        <SiteFooter settings={settings} />
      </body>
    </html>
  );
}
