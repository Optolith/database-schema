import * as DB from "tsondb/schema/dsl"
import { src } from "../../source/_PublicationRef.js"
import {
  CombatUse,
  Complexity,
  Cost,
  DefaultItemTranslations,
  StructurePoints,
  Weight,
} from "./_Item.js"
import { checkWeaponCombatTechniqueIntegrity } from "./_Weapon.js"

export const TravelGearOrTool = DB.Entity(import.meta.url, {
  name: "TravelGearOrTool",
  namePlural: "TravelGearAndTools",
  type: () =>
    DB.Object({
      cost: DB.Required({
        comment: "The cost in silverthalers.",
        type: DB.IncludeIdentifier(Cost),
      }),
      weight: DB.Required({
        comment: "The weight in kg.",
        type: DB.IncludeIdentifier(Weight),
      }),
      complexity: DB.Optional({
        comment: "The complexity of crafting the item.",
        type: DB.IncludeIdentifier(Complexity),
      }),
      structure_points: DB.Optional({
        comment:
          "The structure points of the item. Use an array if the item consists of multiple components that have individual structure points.",
        type: DB.IncludeIdentifier(StructurePoints),
      }),
      combat_use: DB.Optional({
        comment:
          "The item can also be used either as an improvised weapon or as an armor, although this is not the primary use case of the item.",
        type: DB.IncludeIdentifier(CombatUse),
      }),
      src,
      translations: DefaultItemTranslations("TravelGearOrTool"),
    }),
  instanceDisplayName: {},
  uniqueConstraints: [
    {
      entityMapKeyPath: "translations",
      keyPathInEntityMap: "name",
    },
  ],
  customConstraints: ({ instanceContent, ...rest }) => {
    if (instanceContent.combat_use && instanceContent.combat_use.kind === "Weapon") {
      return checkWeaponCombatTechniqueIntegrity({
        ...rest,
        instanceContent: instanceContent.combat_use.Weapon,
      })
    }

    return []
  },
})
