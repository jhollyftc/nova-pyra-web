import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import { getMembers, getTeamStory, team } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Who Nova Pyra is — our founding story, values, subteams, students, mentors and industry partners.",
};

type Person = {
  id: string;
  name: string;
  role: string;
  photo: string;
  roleDescription?: string;
  interests?: string;
  funFact?: string;
  whyRobotics?: string;
  dreamOccupation?: string;
};

function PersonCard({ person }: { person: Person }) {
  return (
    <article className="hud-frame flex flex-col overflow-hidden">
      <div className="relative aspect-square w-full overflow-hidden bg-[var(--color-surface)]/20">
        <Image
          src={person.photo}
          alt={person.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 border-t border-[var(--color-border)] p-4">
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: "16px",
            letterSpacing: "0.04em",
          }}
        >
          {person.name}
        </h3>
        <p className="micro" style={{ color: "var(--color-accent)" }}>
          {person.role}
        </p>
        {person.roleDescription && (
          <p
            className="mt-1 text-[var(--color-text-secondary)]"
            style={{ fontSize: "13.5px", lineHeight: 1.5 }}
          >
            {person.roleDescription}
          </p>
        )}
        {person.dreamOccupation && (
          <p className="micro mt-auto pt-2">Wants to be: {person.dreamOccupation}</p>
        )}
      </div>
    </article>
  );
}

export default function TeamPage() {
  const story = getTeamStory();
  const { students, mentors } = getMembers();

  return (
    <>
      <PageHeader
        eyebrow="Our Story"
        title="Who we are"
        intro={`FIRST Tech Challenge Team ${team.number}, founded ${story.foundingStory ? team.founded : ""} in ${team.location}.`}
      />

      <section className="shell pt-[calc(var(--section-gap)/2)]">
        <Reveal>
          <figure className="hud-frame scanlines m-0 overflow-hidden">
            <Image
              src="/images/team-photo.jpg"
              alt="The Nova Pyra team at the FIRST World Championship in Houston"
              width={1600}
              height={794}
              priority
              className="h-auto w-full"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </figure>
          <figcaption className="micro mt-3">
            FIRST World Championship · Houston, Texas
          </figcaption>
        </Reveal>
      </section>

      <Section eyebrow="Origins" title="New fire">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <p style={{ fontSize: "clamp(15px, 1.7vw, 18px)", lineHeight: 1.7 }}>
              {story.foundingStory}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="hud-frame p-6">
              <p className="micro">Mission</p>
              <p
                className="mt-3 text-[var(--color-text-secondary)]"
                style={{ fontSize: "clamp(15px, 1.7vw, 17px)", lineHeight: 1.65 }}
              >
                {story.mission}
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section eyebrow="What we stand for" title="Values">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {story.values.map((v, i) => (
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
                style={{ fontSize: "13.5px", lineHeight: 1.5 }}
              >
                {v.description}
              </p>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section eyebrow="How we organise" title="Subteams">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {story.subteams.map((s, i) => (
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
              <p className="mt-1" style={{ fontSize: "14px", lineHeight: 1.5 }}>
                {s.goal}
              </p>
              <p className="micro mt-3">Challenge</p>
              <p
                className="mt-1 text-[var(--color-text-secondary)]"
                style={{ fontSize: "14px", lineHeight: 1.5 }}
              >
                {s.challenge}
              </p>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section eyebrow="Students" title={`The team · ${students.length} members`}>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {students.map((m, i) => (
            <Reveal as="li" key={m.id} delay={Math.min(i, 8) * 0.03}>
              <PersonCard person={m as Person} />
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section eyebrow="Mentors & Boosters" title={`Behind the team · ${mentors.length}`}>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {mentors.map((m, i) => (
            <Reveal as="li" key={m.id} delay={Math.min(i, 8) * 0.03}>
              <PersonCard person={m as Person} />
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section eyebrow="FIRST & Industry" title="Partners">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {story.partners.map((p, i) => (
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
                style={{ fontSize: "14px", lineHeight: 1.5 }}
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
