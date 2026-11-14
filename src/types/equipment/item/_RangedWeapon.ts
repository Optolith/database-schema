/**
 * Auxiliary types for ranged weapons.
 */

import * as DB from "tsondb/schema/dsl"
import { Dice } from "../../_Dice.js"
import { AmmunitionishIdentifier } from "../../_IdentifierGroup.ts"
import { Length } from "./_Weapon.js"

export const RangedDamage = DB.Enum(import.meta.url, {
  name: "RangedDamage",
  comment:
    "The damage of a ranged weapon. It consists of a random part using dice and an optional flat part ny default. Some ranged weapons may work different so that damage is either not applicable at all or it is outlined as *Special* and further defined in a description.",
  values: () => ({
    Default: DB.EnumCase({ type: DB.IncludeIdentifier(DefaultRangedDamage) }),
    NotApplicable: DB.EnumCase({ type: null }),
    Special: DB.EnumCase({ type: null }),
  }),
})

const DefaultRangedDamage = DB.TypeAlias(import.meta.url, {
  name: "DefaultRangedDamage",
  comment: "The damage of a weapon consists of a random part using dice and an optional flat part.",
  type: () =>
    DB.Object({
      dice: DB.Required({
        comment: "How many dice of which type are rolled to get the damage.",
        type: DB.IncludeIdentifier(Dice),
      }),
      flat: DB.Optional({
        comment: "Flat damage, if any. It gets added to the result of the dice rolls.",
        type: DB.Integer(),
      }),
    }),
})

export const RangedWeapon = DB.TypeAlias(import.meta.url, {
  name: "RangedWeapon",
  type: () => DB.GenIncludeIdentifier(GenRangedWeapon, [DB.IncludeIdentifier(RangedDamage)]),
})

export const GenRangedWeapon = DB.GenTypeAlias(import.meta.url, {
  name: "GenRangedWeapon",
  parameters: [DB.Param("Damage")],
  type: Damage =>
    DB.Object({
      damage: DB.Required({
        comment: "The damage of a weapon can consist of random dice rolls and flat damage.",
        type: DB.TypeArgument(Damage),
      }),
      reload_time: DB.Required({
        comment: "One or multiple reload times.",
        type: DB.Array(DB.IncludeIdentifier(ReloadTime), {
          minItems: 1,
          uniqueItems: true,
        }),
      }),
      range: DB.Required({
        comment: "The range brackets for the weapon: close, medium, far. Distances in m.",
        type: DB.IncludeIdentifier(RangeBrackets),
      }),
      ammunition: DB.Optional({
        comment: "The needed ammunition.",
        type: DB.IncludeIdentifier(AmmunitionishIdentifier),
      }),
      length: DB.Optional({
        comment: "The length of the weapon in cm/halffingers.",
        type: DB.IncludeIdentifier(Length),
      }),
      is_improvised_weapon: DB.Required({
        comment: "Is the weapon an improvised weapon?",
        type: DB.Boolean(),
      }),
    }),
})

export const RangeBrackets = DB.TypeAlias(import.meta.url, {
  name: "RangeBrackets",
  type: () =>
    DB.Object({
      close: DB.Required({
        comment: "The close range bracket for the weapon. Distance in m.",
        type: DB.Integer({ minimum: 0 }),
      }),
      medium: DB.Required({
        comment: "The medium range bracket for the weapon. Distance in m.",
        type: DB.Integer({ minimum: 0 }),
      }),
      far: DB.Required({
        comment: "The far range bracket for the weapon. Distance in m.",
        type: DB.Integer({ minimum: 0 }),
      }),
    }),
})

export const ReloadTime = DB.TypeAlias(import.meta.url, {
  name: "ReloadTime",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "A reload time value in actions.",
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})
