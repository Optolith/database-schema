import * as DB from "tsondb/schema/dsl"
import { PublicationPrerequisites } from "../_Prerequisite.js"
import { NestedTranslationMap } from "../Locale.js"

export const Publication = DB.Entity(import.meta.url, {
  name: "Publication",
  namePlural: "Publications",
  comment:
    "A (usually physical) self-contained document with rules and crunch elements relevant for character creation, character development, and game play.",
  type: () =>
    DB.Object({
      category: DB.Required({
        comment: "The publication category.",
        type: DB.IncludeIdentifier(PublicationCategory),
      }),
      containsAdultContent: DB.Required({
        comment: "If the publication may contain adult content.",
        type: DB.Boolean(),
      }),
      isMissingImplementation: DB.Required({
        comment:
          "If the publication is not (fully) implemented and thus needs to be excluded from stable releases.",
        type: DB.Boolean(),
      }),
      prerequisites: DB.Optional({
        type: DB.IncludeIdentifier(PublicationPrerequisites),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "Publication",
        DB.Object({
          publisherId: DB.Optional({
            comment: "The publisher’s publication identifier.",
            type: DB.String({ minLength: 1 }),
          }),
          name: DB.Required({
            comment: "The publication’s name.",
            type: DB.String({ minLength: 1 }),
          }),
          abbreviation: DB.Required({
            comment: "The publication’s abbreviation.",
            type: DB.String({ minLength: 1 }),
          }),
          release_date: DB.Optional({
            comment: "The publication’s release date.",
            type: DB.Date(),
          }),
          isMissingImplementation: DB.Required({
            comment:
              "If this publication translation is not (fully) implemented and thus needs to be excluded from stable releases.",
            type: DB.Boolean(),
          }),
        }),
      ),
    }),
  instanceDisplayName: {},
  uniqueConstraints: [
    {
      entityMapKeyPath: "translations",
      keyPathInEntityMap: "name",
    },
  ],
})

export const PublicationCategory = DB.Enum(import.meta.url, {
  name: "PublicationCategory",
  values: () => ({
    CoreRules: DB.EnumCase({ type: null }),
    ExpansionRules: DB.EnumCase({ type: null }),
    Sourcebook: DB.EnumCase({ type: null }),
    RegionalSourcebook: DB.EnumCase({ type: null }),
    Adventure: DB.EnumCase({ type: null }),
  }),
})
