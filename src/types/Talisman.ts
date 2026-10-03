import * as DB from "tsondb/schema/dsl"
import { DurationUnit } from "./_ActivatableSkillDuration.ts"
import { Dice } from "./_Dice.js"
import { BlessedTraditionIdentifier, DerivedCharacteristicIdentifier } from "./_Identifier.js"
import { MathOperation } from "./_MathExpression.js"
import { CloseCombatTechnique, RangedCombatTechnique } from "./CombatTechnique.js"
import { GenMeleeWeapon } from "./equipment/item/_MeleeWeapon.js"
import { GenRangedWeapon } from "./equipment/item/_RangedWeapon.js"
import { checkWeaponCombatTechniqueIntegrity } from "./equipment/item/_Weapon.js"
import { NestedTranslationMap } from "./Locale.js"
import { Errata } from "./source/_Erratum.js"
import { src } from "./source/_PublicationRef.js"

export const Talisman = DB.Entity(import.meta.url, {
  name: "Talisman",
  namePlural: "Talismans",
  type: () =>
    DB.Object({
      tradition: DB.Required({
        comment: "The tradition(s) the talisman belongs to.",
        type: DB.Array(BlessedTraditionIdentifier(), { minItems: 1 }),
      }),
      type: DB.Optional({
        comment: "The talisman type, if any.",
        type: DB.IncludeIdentifier(TalismanType),
      }),
      activation: DB.Optional({
        comment: "The activation parameters.",
        type: DB.IncludeIdentifier(TalismanActivation),
      }),
      ap_value: DB.Optional({
        comment: "The AP value for the required trade secret, if possible.",
        type: DB.Integer({ minimum: 5, multipleOf: 5 }),
      }),
      combatUse: DB.Optional({
        type: DB.Object(
          {
            melee_uses: DB.Optional({
              comment:
                "A list of stat blocks for each close combat technique this talisman can be used with.",
              type: DB.NestedEntityMap({
                name: "MeleeTalismanUse",
                namePlural: "MeleeTalismanUses",
                secondaryEntity: CloseCombatTechnique,
                type: DB.IncludeIdentifier(TalismanMeleeWeapon),
                minProperties: 1,
              }),
            }),
            ranged_uses: DB.Optional({
              comment:
                "A list of stat blocks for each ranged combat technique this talisman can be used with.",
              type: DB.NestedEntityMap({
                name: "RangedTalismanUse",
                namePlural: "RangedTalismanUses",
                secondaryEntity: RangedCombatTechnique,
                type: DB.IncludeIdentifier(TalismanRangedWeapon),
                minProperties: 1,
              }),
            }),
          },
          { minProperties: 1 },
        ),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "Talisman",
        DB.Object({
          name: DB.Required({
            comment: "The talisman’s name.",
            type: DB.String({ minLength: 1 }),
          }),
          effect: DB.Required({
            comment: "The effect description.",
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
  customConstraints: ({ instanceContent, getInstanceById, getDisplayNameAndId }) =>
    instanceContent.combatUse
      ? checkWeaponCombatTechniqueIntegrity({
          instanceContent: instanceContent.combatUse,
          getDisplayNameAndId,
          getInstanceById,
        })
      : [],
})

const TalismanMeleeWeapon = DB.TypeAlias(import.meta.url, {
  name: "TalismanMeleeWeapon",
  type: () => DB.GenIncludeIdentifier(GenMeleeWeapon, [DB.IncludeIdentifier(TalismanDamage)]),
})

const TalismanRangedWeapon = DB.TypeAlias(import.meta.url, {
  name: "TalismanRangedWeapon",
  type: () => DB.GenIncludeIdentifier(GenRangedWeapon, [DB.IncludeIdentifier(TalismanDamage)]),
})

const TalismanDamage = DB.TypeAlias(import.meta.url, {
  name: "TalismanDamage",
  type: () => DB.GenIncludeIdentifier(MathOperation, [DB.IncludeIdentifier(TalismanDamageOption)]),
})

const TalismanDamageOption = DB.Enum(import.meta.url, {
  name: "TalismanDamageOption",
  values: () => ({
    Random: DB.EnumCase({ type: DB.IncludeIdentifier(Dice) }),
    Constant: DB.EnumCase({ type: null }),
    QualityLevels: DB.EnumCase({ type: null }),
  }),
})

const TalismanType = DB.Enum(import.meta.url, {
  name: "TalismanType",
  values: () => ({
    MainTalisman: DB.EnumCase({ type: null }),
    Talisman: DB.EnumCase({ type: null }),
    MinorTalisman: DB.EnumCase({ type: null }),
    Regalia: DB.EnumCase({ type: null }),
    PowerfulTalisman: DB.EnumCase({ type: null }),
  }),
})

const TalismanActivation = DB.TypeAlias(import.meta.url, {
  name: "TalismanActivation",
  type: () =>
    DB.Object({
      cost: DB.Required({
        comment: "The cost to activate the talisman.",
        type: DB.IncludeIdentifier(TalismanActivationCost),
      }),
      duration: DB.Required({
        comment: "The duration of how long the talisman will be active.",
        type: DB.IncludeIdentifier(TalismanActivationDuration),
      }),
    }),
})

const TalismanActivationCost = DB.TypeAlias(import.meta.url, {
  name: "TalismanActivationCost",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The (numeric) cost value.",
        type: DB.Integer({ minimum: 0 }),
      }),
      unit: DB.Required({
        comment: "The unit in which to pay the cost.",
        type: DerivedCharacteristicIdentifier(),
      }),
    }),
})

const TalismanActivationDuration = DB.TypeAlias(import.meta.url, {
  name: "TalismanActivationDuration",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The (numeric) duration value.",
        type: DB.IncludeIdentifier(TalismanActivationDurationExpression),
      }),
      unit: DB.Required({
        comment: "The unit of the duration.",
        type: DB.IncludeIdentifier(DurationUnit),
      }),
    }),
})

export const TalismanActivationDurationExpression = DB.TypeAlias(import.meta.url, {
  name: "TalismanActivationDurationExpression",
  type: () =>
    DB.GenIncludeIdentifier(MathOperation, [
      DB.IncludeIdentifier(TalismanActivationDurationExpressionValue),
    ]),
})

export const TalismanActivationDurationExpressionValue = DB.Enum(import.meta.url, {
  name: "TalismanActivationDurationExpressionValue",
  values: () => ({
    Constant: DB.EnumCase({ type: DB.Integer({ minimum: 1 }) }),
    QualityLevels: DB.EnumCase({ type: null }),
  }),
})
