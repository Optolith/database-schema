import * as DB from "tsondb/schema/dsl"
import { AlternativeName } from "../../_AlternativeNames.js"
import { LanguageIdentifier } from "../../_Identifier.js"
import { LanguagePrerequisites } from "../../_Prerequisite.js"
import { NestedTranslationMap } from "../../Locale.js"
import { Errata } from "../../source/_Erratum.js"
import { src } from "../../source/_PublicationRef.js"
import { AssociatedContinent } from "./_LanguageScript.js"

export const Language = DB.Entity(import.meta.url, {
  name: "Language",
  namePlural: "Languages",
  type: () =>
    DB.Object({
      continent: DB.Required({
        comment: "The continents this language is present on.",
        type: DB.Array(DB.IncludeIdentifier(AssociatedContinent), { minItems: 1 }),
      }),
      specializations: DB.Required({
        type: DB.ChildEntities(LanguageSpecialization),
      }),
      customSpecializations: DB.Optional({
        comment: "If applicable, a description of what may be a specialization.",
        type: DB.IncludeIdentifier(IndefiniteSpecializations),
      }),
      prerequisites: DB.Optional({
        type: DB.IncludeIdentifier(LanguagePrerequisites),
      }),
      max_level: DB.Optional({
        comment:
          "The maximum possible level of the language. Only specified if lower than default of 3.",
        type: DB.Integer({ minimum: 1, maximum: 2 }),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "Language",
        DB.Object({
          name: DB.Required({
            comment: "The language’s name.",
            type: DB.String({ minLength: 1 }),
          }),
          alternative_names: DB.Optional({
            comment: "A list of alternative names.",
            type: DB.Array(DB.IncludeIdentifier(AlternativeName), { minItems: 1 }),
          }),
          description: DB.Optional({
            comment: "The description of the language.",
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

export const LanguageSpecialization = DB.Entity(import.meta.url, {
  name: "LanguageSpecialization",
  namePlural: "LanguageSpecializations",
  type: () =>
    DB.Object({
      parent: DB.Required({
        comment: "The language this specialization belongs to.",
        type: LanguageIdentifier(),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "LanguageSpecialization",
        DB.Object({
          name: DB.Required({
            comment: "The specialization’s name.",
            type: DB.String({ minLength: 1 }),
          }),
          description: DB.Optional({
            comment:
              "The specialization description. It will be appended to the name in parenthesis.",
            type: DB.String({ minLength: 1 }),
          }),
        }),
      ),
    }),
  parentReferenceKey: "parent",
  instanceDisplayName: {},
  instanceDisplayNameCustomizer: ({
    instance,
    instanceDisplayName,
    instanceDisplayNameLocaleId,
    getDisplayNameForInstanceId,
  }) => ({
    name: `${
      getDisplayNameForInstanceId("Language", instance.parent)?.name ?? "[unknown parent]"
    } — ${instanceDisplayName}`,
    localeId: instanceDisplayNameLocaleId,
  }),
})

const IndefiniteSpecializations = DB.TypeAlias(import.meta.url, {
  name: "IndefiniteSpecializations",
  type: () =>
    DB.Object({
      translations: NestedTranslationMap(
        DB.Required,
        "IndefiniteSpecializations",
        DB.Object({
          description: DB.Required({
            comment: "The specializations description.",
            type: DB.String({ minLength: 1 }),
          }),
          label: DB.Optional({
            comment:
              "An input label or placeholder text for an UI element if it differs from the `description`.",
            type: DB.String({ minLength: 1 }),
          }),
        }),
      ),
    }),
})
