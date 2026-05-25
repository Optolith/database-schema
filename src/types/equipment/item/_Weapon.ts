import * as DB from "tsondb/schema/dsl"
import type { GetDisplayNameAndId, GetInstanceById } from "tsondb/schema/gen"
import type {
  GenMeleeWeapon,
  GenRangedWeapon,
  WeaponCombatTechniqueValueRule,
} from "../../../../gen/types.js"
import { AttributeIdentifier } from "../../_Identifier.js"

export const PrimaryAttributeDamageThreshold = DB.Enum(import.meta.url, {
  name: "PrimaryAttributeDamageThreshold",
  comment:
    "The primary attribute damage and threshold value. You can either use an integer, an object or a pair. Use an integer if you just have to define a single threshold value for the default primary attribute of the combat technique. Use an object if you need to define the value only or if you need to define the value as well as a single different primary attribute than which the combat technique uses. Use the pair if you need to set the primary attributes to AGI and STR (the combat technique has AGI but this item has AGI/STR) and/or if you need to set different thresholds for AGI and STR (e.g. AGI 14/STR 15). If the same values are in the pair, they will be merged (AGI 14/STR 14 will be AGI/STR 14).",
  values: () => ({
    Default: DB.EnumCase({ type: DB.IncludeIdentifier(DefaultPrimaryAttributeDamageThreshold) }),
    List: DB.EnumCase({ type: DB.IncludeIdentifier(PrimaryAttributeDamageThresholdList) }),
  }),
})

const DefaultPrimaryAttributeDamageThreshold = DB.TypeAlias(import.meta.url, {
  name: "DefaultPrimaryAttributeDamageThreshold",
  type: () =>
    DB.Object({
      threshold: DB.Required({
        comment:
          "The attribute value representing the damage threshold for the primary attribute of the item's combat technique.",
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})

const PrimaryAttributeDamageThresholdList = DB.TypeAlias(import.meta.url, {
  name: "PrimaryAttributeDamageThresholdList",
  type: () =>
    DB.Object({
      list: DB.Required({
        comment: "A list of primary attributes with their associated threshold.",
        type: DB.Array(DB.IncludeIdentifier(SinglePrimaryAttributeDamageThreshold), {
          minItems: 1,
          uniqueItems: true,
        }),
      }),
    }),
})

const SinglePrimaryAttributeDamageThreshold = DB.TypeAlias(import.meta.url, {
  name: "SinglePrimaryAttributeDamageThreshold",
  type: () =>
    DB.Object({
      attribute: DB.Required({
        comment: "The primary attribute.",
        type: AttributeIdentifier(),
      }),
      threshold: DB.Required({
        comment: "The attribute value representing the damage threshold.",
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})

export const Length = DB.TypeAlias(import.meta.url, {
  name: "Length",
  comment: "The length of the weapon in cm/halffingers.",
  type: () => DB.Integer({ minimum: 1 }),
})

export const checkWeaponCombatTechniqueIntegrity = (
  {
    instanceContent,
    getInstanceById,
    getDisplayNameAndId,
  }: {
    instanceContent: {
      melee_uses?: Record<string, GenMeleeWeapon<unknown>>
      ranged_uses?: Record<string, GenRangedWeapon<unknown>>
    }
    getInstanceById: GetInstanceById
    getDisplayNameAndId: GetDisplayNameAndId
  },
  { secondary: _secondary }: { secondary: boolean },
): string[] => {
  const checkPart = (
    rule: WeaponCombatTechniqueValueRule,
    value: unknown,
    name: string,
    type: "close" | "ranged",
    id: string,
  ): string | undefined =>
    (rule.kind === "Prohibited") === (value === undefined) || rule.kind === "Optional"
      ? undefined
      : `${name} must${rule.kind === "Required" ? "" : " not"} be provided for ${type} combat technique ${getDisplayNameAndId(type === "close" ? "CloseCombatTechnique" : "RangedCombatTechnique", id)}`

  return [
    instanceContent.melee_uses === undefined && instanceContent.ranged_uses === undefined
      ? "either melee uses or ranged uses have to be provided"
      : undefined,
    ...Object.entries(instanceContent.melee_uses ?? {}).flatMap(([ctId, meleeUse]) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- integrity has been checked, it must be present
      const ct = getInstanceById("CloseCombatTechnique", ctId)!
      return [
        checkPart(ct.special.can_parry, meleeUse.parryModifier, "a parry modifier", "close", ctId),
        checkPart(
          ct.special.has_damage_threshold,
          meleeUse.damage_threshold,
          "a damage threshold",
          "close",
          ctId,
        ),
        checkPart(ct.special.has_length, meleeUse.length, "a length", "close", ctId),
        checkPart(ct.special.has_reach, meleeUse.reach, "a reach", "close", ctId),
        checkPart(ct.special.has_shield_size, meleeUse.size, "a shield size", "close", ctId),
      ]
    }),
    ...Object.entries(instanceContent.ranged_uses ?? {}).flatMap(([ctId, rangedUse]) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- integrity has been checked, it must be present
      const ct = getInstanceById("RangedCombatTechnique", ctId)!
      return [
        checkPart(ct.special.has_ammunition, rangedUse.ammunition, "an ammunition", "ranged", ctId),
      ]
    }),
  ].filter(v => v !== undefined)
}
