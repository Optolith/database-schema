import * as DB from "tsondb/schema/dsl"
import { levels, maximum } from "../_Activatable.js"
import { ap_value } from "../_ActivatableAdventurePointsValue.js"
import { nameBuilderRules } from "../_ActivatableNames.ts"
import { ArcaneEnergyCost, BindingCost, property, volume } from "../_ActivatableNonMundane.js"
import { explicit_select_options, select_options } from "../_ActivatableSelectOptions.js"
import { GeneralPrerequisites } from "../_Prerequisite.js"
import { src } from "../source/_PublicationRef.js"
import { translations } from "./_shared.ts"

export const DaggerRitual = DB.Entity(import.meta.url, {
  name: "DaggerRitual",
  namePlural: "DaggerRituals",
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
      cost: DB.Optional({
        type: DB.IncludeIdentifier(DaggerRitualCost),
      }),
      property: property(),
      ap_value,
      src,
      translations: translations("DaggerRitual"),
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

const DaggerRitualCost = DB.Enum(import.meta.url, {
  name: "DaggerRitualCost",
  values: () => ({
    ArcaneEnergyCost: DB.EnumCase({ type: DB.IncludeIdentifier(DaggerRitualArcaneEnergyCost) }),
    BindingCost: DB.EnumCase({ type: DB.IncludeIdentifier(BindingCost) }),
  }),
})

const DaggerRitualArcaneEnergyCost = DB.TypeAlias(import.meta.url, {
  name: "DaggerRitualArcaneEnergyCost",
  type: () =>
    DB.Object({
      ae_cost: DB.Required({
        type: DB.IncludeIdentifier(ArcaneEnergyCost),
      }),
      lp_cost: DB.Optional({
        type: DB.IncludeIdentifier(LifePointsCost),
      }),
    }),
})

export const LifePointsCost = DB.Enum(import.meta.url, {
  name: "LifePointsCost",
  values: () => ({
    Fixed: DB.EnumCase({ type: DB.IncludeIdentifier(FixedLifePointsCost) }),
  }),
})

const FixedLifePointsCost = DB.TypeAlias(import.meta.url, {
  name: "FixedLifePointsCost",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The LP cost value.",
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})
