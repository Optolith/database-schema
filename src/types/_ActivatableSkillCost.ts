import * as DB from "tsondb/schema/dsl"
import { CostMap } from "./_ActivatableSkillCostMap.ts"
import { DurationUnitValue } from "./_ActivatableSkillDuration.js"
import { SkillModificationLevelIdentifier } from "./_Identifier.js"
import { ResponsiveText, ResponsiveTextOptional, ResponsiveTextReplace } from "./_ResponsiveText.js"
import { NestedTranslationMap } from "./Locale.js"

export const OneTimeCost = DB.Enum(import.meta.url, {
  name: "OneTimeCost",
  values: () => ({
    Single: DB.EnumCase({ type: DB.IncludeIdentifier(SingleOneTimeCost) }),
    Conjunction: DB.EnumCase({ type: DB.IncludeIdentifier(MultipleOneTimeCosts) }),
    Disjunction: DB.EnumCase({ type: DB.IncludeIdentifier(MultipleOneTimeCosts) }),
    Map: DB.EnumCase({ type: DB.IncludeIdentifier(OneTimeCostMap) }),
  }),
})

const SingleOneTimeCost = DB.Enum(import.meta.url, {
  name: "SingleOneTimeCost",
  values: () => ({
    Modifiable: DB.EnumCase({ type: DB.IncludeIdentifier(ModifiableOneTimeCost) }),
    NonModifiable: DB.EnumCase({ type: DB.IncludeIdentifier(NonModifiableOneTimeCost) }),
    Indefinite: DB.EnumCase({ type: DB.IncludeIdentifier(IndefiniteOneTimeCost) }),
  }),
})

const MultipleOneTimeCosts = DB.TypeAlias(import.meta.url, {
  name: "MultipleOneTimeCosts",
  type: () =>
    DB.Array(DB.IncludeIdentifier(SingleOneTimeCost), {
      minItems: 2,
    }),
})

