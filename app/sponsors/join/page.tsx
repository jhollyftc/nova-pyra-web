import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import StatCounter from "@/components/StatCounter";
import {
  getAwards,
  getImpactStats,
  getSponsors,
  getSponsorship,
  team,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Sponsor Us",
  description:
    "Sponsor FIRST Tech Challenge Team 25619 Nova Pyra. Tiers from $1 to $1,000+, funding parts, travel and STEM outreach across St. Tammany Parish.",
};

export default function SponsorUsPage() {
  const s = getSponsorship();
  const stats = getImpactStats();
  const awards = getAwards();

  const subject = encodeURIComponent(`Sponsorship enquiry — Nova Pyra FTC ${team.number}`);

  return (
    <>
      <PageHeader eyebrow="Sponsor Us" title="Put your name on a robot" intro={s.intro} />

      {/* The case: what a sponsor's money reaches */}
      <Section eyebrow="Reach" title="What your support buys">
        <Reveal>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            <StatCounter value={stats.peopleReached} label="People reached this season" />
            <StatCounter value={stats.volunteerHours} label="Volunteer hours" />
            <StatCounter value={stats.schoolsVisited} label="Schools visited" />
            <StatCounter value={awards.length} label="Awards won" />
          </div>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {s.whatItFunds.map((f, i) => (
            <Reveal key={f.label} delay={i * 0.05} className="hud-frame p-6">
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: "16px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {f.label}
              </h3>
              <p
                className="mt-3 text-[var(--color-text-secondary)]"
                style={{ fontSize: "15px", lineHeight: 1.55 }}
              >
                {f.description}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Tiers"
        title="Every level helps"
        intro={`${getSponsors().length} sponsors already back the team — from $1 to $1,000+.`}
      >
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {s.tiers.map((tier, i) => (
            <Reveal
              as="li"
              key={tier.id}
              delay={i * 0.05}
              className="hud-frame flex flex-col p-6"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: "19px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--color-gold)",
                  }}
                >
                  {tier.label}
                </h3>
                <span
                  className="shrink-0 tabular-nums"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "14px",
                    color: "var(--color-accent)",
                  }}
                >
                  {tier.amount}
                </span>
              </div>

              <ul className="mt-5 flex flex-col gap-2.5">
                {tier.benefits.map((b) => (
                  <li key={b} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2 block h-1 w-1 shrink-0 rounded-full"
                      style={{ background: "var(--color-accent)" }}
                    />
                    <span
                      className="text-[var(--color-text-secondary)]"
                      style={{ fontSize: "14.5px", lineHeight: 1.5 }}
                    >
                      {b}
                    </span>
                  </li>
                ))}
              </ul>

              {tier.currentCount > 0 && (
                <p className="micro mt-auto pt-5">
                  {tier.currentCount} current sponsor{tier.currentCount === 1 ? "" : "s"}
                </p>
              )}
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section eyebrow="Get in touch" title="Talk to us">
        <Reveal>
          <div className="hud-frame flex flex-col items-start gap-6 p-8">
            <p
              className="max-w-2xl text-[var(--color-text-secondary)]"
              style={{ fontSize: "clamp(15px, 1.7vw, 18px)", lineHeight: 1.65 }}
            >
              Tell us a little about your business and what level you have in mind, and a mentor
              will get back to you. Sponsorships are handled by our teacher sponsors, not by
              students.
            </p>

            <a
              href={`mailto:${s.contactEmail}?subject=${subject}`}
              className="border px-8 py-4"
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
              Email the team
            </a>

            <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="micro">Checks payable to</dt>
                <dd className="mt-1.5" style={{ fontSize: "15px" }}>
                  {s.checkPayableTo}{" "}
                  <span className="text-[var(--color-text-muted)]">
                    — our fiscal sponsor
                  </span>
                </dd>
              </div>
              <div>
                <dt className="micro">Tax status</dt>
                <dd
                  className="mt-1.5 text-[var(--color-text-secondary)]"
                  style={{ fontSize: "15px" }}
                >
                  {s.taxNote}
                </dd>
              </div>
            </dl>

            <Link href="/sponsors" className="micro underline underline-offset-4">
              See who already supports us
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
