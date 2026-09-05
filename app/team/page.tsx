import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import PersonCard from "@/components/team/PersonCard";
import { getMembers, getTeamStory, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Who Nova Pyra is — our founding story, values, subteams, students, mentors and industry partners.",
};

export default async function TeamPage() {
  const [story, { students, mentors, alumni }, settings] = await Promise.all([
    getTeamStory(), getMembers(), getSettings(),
  ]);

  return (
    <>
      {/*
        Title, photo and founding story share the header so the page introduces
        itself in one screen. Previously the story sat a full section below the
        photo, so "who we are" needed a scroll to actually read.
      */}
      <PageHeader
        eyebrow="Our Story"
        title="Who we are"
        intro={`FIRST Tech Challenge Team ${settings.teamNumber}, founded ${settings.founded} in ${settings.location}.`}
        lead={
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
            {settings.teamPhoto && (
              <figure className="hud-frame scanlines m-0 self-start overflow-hidden">
                <Image
                  src={settings.teamPhoto}
                  alt="The Nova Pyra team at the FIRST World Championship in Houston"
                  width={1600}
                  height={516}
                  priority
                  className="h-auto w-full"
                  sizes="(max-width: 1024px) 100vw, 600px"
                />
              </figure>
            )}
            <div>
              <p className="micro mb-3">Origins · New fire</p>
              <p style={{ fontSize: "clamp(15px, 1.6vw, 17px)", lineHeight: 1.65 }}>
                {story?.foundingStory}
              </p>
              <p className="micro mt-4">
                FIRST World Championship · Houston, Texas
              </p>
            </div>
          </div>
        }
      />

      <Section eyebrow="What drives us" title="Mission">
        <Reveal>
          <div className="hud-frame max-w-3xl p-6">
            <p
              className="text-[var(--color-text-secondary)]"
              style={{ fontSize: "clamp(16px, 1.8vw, 19px)", lineHeight: 1.65 }}
            >
              {story?.missionStatement}
            </p>
          </div>
        </Reveal>
      </Section>

      <Section eyebrow="What we stand for" title="Values">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {(story?.values ?? []).map((v, i) => (
            <Reveal as="li" key={v.label} delay={i * 0.05} className="hud-frame p-5">
              <span aria-hidden="true" style={{ fontSize: "26px" }}>
                {v.icon}
              </span>
              <h3
                className="mt-3"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: "15px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {v.label}
              </h3>
              <p
                className="mt-2 text-[var(--color-text-secondary)]"
                style={{ fontSize: "15px", lineHeight: 1.5 }}
              >
                {v.description}
              </p>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section eyebrow="How we organise" title="Subteams">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(story?.subteams ?? []).map((s, i) => (
            <Reveal as="li" key={s.name} delay={i * 0.04} className="hud-frame p-5">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" style={{ fontSize: "22px" }}>
                  {s.icon}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    fontSize: "16px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {s.name}
                </h3>
              </div>
              <p className="micro mt-4">Goal</p>
              <p className="mt-1" style={{ fontSize: "15px", lineHeight: 1.5 }}>
                {s.goal}
              </p>
              <p className="micro mt-3">Challenge</p>
              <p
                className="mt-1 text-[var(--color-text-secondary)]"
                style={{ fontSize: "15px", lineHeight: 1.5 }}
              >
                {s.challenge}
              </p>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section eyebrow="Students" title={`The team · ${students.length} members`}>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {students.map((m, i) => (
            <Reveal as="li" key={m.id} delay={Math.min(i, 8) * 0.03}>
              <PersonCard person={m} />
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section eyebrow="Mentors & Boosters" title={`Behind the team · ${mentors.length}`}>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {mentors.map((m, i) => (
            <Reveal as="li" key={m.id} delay={Math.min(i, 8) * 0.03}>
              <PersonCard person={m} />
            </Reveal>
          ))}
        </ul>
      </Section>

      {alumni.length > 0 && (
        <Section
          eyebrow="Alumni"
          title={`Where they went · ${alumni.length}`}
          intro="Students and mentors who moved on. They built the robots that came before this one."
        >
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {alumni.map((m, i) => (
              <Reveal as="li" key={m.id} delay={Math.min(i, 8) * 0.03}>
                <PersonCard person={m} showAlumniDetail />
              </Reveal>
            ))}
          </ul>
        </Section>
      )}

      <Section eyebrow="FIRST & Industry" title="Partners">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(story?.partners ?? []).map((p, i) => (
            <Reveal as="li" key={p.name} delay={i * 0.04} className="hud-frame p-5">
              <p className="micro" style={{ color: "var(--color-cyan)" }}>
                {p.type}
              </p>
              <h3
                className="mt-2"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: "16px",
                  letterSpacing: "0.04em",
                }}
              >
                {p.name}
              </h3>
              <p
                className="mt-2 text-[var(--color-text-secondary)]"
                style={{ fontSize: "15px", lineHeight: 1.5 }}
              >
                {p.description}
              </p>
            </Reveal>
          ))}
        </ul>
      </Section>
    </>
  );
}
