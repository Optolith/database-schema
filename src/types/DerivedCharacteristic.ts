import { assertExhaustive } from "@elyukai/utils/typeSafety"
import * as DB from "tsondb/schema/dsl"
import { fromUniformCase } from "tsondb/schema/gen"
import type {
  DerivedCharacteristicBase,
  DerivedCharacteristicBaseValue,
  MathOperation as MathOperationType,
} from "../../gen/types.js"
import { NestedTranslationMap } from "./Locale.js"
import { AttributeIdentifier } from "./_Identifier.ts"
import { ImprovementCost } from "./_ImprovementCost.ts"
import { MathOperation } from "./_MathExpression.ts"
import { DerivedCharacteristicPrerequisites } from "./_Prerequisite.js"
import { DerivedCharacteristicModifierPrerequisiteGroup } from "./prerequisites/PrerequisiteGroups.ts"
import { src } from "./source/_PublicationRef.js"

export const DerivedCharacteristic = DB.Entity(import.meta.url, {
  name: "DerivedCharacteristic",
  namePlural: "DerivedCharacteristics",
  type: () =>
    DB.Object({
      position: DB.Required({
        comment:
          "The position of the derived characteristic in lists. This has to be a unique value.",
        type: DB.Integer({ minimum: 0 }),
      }),
      type: DB.Optional({
        comment: "The derived characteristic may have a specific use in the game.",
        type: DB.IncludeIdentifier(DerivedCharacteristicType),
      }),
      calculation: DB.Required({
        comment: "Instructions for calculating the derived characteristic’s value.",
        type: DB.IncludeIdentifier(DerivedCharacteristicCalculation),
      }),
      prerequisites: DB.Optional({
        type: DB.IncludeIdentifier(DerivedCharacteristicPrerequisites),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "DerivedCharacteristic",
        DB.Object({
          name: DB.Required({
            comment: "The derived characteristic’s name.",
            type: DB.String({ minLength: 1 }),
          }),
          abbreviation: DB.Required({
            comment: "The derived characteristic’s abbreviation.",
            type: DB.String({ minLength: 1 }),
          }),
          unitAbbreviation: DB.Optional({
            comment:
              "The unit the derived characteristic is measured in, if different from the main abbreviation.",
            type: DB.String({ minLength: 1 }),
          }),
          unitAbbreviationValueAware: DB.Optional({
            comment:
              "The value-aware unit the derived characteristic is measured in, if different from the normal unit abbreviation. The string must follow the MessageFormat 2 specification and receives the value for the unit as the parameter `$value`. This can be used to display the unit in singular or plural form depending on the value, if relevant.",
            type: DB.String({ minLength: 1 }),
          }),
          description: DB.Optional({
            comment: "The derived characteristic’s description.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          calculation: DB.Optional({
            comment: "Possible calculation strings for the final value.",
            type: DB.IncludeIdentifier(CalculationTranslation),
          }),
        }),
      ),
    }),
  instanceDisplayName: {},
  sortOrder: { keyPath: "position", isIndex: true },
  uniqueConstraints: [
    {
      keyPath: "position",
    },
    {
      entityMapKeyPath: "translations",
      keyPathInEntityMap: "name",
    },
    {
      entityMapKeyPath: "translations",
      keyPathInEntityMap: "abbreviation",
    },
  ],
})

const DerivedCharacteristicType = DB.Enum(import.meta.url, {
  name: "DerivedCharacteristicType",
  comment:
    "The type of the derived characteristic, which determines how it can be used in the game.",
  values: () => ({
    Energy: DB.EnumCase({
      comment:
        "The derived characteristic works like an energy in that it can be spent on various actions and abilities, and also be refilled based on certain conditions.",
      type: DB.IncludeIdentifier(EnergyType),
    }),
    Resistance: DB.EnumCase({
      comment: "The derived characteristic represents a resistance against certain effects.",
      type: null,
    }),
  }),
})

const EnergyType = DB.TypeAlias(import.meta.url, {
  name: "EnergyType",
  comment: "Additional values that can be defined for an energy.",
  type: () =>
    DB.Object({
      purchase: DB.Optional({
        comment:
          "If set, the energy’s maximum value can be improved by spending AP.\n\nIf the energy’s permanent losses can be bought back, points will not be able to be purchased unless all permanent losses have been bought back.",
        type: DB.IncludeIdentifier(DerivedCharacteristicPurchase),
      }),
      permanentLoss: DB.Optional({
        comment:
          "If set, the energy can suffer permanent losses that reduce its maximum value. It may also be possible to buy back these permanent losses.",
        type: DB.IncludeIdentifier(DerivedCharacteristicPermanentLoss),
      }),
    }),
})

const DerivedCharacteristicCalculation = DB.TypeAlias(import.meta.url, {
  name: "DerivedCharacteristicCalculation",
  type: () =>
    DB.Object({
      base: DB.Required({
        comment: "The base value for the calculation.",
        type: DB.IncludeIdentifier(DerivedCharacteristicBase),
      }),
      modifiers: DB.Optional({
        comment:
          "A list of modifiers that are applied to the base value. The modifiers are applied in the order they appear in the list.",
        type: DB.Array(DB.IncludeIdentifier(DerivedCharacteristicModifier), { minItems: 1 }),
      }),
    }),
})

const DerivedCharacteristicPrimaryAttributeValue = DB.Enum(import.meta.url, {
  name: "DerivedCharacteristicPrimaryAttributeValue",
  values: () => ({
    Magical: DB.EnumCase({ type: null }),
    Blessed: DB.EnumCase({ type: null }),
  }),
})

const DerivedCharacteristicBaseValue = DB.Enum(import.meta.url, {
  name: "DerivedCharacteristicBaseValue",
  values: () => ({
    Constant: DB.EnumCase({ type: DB.Integer() }),
    Attribute: DB.EnumCase({ type: AttributeIdentifier() }),
    RaceBaseValue: DB.EnumCase({ displayName: "Base Value from Race", type: null }),
    PrimaryAttribute: DB.EnumCase({
      type: DB.IncludeIdentifier(DerivedCharacteristicPrimaryAttributeValue),
    }),
  }),
})

const DerivedCharacteristicBase = DB.TypeAlias(import.meta.url, {
  name: "DerivedCharacteristicBase",
  type: () =>
    DB.GenIncludeIdentifier(MathOperation, [DB.IncludeIdentifier(DerivedCharacteristicBaseValue)]),
})

export const calculationContainsRaceBase = (base: DerivedCharacteristicBase): boolean => {
  switch (base.kind) {
    case "Value":
      switch (base.Value.kind) {
        case "RaceBaseValue":
          return true
        case "Constant":
        case "Attribute":
        case "PrimaryAttribute":
          return false
        default:
          return assertExhaustive(base.Value)
      }
    case "Addition":
    case "Subtraction":
    case "Multiplication":
    case "Division":
    case "Exponentiation": {
      const [left, right] = fromUniformCase<
        "Addition" | "Subtraction" | "Multiplication" | "Division" | "Exponentiation",
        [
          MathOperationType<DerivedCharacteristicBaseValue>,
          MathOperationType<DerivedCharacteristicBaseValue>,
        ]
      >(base)
      return calculationContainsRaceBase(left) || calculationContainsRaceBase(right)
    }
  }
}

const DerivedCharacteristicModifierOperation = DB.Enum(import.meta.url, {
  name: "DerivedCharacteristicModifierOperation",
  values: () => ({
    Addition: DB.EnumCase({ type: null }),
    Subtraction: DB.EnumCase({ type: null }),
    Multiplication: DB.EnumCase({ type: null }),
    Division: DB.EnumCase({ type: null }),
  }),
})

const DerivedCharacteristicModifier = DB.TypeAlias(import.meta.url, {
  name: "DerivedCharacteristicModifier",
  type: () =>
    DB.Object({
      source: DB.Required({
        comment: "The entry that, when active, causes the modifier.",
        type: DB.IncludeIdentifier(DerivedCharacteristicModifierPrerequisiteGroup),
      }),
      operation: DB.Required({
        comment:
          "The mathematical operation that modifies the base value. The previous result is on the left side.",
        type: DB.IncludeIdentifier(DerivedCharacteristicModifierOperation),
      }),
      value: DB.Required({
        comment:
          "The value that is used in the modifier operation. If the source entry has levels, the value is multiplied by the source entry’s level.",
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})

const DerivedCharacteristicPurchase = DB.TypeAlias(import.meta.url, {
  name: "DerivedCharacteristicPurchase",
  type: () =>
    DB.Object({
      improvementCost: DB.Required({
        comment: "The cost for improving the derived characteristic by one.",
        type: DB.IncludeIdentifier(ImprovementCost),
      }),
      maximum: DB.Required({
        comment:
          "The maximum value that can be achieved for the derived characteristic through improvements.",
        type: DB.IncludeIdentifier(DerivedCharacteristicBase),
      }),
    }),
})

const DerivedCharacteristicPermanentLoss = DB.TypeAlias(import.meta.url, {
  name: "DerivedCharacteristicPermanentLoss",
  type: () =>
    DB.Object({
      canBeBoughtBack: DB.Optional({
        comment:
          "If set, permanent losses to the derived characteristic can be bought back for the specified cost.",
        type: DB.IncludeIdentifier(DerivedCharacteristicBuyBack),
      }),
    }),
})

const DerivedCharacteristicBuyBack = DB.TypeAlias(import.meta.url, {
  name: "DerivedCharacteristicBuyBack",
  type: () =>
    DB.Object({
      cost: DB.Required({
        comment: "The AP cost for buying back one point.",
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})

const CalculationTranslation = DB.TypeAlias(import.meta.url, {
  name: "CalculationTranslation",
  type: () =>
    DB.Object({
      default: DB.Required({
        comment: "The default calculation string.",
        type: DB.String({ minLength: 1 }),
      }),
      half_primary: DB.Optional({
        comment: "The calculation string if only half of the primary attribute is used.",
        type: DB.String({ minLength: 1 }),
      }),
      no_primary: DB.Optional({
        comment: "The calculation string if no primary attribute is used.",
        type: DB.String({ minLength: 1 }),
      }),
    }),
})
