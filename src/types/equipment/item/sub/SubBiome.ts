import * as DB from "tsondb/schema/dsl"
import { BiomeIdentifier } from "../../../_Identifier.js"
import { NestedTranslationMap } from "../../../Locale.js"
import { BotanicRegion } from "./BotanicRegion.js"

export const SubBiome = DB.Entity(import.meta.url, {
  name: "SubBiome",
  namePlural: "SubBiomes",
  type: () =>
    DB.Object({
      parent: DB.Required({
        comment: "The biome this sub-biome belongs to.",
        type: BiomeIdentifier(),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "SubBiome",
        DB.Object({
          name: DB.Required({
            comment: "The subbiome's name.",
            type: DB.String({ minLength: 1 }),
          }),
        }),
      ),
      regions: DB.Required({
        type: DB.ChildEntities(BotanicRegion),
      }),
    }),
  parentReferenceKey: "parent",
  instanceDisplayName: {},
  instanceDisplayNameCustomizer: ({
    instance,
    instanceDisplayName,
    instanceDisplayNameLocaleId,
    getDisplayNameForInstanceId,
  }) => ({
    name: `${getDisplayNameForInstanceId("Biome", instance.parent)?.name ?? ""} — ${instanceDisplayName}`,
    localeId: instanceDisplayNameLocaleId,
  }),
  uniqueConstraints: [
    [
      {
        keyPath: "parent",
      },
      {
        entityMapKeyPath: "translations",
        keyPathInEntityMap: "name",
      },
    ],
  ],
})
