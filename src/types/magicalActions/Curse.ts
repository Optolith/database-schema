import * as DB from "tsondb/schema/dsl"
import { OldParameter } from "../_ActivatableSkill.js"
import { IndefiniteOneTimeCost } from "../_ActivatableSkillCost.js"
import { ExpressionBasedDuration } from "../_ActivatableSkillDuration.js"
import { ActivatableSkillEffect } from "../_ActivatableSkillEffect.js"
import { PropertyIdentifier } from "../_Identifier.js"
import { ResponsiveText, ResponsiveTextOptional } from "../_ResponsiveText.js"
import { SkillCheck, SkillCheckPenalty } from "../_SkillCheck.js"
import { NestedTranslationMap } from "../Locale.js"
import { Errata } from "../source/_Erratum.js"
import { src } from "../source/_PublicationRef.js"

export const Curse = DB.Entity(import.meta.url, {
  name: "Curse",
  namePlural: "Curses",
  type: () =>
    DB.Object({
      check: DB.Required({
        comment: "Lists the linked three attributes used to make a skill check.",
        type: DB.IncludeIdentifier(SkillCheck),
      }),
      check_penalty: DB.Optional({
        comment: "In some cases, the target's Spirit or Toughness is applied as a penalty.",
        type: DB.IncludeIdentifier(SkillCheckPenalty),
      }),
      parameters: DB.Required({
        comment: "Measurable parameters of a curse.",
        type: DB.IncludeIdentifier(CursePerformanceParameters),
      }),
      property: DB.Required({
        comment: "The associated property.",
        type: PropertyIdentifier(),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "Curse",
        DB.Object({
          name: DB.Required({
            comment: "The curse’s name.",
            type: DB.String({ minLength: 1 }),
          }),
          effect: DB.Required({
            comment:
              "The effect description may be either a plain text or a text that is divided by a list of effects for each quality level. It may also be a list for each two quality levels.",
            type: DB.IncludeIdentifier(ActivatableSkillEffect),
          }),
          cost: DB.Optional({
            isDeprecated: true,
            type: DB.IncludeIdentifier(OldParameter),
          }),
          duration: DB.Optional({
            isDeprecated: true,
            type: DB.IncludeIdentifier(OldParameter),
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

const CursePerformanceParameters = DB.TypeAlias(import.meta.url, {
  name: "CursePerformanceParameters",
  comment: "Measurable parameters of a curse.",
  type: () =>
    DB.Object({
      cost: DB.Required({
        comment: "The AE cost.",
        type: DB.IncludeIdentifier(CurseCost),
      }),
      duration: DB.Required({
        comment: "The duration.",
        type: DB.IncludeIdentifier(CurseDuration),
      }),
    }),
})

const CurseCost = DB.Enum(import.meta.url, {
  name: "CurseCost",
  values: () => ({
    Fixed: DB.EnumCase({ type: DB.IncludeIdentifier(FixedCurseCost) }),
    Indefinite: DB.EnumCase({ type: DB.IncludeIdentifier(IndefiniteOneTimeCost) }),
  }),
})

const FixedCurseCost = DB.TypeAlias(import.meta.url, {
  name: "FixedCurseCost",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The (temporary) AE cost value.",
        type: DB.Integer({ minimum: 1 }),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "FixedCurseCost",
        DB.Object(
          {
            per: DB.Optional({
              comment:
                "The cost have to be per a specific countable entity, e.g. `8 KP per person`.",
              type: DB.IncludeIdentifier(ResponsiveText),
            }),
            note: DB.Optional({
              comment: "A note, appended to the generated string in parenthesis.",
              type: DB.IncludeIdentifier(ResponsiveTextOptional),
            }),
          },
          { minProperties: 1 },
        ),
      ),
    }),
})

const CurseDuration = DB.Enum(import.meta.url, {
  name: "CurseDuration",
  values: () => ({
    Immediate: DB.EnumCase({ type: null }),
    Expression: DB.EnumCase({ type: DB.IncludeIdentifier(ExpressionBasedDuration) }),
    Indefinite: DB.EnumCase({ type: DB.IncludeIdentifier(IndefiniteCurseDuration) }),
  }),
})

const IndefiniteCurseDuration = DB.TypeAlias(import.meta.url, {
  name: "IndefiniteCurseDuration",
  type: () =>
    DB.Object({
      maximum: DB.Optional({
        comment: "Specified if the duration has a maximum time span.",
        type: DB.IncludeIdentifier(MaximumIndefiniteCurseDuration),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "IndefiniteCurseDuration",
        DB.Object({
          description: DB.Required({
            comment: "A description of the duration.",
            type: DB.IncludeIdentifier(ResponsiveText),
          }),
        }),
      ),
    }),
})

const MaximumIndefiniteCurseDuration = DB.Enum(import.meta.url, {
  name: "MaximumIndefiniteCurseDuration",
  values: () => ({
    Expression: DB.EnumCase({ type: DB.IncludeIdentifier(ExpressionBasedDuration) }),
  }),
})
