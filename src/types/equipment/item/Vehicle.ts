import * as DB from "tsondb/schema/dsl"
import { EquipmentPrerequisites } from "../../_Prerequisite.ts"
import { src } from "../../source/_PublicationRef.js"
import { Complexity, Cost, DefaultItemTranslations, Weight } from "./_Item.js"

export const Vehicle = DB.Entity(import.meta.url, {
  name: "Vehicle",
  namePlural: "Vehicles",
  type: () =>
    DB.Object({
      cost: DB.Required({
        comment: "The cost in silverthalers.",
        type: DB.IncludeIdentifier(Cost),
      }),
      weight: DB.Optional({
        comment: "The weight in kg.",
        type: DB.IncludeIdentifier(Weight),
      }),
      complexity: DB.Optional({
        comment: "The complexity of crafting the item.",
        type: DB.IncludeIdentifier(Complexity),
      }),
      prerequisites: DB.Optional({
        comment:
          "The prerequisites of the item, if any. Note that this is fully separate from the prerequisites of the item’s trade secret, which are defined independently from this.",
        type: DB.IncludeIdentifier(EquipmentPrerequisites),
      }),
      src,
      translations: DefaultItemTranslations("Vehicle"),
    }),
  instanceDisplayName: {},
  uniqueConstraints: [
    {
      entityMapKeyPath: "translations",
      keyPathInEntityMap: "name",
    },
  ],
})
