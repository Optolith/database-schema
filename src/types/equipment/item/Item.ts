import { isNotEmpty } from "@elyukai/utils/array/nonEmpty"
import { isNotNullish } from "@elyukai/utils/nullable"
import * as DB from "tsondb/schema/dsl"
import type { GetDisplayNameAndId, GetInstanceById } from "tsondb/schema/gen"
import type { Item as ItemType, ValueRule } from "../../../../gen/types.js"
import { EquipmentCategoryIdentifier } from "../../_Identifier.ts"
import { CloseCombatTechnique, RangedCombatTechnique } from "../../CombatTechnique.ts"
import { NestedTranslationMap } from "../../Locale.ts"
import { Errata } from "../../source/_Erratum.ts"
import { src } from "../../source/_PublicationRef.js"
import {
  Complexity,
  Cost,
  KnownItemSpecifics,
  KnownItemSpecificsTranslation,
  RestrictedTo,
  StructurePoints,
  Weight,
} from "./_Item.ts"
import { MeleeWeapon } from "./_MeleeWeapon.ts"
import { RangedWeapon } from "./_RangedWeapon.ts"
import { checkWeaponCombatTechniqueIntegrity } from "./_Weapon.ts"
import { SecondaryArmor } from "./Armor.ts"
import { isEquipmentCategoryOfDefaultType, mergeAllValueRules } from "./EquipmentCategory.ts"
import { BurningTime } from "./IlluminationLightSource.ts"

export const Item = DB.Entity(import.meta.url, {
  name: "Item",
  namePlural: "Items",
  type: () =>
    DB.Object({
      categories: DB.Required({
        comment: "The categories this item belongs to.",
        type: DB.Array(EquipmentCategoryIdentifier(), { minItems: 1, uniqueItems: true }),
      }),
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
      structurePoints: DB.Required({
        comment:
          "The structure points of the item. Use an array if the item consists of multiple components that have individual structure points.",
        type: DB.IncludeIdentifier(StructurePoints),
      }),
      burningTime: DB.Optional({
        comment:
          "The burning time is the time how long the light source can be lit. After that time you have to use a new light source.",
        type: DB.IncludeIdentifier(BurningTime),
      }),
      meleeUses: DB.Optional({
        comment:
          "A list of stat blocks for each close combat technique this weapon can be used with.",
        type: DB.NestedEntityMap({
          name: "MeleeWeaponUse2",
          namePlural: "MeleeWeaponUses2",
          secondaryEntity: CloseCombatTechnique,
          type: DB.IncludeIdentifier(MeleeWeapon),
          minProperties: 1,
        }),
      }),
      rangedUses: DB.Optional({
        comment:
          "A list of stat blocks for each ranged combat technique this weapon can be used with.",
        type: DB.NestedEntityMap({
          name: "RangedWeaponUse2",
          namePlural: "RangedWeaponUses2",
          secondaryEntity: RangedCombatTechnique,
          type: DB.IncludeIdentifier(RangedWeapon),
          minProperties: 1,
        }),
      }),
      armorUse: DB.Optional({
        comment: "Stats for this item being used as an armor.",
        type: DB.IncludeIdentifier(SecondaryArmor),
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
        "Item",
        DB.Object({
          name: DB.Required({
            comment: "The item’s name.",
            type: DB.String({ minLength: 1 }),
          }),
          secondaryName: DB.Optional({
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
  customConstraints: ({ instanceContent, ...rest }) =>
    checkEquipmentCategoryConstraintsWithItem(
      instanceContent,
      rest.getInstanceById,
      rest.getDisplayNameAndId,
    ),
})

const checkEquipmentCategoryConstraintsWithItem = (
  item: ItemType,
  getInstanceById: GetInstanceById,
  getDisplayNameAndId: GetDisplayNameAndId,
) => {
  const categories = item.categories.map(categoryId =>
    getInstanceById("EquipmentCategory", categoryId),
  )

  if (isNotEmpty(categories)) {
    if (categories.every(isNotNullish)) {
      if (categories.every(isEquipmentCategoryOfDefaultType)) {
        const mergedRules = mergeAllValueRules(categories.map(c => c.type.Default))
        const errors: string[] = []

        if (mergedRules.combatValues.isWeaponAllowed) {
          if (item.meleeUses === undefined && item.rangedUses === undefined) {
            errors.push("A weapon must defined at least one melee use or ranged use.")
          } else {
            errors.push(
              ...checkWeaponCombatTechniqueIntegrity({
                instanceContent: item,
                getInstanceById,
                getDisplayNameAndId,
              }),
            )
          }
        }

        if (mergedRules.combatValues.isArmorAllowed && item.armorUse === undefined) {
          errors.push("An armor must defined an armor use.")
        }

        if (
          !mergedRules.combatValues.isWeaponAllowed &&
          !mergedRules.combatValues.isArmorAllowed &&
          Object.values(item.translations).some(
            t =>
              t.advantage !== undefined ||
              t.disadvantage !== undefined ||
              t.knownItemSpecifics !== undefined,
          )
        ) {
          errors.push(
            "Advantages, disadvantages and known item specifics may only be specified for weapons and armor.",
          )
        }

        const applyValueRule = (rule: ValueRule, value: unknown, valueName: string) => {
          if (rule.kind === "Required" && value === undefined) {
            errors.push(`${valueName} required for this item.`)
          } else if (rule.kind === "Prohibited" && value !== undefined) {
            errors.push(`${valueName} prohibited for this item.`)
          }
        }

        applyValueRule(mergedRules.complexity, item.complexity, "A complexity is")
        applyValueRule(mergedRules.restrictedTo, item.restrictedTo, "Restriction are")
        applyValueRule(mergedRules.structurePoints, item.structurePoints, "Structure points are")
        applyValueRule(mergedRules.weight, item.weight, "A weight is")
        applyValueRule(mergedRules.burningTime, item.burningTime, "A burning time is")

        return errors
      } else {
        return [
          "One or more categories of this item are not of the default type, which cannot be chosen items of this entity.",
        ]
      }
    } else {
      return ["One or more categories of this item could not be found."]
    }
  } else {
    return ["At least one category must be chosen for an item."]
  }
}
