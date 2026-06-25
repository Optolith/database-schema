import * as DB from "tsondb/schema/dsl"
import { levels, maximum } from "../_Activatable.js"
import { ap_value } from "../_ActivatableAdventurePointsValue.js"
import { nameBuilderRules } from "../_ActivatableNames.ts"
import { cost, property, volume } from "../_ActivatableNonMundane.js"
import { explicit_select_options, select_options } from "../_ActivatableSelectOptions.js"
import { GeneralPrerequisites } from "../_Prerequisite.js"
import { src } from "../source/_PublicationRef.js"
import { translations } from "./_shared.ts"

export const ArcaneOrbEnchantment = DB.Entity(import.meta.url, {
  name: "ArcaneOrbEnchantment",
  namePlural: "ArcaneOrbEnchantments",
  type: () =>
    DB.Object({
      levels,
      nameBuilderRules,
      select_options,
      explicit_select_options,
      maximum,
      prerequisites: DB.Optional({
        type: DB.IncludeIdentifier(GeneralPrerequisites),
      }),
      volume,
      cost,
      property: property(),
      ap_value,
      src,
      translations: translations("ArcaneOrbEnchantment"),
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
