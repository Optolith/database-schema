import * as DB from "tsondb/schema/dsl"
import { NestedTranslationMap } from "../../Locale.ts"

export const CeremonialItemSpecialAbilityGroup = DB.Entity(import.meta.url, {
  name: "CeremonialItemSpecialAbilityGroup",
  namePlural: "CeremonialItemSpecialAbilityGroups",
  type: () =>
    DB.Object({
      translations: NestedTranslationMap(
        DB.Required,
        "CeremonialItemSpecialAbilityGroup",
        DB.Object({
          name: DB.Required({
            comment:
              "The name of the ceremonial item. This should be the heading used in the respective publication.",
            type: DB.String({ minLength: 1 }),
          }),
          nameForSorting: DB.Required({
            comment:
              "The name of the ceremonial item for sorting purposes, if different from the actual name.",
            type: DB.String({ minLength: 1 }),
          }),
        }),
      ),
    }),
  instanceDisplayName: {
    pathInLocaleMap: "nameForSorting",
  },
  uniqueConstraints: [
    {
      entityMapKeyPath: "translations",
      keyPathInEntityMap: "name",
    },
    {
      entityMapKeyPath: "translations",
      keyPathInEntityMap: "nameForSorting",
    },
  ],
})
