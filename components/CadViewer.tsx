"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lazy 3D CAD viewer.
 *
 * The three GLB models are 6.9–16.5 MB. Nothing is fetched — not the model, not
 * the @google/model-viewer bundle — until the visitor explicitly asks for it,
 * so a phone on cell data never pays for 3D it did not request.
 *
 * Ported from ftc-pit-app/components/ModelViewer.tsx; the kiosk loaded eagerly
 * because it ran on a wired display with the assets on local disk.
 */
export default function CadViewer({
  models,
}: {
  models: { id: string; label: string; src: string }[];
}) {
  const [activated, setActivated] = useState(false);
  const [activeId, setActiveId] = useState(models[0]?.id);
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const viewerRef = useRef<HTMLElement>(null);
  const imported = useRef(false);

  const active = models.find((m) => m.id === activeId) ?? models[0];
  // Derived from which model has finished loading, so switching models resets
  // the indicator without an effect writing state on every change.
  const loading = Boolean(active) && loadedId !== active.id;

  useEffect(() => {
    if (!activated || imported.current) return;
    imported.current = true;
    import("@google/model-viewer").then(() => {
      const MV = customElements.get("model-viewer") as
        | (CustomElementConstructor & { dracoDecoderLocation?: string })
        | undefined;
      if (MV) MV.dracoDecoderLocation = "/draco/";
    });
  }, [activated]);

  useEffect(() => {
    const el = viewerRef.current;
    if (!el || !active) return;
    // setState inside an event callback, not in the effect body.
    const done = () => setLoadedId(active.id);
    el.addEventListener("load", done);
    el.addEventListener("error", done);
    return () => {
      el.removeEventListener("load", done);
      el.removeEventListener("error", done);
    };
  }, [activated, active]);

  if (!activated) {
    return (
      <div className="hud-frame flex min-h-[340px] flex-col items-center justify-center gap-5 p-8 text-center sm:min-h-[460px]">
        <p className="micro">Interactive 3D · {models.length} models</p>
        <p
          className="max-w-md text-[var(--color-text-secondary)]"
          style={{ fontSize: "15px" }}
        >
          The CAD models are large files. They load only when you ask for them.
        </p>
        <button
          type="button"
          onClick={() => setActivated(true)}
          className="glow-box border px-7 py-3.5"
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: "14px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-accent)",
            borderColor: "var(--color-border-active)",
          }}
        >
          Load 3D model
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {models.map((m) => {
          const isActive = m.id === active?.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setActiveId(m.id)}
              aria-pressed={isActive}
              className="border px-4 py-2 transition-colors"
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                fontSize: "13px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: isActive ? "var(--color-accent)" : "var(--color-text-secondary)",
                borderColor: isActive ? "var(--color-border-active)" : "var(--color-border)",
              }}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      <div className="hud-frame relative min-h-[340px] sm:min-h-[520px]">
        <div className="dot-grid absolute inset-0 opacity-50" aria-hidden="true" />
        <model-viewer
          key={active?.src}
          ref={viewerRef}
          src={active?.src}
          alt={`${active?.label} — interactive 3D CAD model`}
          camera-controls
          auto-rotate
          auto-rotate-delay={2000}
          rotation-per-second="20deg"
          exposure={0.9}
          shadow-intensity={1}
          style={{ width: "100%", height: "min(60vh, 520px)", background: "transparent" }}
        />
        {loading && (
          <p
            className="micro absolute inset-0 flex items-center justify-center"
            aria-live="polite"
          >
            Loading model…
          </p>
        )}
      </div>

      <p className="micro mt-3">Drag to orbit · scroll to zoom · right-click to pan</p>
    </div>
  );
}
