import * as DB from "tsondb/schema/dsl"
import { NestedTranslationMap } from "../../../Locale.js"

export const PlantType = DB.Entity(import.meta.url, {
  name: "PlantType",
  namePlural: "PlantTypes",
  type: () =>
    DB.Object({
      translations: NestedTranslationMap(
        DB.Required,
        "PlantType",
        DB.Object({
          name: DB.Required({
            comment: "The plant type�s name.",
            type: DB.String({ minLength: 1 }),
          }),
          description: DB.Required({
            comment: "The plant type�s description.",
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
