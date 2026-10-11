import * as DB from "tsondb/schema/dsl"
import { NestedTranslationMap } from "../../Locale.ts"

export const BlessedTraditionGroup = DB.Entity(import.meta.url, {
  name: "BlessedTraditionGroup",
  namePlural: "BlessedTraditionGroup",
  type: () =>
    DB.Object({
      translations: NestedTranslationMap(
        DB.Required,
        "BlessedTraditionGroup",
        DB.Object({
          name: DB.Required({
            comment: "The name of the group.",
            type: DB.String({ minLength: 1 }),
          }),
          nameInCulture: DB.Required({
            comment:
              "The text to use when all Blessed Ones of this group are recommended for a culture.",
            type: DB.String({ minLength: 1 }),
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
