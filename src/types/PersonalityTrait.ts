import * as DB from "tsondb/schema/dsl"
import { NestedTranslationMap } from "./Locale.js"
import { PersonalityTraitIdentifier } from "./_Identifier.js"
import { PersonalityTraitPrerequisites } from "./_Prerequisite.js"
import { Errata } from "./source/_Erratum.js"
import { src } from "./source/_PublicationRef.js"

export const PersonalityTrait = DB.Entity(import.meta.url, {
  name: "PersonalityTrait",
  namePlural: "PersonalityTraits",
  comment:
    "A personality trait describes character aspects of a person from a certain region. Higher trait levels only cover a part of the region covered by lower-level traits.",
  type: () =>
    DB.Object({
      level: DB.Required({
        comment: "The personality trait’s level.",
        type: DB.Integer({ minimum: 1, maximum: 3 }),
      }),
      prerequisites: DB.Optional({
        type: DB.IncludeIdentifier(PersonalityTraitPrerequisites),
      }),
      combination_options: DB.Optional({
        comment: "The lower-level personality trait(s) this trait can be combined with.",
        type: DB.Array(PersonalityTraitIdentifier(), { minItems: 1, uniqueItems: true }),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "PersonalityTrait",
        DB.Object({
          name: DB.Required({
            comment: "The personality trait’s name.",
            type: DB.String({ minLength: 1 }),
          }),
          effects: DB.Required({
            comment:
              "The effects of the personality trait. They should be sorted like they are in the book.",
            type: DB.Array(DB.IncludeIdentifier(PersonalityTraitEffect), { minItems: 1 }),
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

const PersonalityTraitEffect = DB.TypeAlias(import.meta.url, {
  name: "PersonalityTraitEffect",
  type: () =>
    DB.Object({
      label: DB.Required({
        comment: "A label that is displayed and placed before the actual text.",
        type: DB.String({ minLength: 1 }),
      }),
      text: DB.Required({
        comment: "The effect text.",
        type: DB.String({ minLength: 1, markdown: "inline" }),
      }),
    }),
})
