import * as DB from "tsondb/schema/dsl"
import { CloseCombatTechnique, RangedCombatTechnique } from "../../CombatTechnique.js"
import { NestedTranslationMap } from "../../Locale.js"
import { Errata } from "../../source/_Erratum.js"
import { src } from "../../source/_PublicationRef.js"
import {
  Complexity,
  Cost,
  KnownItemSpecifics,
  KnownItemSpecificsTranslation,
  RestrictedTo,
  StructurePoints,
  Weight,
} from "./_Item.js"
import { MeleeWeapon } from "./_MeleeWeapon.js"
import { RangedWeapon } from "./_RangedWeapon.js"
import { checkWeaponCombatTechniqueIntegrity } from "./_Weapon.js"

export const Weapon = DB.Entity(import.meta.url, {
  name: "Weapon",
  namePlural: "Weapons",
  type: () =>
    DB.Object({
      cost: DB.Required({
        comment: "The cost in silverthalers.",
        type: DB.IncludeIdentifier(Cost),
      }),
      weight: DB.Required({
        comment: "The weight in kg.",
        type: DB.IncludeIdentifier(Weight),
      }),
      complexity: DB.Optional({
        comment: "The complexity of crafting the item.",
        type: DB.IncludeIdentifier(Complexity),
      }),
      structure_points: DB.Optional({
        comment:
          "The structure points of the item. Use an array if the item consists of multiple components that have individual structure points.",
        type: DB.IncludeIdentifier(StructurePoints),
      }),
      melee_uses: DB.Optional({
        comment:
          "A list of stat blocks for each close combat technique this weapon can be used with.",
        type: DB.NestedEntityMap({
          name: "MeleeWeaponUse",
          namePlural: "MeleeWeaponUses",
          secondaryEntity: CloseCombatTechnique,
          type: DB.IncludeIdentifier(MeleeWeapon),
          minProperties: 1,
        }),
      }),
      ranged_uses: DB.Optional({
        comment:
          "A list of stat blocks for each ranged combat technique this weapon can be used with.",
        type: DB.NestedEntityMap({
          name: "RangedWeaponUse",
          namePlural: "RangedWeaponUses",
          secondaryEntity: RangedCombatTechnique,
          type: DB.IncludeIdentifier(RangedWeapon),
          minProperties: 1,
        }),
      }),
      restrictedTo: DB.Optional({
        comment:
          "Define if during character creation this weapon can only be bought by a specific subset of characters.",
        type: DB.IncludeIdentifier(RestrictedTo),
      }),
      knownItemSpecifics: DB.Optional({
        comment: "The weapon is a known item, which implies some additional values.",
        type: DB.IncludeIdentifier(KnownItemSpecifics),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "Weapon",
        DB.Object({
          name: DB.Required({
            comment: "The item’s name.",
            type: DB.String({ minLength: 1 }),
          }),
          secondary_name: DB.Optional({
            comment: "An auxiliary name or label of the item, if available.",
            type: DB.String({ minLength: 1 }),
          }),
          note: DB.Optional({
            comment: "Note text.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          rules: DB.Optional({
            comment: "Special rules text.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          advantage: DB.Optional({
            comment: "The weapon advantage text.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          disadvantage: DB.Optional({
            comment: "The weapon disadvantage text.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          knownItemSpecifics: DB.Optional({
            comment: "The weapon is a known item, which implies some additional values.",
            type: DB.IncludeIdentifier(KnownItemSpecificsTranslation),
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
  customConstraints: params => checkWeaponCombatTechniqueIntegrity(params, { secondary: false }),
})

export const ImprovisedWeapon = DB.TypeAlias(import.meta.url, {
  name: "ImprovisedWeapon",
  type: () =>
    DB.Object({
      melee_uses: DB.Optional({
        comment:
          "A list of stat blocks for each close combat technique this weapon can be used with.",
        type: DB.NestedEntityMap({
          name: "ImprovisedMeleeWeaponUse",
          namePlural: "ImprovisedMeleeWeaponUses",
          secondaryEntity: CloseCombatTechnique,
          type: DB.IncludeIdentifier(MeleeWeapon),
          minProperties: 1,
        }),
      }),
      ranged_uses: DB.Optional({
        comment:
          "A list of stat blocks for each ranged combat technique this weapon can be used with.",
        type: DB.NestedEntityMap({
          name: "ImprovisedRangedWeaponUse",
          namePlural: "ImprovisedRangedWeaponUses",
          secondaryEntity: RangedCombatTechnique,
          type: DB.IncludeIdentifier(RangedWeapon),
          minProperties: 1,
        }),
      }),
      restrictedTo: DB.Optional({
        comment:
          "Define if during character creation this weapon can only be bought by a specific subset of characters.",
        type: DB.IncludeIdentifier(RestrictedTo),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "ImprovisedWeapon",
        DB.Object(
          {
            advantage: DB.Optional({
              comment: "The weapon advantage text.",
              type: DB.String({ minLength: 1, markdown: "block" }),
            }),
            disadvantage: DB.Optional({
              comment: "The weapon disadvantage text.",
              type: DB.String({ minLength: 1, markdown: "block" }),
            }),
          },
          { minProperties: 1 },
        ),
      ),
    }),
})
