import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { team } from "@/lib/content";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://novapyra.app"),
  title: {
    default: `${team.name} · FTC ${team.number}`,
    template: `%s · ${team.name} FTC ${team.number}`,
  },
  description:
    `FIRST Tech Challenge Team ${team.number} from ${team.location}. ${team.tagline}`,
  openGraph: {
    type: "website",
    siteName: `${team.name} · FTC ${team.number}`,
    locale: "en_US",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${rajdhani.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:text-black"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
