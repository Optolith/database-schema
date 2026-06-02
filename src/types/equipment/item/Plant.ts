import * as DB from "tsondb/schema/dsl"
import { src } from "../../source/_PublicationRef.js"
import { NestedTranslationMap } from "../../Locale.js"
import { AlternativeName } from "../../_AlternativeNames.js"
import { BiomeIdentifier, PlantRarityIdentifier, PlantTypeIdentifier } from "../../_Identifier.js"

export const Plant = DB.Entity(import.meta.url, {
  name: "Plant",
  namePlural: "Plants",
  type: () =>
    DB.Object({
      types: DB.Required({
        comment: "The plant types this plant belongs to.",
        type: DB.Array(PlantTypeIdentifier(), { minItems: 1, uniqueItems: true }),
      }),
      occurences: DB.Optional({
        comment: "The biomes this plant occurs in and its rarity in those biomes.",
        type: DB.Array(DB.IncludeIdentifier(PlantOccurrence), { minItems: 1 }),
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
        type: PlantRarityIdentifier(),
      }),
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
