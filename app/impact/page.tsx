import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import StatCounter from "@/components/StatCounter";
import Video from "@/components/Video";
import ImpactGrid from "@/components/home/ImpactGrid";
import { getAllTimeStats, getImpactStats, getOutreachEvents, getRecapClip, getRecapPoster } from "@/lib/content";

export const metadata: Metadata = {
  title: "Outreach & Impact",
  description:
    "How Nova Pyra promotes STEM across St. Tammany Parish — events, schools reached, teams mentored, and volunteer hours.",
};

export default async function ImpactPage() {
  const [season, allTime, events, recap, recapPoster] = await Promise.all([
    getImpactStats(), getAllTimeStats(), getOutreachEvents(), getRecapClip(), getRecapPoster(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Outreach & Impact"
        title="What we do off the field"
        intro="Robots are the excuse. The point is getting more kids in front of engineering."
        lead={
          <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-5">
            <StatCounter compact value={season.peopleReached} label="People reached" />
            <StatCounter compact value={season.volunteerHours} label="Volunteer hours" />
            <StatCounter compact value={season.eventsHosted} label="Events" />
            <StatCounter compact value={season.schoolsVisited} label="Schools visited" />
            <StatCounter compact value={season.teamsMentored} label="Teams mentored" />
          </div>
        }
      />

      <Section eyebrow="All time" title="Since we started">
        <Reveal delay={0.1}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-center">
            <div>
              <dl className="flex flex-col gap-2">
                {[
                  ["People reached", allTime.peopleReached],
                  ["Volunteer hours", allTime.volunteerHours],
                  ["Events", allTime.eventsHosted],
                  ["Schools visited", allTime.schoolsVisited],
                  ["Teams mentored", allTime.teamsMentored],
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
            {recap && (
              <div className="scanlines hud-frame overflow-hidden">
                <Video sources={{ mp4: recap, poster: recapPoster }} className="w-full" label="Season recap" />
              </div>
            )}
          </div>
        </Reveal>
      </Section>

      <Section eyebrow="Events" title="Where we showed up">
        <ImpactGrid events={events} />
      </Section>
    </>
  );
}
