import * as DB from "tsondb/schema/dsl"
import { NestedTranslationMap } from "./Locale.js"
import { cause, DiseaseTranslation, level, resistance } from "./_DiseasePoison.js"
import { RecipeTradeSecret } from "./equipment/item/_Herbary.js"
import { src } from "./source/_PublicationRef.js"

export const Disease = DB.Entity(import.meta.url, {
  name: "Disease",
  namePlural: "Diseases",
  type: () =>
    DB.Object({
      level,
      resistance,
      cause,
      trade_secret: DB.Optional({
        comment: "AP value and prerequisites of the disease’s trade secret.",
        type: DB.IncludeIdentifier(RecipeTradeSecret),
      }),
      isChildhoodDisease: DB.Required({
        comment: "Whether the disease is a childhood disease.",
        type: DB.Boolean(),
      }),
      isMagicalDisease: DB.Required({
        comment: "Whether the disease is a magical disease.",
        type: DB.Boolean(),
      }),
      isSexuallyTransmittableDisease: DB.Required({
        comment: "Whether the disease is sexually transmittable.",
        type: DB.Boolean(),
      }),
      src,
      translations: NestedTranslationMap(DB.Required, "Disease", DiseaseTranslation),
    }),
  instanceDisplayName: {},
  uniqueConstraints: [
    {
      entityMapKeyPath: "translations",
      keyPathInEntityMap: "name",
    },
  ],
})
