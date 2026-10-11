import * as DB from "tsondb/schema/dsl"
import { CultureIdentifier } from "./_Identifier.js"
import { NestedTranslationMap } from "./Locale.js"

export const PatronCategory = DB.Entity(import.meta.url, {
  name: "PatronCategory",
  namePlural: "PatronCategories",
  type: () =>
    DB.Object({
      primary_patron_cultures: DB.Required({
        comment:
          "The list of cultures where patrons from this category can be the primary patron of.",
        type: DB.Array(CultureIdentifier(), { minItems: 1, uniqueItems: true }),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "PatronCategory",
        DB.Object({
          name: DB.Required({
            comment: "The patron category’s name.",
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
