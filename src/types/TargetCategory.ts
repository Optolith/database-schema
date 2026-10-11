import * as DB from "tsondb/schema/dsl"
import { TargetCategoryIdentifier } from "./_Identifier.js"
import { NestedTranslationMap } from "./Locale.js"

export const TargetCategory = DB.Entity(import.meta.url, {
  name: "TargetCategory",
  namePlural: "TargetCategories",
  type: () =>
    DB.Object({
      parent: DB.Optional({
        comment: "A superordinate target category, if present.",
        type: TargetCategoryIdentifier(),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "TargetCategory",
        DB.Object({
          name: DB.Required({
            comment: "The target category’s name.",
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
