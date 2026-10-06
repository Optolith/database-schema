import type { NonEmptyArray } from "@elyukai/utils/array/nonEmpty"
import * as DB from "tsondb/schema/dsl"
import type { Case } from "tsondb/schema/gen"
import type {
  DefaultEquipmentCategoryTypeRules,
  EquipmentCategory as EquipmentCategoryType,
  ValueRule,
} from "../../../../gen/types.js"
import { NestedTranslationMap } from "../../Locale.ts"

const ValueRule = DB.Enum(import.meta.url, {
  name: "ValueRule",
  comment:
    "Defines if an instance MUST/CAN/MUST NOT define a value for this parameter. If multiple rules apply to the same parameter, the order of precedence is Required > Optional > Prohibited.",
  values: () => ({
    Required: DB.EnumCase({
      comment: "The parameter MUST be present in all instances the rule applies to.",
      type: null,
    }),
    Optional: DB.EnumCase({
      comment: "The parameter CAN be present in any instances the rule applies to.",
      type: null,
    }),
    Prohibited: DB.EnumCase({
      comment: "The parameter MUST NOT be present in any instances the rule applies to.",
      type: null,
    }),
  }),
})

const AllowedCombatValues = DB.TypeAlias(import.meta.url, {
  name: "AllowedCombatValues",
  comment:
    "The combat values that are allowed for this category. If any combat value is allowed and used, advantages, disadvantages and known item specifics are also allowed to be defined for the item.",
  type: () =>
    DB.Object({
      isWeaponAllowed: DB.Required({
        comment: "Is the item allowed to be used as a weapon?",
        type: DB.Boolean(),
      }),
      isArmorAllowed: DB.Required({
        comment: "Is the item allowed to be used as an armor?",
        type: DB.Boolean(),
      }),
    }),
})

const EquipmentCategoryType = DB.Enum(import.meta.url, {
  name: "EquipmentCategoryType",
  values: () => ({
    Default: DB.EnumCase({
      comment: "Items that can be expressed using the generic Item entity.",
      type: DB.IncludeIdentifier(DefaultEquipmentCategoryTypeRules),
    }),
    Special: DB.EnumCase({
      comment: "Items whose rules and/or values cannot be expressed using the generic Item entity.",
      type: DB.IncludeIdentifier(SpecialEquipmentCategoryEntity),
    }),
  }),
})

const DefaultEquipmentCategoryTypeRules = DB.TypeAlias(import.meta.url, {
  name: "DefaultEquipmentCategoryTypeRules",
  type: () =>
    DB.Object({
      combatValues: DB.Required({
        comment:
          "The combat values that are allowed for this category. If any combat value is allowed and used, advantages, disadvantages and known item specifics are also allowed to be defined for the item.",
        type: DB.IncludeIdentifier(AllowedCombatValues),
      }),
      restrictedTo: DB.Required({
        comment: "Presence of restrictions to certain groups for items in this category.",
        type: DB.IncludeIdentifier(ValueRule),
      }),
      structurePoints: DB.Required({
        comment: "Presence of structure points to certain groups for items in this category.",
        type: DB.IncludeIdentifier(ValueRule),
      }),
      weight: DB.Required({
        comment: "Presence of weight to certain groups for items in this category.",
        type: DB.IncludeIdentifier(ValueRule),
      }),
      complexity: DB.Required({
        comment: "Presence of complexity to certain groups for items in this category.",
        type: DB.IncludeIdentifier(ValueRule),
      }),
      burningTime: DB.Required({
        comment: "Presence of burning time to certain groups for items in this category.",
        type: DB.IncludeIdentifier(ValueRule),
      }),
    }),
})

const SpecialEquipmentCategoryEntity = DB.Enum(import.meta.url, {
  name: "SpecialEquipmentCategoryEntity",
  values: () => ({
    AnimalCare: DB.EnumCase({ type: null }),
    Book: DB.EnumCase({ type: null }),
    Elixir: DB.EnumCase({ type: null }),
    GemOrPreciousStone: DB.EnumCase({ type: null }),
    Newspaper: DB.EnumCase({ type: null }),
    Poison: DB.EnumCase({ type: null }),
    WorkingSupernaturalCreature: DB.EnumCase({ type: null }),
  }),
})

export const EquipmentCategory = DB.Entity(import.meta.url, {
  name: "EquipmentCategory",
  namePlural: "EquipmentCategories",
  type: () =>
    DB.Object({
      position: DB.Required({
        comment: "The position of the category in the list. This has to be a unique value.",
        type: DB.Integer({ minimum: 0 }),
      }),
      type: DB.Required({
        comment: "The type of the equipment category.",
        type: DB.IncludeIdentifier(EquipmentCategoryType),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "EquipmentCategory",
        DB.Object({
          name: DB.Required({
            comment: "The equipment category’s name.",
            type: DB.String({ minLength: 1 }),
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
  ],
})

export const isEquipmentCategoryOfDefaultType = (
  category: EquipmentCategoryType,
): category is Omit<EquipmentCategoryType, "type"> & {
  type: Case<"Default", DefaultEquipmentCategoryTypeRules>
} => category.type.kind === "Default"

export const mergeValueRules = (categories: NonEmptyArray<ValueRule>): ValueRule["kind"] =>
  categories.reduce(
    (acc: ValueRule["kind"], elem) =>
      acc === "Required" || elem.kind === "Required"
        ? "Required"
        : acc === "Optional" || elem.kind === "Optional"
          ? "Optional"
          : "Prohibited",
    "Prohibited",
  )

export const mergeAllValueRules = (
  categories: NonEmptyArray<DefaultEquipmentCategoryTypeRules>,
): DefaultEquipmentCategoryTypeRules => ({
  combatValues: {
    isWeaponAllowed: categories.some(category => category.combatValues.isWeaponAllowed),
    isArmorAllowed: categories.some(category => category.combatValues.isArmorAllowed),
  },
  restrictedTo: { kind: mergeValueRules(categories.map(category => category.restrictedTo)) },
  structurePoints: { kind: mergeValueRules(categories.map(category => category.structurePoints)) },
  weight: { kind: mergeValueRules(categories.map(category => category.weight)) },
  complexity: { kind: mergeValueRules(categories.map(category => category.complexity)) },
  burningTime: { kind: mergeValueRules(categories.map(category => category.burningTime)) },
})
