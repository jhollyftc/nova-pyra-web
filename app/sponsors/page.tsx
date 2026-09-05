import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import { getSponsorsByTier, getSponsors } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Sponsors",
  description:
    "The businesses, foundations and families who fund FTC Team 25619 Nova Pyra.",
};

export default async function SponsorsPage() {
  const [allTiers, sponsors] = await Promise.all([getSponsorsByTier(), getSponsors()]);
  const tiers = allTiers.filter((t) => t.sponsors.length > 0);

  return (
    <>
      <PageHeader
        eyebrow="Thank You"
        title="Built by our community"
        intro={`${sponsors.length} sponsors fund our parts, our travel, and the outreach we run across St. Tammany Parish.`}
      />

      {tiers.map((tier) => (
        <Section key={tier.id} eyebrow={tier.amount} title={tier.label}>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tier.sponsors.map((s, i) => (
              <Reveal
                as="li"
                key={s.id}
                delay={Math.min(i, 6) * 0.04}
                className="hud-frame flex flex-col gap-4 p-5"
              >
                {s.logo && (
                  <div
                    className="flex h-28 w-full items-center justify-center rounded-md border border-[var(--color-border)] p-4"
                    style={{ background: "rgba(17, 115, 241, 0.05)" }}
                  >
                    <Image
                      src={s.logo}
                      alt={s.name}
                      width={240}
                      height={112}
                      className="max-h-full w-auto object-contain"
                      sizes="240px"
                    />
                  </div>
                )}
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 700,
                      fontSize: "16px",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {s.name}
                  </h3>
                  {s.description && (
                    <p
                      className="mt-2 text-[var(--color-text-secondary)]"
                      style={{ fontSize: "15px", lineHeight: 1.5 }}
                    >
                      {s.description}
                    </p>
                  )}
                </div>
              </Reveal>
            ))}
          </ul>
        </Section>
      ))}

      <Section eyebrow="Join them" title="Support Nova Pyra">
        <Reveal>
          <Link
            href="/sponsors/join"
            className="inline-block border px-8 py-4"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "15px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--color-gold)",
              borderColor: "rgba(242,183,5,0.5)",
              boxShadow: "var(--glow-gold)",
            }}
          >
            Become a Sponsor
          </Link>
        </Reveal>
      </Section>
    </>
  );
}
