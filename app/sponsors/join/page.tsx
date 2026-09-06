import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import StatCounter from "@/components/StatCounter";
import DonateEmbed from "@/components/DonateEmbed";
import {
  getAwards,
  getImpactStats,
  getSectionCopy,
  getSettings,
  getSponsors,
  getSponsorship,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Sponsor Us",
  description:
    "Sponsor FIRST Tech Challenge Team 25619 Nova Pyra. Tiers from $1 to $1,000+, funding parts, travel and STEM outreach across St. Tammany Parish.",
};

export default async function SponsorUsPage() {
  const [s, stats, awards, sponsors, settings, copy] = await Promise.all([
    getSponsorship(), getImpactStats(), getAwards(), getSponsors(), getSettings(),
    getSectionCopy(),
  ]);

  const actionStyle = {
    fontFamily: "var(--font-heading)",
    fontWeight: 700,
    fontSize: "14px",
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    padding: "12px 26px",
  };

  const subject = encodeURIComponent(
    `Sponsorship enquiry — ${settings.teamName} FTC ${settings.teamNumber}`,
  );

  return (
    <>
      <PageHeader
        {...copy("sponsorsJoin.header")}
        intro={s.intro}
        // This page exists to be acted on. Both routes to giving are in the
        // header so nobody has to scroll past three sections to find them.
        lead={
          <div className="flex flex-wrap gap-3">
            {s.donateUrl && (
              <a
                href="#donate"
                className="border"
                style={{
                  ...actionStyle,
                  color: "var(--color-gold)",
                  borderColor: "rgba(242,183,5,0.5)",
                  boxShadow: "var(--glow-gold)",
                }}
              >
                Give now
              </a>
            )}
            <a
              href={`mailto:${s.contactEmail}?subject=${subject}`}
              className="border"
              style={{
                ...actionStyle,
                color: "var(--color-accent)",
                borderColor: "var(--color-border-active)",
              }}
            >
              Email the team
            </a>
          </div>
        }
      />

      {/* The case: what a sponsor's money reaches */}
      <Section {...copy("sponsorsJoin.reach")}>
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

      {/*
        Tiers and the donation form share one section on purpose. They used to be
        separate, so clicking "Give now" scrolled the tiers off screen exactly
        when someone needed them — the amount you type only means something if
        you can see which level it buys. On wide screens the form sticks beside
        the tiers as they scroll; below lg it stacks, form first, because the
        anchor that brought you here was about giving.
      */}
      <Section
        id="donate"
        {...copy("sponsorsJoin.tiers", { n: sponsors.length })}
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-10">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
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
                      fontSize: "15px",
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
                        style={{ fontSize: "15px", lineHeight: 1.5 }}
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

          {s.donateUrl && (
            <div
              className="order-first lg:order-last lg:sticky lg:self-start"
              style={{ top: "calc(var(--header-height) + 20px)" }}
            >
              <p className="micro mb-3">Donate online</p>
              <DonateEmbed url={s.donateUrl} teamName={settings.teamName} />
            </div>
          )}
        </div>
      </Section>

      <Section {...copy("sponsorsJoin.contact")}>
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
                <dt className="micro">Sponsorship form</dt>
                <dd className="mt-1.5" style={{ fontSize: "15px" }}>
                  {s.sponsorLetter ? (
                    <a
                      href={s.sponsorLetter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4"
                      style={{ color: "var(--color-gold)" }}
                    >
                      Download the form (PDF)
                    </a>
                  ) : (
                    <span className="text-[var(--color-text-muted)]">Ask us for a copy</span>
                  )}
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
