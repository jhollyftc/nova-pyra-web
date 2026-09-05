import type { SchemaTypeDefinition } from "sanity";

import siteSettings from "./siteSettings";
import teamStory from "./teamStory";
import robot from "./robot";
import engineeringProcess from "./engineeringProcess";
import impact from "./impact";
import season from "./season";
import sponsorship from "./sponsorship";

import subsystem from "./subsystem";
import evolutionEntry from "./evolutionEntry";
import problemCard from "./problemCard";
import testingChart from "./testingChart";
import member from "./member";
import award from "./award";
import timelineEvent from "./timelineEvent";
import outreachEvent from "./outreachEvent";
import seasonEvent from "./seasonEvent";
import sponsor from "./sponsor";
import post from "./post";

/**
 * Documents that exist exactly once. The Studio's structure pins these to a
 * single editable document rather than showing a list with a "create" button.
 */
export const SINGLETONS = [
  "siteSettings",
  "teamStory",
  "engineeringProcess",
  "impact",
  "season",
  "sponsorship",
] as const;

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  teamStory,
  robot,
  engineeringProcess,
  impact,
  season,
  sponsorship,
  subsystem,
  evolutionEntry,
  problemCard,
  testingChart,
  member,
  award,
  timelineEvent,
  outreachEvent,
  seasonEvent,
  sponsor,
  post,
];
