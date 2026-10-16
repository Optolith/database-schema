import * as DB from "tsondb/schema/dsl"
import { EquipmentPrerequisites } from "../../_Prerequisite.ts"
import { src } from "../../source/_PublicationRef.js"
import { Complexity, DefaultItemTranslations, StructurePoints, Weight } from "./_Item.js"

export const Jewelry = DB.Entity(import.meta.url, {
  name: "Jewelry",
  namePlural: "Jewelries",
  type: () =>
    DB.Object({
      cost: DB.Required({
        comment: "The cost in silverthalers.",
        type: DB.GenIncludeIdentifier(JewelryMaterialDifference, [
          DB.Float({ minimum: { value: 0, isExclusive: true } }),
        ]),
      }),
      weight: DB.Required({
        comment: "The weight in kg.",
        type: DB.GenIncludeIdentifier(JewelryMaterialDifference, [DB.IncludeIdentifier(Weight)]),
      }),
      complexity: DB.Optional({
        comment: "The complexity of crafting the item.",
        type: DB.IncludeIdentifier(Complexity),
      }),
      structure_points: DB.Required({
        comment:
          "The structure points of the item. Use an array if the item consists of multiple components that have individual structure points.",
        type: DB.IncludeIdentifier(StructurePoints),
      }),
      prerequisites: DB.Optional({
        comment:
          "The prerequisites of the item, if any. Note that this is fully separate from the prerequisites of the item’s trade secret, which are defined independently from this.",
        type: DB.IncludeIdentifier(EquipmentPrerequisites),
      }),
      src,
      translations: DefaultItemTranslations("Jewelry"),
    }),
  instanceDisplayName: {},
  uniqueConstraints: [
    {
      entityMapKeyPath: "translations",
      keyPathInEntityMap: "name",
    },
  ],
})

const JewelryMaterialDifference = DB.GenTypeAlias(import.meta.url, {
  name: "JewelryMaterialDifference",
  comment: "Jewelry can have different values for a property based on the material.",
  parameters: [DB.Param("T")],
  type: T =>
    DB.Object({
      bronze: DB.Required({ type: DB.TypeArgument(T) }),
      silver: DB.Required({ type: DB.TypeArgument(T) }),
      gold: DB.Required({ type: DB.TypeArgument(T) }),
    }),
})
