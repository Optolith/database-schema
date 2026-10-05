import * as DB from "tsondb/schema/dsl"
import { BrewIdentifier } from "../_Identifier.js"
import { full } from "./_shared.ts"

export const CauldronEnchantment = full({
  name: "CauldronEnchantment",
  namePlural: "CauldronEnchantments",
  brew: () =>
    DB.Required({
      comment:
        "Witches can learn to brew special things in their Witch's Cauldron. These brews can be categorized in different types.",
      type: BrewIdentifier(),
    }),
})
