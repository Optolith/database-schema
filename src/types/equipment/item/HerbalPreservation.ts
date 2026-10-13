import * as DB from "tsondb/schema/dsl"
import { DurationUnit } from "../../_ActivatableSkillDuration.js"
import { Dice } from "../../_Dice.js"
import { MathOperation } from "../../_MathExpression.js"
import { ResponsiveText, ResponsiveTextReplace } from "../../_ResponsiveText.js"
import { NestedTranslationMap } from "../../Locale.js"
import { src } from "../../source/_PublicationRef.js"
import { EffectType } from "./_Herbary.js"

export const HerbalPreservation = DB.Entity(import.meta.url, {
  name: "HerbalPreservation",
  namePlural: "HerbalPreservations",
  type: () =>
    DB.Object({
      types: DB.Required({
        comment: "The types of this preservation.",
        type: DB.Array(DB.IncludeIdentifier(EffectType), {
          minItems: 1,
          uniqueItems: true,
        }),
      }),
      longevity: DB.Required({
        comment: "How long this preservation lasts.",
        type: DB.IncludeIdentifier(HerbalPreservationLongevity),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "HerbalPreservation",
        DB.Object({
          name: DB.Required({
            comment: "The herbal preservation's name.",
            type: DB.String({ minLength: 1 }),
          }),
          preparation: DB.Required({
            comment: "How to prepare this preservation.",
            type: DB.String({ minLength: 1, markdown: "inline" }),
          }),
          alternative_effect: DB.Required({
            comment: "The herbal preservation's alternative effect.",
            type: DB.String({ minLength: 1, markdown: "block" }),
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

export const HerbalPreservationLongevity = DB.Enum(import.meta.url, {
  name: "HerbalPreservationLongevity",
  values: () => ({
    Expression: DB.EnumCase({
      type: DB.IncludeIdentifier(ExpressionBasedHerbalPreservationLongevity),
    }),
    Indefinite: DB.EnumCase({ type: DB.IncludeIdentifier(IndefiniteHerbalPreservationLongevity) }),
  }),
})

const ExpressionBasedHerbalPreservationLongevity = DB.TypeAlias(import.meta.url, {
  name: "ExpressionBasedHerbalPreservationLongevity",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "An expression that evaluates to the duration.",
        type: DB.IncludeIdentifier(HerbalPreservationLongevityExpression),
      }),
      unit: DB.Required({
        comment: "The duration unit.",
        type: DB.IncludeIdentifier(DurationUnit),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "ExpressionHerbalPreservationLongevity",
        DB.Object({
          replacement: DB.Required({
            comment: "A replacement string.",
            type: DB.IncludeIdentifier(ResponsiveTextReplace),
          }),
        }),
      ),
    }),
})

const HerbalPreservationLongevityExpression = DB.TypeAlias(import.meta.url, {
  name: "HerbalPreservationLongevityExpression",
  type: () =>
    DB.GenIncludeIdentifier(MathOperation, [
      DB.IncludeIdentifier(HerbalPreservationLongevityValue),
    ]),
})

const HerbalPreservationLongevityValue = DB.Enum(import.meta.url, {
  name: "HerbalPreservationLongevityValue",
  values: () => ({
    Constant: DB.EnumCase({ type: DB.Integer({ minimum: 1 }) }),
    Dice: DB.EnumCase({
      type: DB.IncludeIdentifier(Dice),
    }),
  }),
})

const IndefiniteHerbalPreservationLongevity = DB.TypeAlias(import.meta.url, {
  name: "IndefiniteHerbalPreservationLongevity",
  type: () =>
    DB.Object({
      translations: NestedTranslationMap(
        DB.Required,
        "IndefiniteHerbalPreservationLongevity",
        DB.Object({
          text: DB.Required({
            comment: "A text describing the duration.",
            type: DB.IncludeIdentifier(ResponsiveText),
          }),
        }),
      ),
    }),
})
