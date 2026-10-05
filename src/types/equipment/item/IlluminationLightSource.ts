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

export const IlluminationLightSource = DB.Entity(import.meta.url, {
  name: "IlluminationLightSource",
  namePlural: "IlluminationLightSources",
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
      structure_points: DB.Required({
        comment:
          "The structure points of the item. Use an array if the item consists of multiple components that have individual structure points.",
        type: DB.IncludeIdentifier(StructurePoints),
      }),
      burning_time: DB.Required({
        comment:
          "The burning time is the time how long the light source can be lit. After that time you have to use a new light source.",
        type: DB.IncludeIdentifier(BurningTime),
      }),
      combat_use: DB.Optional({
        comment:
          "The item can also be used either as an improvised weapon or as an armor, although this is not the primary use case of the item.",
        type: DB.IncludeIdentifier(CombatUse),
      }),
      src,
      translations: DefaultItemTranslations("IlluminationLightSource"),
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

export const BurningTime = DB.Enum(import.meta.url, {
  name: "BurningTime",
  values: () => ({
    Unlimited: DB.EnumCase({ type: null }),
    Limited: DB.EnumCase({ type: DB.IncludeIdentifier(LimitedBurningTime) }),
  }),
})

const LimitedBurningTime = DB.TypeAlias(import.meta.url, {
  name: "LimitedBurningTime",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The (unitless) time value.",
        type: DB.Float({ minimum: { value: 0, isExclusive: true } }),
      }),
      unit: DB.Required({
        comment: "The time unit.",
        type: DB.IncludeIdentifier(LimitedBurningTimeUnit),
      }),
    }),
})

const LimitedBurningTimeUnit = DB.Enum(import.meta.url, {
  name: "LimitedBurningTimeUnit",
  values: () => ({
    Hours: DB.EnumCase({ type: null }),
  }),
})
