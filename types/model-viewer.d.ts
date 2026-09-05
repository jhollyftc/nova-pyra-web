import type React from "react";

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        "camera-controls"?: boolean;
        "auto-rotate"?: boolean;
        "auto-rotate-delay"?: number;
        "rotation-per-second"?: string;
        "environment-image"?: string;
        exposure?: number;
        "shadow-intensity"?: number;
        orientation?: string;
        "camera-orbit"?: string;
        "camera-target"?: string;
      };
    }
  }
}
