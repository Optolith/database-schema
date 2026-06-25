import * as DB from "tsondb/schema/dsl"
import { NestedTranslationMap } from "../../../Locale.js"
import { SubBiome } from "./SubBiome.js"

export const Biome = DB.Entity(import.meta.url, {
  name: "Biome",
  namePlural: "Biome",
  type: () =>
    DB.Object({
      translations: NestedTranslationMap(
        DB.Required,
        "Biome",
        DB.Object({
          name: DB.Required({
            comment: "The biome's name.",
            type: DB.String({ minLength: 1 }),
          }),
        }),
      ),
      sub_biomes: DB.Required({
        type: DB.ChildEntitiesType(SubBiome),
      }),
    }),
  instanceDisplayName: {},
  uniqueConstraints: [
    {
      entityMapKeyPath: "translations",
      keyPathInEntityMap: "name",
    },
  ],
})
