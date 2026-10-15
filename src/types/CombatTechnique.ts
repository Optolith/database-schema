import * as DB from "tsondb/schema/dsl"
import { AttributeIdentifier } from "./_Identifier.js"
import { ImprovementCost } from "./_ImprovementCost.js"
import { NestedTranslationMap } from "./Locale.js"
import { Errata } from "./source/_Erratum.js"
import { src } from "./source/_PublicationRef.js"

export const CloseCombatTechnique = DB.Entity(import.meta.url, {
  name: "CloseCombatTechnique",
  namePlural: "CloseCombatTechniques",
  type: () =>
    DB.Object({
      special: DB.Required({
        comment:
          "Special rules for the combat technique that apply to all weapons in this category.",
        type: DB.IncludeIdentifier(CloseCombatTechniqueSpecialRules),
      }),
      primary_attribute: DB.Required({
        comment: "The primary attribute(s).",
        type: DB.Array(AttributeIdentifier(), { minItems: 1, maxItems: 2, uniqueItems: true }),
      }),
      breaking_point_rating: DB.Required({
        comment: "The *Breaking Point Rating* of the respective combat technique.",
        type: DB.Integer({ minimum: 1 }),
      }),
      improvement_cost: DB.Required({
        comment: "States which column is used to improve the combat technique.",
        type: DB.IncludeIdentifier(ImprovementCost),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "CloseCombatTechnique",
        DB.Object({
          name: DB.Required({
            comment: "The combat technique’s name.",
            type: DB.String({ minLength: 1 }),
          }),
          special: DB.Optional({
            comment: "Additional rules for the combat technique, if applicable.",
            type: DB.String({ minLength: 1, markdown: "block" }),
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

const WeaponCombatTechniqueValueRule = DB.Enum(import.meta.url, {
  name: "WeaponCombatTechniqueValueRule",
  comment: "Defines if the weapon must/can/must not define a value for this parameter.",
  values: () => ({
    Required: DB.EnumCase({
      comment: "The parameter must be present in all weapons for this combat technique.",
      type: null,
    }),
    Optional: DB.EnumCase({
      comment: "The parameter can be present in any weapons for this combat technique.",
      type: null,
    }),
    Prohibited: DB.EnumCase({
      comment: "The parameter must not be present in any weapon for this combat technique.",
      type: null,
    }),
  }),
})

const CloseCombatTechniqueSpecialRules = DB.TypeAlias(import.meta.url, {
  name: "CloseCombatTechniqueSpecialRules",
  comment: "Special rules for the combat technique that apply to all weapons in this category.",
  type: () =>
    DB.Object({
      hasAttackModifier: DB.Required({
        comment: "Do weapons of this combat technique have an attack modifier?",
        type: DB.IncludeIdentifier(WeaponCombatTechniqueValueRule),
      }),
      can_parry: DB.Required({
        comment: "Is parrying possible with this combat technique?",
        type: DB.IncludeIdentifier(WeaponCombatTechniqueValueRule),
      }),
      has_damage_threshold: DB.Required({
        type: DB.IncludeIdentifier(WeaponCombatTechniqueValueRule),
      }),
      has_reach: DB.Required({ type: DB.IncludeIdentifier(WeaponCombatTechniqueValueRule) }),
      has_length: DB.Required({ type: DB.IncludeIdentifier(WeaponCombatTechniqueValueRule) }),
      has_shield_size: DB.Required({ type: DB.IncludeIdentifier(WeaponCombatTechniqueValueRule) }),
    }),
})

export const RangedCombatTechnique = DB.Entity(import.meta.url, {
  name: "RangedCombatTechnique",
  namePlural: "RangedCombatTechniques",
  type: () =>
    DB.Object({
      special: DB.Required({
        comment:
          "Special rules for the combat technique that apply to all weapons in this category.",
        type: DB.IncludeIdentifier(RangedCombatTechniqueSpecialRules),
      }),
      primary_attribute: DB.Required({
        comment: "The primary attribute(s).",
        type: DB.Array(AttributeIdentifier(), { minItems: 1, maxItems: 2, uniqueItems: true }),
      }),
      breaking_point_rating: DB.Required({
        comment: "The *Breaking Point Rating* of the respective combat technique.",
        type: DB.Integer({ minimum: 1 }),
      }),
      improvement_cost: DB.Required({
        comment: "States which column is used to improve the combat technique.",
        type: DB.IncludeIdentifier(ImprovementCost),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "RangedCombatTechnique",
        DB.Object({
          name: DB.Required({
            comment: "The combat technique’s name.",
            type: DB.String({ minLength: 1 }),
          }),
          special: DB.Optional({
            comment: "Additional rules for the combat technique, if applicable.",
            type: DB.String({ minLength: 1, markdown: "block" }),
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

const RangedCombatTechniqueSpecialRules = DB.TypeAlias(import.meta.url, {
  name: "RangedCombatTechniqueSpecialRules",
  comment: "Special rules for the combat technique that apply to all weapons in this category.",
  type: () =>
    DB.Object({
      has_ammunition: DB.Required({ type: DB.IncludeIdentifier(WeaponCombatTechniqueValueRule) }),
    }),
})
