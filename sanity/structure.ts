import type { StructureResolver } from "sanity/structure";
import { SINGLETONS } from "./schemaTypes";

/**
 * Studio navigation.
 *
 * Grouped by what someone is trying to do, not by document type. The things
 * students update most often — outreach, sponsors, results — sit at the top;
 * the once-a-season settings sit at the bottom.
 *
 * Note this is a usability guardrail, not a permission boundary: on Sanity's
 * free plan the only roles are Administrator and Viewer, so anyone who can edit
 * can reach everything through the API regardless of what the Studio shows.
 */
const singleton = (S: Parameters<StructureResolver>[0], type: string, title: string) =>
  S.listItem()
    .title(title)
    .id(type)
    .child(S.document().schemaType(type).documentId(type).title(title));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Nova Pyra")
    .items([
      S.listItem()
        .title("Outreach")
        .child(
          S.list()
            .title("Outreach")
            .items([
              S.documentTypeListItem("outreachEvent").title("Events"),
              singleton(S, "impact", "Totals"),
              S.documentTypeListItem("post").title("Season updates"),
            ]),
        ),

      S.listItem()
        .title("Sponsors")
        .child(
          S.list()
            .title("Sponsors")
            .items([
              S.documentTypeListItem("sponsor").title("Sponsor list"),
              singleton(S, "sponsorship", "Pitch & tier benefits"),
            ]),
        ),

      S.listItem()
        .title("Competition")
        .child(
          S.list()
            .title("Competition")
            .items([
              S.documentTypeListItem("seasonEvent").title("Results"),
              singleton(S, "season", "This season"),
              S.documentTypeListItem("award").title("Awards"),
            ]),
        ),

      S.divider(),

      S.listItem()
        .title("The robot")
        .child(
          S.list()
            .title("The robot")
            .items([
              singleton(S, "robot", "Overview & strategy"),
              S.documentTypeListItem("subsystem").title("Subsystems"),
              S.documentTypeListItem("evolutionEntry").title("Design evolution"),
            ]),
        ),

      S.listItem()
        .title("Engineering")
        .child(
          S.list()
            .title("Engineering")
            .items([
              singleton(S, "engineeringProcess", "Process & portfolio"),
              S.documentTypeListItem("problemCard").title("Problem → solution"),
              S.documentTypeListItem("testingChart").title("Test data"),
            ]),
        ),

      S.listItem()
        .title("The team")
        .child(
          S.list()
            .title("The team")
            .items([
              S.documentTypeListItem("member").title("People"),
              singleton(S, "teamStory", "Story, values & partners"),
              S.documentTypeListItem("timelineEvent").title("Timeline"),
            ]),
        ),

      S.divider(),
      singleton(S, "siteSettings", "Site settings"),
    ]);

/** Singletons are created by the importer; the Studio must not offer more. */
export const singletonActions = new Set(["publish", "discardChanges", "restore"]);
export const singletonTypes = new Set<string>(SINGLETONS);
