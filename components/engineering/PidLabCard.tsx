import Link from "next/link";
import Reveal from "@/components/Reveal";

/**
 * The entry point to the Motor PID Lab.
 *
 * Unlike the shot simulator, this isn't modelling one of our own mechanisms —
 * it's a generic simulated DC motor holding a position or a flywheel speed,
 * built to teach the control loop underneath things we actually rely on: a
 * flywheel holding RPM under load, an arm holding an angle against gravity.
 * The card says that plainly rather than dressing it up as bespoke robot
 * data, because the tool's honesty about what it is is what makes it useful
 * to point a new student at.
 */
const FACTS = [
  {
    label: "Tune",
    value: "P, I and D live, against a position hold or a flywheel speed hold",
  },
  {
    label: "Watch",
    value: "Overshoot, rise time, settling time and steady-state error update as you turn each knob",
  },
  {
    label: "Break it on purpose",
    value: "Guided experiments for integral windup, derivative kick, and sensor noise",
  },
];

export default function PidLabCard() {
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
          <p className="micro">Interactive</p>
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
            Motor PID Lab
          </h3>
          <p
            className="mt-4 max-w-xl text-[var(--color-text-secondary)]"
            style={{ fontSize: "clamp(15px, 1.7vw, 17px)", lineHeight: 1.65 }}
          >
            Every closed loop on the robot — a flywheel holding speed, an arm holding
            an angle — comes down to the same three numbers. This is a simulated
            motor to turn them on: push P too far and it rings, add I and watch it
            find the exact voltage gravity needs, push I too far and it doesn&rsquo;t
            come back.
          </p>

          <Link
            href="/engineering/pid-lab"
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
            Open the lab →
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
