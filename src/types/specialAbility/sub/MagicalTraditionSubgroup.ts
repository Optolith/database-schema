import * as DB from "tsondb/schema/dsl"
import { MagicalTraditionIdentifier } from "../../_Identifier.ts"
import { NestedTranslationMap } from "../../Locale.ts"

export const MagicalTraditionSubgroup = DB.Entity(import.meta.url, {
  name: "MagicalTraditionSubgroup",
  namePlural: "MagicalTraditionSubgroups",
  type: () =>
    DB.Object({
      parent: DB.Required({
        comment: "The magical tradition this subgroup belongs to.",
        type: MagicalTraditionIdentifier(),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "MagicalTraditionSubgroup",
        DB.Object({
          name: DB.Required({
            comment:
              "The name of the ceremonial item. This should be the heading used in the respective publication.",
            type: DB.String({ minLength: 1 }),
          }),
        }),
      ),
    }),
  parentReferenceKey: "parent",
  instanceDisplayName: {},
  uniqueConstraints: [
    {
      entityMapKeyPath: "translations",
      keyPathInEntityMap: "name",
    },
  ],
})
