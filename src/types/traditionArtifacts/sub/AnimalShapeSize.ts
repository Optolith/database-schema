import * as DB from "tsondb/schema/dsl"
import { NestedTranslationMap } from "../../Locale.js"

export const AnimalShapeSize = DB.Entity(import.meta.url, {
  name: "AnimalShapeSize",
  namePlural: "AnimalShapeSizes",
  type: () =>
    DB.Object({
      volume: DB.Required({
        comment: "The animal shape size’s volume points",
        type: DB.Integer({ minimum: 1 }),
      }),
      ap_value: DB.Required({
        comment: "The animal shape size’s adventure point value",
        type: DB.Integer({ minimum: 1 }),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "AnimalShapeSize",
        DB.Object({
          name: DB.Required({
            comment: "The animal shape size’s name.",
            type: DB.String({ minLength: 1 }),
          }),
          nameInAPValue: DB.Required({
            comment:
              "The animal shape size’s name in the generated AP Value text for the Animal Shape entry.",
            type: DB.String({ minLength: 1 }),
          }),
        }),
      ),
    }),
  instanceDisplayName: {},
})
