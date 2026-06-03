import * as DB from "tsondb/schema/dsl"
import { src } from "../../source/_PublicationRef.js"
import { NestedTranslationMap } from "../../Locale.js"
import { AlternativeName } from "../../_AlternativeNames.js"
import {
  BiomeIdentifier,
  HerbalAidIdentifier,
  ElixirIdentifier,
  PoisonIdentifier,
} from "../../_Identifier.js"
import { ResponsiveTextOptional, ResponsiveTextReplace } from "../../_ResponsiveText.js"
import { EffectType, PlantRarity } from "./_Herbary.js"

export const Plant = DB.Entity(import.meta.url, {
  name: "Plant",
  namePlural: "Plants",
  type: () =>
    DB.Object({
      types: DB.Required({
        comment: "The plant types of this plant.",
        type: DB.Array(DB.IncludeIdentifier(EffectType), { minItems: 1, uniqueItems: true }),
      }),
      occurences: DB.Optional({
        comment: "The biomes this plant occurs in and its rarity in those biomes.",
        type: DB.IncludeIdentifier(PlantOccurences),
      }),
      search_difficulty: DB.Required({
        comment: "The search difficulty for this plant.",
        type: DB.Integer(),
      }),
      identification_difficulty: DB.Required({
        comment: "The identification difficulty for this plant.",
        type: DB.Integer(),
      }),
      applications: DB.Required({
        comment: "The applications of this plant per quality level.",
        type: DB.Array(DB.Integer(), { minItems: 6, maxItems: 6 }),
      }),
      price: DB.Required({
        comment: "The price of the plant.",
        type: DB.IncludeIdentifier(PlantPrice),
      }),
      recipes: DB.Optional({
        comment: "The herbal aids and elixirs that can be crafted with this plant.",
        type: DB.Array(DB.IncludeIdentifier(PlantRecipe), { minItems: 1 }),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "Plant",
        DB.Object({
          name: DB.Required({
            comment: "The plant's name.",
            type: DB.String({ minLength: 1 }),
          }),
          alternative_names: DB.Optional({
            comment: "A list of alternative names.",
            type: DB.Array(DB.IncludeIdentifier(AlternativeName), { minItems: 1 }),
          }),
          touch: DB.Optional({
            comment: "The plant's touch effect.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          breathe: DB.Optional({
            comment: "The plant's breathe effect.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          consume: DB.Optional({
            comment: "The plant's consume effect.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          remedies_and_traditions: DB.Required({
            comment: "How this plant is used as a household remedy and in folk traditions.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          knowledge: DB.Required({
            comment:
              "What one knows about this plant for each quality level. The first element represents QL 1, the second element QL 2, and so on.",
            type: DB.Array(DB.String({ minLength: 1, markdown: "block" }), {
              minItems: 3,
              maxItems: 6,
            }),
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

const PlantOccurences = DB.TypeAlias(import.meta.url, {
  name: "PlantOccurences",
  type: () =>
    DB.Object({
      items: DB.Optional({
        comment: "The biomes this plant occurs in and its rarity in those biomes.",
        type: DB.Array(DB.IncludeIdentifier(PlantOccurrence), { minItems: 1 }),
      }),
      translation: NestedTranslationMap(
        DB.Optional,
        "PlantOccurrences",
        DB.Object({
          note: DB.Required({
            comment: "A note to all occurences of this plant",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
        }),
      ),
    }),
})

const PlantOccurrence = DB.TypeAlias(import.meta.url, {
  name: "PlantOccurrence",
  type: () =>
    DB.Object({
      biome: DB.Required({
        comment: "The biome this plant occurs in.",
        type: BiomeIdentifier(),
      }),
      rarity: DB.Required({
        comment: "The rarity of this plant in the biome.",
        type: DB.IncludeIdentifier(PlantRarity),
      }),
      translation: NestedTranslationMap(
        DB.Optional,
        "PlantOccurrence",
        DB.Object({
          note: DB.Required({
            comment:
              "A note, appended to the generated string in parenthesis. If the generated is modified using `replacement`, the note is appended to the modifier string.",
            type: DB.String({ minLength: 1, markdown: "inline" }),
          }),
        }),
      ),
    }),
})

const PlantPrice = DB.Enum(import.meta.url, {
  name: "PlantPrice",
  values: () => ({
    Constant: DB.EnumCase({
      type: DB.Object({
        value: DB.Required({
          comment: "The value of the plant in silver coins.",
          type: DB.Float({ minimum: 0 }),
        }),
        cost: DB.Required({
          comment: "The cost of the plant in silver coins.",
          type: DB.Float({ minimum: 0 }),
        }),
      }),
    }),
    Indefinite: DB.EnumCase({ type: DB.IncludeIdentifier(IndefinitePlantPrice) }),
  }),
})

const IndefinitePlantPrice = DB.TypeAlias(import.meta.url, {
  name: "IndefinitePlantPrice",
  type: () =>
    DB.Object({
      translations: NestedTranslationMap(
        DB.Required,
        "IndefinitePlantPrice",
        DB.Object({
          description: DB.Required({
            comment: "A description of the price.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
        }),
      ),
    }),
})

const PlantRecipe = DB.Enum(import.meta.url, {
  name: "PlantRecipe",
  values: () => ({
    HerbalAid: DB.EnumCase({
      type: DB.IncludeIdentifier(HerbalAidRecipe),
    }),
    Elixir: DB.EnumCase({
      type: DB.IncludeIdentifier(ElixirRecipe),
    }),
    PoisonIdentifier: DB.EnumCase({
      type: DB.IncludeIdentifier(PoisonRecipe),
    }),
    Indefinite: DB.EnumCase({
      type: DB.IncludeIdentifier(IndefiniteRecipe),
    }),
  }),
})

const PlantProductTranslation = DB.Object(
  {
    note: DB.Optional({
      comment:
        "A note, appended to the generated string in parenthesis. If the generated is modified using `replacement`, the note is appended to the modifier string.",
      type: DB.IncludeIdentifier(ResponsiveTextOptional),
    }),
    replacement: DB.Optional({
      comment:
        "A replacement string. If `note` is provided, it is appended to the replaced string.",
      type: DB.IncludeIdentifier(ResponsiveTextReplace),
    }),
  },
  { minProperties: 1 },
)

const HerbalAidRecipe = DB.TypeAlias(import.meta.url, {
  name: "HerbalAidRecipe",
  type: () =>
    DB.Object({
      herbal_aid: DB.Required({
        comment: "The herbal aid this recipe results in.",
        type: HerbalAidIdentifier(),
      }),
      translation: NestedTranslationMap(
        DB.Optional,
        "HerbalAidRecipeTranslation",
        PlantProductTranslation,
      ),
    }),
})

const ElixirRecipe = DB.TypeAlias(import.meta.url, {
  name: "ElixirRecipe",
  type: () =>
    DB.Object({
      elixir: DB.Required({
        comment: "The elixir this recipe results in.",
        type: ElixirIdentifier(),
      }),
      translation: NestedTranslationMap(
        DB.Optional,
        "ElixirRecipeTranslation",
        PlantProductTranslation,
      ),
    }),
})

const PoisonRecipe = DB.TypeAlias(import.meta.url, {
  name: "PoisonRecipe",
  type: () =>
    DB.Object({
      poison: DB.Required({
        comment: "The poison this recipe results in.",
        type: PoisonIdentifier(),
      }),
      translation: NestedTranslationMap(
        DB.Optional,
        "PoisonRecipeTranslation",
        PlantProductTranslation,
      ),
    }),
})

const IndefiniteRecipe = DB.TypeAlias(import.meta.url, {
  name: "IndefiniteRecipe",
  type: () =>
    DB.Object({
      translations: NestedTranslationMap(
        DB.Required,
        "IndefiniteRecipe",
        DB.Object({
          description: DB.Required({
            comment: "A description of the recipe.",
            type: DB.String({ minLength: 1, markdown: "inline" }),
          }),
        }),
      ),
    }),
})
