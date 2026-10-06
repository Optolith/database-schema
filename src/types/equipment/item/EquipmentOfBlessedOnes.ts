import * as DB from "tsondb/schema/dsl"
import { src } from "../../source/_PublicationRef.js"
import { CombatUse, Cost, DefaultItemTranslations, RestrictedTo, StructurePoints } from "./_Item.js"
import { checkWeaponCombatTechniqueIntegrity } from "./_Weapon.js"

export const EquipmentOfBlessedOnes = DB.Entity(import.meta.url, {
  name: "EquipmentOfBlessedOnes",
  namePlural: "EquipmentOfBlessedOnes",
  type: () =>
    DB.Object({
      cost: DB.Required({
        comment: "The cost in silverthalers.",
        type: DB.IncludeIdentifier(Cost),
      }),
      structure_points: DB.Required({
        comment:
          "The structure points of the item. Use an array if the item consists of multiple components that have individual structure points.",
        type: DB.IncludeIdentifier(StructurePoints),
      }),
      restrictedTo: DB.Optional({
        comment:
          "Define if during character creation this item can only be bought by a specific subset of characters.",
        type: DB.IncludeIdentifier(RestrictedTo),
      }),
      combat_use: DB.Optional({
        comment:
          "The item can also be used either as an improvised weapon or as an armor, although this is not the primary use case of the item.",
        type: DB.IncludeIdentifier(CombatUse),
      }),
      src,
      translations: DefaultItemTranslations("EquipmentOfBlessedOnes"),
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
