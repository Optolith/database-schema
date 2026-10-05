import * as DB from "tsondb/schema/dsl"
import { ArcaneEnergyCost, BindingCost } from "../_ActivatableNonMundane.js"
import { full } from "./_shared.ts"

export const DaggerRitual = full({
  name: "DaggerRitual",
  namePlural: "DaggerRituals",
  cost: () =>
    DB.Optional({
      type: DB.IncludeIdentifier(DaggerRitualCost),
    }),
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
