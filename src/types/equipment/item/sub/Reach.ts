import * as DB from "tsondb/schema/dsl"
import { NestedTranslationMap } from "../../../Locale.js"

export const Reach = DB.Entity(import.meta.url, {
  name: "Reach",
  namePlural: "Reaches",
  type: () =>
    DB.Object({
      position: DB.Required({
        comment:
          "The position of the reach in lists. Lower values indicate a shorter range; higher values a larger range. This has to be a unique value.",
        type: DB.Integer({ minimum: 0 }),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "Reach",
        DB.Object({
          name: DB.Required({
            comment: "The reach’s name.",
            type: DB.String({ minLength: 1 }),
          }),
        }),
      ),
    }),
  instanceDisplayName: {},
  sortOrder: { keyPath: "position", isIndex: true },
  uniqueConstraints: [
    {
      entityMapKeyPath: "translations",
      keyPathInEntityMap: "name",
    },
  ],
})
