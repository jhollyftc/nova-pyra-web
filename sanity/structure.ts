import type { StructureResolver } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
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

/**
 * Types whose order a person decides are drag-and-drop lists. Outreach events,
 * season updates and section headings are not — they sort by date or key, which
 * is data the CMS already has and should not be maintained by hand.
 */
export const structure: StructureResolver = (S, context) => {
  const orderable = (type: string, title: string, filter?: string) =>
    orderableDocumentListDeskItem({ type, title, S, context, ...(filter ? { filter } : {}) });

  return
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
              orderable("sponsor", "Sponsor list"),
              singleton(S, "sponsorship", "Pitch & tier benefits"),
            ]),
        ),

      S.listItem()
        .title("Competition")
        .child(
          S.list()
            .title("Competition")
            .items([
              orderable("seasonEvent", "Results"),
              singleton(S, "season", "This season"),
              orderable("award", "Awards"),
            ]),
        ),

      S.divider(),

      S.listItem()
        .title("The robot")
        .child(
          S.list()
            .title("The robot")
            .items([
              // No longer a singleton: one document per season's robot.
              orderable("robot", "Robots by season"),
              orderable("subsystem", "Subsystems"),
              orderable("evolutionEntry", "Design evolution"),
            ]),
        ),

      S.listItem()
        .title("Engineering")
        .child(
          S.list()
            .title("Engineering")
            .items([
              singleton(S, "engineeringProcess", "Process & portfolio"),
              orderable("problemCard", "Problem → solution"),
              orderable("testingChart", "Test data"),
            ]),
        ),

      S.listItem()
        .title("The team")
        .child(
          S.list()
            .title("The team")
            .items([
              S.listItem()
                .title("People")
                .child(
                  S.list()
                    .title("People")
                    .items([
                      orderable("member", "Current team", '_type == "member" && status != "alumni"'),
                      S.listItem()
                        .title("Alumni")
                        .child(
                          S.documentList()
                            .title("Alumni")
                            .filter('_type == "member" && status == "alumni"'),
                        ),
                      S.documentTypeListItem("member").title("Everyone"),
                    ]),
                ),
              singleton(S, "teamStory", "Story, values & partners"),
              orderable("timelineEvent", "Timeline"),
            ]),
        ),

      S.divider(),
      S.documentTypeListItem("sectionCopy").title("Section headings"),
      singleton(S, "siteSettings", "Site settings"),
    ]);
};

/** Singletons are created by the importer; the Studio must not offer more. */
export const singletonActions = new Set(["publish", "discardChanges", "restore"]);
export const singletonTypes = new Set<string>(SINGLETONS);
