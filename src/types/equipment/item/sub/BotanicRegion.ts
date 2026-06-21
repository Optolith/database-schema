import * as DB from "tsondb/schema/dsl"
import { NestedTranslationMap } from "../../../Locale.js"
import { SubBiomeIdentifier } from "../../../_Identifier.js"

export const BotanicRegion = DB.Entity(import.meta.url, {
  name: "BotanicRegion",
  namePlural: "BotanicRegions",
  type: () =>
    DB.Object({
      parent: DB.Required({
        comment: "The subbiome this region belongs to.",
        type: SubBiomeIdentifier(),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "BotanicRegion",
        DB.Object({
          name: DB.Required({
            comment: "The region's name.",
            type: DB.String({ minLength: 1 }),
          }),
        }),
      ),
    }),
  parentReferenceKey: "parent",
  instanceDisplayName: {},
  uniqueConstraints: [
    [
      {
        entityMapKeyPath: "translations",
        keyPathInEntityMap: "name",
      },
      {
        keyPath: "parent",
      },
    ],
  ],
})
