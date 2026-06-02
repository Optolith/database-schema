import * as DB from "tsondb/schema/dsl"
import { src } from "../../source/_PublicationRef.js"
import { NestedTranslationMap } from "../../Locale.js"
import { PlantTypeIdentifier } from "../../_Identifier.js"

export const HerbalAid = DB.Entity(import.meta.url, {
  name: "HerbalAid",
  namePlural: "HerbalAids",
  type: () =>
    DB.Object({
      types: DB.Required({
        comment: "The plant types this plant belongs to.",
        type: DB.Array(PlantTypeIdentifier(), { minItems: 1, uniqueItems: true }),
      }),
      crafting_difficulty: DB.Required({
        comment: "The difficulty for this aid to craft.",
        type: DB.Integer(),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "HerbalAid",
        DB.Object({
          name: DB.Required({
            comment: "The herbal aid's name.",
            type: DB.String({ minLength: 1 }),
          }),
          description: DB.Required({
            comment: "The herbal aid's description.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          ingredients: DB.Required({
            comment: "The ingredients used to craft this herbal aid.",
            type: DB.String({ minLength: 1, markdown: "inline" }),
          }),
          typical_tools: DB.Optional({
            comment: "The typical tools used to craft this.",
            type: DB.String({ minLength: 1, markdown: "inline" }),
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
