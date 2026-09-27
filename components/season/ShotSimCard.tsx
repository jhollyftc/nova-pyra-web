import Link from "next/link";
import Reveal from "@/components/Reveal";

/**
 * The entry point to the HIVE Shot Envelope simulator.
 *
 * The tool opens at its own full-screen URL rather than inside this page, so
 * this card has to do the work an embed would otherwise do: say what the thing
 * is, say what it models, and be worth clicking. A bare "Open the simulator"
 * link would undersell the most substantial piece of engineering work the team
 * has published.
 *
 * The three facts below are the ones a judge would ask about — what physics is
 * in the model, what the load-bearing assumption is, and what it refuses to
 * claim. Naming the limitation on the card rather than hiding it inside the
 * tool is the same instinct that makes the tool itself credible.
 */
const FACTS = [
  {
    label: "Models",
    value: "Quadratic drag, both balls, every angle and speed that scores",
  },
  {
    label: "Solves",
    value: "The exit speed window at any point on the floor",
  },
  {
    label: "Assumes",
    value: "A 60° entry cone — adjustable, and the answer moves a lot with it",
  },
];

export default function ShotSimCard() {
  return (
    <Reveal className="hud-frame relative overflow-hidden">
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 85% 50%, rgba(17,115,241,0.16), transparent 70%)",
        }}
      />
      <div className="relative grid gap-8 p-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center lg:p-10">
        <div>
          <p className="micro">Interactive · Built by the team</p>
          <h3
            className="glow-text mt-2"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(22px, 3.4vw, 34px)",
              lineHeight: 1.1,
              letterSpacing: "0.02em",
            }}
          >
            HIVE Shot Envelope
          </h3>
          <p
            className="mt-4 max-w-xl text-[var(--color-text-secondary)]"
            style={{ fontSize: "clamp(15px, 1.7vw, 17px)", lineHeight: 1.65 }}
          >
            Before building a launcher, we modelled one. Set a spot on the field and
            the simulator solves every launch angle and exit speed that puts a ball
            through the CELL — then maps the whole floor to show where a shot exists
            at all, and how much launcher error each position forgives.
          </p>

          <Link
            href="/season/shot-sim"
            className="cta cta-accent glow-box mt-7 inline-block border"
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "15px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              borderColor: "var(--color-border-active)",
              padding: "12px 26px",
            }}
          >
            Open the simulator →
          </Link>
        </div>

        <dl className="flex flex-col gap-4">
          {FACTS.map((f) => (
            <div
              key={f.label}
              className="border-l-2 pl-4"
              style={{ borderColor: "var(--color-border-active)" }}
            >
              <dt className="micro">{f.label}</dt>
              <dd
                className="mt-1 text-[var(--color-text-secondary)]"
                style={{ fontSize: "15px", lineHeight: 1.5 }}
              >
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Reveal>
  );
}
