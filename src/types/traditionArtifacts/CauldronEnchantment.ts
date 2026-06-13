import * as DB from "tsondb/schema/dsl"
import { levels, maximum } from "../_Activatable.js"
import { ap_value } from "../_ActivatableAdventurePointsValue.js"
import { nameBuilderRules } from "../_ActivatableNames.ts"
import { cost, property, volume } from "../_ActivatableNonMundane.js"
import { explicit_select_options, select_options } from "../_ActivatableSelectOptions.js"
import { BrewIdentifier } from "../_Identifier.js"
import { GeneralPrerequisites } from "../_Prerequisite.js"
import { src } from "../source/_PublicationRef.js"
import { translations } from "./_shared.ts"

export const CauldronEnchantment = DB.Entity(import.meta.url, {
  name: "CauldronEnchantment",
  namePlural: "CauldronEnchantments",
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
      brew: DB.Required({
        comment:
          "Witches can learn to brew special things in their Witch's Cauldron. These brews can be categorized in different types.",
        type: BrewIdentifier(),
      }),
      cost,
      property: property(),
      ap_value,
      src,
      translations: translations("CauldronEnchantment"),
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