const ModifiableOneTimeCost = DB.TypeAlias(import.meta.url, {
  name: "ModifiableOneTimeCost",
  type: () =>
    DB.Object({
      initial_modification_level: DB.Required({
        comment: "The initial skill modification identifier/level.",
        type: SkillModificationLevelIdentifier(),
      }),
      permanent_value: DB.Optional({
        comment: "The part of the cost value that has to be spent permanently.",
        type: DB.Integer({ minimum: 1 }),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "ModifiableOneTimeCost",
        DB.Object({
          replacement: DB.Required({
            comment: "A replacement string.",
            type: DB.IncludeIdentifier(ResponsiveTextReplace),
          }),
        }),
      ),
    }),
})

export const NonModifiableOneTimeCost = DB.TypeAlias(import.meta.url, {
  name: "NonModifiableOneTimeCost",
  type: () =>
    DB.Object({
      is_minimum: DB.Optional({
        comment: "If `true`, the non-modifiable value is a minimum value.",
        type: DB.Boolean(),
      }),
      value: DB.Required({
        comment: "The AE cost value.",
        type: DB.Integer({ minimum: 1 }),
      }),
      permanent_value: DB.Optional({
        comment: "The part of the cost value that has to be spent permanently.",
        type: DB.Integer({ minimum: 1 }),
      }),
      per: DB.Optional({
        comment: "The cost have to be per a specific countable entity, e.g. `8 KP per person`.",
        type: DB.IncludeIdentifier(NonModifiableOneTimeCostPerCountable),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "NonModifiableOneTimeCost",
        DB.Object({
          note: DB.Required({
            comment: "A note, appended to the generated string in parenthesis.",
            type: DB.IncludeIdentifier(ResponsiveTextOptional),
          }),
        }),
      ),
    }),
})

export const NonModifiableOneTimeCostPerCountable = DB.TypeAlias(import.meta.url, {
  name: "NonModifiableOneTimeCostPerCountable",
  type: () =>
    DB.Object({
      minimum_total: DB.Optional({
        comment: "If defined, the minimum total AE that have to be spent casting the skill.",
        type: DB.Integer({ minimum: 1 }),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "NonModifiableOneTimeCostPerCountable",
        DB.Object({
          countable: DB.Required({
            comment: "The countable entity name.",
            type: DB.IncludeIdentifier(ResponsiveText),
          }),
        }),
      ),
    }),
})

export const IndefiniteOneTimeCost = DB.TypeAlias(import.meta.url, {
  name: "IndefiniteOneTimeCost",
  type: () =>
    DB.Object({
      translations: NestedTranslationMap(
        DB.Required,
        "IndefiniteOneTimeCost",
        DB.Object({
          description: DB.Required({
            comment: "A description of where the cost come from.",
            type: DB.IncludeIdentifier(ResponsiveText),
          }),
        }),
      ),
    }),
})

const OneTimeCostMap = DB.Enum(import.meta.url, {
  name: "OneTimeCostMap",
  values: () => ({
    Modifiable: DB.EnumCase({ type: DB.IncludeIdentifier(ModifiableOneTimeCostMap) }),
    NonModifiable: DB.EnumCase({ type: DB.IncludeIdentifier(NonModifiableOneTimeCostMap) }),
  }),
})

export const SustainedCost = DB.Enum(import.meta.url, {
  name: "SustainedCost",
  values: () => ({
    Single: DB.EnumCase({ type: DB.IncludeIdentifier(SingleSustainedCost) }),
    Map: DB.EnumCase({ type: DB.IncludeIdentifier(SustainedCostMap) }),
  }),
})

const SingleSustainedCost = DB.Enum(import.meta.url, {
  name: "SingleSustainedCost",
  values: () => ({
    Modifiable: DB.EnumCase({ type: DB.IncludeIdentifier(ModifiableSustainedCost) }),
    NonModifiable: DB.EnumCase({ type: DB.IncludeIdentifier(NonModifiableSustainedCost) }),
  }),
})

const SustainedCostMap = DB.Enum(import.meta.url, {
  name: "SustainedCostMap",
  values: () => ({
    Modifiable: DB.EnumCase({ type: DB.IncludeIdentifier(ModifiableSustainedCostMap) }),
    NonModifiable: DB.EnumCase({ type: DB.IncludeIdentifier(NonModifiableSustainedCostMap) }),
  }),
})

const ModifiableSustainedCost = DB.TypeAlias(import.meta.url, {
  name: "ModifiableSustainedCost",
  type: () =>
    DB.Object({
      initial_modification_level: DB.Required({
        comment: "The initial skill modification identifier/level.",
        type: SkillModificationLevelIdentifier(),
      }),
      interval: DB.Required({
        comment: "The sustain interval.",
        type: DB.IncludeIdentifier(DurationUnitValue),
      }),
    }),
})

export const NonModifiableSustainedCost = DB.TypeAlias(import.meta.url, {
  name: "NonModifiableSustainedCost",
  type: () =>
    DB.Object({
      is_minimum: DB.Optional({
        comment: "If `true`, the non-modifiable value is a minimum value.",
        type: DB.Boolean(),
      }),
      value: DB.Required({
        comment: "The AE cost value.",
        type: DB.Integer({ minimum: 1 }),
      }),
      per: DB.Optional({
        comment: "The cost have to be per a specific countable entity, e.g. `8 KP per person`.",
        type: DB.IncludeIdentifier(NonModifiableSustainedCostPerCountable),
      }),
      interval: DB.Required({
        comment: "The sustain interval.",
        type: DB.IncludeIdentifier(DurationUnitValue),
      }),
    }),
})

const NonModifiableSustainedCostPerCountable = DB.TypeAlias(import.meta.url, {
  name: "NonModifiableSustainedCostPerCountable",
  type: () =>
    DB.Object({
      minimum_total: DB.Optional({
        comment: "If defined, the minimum total AE that have to be spent casting the skill.",
        type: DB.Integer({ minimum: 1 }),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "NonModifiableSustainedCostPerCountable",
        DB.Object({
          countable: DB.Required({
            comment: "The countable entity name.",
            type: DB.IncludeIdentifier(ResponsiveText),
          }),
        }),
      ),
    }),
})

const ModifiableOneTimeCostMap = DB.TypeAlias(import.meta.url, {
  name: "ModifiableOneTimeCostMap",
  type: () =>
    DB.Object({
      map: DB.Required({
        comment: "The cost map.",
        type: DB.GenIncludeIdentifier(CostMap, [
          DB.IncludeIdentifier(ModifiableOneTimeCostMapOptionValue),
        ]),
      }),
    }),
})

const NonModifiableOneTimeCostMap = DB.TypeAlias(import.meta.url, {
  name: "NonModifiableOneTimeCostMap",
  type: () =>
    DB.Object({
      map: DB.Required({
        comment: "The cost map.",
        type: DB.GenIncludeIdentifier(CostMap, [
          DB.IncludeIdentifier(NonModifiableOneTimeCostMapOptionValue),
        ]),
      }),
    }),
})

/**
 * Based on the cost map, but for other entries that do not care about modifiability and one-time/sustained differences.
 */
export const StandaloneCostMap = DB.TypeAlias(import.meta.url, {
  name: "StandaloneCostMap",
  type: () =>
    DB.GenIncludeIdentifier(CostMap, [
      DB.IncludeIdentifier(NonModifiableOneTimeCostMapOptionValue),
    ]),
})

const ModifiableSustainedCostMap = DB.TypeAlias(import.meta.url, {
  name: "ModifiableSustainedCostMap",
  type: () =>
    DB.Object({
      map: DB.Required({
        comment: "The cost map.",
        type: DB.GenIncludeIdentifier(CostMap, [
          DB.IncludeIdentifier(ModifiableSustainedCostMapOptionValue),
        ]),
      }),
      interval: DB.Required({
        comment: "The sustain interval.",
        type: DB.IncludeIdentifier(DurationUnitValue),
      }),
    }),
})

const NonModifiableSustainedCostMap = DB.TypeAlias(import.meta.url, {
  name: "NonModifiableSustainedCostMap",
  type: () =>
    DB.Object({
      map: DB.Required({
        comment: "The cost map.",
        type: DB.GenIncludeIdentifier(CostMap, [
          DB.IncludeIdentifier(NonModifiableSustainedCostMapOptionValue),
        ]),
      }),
      interval: DB.Required({
        comment: "The sustain interval.",
        type: DB.IncludeIdentifier(DurationUnitValue),
      }),
    }),
})

const ModifiableOneTimeCostMapOptionValue = DB.TypeAlias(import.meta.url, {
  name: "ModifiableOneTimeCostMapOptionValue",
  type: () =>
    DB.Object({
      initialModificationLevel: DB.Required({
        comment: "The initial skill modification identifier/level.",
        type: SkillModificationLevelIdentifier(),
      }),
      permanentValue: DB.Optional({
        comment: "The part of the cost value that has to be spent permanently.",
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})

const NonModifiableOneTimeCostMapOptionValue = DB.TypeAlias(import.meta.url, {
  name: "NonModifiableOneTimeCostMapOptionValue",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The full cost value for this option.",
        type: DB.Integer({ minimum: 1 }),
      }),
      permanentValue: DB.Optional({
        comment: "The part of the cost value that has to be spent permanently.",
        type: DB.Integer({ minimum: 0 }),
      }),
    }),
})

const ModifiableSustainedCostMapOptionValue = DB.TypeAlias(import.meta.url, {
  name: "ModifiableSustainedCostMapOptionValue",
  type: () =>
    DB.Object({
      initialModificationLevel: DB.Required({
        comment: "The initial skill modification identifier/level.",
        type: SkillModificationLevelIdentifier(),
      }),
    }),
})

const NonModifiableSustainedCostMapOptionValue = DB.TypeAlias(import.meta.url, {
  name: "NonModifiableSustainedCostMapOptionValue",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The full cost value for this option.",
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})
