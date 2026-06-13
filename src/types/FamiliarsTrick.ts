import * as DB from "tsondb/schema/dsl"
import { OldParameter } from "./_ActivatableSkill.js"
import {
  IndefiniteOneTimeCost,
  NonModifiableOneTimeCostPerCountable,
} from "./_ActivatableSkillCost.js"
import {
  DurationUnitValue,
  ExpressionBasedDuration,
  IndefiniteDuration,
} from "./_ActivatableSkillDuration.js"
import {
  AnimalTypeIdentifier,
  MagicalTraditionIdentifier,
  PropertyIdentifier,
} from "./_Identifier.js"
import { ResponsiveText } from "./_ResponsiveText.js"
import { NestedTranslationMap } from "./Locale.js"
import { Errata } from "./source/_Erratum.js"
import { src } from "./source/_PublicationRef.js"

export const FamiliarsTrick = DB.Entity(import.meta.url, {
  name: "FamiliarsTrick",
  namePlural: "FamiliarsTricks",
  displayName: "Familiar’s Trick",
  displayNamePlural: "Familiar’s Tricks",
  type: () =>
    DB.Object({
      animal_types: DB.Required({
        comment: `The animal types this trick is available to. Either it is available to all or only a list of specific animal types.

If no animal types are given, the familiars trick applies to all animal types.`,
        type: DB.Array(AnimalTypeIdentifier(), { uniqueItems: true }),
      }),
      traditions: DB.Optional({
        comment: `The magical traditions whose familiars can use this trick. Either it is available to all or only a list of specific traditions.

If no traditions are given, the familiars trick is not restricted by the magical tradition at all.`,
        type: DB.Array(MagicalTraditionIdentifier(), { uniqueItems: true, minItems: 1 }),
      }),
      parameters: DB.Required({
        comment: "Measurable parameters of a familiar’s trick.",
        type: DB.IncludeIdentifier(FamiliarsTrickPerformanceParameters),
      }),
      property: DB.Required({
        comment: "The associated property.",
        type: DB.IncludeIdentifier(FamiliarsTrickProperty),
      }),
      ap_value: DB.Optional({
        comment:
          "The AP value the familiar has to pay for. It may also be that a specific is known by all familiar by default. In the latter case the field is not set.",
        type: DB.Integer({ minimum: 1 }),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "FamiliarsTrick",
        DB.Object({
          name: DB.Required({
            comment: "The familiar’s trick’s name.",
            type: DB.String({ minLength: 1 }),
          }),
          effect: DB.Required({
            comment: "The effect description.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          cost: DB.Optional({
            isDeprecated: true,
            type: DB.IncludeIdentifier(OldParameter),
          }),
          duration: DB.Optional({
            isDeprecated: true,
            type: DB.IncludeIdentifier(OldParameter),
          }),
          errata: DB.Optional({
            type: DB.IncludeIdentifier(Errata),
          }),
        }),
      ),
    }),
  instanceDisplayName: {},
  uniqueConstraints: [
    {
      entityMapKeyPath: "translations",
      keyPathInEntityMap: "name",
    },
  ],
})

const FamiliarsTrickProperty = DB.Enum(import.meta.url, {
  name: "FamiliarsTrickProperty",
  values: () => ({
    Fixed: DB.EnumCase({ type: PropertyIdentifier() }),
    Indefinite: DB.EnumCase({ type: DB.IncludeIdentifier(IndefiniteFamiliarsTrickProperty) }),
  }),
})

const IndefiniteFamiliarsTrickProperty = DB.TypeAlias(import.meta.url, {
  name: "IndefiniteFamiliarsTrickProperty",
  type: () =>
    DB.Object({
      translations: NestedTranslationMap(
        DB.Optional,
        "IndefiniteFamiliarsTrickProperty",
        DB.Object({
          description: DB.Required({
            comment: "A description of the property.",
            type: DB.IncludeIdentifier(ResponsiveText),
          }),
        }),
      ),
    }),
})

const FamiliarsTrickPerformanceParameters = DB.Enum(import.meta.url, {
  name: "FamiliarsTrickPerformanceParameters",
  comment: "Measurable parameters of a familiar’s trick.",
  values: () => ({
    OneTime: DB.EnumCase({
      type: DB.IncludeIdentifier(FamiliarsTrickOneTimePerformanceParameters),
    }),
    OneTimeInterval: DB.EnumCase({
      type: DB.IncludeIdentifier(FamiliarsTrickOneTimeIntervalPerformanceParameters),
    }),
    Sustained: DB.EnumCase({
      type: DB.IncludeIdentifier(FamiliarsTrickSustainedPerformanceParameters),
    }),
  }),
})

const FamiliarsTrickOneTimePerformanceParameters = DB.TypeAlias(import.meta.url, {
  name: "FamiliarsTrickOneTimePerformanceParameters",
  type: () =>
    DB.Object({
      cost: DB.Required({
        type: DB.IncludeIdentifier(FamiliarsTrickOneTimeCost),
      }),
      duration: DB.Required({
        type: DB.IncludeIdentifier(FamiliarsTrickOneTimeDuration),
      }),
    }),
})

const FamiliarsTrickOneTimeCost = DB.Enum(import.meta.url, {
  name: "FamiliarsTrickOneTimeCost",
  values: () => ({
    Fixed: DB.EnumCase({ type: DB.IncludeIdentifier(FamiliarsTrickFixedOneTimeCost) }),
    All: DB.EnumCase({ type: DB.IncludeIdentifier(FamiliarsTrickAllOneTimeCost) }),
    Indefinite: DB.EnumCase({ type: DB.IncludeIdentifier(IndefiniteOneTimeCost) }),
  }),
})

const FamiliarsTrickFixedOneTimeCost = DB.TypeAlias(import.meta.url, {
  name: "FamiliarsTrickFixedOneTimeCost",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The AE cost value.",
        type: DB.Integer({ minimum: 1 }),
      }),
      lp_value: DB.Optional({
        comment: "The LP cost value.",
        type: DB.Integer({ minimum: 1 }),
      }),
      interval: DB.Optional({
        comment: "The interval in which you have to pay the AE cost again.",
        type: DB.IncludeIdentifier(DurationUnitValue),
      }),
      per: DB.Optional({
        comment: "The cost have to be per a specific countable entity, e.g. `8 KP per person`.",
        type: DB.IncludeIdentifier(NonModifiableOneTimeCostPerCountable),
      }),
    }),
})

