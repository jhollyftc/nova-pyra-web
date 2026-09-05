import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import StatCounter from "@/components/StatCounter";
import Video from "@/components/Video";
import ImpactGrid from "@/components/home/ImpactGrid";
import { video } from "@/lib/media";
import { getAllTimeStats, getImpactStats, getOutreachEvents } from "@/lib/content";

export const metadata: Metadata = {
  title: "Outreach & Impact",
  description:
    "How Nova Pyra promotes STEM across St. Tammany Parish — events, schools reached, teams mentored, and volunteer hours.",
};

export default function ImpactPage() {
  const season = getImpactStats();
  const allTime = getAllTimeStats();

  return (
    <>
      <PageHeader
        eyebrow="Outreach & Impact"
        title="What we do off the field"
        intro="Robots are the excuse. The point is getting more kids in front of engineering."
      />

      <Section eyebrow="This season" title="Impact at a glance">
        <Reveal>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-5">
            <StatCounter value={season.peopleReached} label="People reached" />
            <StatCounter value={season.volunteerHours} label="Volunteer hours" />
            <StatCounter value={season.eventsHosted} label="Events" />
            <StatCounter value={season.schoolsVisited} label="Schools visited" />
            <StatCounter value={season.teamsmentored} label="Teams mentored" />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-center">
            <div>
              <p className="micro">All time · both seasons</p>
              <dl className="mt-4 flex flex-col gap-2">
                {[
                  ["People reached", allTime.peopleReached],
                  ["Volunteer hours", allTime.volunteerHours],
                  ["Events", allTime.eventsHosted],
                  ["Schools visited", allTime.schoolsVisited],
                  ["Teams mentored", allTime.teamsmentored],
                ].map(([label, value]) => (
                  <div
                    key={label as string}
                    className="flex items-baseline justify-between gap-4 border-b border-[var(--color-border)] pb-2"
                  >
                    <dt style={{ fontSize: "15px" }}>{label}</dt>
                    <dd
                      className="tabular-nums"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "17px",
                        color: "var(--color-accent)",
                      }}
                    >
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="scanlines hud-frame overflow-hidden">
              <Video sources={video("recap")} className="w-full" label="Season recap" />
            </div>
          </div>
        </Reveal>
      </Section>

      <Section eyebrow="Events" title="Where we showed up">
        <ImpactGrid events={getOutreachEvents()} />
      </Section>
    </>
  );
}
