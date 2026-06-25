/**
 * @main Skill
 */

import * as DB from "tsondb/schema/dsl"
import { SkillGroupIdentifier, SkillIdentifier } from "./_Identifier.js"
import { ImprovementCost } from "./_ImprovementCost.js"
import { SkillCheck } from "./_SkillCheck.js"
import { NestedTranslationMap } from "./Locale.js"
import { Errata } from "./source/_Erratum.js"
import { optionalSrc, src } from "./source/_PublicationRef.js"

export const Skill = DB.Entity(import.meta.url, {
  name: "Skill",
  namePlural: "Skills",
  type: () =>
    DB.Object({
      check: DB.Required({
        comment: "Lists the linked three attributes used to make a skill check.",
        type: DB.IncludeIdentifier(SkillCheck),
      }),
      applications: DB.Required({
        comment:
          "Lists applications for the skill, if any. This does not necessarily include all possible applications. There may also be new applications that could be purchased via certain advantages or special abilities.",
        type: DB.IncludeIdentifier(Applications),
      }),
      encumbrance: DB.Required({
        comment: "Indicates whether encumbrance gives a penalty for checks with the skill.",
        type: DB.IncludeIdentifier(EncumbranceInfluence),
      }),
      improvement_cost: DB.Required({
        comment: "States which column is used to improve the skill.",
        type: DB.IncludeIdentifier(ImprovementCost),
      }),
      group: DB.Required({
        comment: "The skill group this skill belongs to.",
        type: SkillGroupIdentifier(),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "Skill",
        DB.Object({
          name: DB.Required({
            comment: "The skill’s name.",
            type: DB.String({ minLength: 1 }),
          }),
          applications_input_label: DB.Optional({
            comment:
              "If there are options available that can not be put into a selection list (like different cults), provide the label text for the input element here. Otherwise leave empty.",
            type: DB.String({ minLength: 1 }),
          }),
          encumbrance_description: DB.Optional({
            comment: `The text listing the certain circumstances in which the encumbrance may count. This text must be used if \`encumbrance\` is set to \`"Maybe"\`, otherwise it is ignored if defined.`,
            type: DB.String({ minLength: 1 }),
          }),
          tools: DB.Optional({
            comment:
              "Mentions any tools from the equipment list that are necessary to employ the skill.",
            type: DB.String({ minLength: 1 }),
          }),
          quality: DB.Required({
            comment: "Gives examples of the effects that various QL might provide.",
            type: DB.String({ minLength: 1 }),
          }),
          failed: DB.Required({
            comment: "Lists examples of results for a failed check.",
            type: DB.String({ minLength: 1 }),
          }),
          critical: DB.Required({
            comment: "Lists examples of results for a critical success.",
            type: DB.String({ minLength: 1 }),
          }),
          botch: DB.Required({
            comment: "Lists examples of results for botches.",
            type: DB.String({ minLength: 1 }),
          }),
          errata: DB.Optional({
            type: DB.IncludeIdentifier(Errata),
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

export const Applications = DB.TypeAlias(import.meta.url, {
  name: "Applications",
  comment: "The skill’s applications",
  type: () =>
    DB.Object({
      derived: DB.Optional({
        type: DB.IncludeIdentifier(ApplicationCategory),
      }),
      explicit: DB.Required({
        comment: "A list of explicit applications.",
        type: DB.ChildEntities(SkillApplication),
      }),
    }),
})

export const ApplicationCategory = DB.Enum(import.meta.url, {
  name: "ApplicationCategory",
  comment:
    "A category. All available entries from the specified category will be included as separate applications.",
  values: () => ({
    BlessedTraditions: DB.EnumCase({ type: null }),
    Diseases: DB.EnumCase({ type: null }),
    Regions: DB.EnumCase({ type: null }),
  }),
})

export const SkillApplication = DB.Entity(import.meta.url, {
  name: "SkillApplication",
  namePlural: "SkillApplications",
  type: () =>
    DB.Object({
      parent: DB.Required({
        comment: "The skill this application belongs to.",
        type: SkillIdentifier(),
      }),
      src: optionalSrc,
      translations: NestedTranslationMap(
        DB.Required,
        "SkillApplication",
        DB.Object({
          name: DB.Required({
            comment: "The skill application’s name.",
            type: DB.String({ minLength: 1 }),
          }),
        }),
      ),
    }),
  parentReferenceKey: "parent",
  instanceDisplayName: {},
  uniqueConstraints: [
    [
      { keyPath: "parent" },
      {
        entityMapKeyPath: "translations",
        keyPathInEntityMap: "name",
      },
    ],
  ],
})

export const EncumbranceInfluence = DB.Enum(import.meta.url, {
  name: "EncumbranceInfluence",
  comment: "Indicates whether encumbrance gives a penalty for checks with the skill.",
  values: () => ({
    Yes: DB.EnumCase({ type: null }),
    No: DB.EnumCase({ type: null }),
    Maybe: DB.EnumCase({ type: null }),
  }),
})
