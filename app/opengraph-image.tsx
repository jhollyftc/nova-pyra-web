import { ImageResponse } from "next/og";
import { getSettings, getSeasonTelemetry } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "FIRST Tech Challenge team";

/**
 * The social card. Built from the brand tokens rather than a screenshot so it
 * stays correct when content changes — the record and rank come from the same
 * derived telemetry the hero uses.
 *
 * Orbitron is not loaded here: next/og needs font bytes fetched at request
 * time, and the system sans at heavy weight with wide tracking reads close
 * enough at this size. Revisit if the card ever looks off-brand.
 */
export default async function Image() {
  const [t, team] = await Promise.all([getSeasonTelemetry(), getSettings()]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#000000",
          backgroundImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, rgba(17,115,241,0.28), transparent 70%)",
          padding: 72,
          color: "#FFFFFF",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/*
            Satori (next/og) throws on any div with more than one child unless it
            declares display explicitly, and each interpolation counts as a
            child — so these strings are composed before they reach JSX.
          */}
          <div
            style={{
              fontSize: 24,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#8899AA",
            }}
          >
            {`FTC Team ${team.teamNumber} · ${team.location}`}
          </div>

          <div
            style={{
              marginTop: 28,
              fontSize: 108,
              fontWeight: 900,
              letterSpacing: 4,
              lineHeight: 1.05,
            }}
          >
            {team.teamName.toUpperCase()}
          </div>

          <div style={{ marginTop: 20, fontSize: 40, color: "#E6E6E6" }}>
            {team.tagline}
          </div>
        </div>

        <div style={{ display: "flex", gap: 56, alignItems: "flex-end" }}>
          {[
            { label: "Season", value: t.game },
            { label: "Robot", value: t.robot },
            { label: "Record", value: t.record },
            ...(t.worldsRank ? [{ label: "Worlds", value: `Rank ${t.worldsRank}` }] : []),
          ].map((cell) => (
            <div key={cell.label} style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: 20,
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  color: "#8899AA",
                }}
              >
                {cell.label}
              </div>
              <div style={{ marginTop: 8, fontSize: 38, fontWeight: 700, color: "#1173F1" }}>
                {cell.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
