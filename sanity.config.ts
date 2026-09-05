"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure, singletonActions, singletonTypes } from "./sanity/structure";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  title: "Nova Pyra",
  schema: {
    types: schemaTypes,
    // Singletons are not creatable or deletable from the Studio — there is
    // exactly one site settings document, one robot, one season.
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (input, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
  plugins: [
    structureTool({ structure }),
    // Vision is a GROQ query playground. Useful when debugging why a page is
    // empty; harmless to leave in since the Studio is already login-gated.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
