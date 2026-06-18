import * as DB from "tsondb/schema/dsl"
import { levels, maximum } from "../_Activatable.js"
import { ap_value } from "../_ActivatableAdventurePointsValue.js"
import { nameBuilderRules } from "../_ActivatableNames.js"
import { cost, property, volume } from "../_ActivatableNonMundane.js"
import { GeneralPrerequisites } from "../_Prerequisite.js"
import { src } from "../source/_PublicationRef.js"
import { translations } from "./_shared.js"

//Keulenzauber für Goblinzauberinnen
export const Keulenzauber = DB.Entity(import.meta.url, {
  name: "Keulenzauber",
  namePlural: "Keulenzauber",
  type: () =>
    DB.Object({
      levels,
      nameBuilderRules,
      maximum,
      prerequisites: DB.Optional({
        type: DB.IncludeIdentifier(GeneralPrerequisites),
      }),
      volume,
      cost,
      property: property(),
      ap_value,
      src,
      translations: translations("Keulenzauber"),
    }),
  instanceDisplayName: {},
  uniqueConstraints: [
    {
      entityMapKeyPath: "translations",
      keyPathInEntityMap: "name_in_library",
      keyPathInEntityMapFallback: "name",
    },
  ],
})
