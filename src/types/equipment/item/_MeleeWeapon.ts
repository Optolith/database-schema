/**
 * Auxiliary types for melee weapons.
 */

import * as DB from "tsondb/schema/dsl"
import { Dice } from "../../_Dice.js"
import { ReachIdentifier } from "../../_Identifier.js"
import { Length, PrimaryAttributeDamageThreshold } from "./_Weapon.js"

export const AttackModifier = DB.TypeAlias(import.meta.url, {
  name: "AttackModifier",
  comment: "The AT modifier.",
  type: () => DB.Integer(),
})

export const ParryModifier = DB.TypeAlias(import.meta.url, {
  name: "ParryModifier",
  comment: "The PA modifier.",
  type: () => DB.Integer(),
})

export const MeleeDamage = DB.TypeAlias(import.meta.url, {
  name: "MeleeDamage",
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

const ShieldSize = DB.Enum(import.meta.url, {
  name: "ShieldSize",
  comment: "The shield size and potential size-depending values.",
  values: () => ({
    Small: DB.EnumCase({ type: null }),
    Medium: DB.EnumCase({ type: null }),
    Large: DB.EnumCase({ type: DB.IncludeIdentifier(LargeShieldSize) }),
  }),
})

const LargeShieldSize = DB.TypeAlias(import.meta.url, {
  name: "LargeShieldSize",
  comment: "The damage of a weapon consists of a random part using dice and an optional flat part.",
  type: () =>
    DB.Object({
      attack_penalty: DB.Optional({
        comment: "The attack penalty from the shield, if any.",
        type: DB.Integer(),
      }),
    }),
})

export const MeleeWeapon = DB.TypeAlias(import.meta.url, {
  name: "MeleeWeapon",
  type: () => DB.GenIncludeIdentifier(GenMeleeWeapon, [DB.IncludeIdentifier(MeleeDamage)]),
})

export const GenMeleeWeapon = DB.GenTypeAlias(import.meta.url, {
  name: "GenMeleeWeapon",
  parameters: [DB.Param("Damage")],
  type: Damage =>
    DB.Object({
      damage: DB.Required({
        comment: "The damage of a weapon can consist of random dice rolls and flat damage.",
        type: DB.TypeArgument(Damage),
      }),
      damage_threshold: DB.Optional({
        comment: "The primary attribute damage and threshold value.",
        type: DB.IncludeIdentifier(PrimaryAttributeDamageThreshold),
      }),
      attackModifier: DB.Optional({
        comment: "The AT modifier.",
        type: DB.IncludeIdentifier(AttackModifier),
      }),
      parryModifier: DB.Optional({
        comment: "The PA modifier.",
        type: DB.IncludeIdentifier(ParryModifier),
      }),
      reach: DB.Optional({
        comment: "The reach of the weapon.",
        type: DB.Array(ReachIdentifier(), { minItems: 1, uniqueItems: true }),
      }),
      length: DB.Optional({
        comment: "The length of the weapon in cm/halffingers.",
        type: DB.IncludeIdentifier(Length),
      }),
      size: DB.Optional({
        comment: "The shield size and potential size-depending values.",
        type: DB.IncludeIdentifier(ShieldSize),
      }),
      is_parrying_weapon: DB.Required({
        comment: "Is the weapon a parrying weapon?",
        type: DB.Boolean(),
      }),
      is_two_handed_weapon: DB.Required({
        comment: "Is the weapon a two-handed weapon?",
        type: DB.Boolean(),
      }),
      is_improvised_weapon: DB.Required({
        comment: "Is the weapon an improvised weapon?",
        type: DB.Boolean(),
      }),
    }),
})
