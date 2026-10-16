import * as DB from "tsondb/schema/dsl"
import { EquipmentPrerequisites } from "../../_Prerequisite.ts"
import { src } from "../../source/_PublicationRef.js"
import { Complexity, Cost, DefaultItemTranslations, FixedCost, Weight } from "./_Item.js"

export const AnimalCare = DB.Entity(import.meta.url, {
  name: "AnimalCare",
  namePlural: "AnimalCare",
  type: () =>
    DB.Object({
      type: DB.Required({
        comment: "Values depending on whether the animal care is feed.",
        type: DB.IncludeIdentifier(AnimalCareType),
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
      translations: DefaultItemTranslations("AnimalCare"),
    }),
  instanceDisplayName: {},
  uniqueConstraints: [
    {
      entityMapKeyPath: "translations",
      keyPathInEntityMap: "name",
    },
  ],
})

const AnimalCareType = DB.Enum(import.meta.url, {
  name: "AnimalCareType",
  comment: "Values depending on whether the animal care is feed.",
  values: () => ({
    General: DB.EnumCase({ type: DB.IncludeIdentifier(GeneralAnimalCare) }),
    Feed: DB.EnumCase({ type: DB.IncludeIdentifier(AnimalFeed) }),
  }),
})

const GeneralAnimalCare = DB.TypeAlias(import.meta.url, {
  name: "GeneralAnimalCare",
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
    }),
})

const AnimalFeed = DB.TypeAlias(import.meta.url, {
  name: "AnimalFeed",
  type: () =>
    DB.Object({
      cost: DB.Required({
        comment: "The cost in silverthalers.",
        type: DB.IncludeIdentifier(AnimalFeedCost),
      }),
    }),
})

const AnimalFeedCost = DB.Enum(import.meta.url, {
  name: "AnimalFeedCost",
  values: () => ({
    PerWeek: DB.EnumCase({ type: DB.IncludeIdentifier(FixedCost) }),
  }),
})
