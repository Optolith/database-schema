import * as DB from "tsondb/schema/dsl"
import { NestedTranslationMap } from "../../../Locale.js"

export const PlantRarity = DB.Entity(import.meta.url, {
  name: "PlantRarity",
  namePlural: "PlantRarity",
  type: () =>
    DB.Object({
      translations: NestedTranslationMap(
        DB.Required,
        "PlantRarity",
        DB.Object({
          name: DB.Required({
            comment: "The plant rarity's name.",
            type: DB.String({ minLength: 1 }),
          }),
          description: DB.Required({
            comment: "The plant rarity's description.",
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
