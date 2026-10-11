import * as DB from "tsondb/schema/dsl"
import { cause, Cause, DiseaseTranslation, level, resistance } from "./_DiseasePoison.js"
import { AnimalTypeIdentifier } from "./_Identifier.js"
import { NestedTranslationMap } from "./Locale.js"
import { src } from "./source/_PublicationRef.js"

export const AnimalDisease = DB.Entity(import.meta.url, {
  name: "AnimalDisease",
  namePlural: "AnimalDiseases",
  type: () =>
    DB.Object({
      level,
      resistance,
      cause,
      animal_types: DB.Required({
        comment: `The animal types this disease applies to.

If no animal types are given, the animal disease applies to all animal types.`,
        type: DB.Array(AnimalTypeIdentifier()),
      }),
      communicability_to_intelligent_creatures: DB.Required({
        comment: `If and at which chance the disease can be communicated to intelligent creatures.

If no causes are given, the disease is not communicable to intelligent creatures.`,
        type: DB.Array(DB.IncludeIdentifier(Cause)),
      }),
      src,
      translations: NestedTranslationMap(DB.Required, "AnimalDisease", DiseaseTranslation),
    }),
  instanceDisplayName: {},
  uniqueConstraints: [
    {
      entityMapKeyPath: "translations",
      keyPathInEntityMap: "name",
    },
  ],
})
