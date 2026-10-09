import * as DB from "tsondb/schema/dsl"
import { AlternativeName } from "../../_AlternativeNames.js"
import { NestedTranslationMap } from "../../Locale.js"
import { Errata } from "../../source/_Erratum.js"
import { src } from "../../source/_PublicationRef.js"
import { EffectType, LaboratoryLevel, RecipeTradeSecret } from "./_Herbary.js"

export const Elixir = DB.Entity(import.meta.url, {
  name: "Elixir",
  namePlural: "Elixirs",
  type: () =>
    DB.Object({
      effect_types: DB.Optional({
        comment: "Effect type(s) of an alchemical poison.",
        type: DB.Array(DB.IncludeIdentifier(EffectType), { minItems: 1, uniqueItems: true }),
      }),
      value: DB.Optional({
        comment: "The raw (ingredients) value per level, in silverthalers.",
        type: DB.Integer({ minimum: 1 }),
      }),
      cost_per_ingredient_level: DB.Required({
        comment: "The cost per ingredient level in silverthalers.",
        type: DB.Integer({ minimum: 1 }),
      }),
      laboratory: DB.Required({
        comment: "The laboratory level needed to brew the elixir.",
        type: DB.IncludeIdentifier(LaboratoryLevel),
      }),
      brewing_difficulty: DB.Required({
        comment: "The brewing difficulty, which represents the challenge of creating an elixir.",
        type: DB.Integer(),
      }),
      trade_secret: DB.Required({
        comment: "AP value and prerequisites of the elixir recipe’s trade secret.",
        type: DB.IncludeIdentifier(RecipeTradeSecret),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "ElixirTranslation",
        DB.Object({
          name: DB.Required({
            comment: "The item’s name.",
            type: DB.String({ minLength: 1 }),
          }),
          description: DB.Optional({
            comment: "The recipe’s description.",
            type: DB.String({ minLength: 1 }),
          }),
          special: DB.Optional({
            comment: "Special information about the elixir.",
            type: DB.String({ minLength: 1 }),
          }),
          alternative_names: DB.Optional({
            comment: "A list of alternative names.",
            type: DB.Array(DB.IncludeIdentifier(AlternativeName), { minItems: 1 }),
          }),
          typical_ingredients: DB.Required({
            comment: "A list of typical ingredients.",
            type: DB.Array(DB.String({ minLength: 1 }), { minItems: 1, uniqueItems: true }),
          }),
          brewing_process_prerequisites: DB.Optional({
            comment: "Prerequsites for the brewing process, if any.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          quality_levels: DB.Required({
            comment:
              "The effect description may be either a plain text or a text that is divided by a list of effects for each quality level.",
            type: DB.IncludeIdentifier(ElixirEffect),
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

export const ElixirEffect = DB.Enum(import.meta.url, {
  name: "ElixirEffect",
  comment:
    "The effect description may be either a plain text or a text that is divided by a list of effects for each quality level.",
  values: () => ({
    Plain: DB.EnumCase({
      type: DB.IncludeIdentifier(ElixirPlainEffect),
    }),
    ForEachQualityLevel: DB.EnumCase({
      type: DB.IncludeIdentifier(ElixirEffectForEachQualityLevel),
    }),
  }),
})

const ElixirPlainEffect = DB.TypeAlias(import.meta.url, {
  name: "ElixirPlainEffect",
  type: () =>
    DB.Object({
      text: DB.Required({
        comment: "The effect description.",
        type: DB.String({ minLength: 1, markdown: "block" }),
      }),
    }),
})

const ElixirEffectForEachQualityLevel = DB.TypeAlias(import.meta.url, {
  name: "ElixirEffectForEachQualityLevel",
  type: () =>
    DB.Object({
      qualityLevels: DB.Required({
        comment:
          "The list of effects for each quality level. The first element represents QL 1, the second element QL 2, and so on.",
        type: DB.Array(DB.String({ minLength: 1, markdown: "block" }), {
          minItems: 6,
          maxItems: 6,
        }),
      }),
    }),
})