const FamiliarsTrickAllOneTimeCost = DB.TypeAlias(import.meta.url, {
  name: "FamiliarsTrickAllOneTimeCost",
  type: () =>
    DB.Object({
      minimum: DB.Optional({
        comment: "The minimum AE the familiar has to have/spend.",
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})

const FamiliarsTrickOneTimeDuration = DB.Enum(import.meta.url, {
  name: "FamiliarsTrickOneTimeDuration",
  values: () => ({
    Immediate: DB.EnumCase({ type: null }),
    Expression: DB.EnumCase({ type: DB.IncludeIdentifier(ExpressionBasedDuration) }),
    Indefinite: DB.EnumCase({ type: DB.IncludeIdentifier(IndefiniteDuration) }),
  }),
})

const FamiliarsTrickOneTimeIntervalPerformanceParameters = DB.TypeAlias(import.meta.url, {
  name: "FamiliarsTrickOneTimeIntervalPerformanceParameters",
  type: () =>
    DB.Object({
      cost: DB.Required({
        type: DB.IncludeIdentifier(FamiliarsTrickOneTimeIntervalCost),
      }),
    }),
})

const FamiliarsTrickOneTimeIntervalCost = DB.TypeAlias(import.meta.url, {
  name: "FamiliarsTrickOneTimeIntervalCost",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The AE cost value.",
        type: DB.Integer({ minimum: 1 }),
      }),
      interval: DB.Required({
        comment: "The duration granted/added by paying the given AE cost.",
        type: DB.IncludeIdentifier(DurationUnitValue),
      }),
    }),
})

const FamiliarsTrickSustainedPerformanceParameters = DB.TypeAlias(import.meta.url, {
  name: "FamiliarsTrickSustainedPerformanceParameters",
  type: () =>
    DB.Object({
      cost: DB.Required({
        type: DB.IncludeIdentifier(FamiliarsTrickSustainedCost),
      }),
    }),
})

const FamiliarsTrickSustainedCost = DB.TypeAlias(import.meta.url, {
  name: "FamiliarsTrickSustainedCost",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The AE cost value.",
        type: DB.Integer({ minimum: 1 }),
      }),
      interval: DB.Optional({
        comment: "The interval in which you have to pay the AE cost again.",
        type: DB.IncludeIdentifier(DurationUnitValue),
      }),
    }),
})
