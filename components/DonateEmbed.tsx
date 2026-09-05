"use client";

import { useState } from "react";

/**
 * The Hack Club Bank donation form, embedded so people can give without leaving
 * the site — this is the team's actual money path, so it should be the lowest
 * friction thing on the page.
 *
 * Sized to sit beside the tier cards rather than fill the screen: the amount
 * someone types only means something if they can still see which level it buys.
 * 58vh is the ceiling so the form and at least one tier card share a viewport on
 * a laptop; HCB scrolls internally if its own content needs more room.
 *
 * `dark=true` matches the site's ground. The plain link below is not decoration:
 * third-party frames get blocked by privacy extensions, strict corporate
 * networks and some in-app browsers, and a donation form that silently fails to
 * appear is worse than one that was never embedded. The link always works.
 */
export default function DonateEmbed({ url, teamName }: { url: string; teamName: string }) {
  const [failed, setFailed] = useState(false);

  // HCB takes a default amount in cents; $100 is the Campfire tier's midpoint.
  const embedUrl = `${url}${url.includes("?") ? "&" : "?"}amount=10000&dark=true`;

  return (
    <div className="w-full">
      {!failed && (
        <div className="hud-frame overflow-hidden" style={{ background: "rgba(17,115,241,0.04)" }}>
          <iframe
            src={embedUrl}
            title={`Donate to ${teamName}`}
            onError={() => setFailed(true)}
            className="block w-full"
            style={{ height: "clamp(440px, 58vh, 620px)", border: 0, colorScheme: "dark" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}

      <p className="micro mt-4">
        Payments are handled by Hack Club Bank, our fiscal sponsor —{" "}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4"
          style={{ color: "var(--color-gold)" }}
        >
          open the donation page directly
        </a>{" "}
        if the form above does not load.
      </p>
    </div>
  );
}
