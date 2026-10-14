import * as DB from "tsondb/schema/dsl"
import {
  AmmunitionIdentifier,
  ArmorIdentifier,
  CloseCombatTechniqueIdentifier,
  ItemComponentIdentifier,
  RangedCombatTechniqueIdentifier,
  WeaponIdentifier,
} from "../../_Identifier.ts"
import { CloseCombatTechnique, RangedCombatTechnique } from "../../CombatTechnique.ts"
import { NestedTranslationMap } from "../../Locale.ts"
import { Errata } from "../../source/_Erratum.ts"
import { src } from "../../source/_PublicationRef.ts"
import { Complexity, FixedCost } from "./_Item.ts"

export const ItemComponent = DB.Entity(import.meta.url, {
  name: "ItemComponent",
  namePlural: "ItemComponents",
  type: () =>
    DB.Object({
      options: DB.Required({
        type: DB.ChildEntities(ItemComponentOption),
      }),
      cost: DB.Required({
        comment: ItemFeatureCost.comment,
        type: DB.IncludeIdentifier(ItemFeatureCost),
      }),
      complexity: DB.Optional({
        comment: "The complexity of crafting the item.",
        type: DB.IncludeIdentifier(Complexity),
      }),
      applicableItems: DB.Required({
        comment: "The items the component can be applied to.",
        type: DB.IncludeIdentifier(ApplicableItems),
      }),
      incompatibleWith: DB.Optional({
        comment: "Other extensions this extension is not compatible with.",
        type: DB.Array(ItemComponentIdentifier(), {
          minItems: 1,
          uniqueItems: true,
        }),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "Ammunition",
        DB.Object({
          name: DB.Required({
            comment: "The item’s name.",
            type: DB.String({ minLength: 1 }),
          }),
          rules: DB.Optional({
            comment: "Special rules text.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          applicableItems: DB.Optional({
            comment:
              "The items the feature can be applied to. Used if the generated text is not sufficient.",
            type: DB.String({ minLength: 1, markdown: "inline" }),
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

const ItemComponentOption = DB.Entity(import.meta.url, {
  name: "ItemComponentOption",
  namePlural: "ItemComponentOptions",
  type: () =>
    DB.Object({
      parent: DB.Required({
        comment: "The item component this option belongs to.",
        type: ItemComponentIdentifier(),
      }),
      cost: DB.Required({
        comment: "The cost in silverthalers.",
        type: DB.Float({ minimum: { value: 0, isExclusive: true } }),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "ItemComponentOption",
        DB.Object({
          label: DB.Required({
            comment: "The label for the option.",
            type: DB.String({ minLength: 1 }),
          }),
        }),
      ),
    }),
  parentReferenceKey: "parent",
})

const ItemFeatureCost = DB.Enum(import.meta.url, {
  name: "ItemFeatureCost",
  comment: "The cost in silverthalers.",
  values: () => ({
    Fixed: DB.EnumCase({
      comment: "The cost is a fixed amount of silverthalers.",
      type: DB.IncludeIdentifier(FixedCost),
    }),
    ByCombatTechnique: DB.EnumCase({
      comment: "The cost depends on the combat technique of the item it is applied to.",
      type: DB.IncludeIdentifier(ItemFeatureCostByCombatTechnique),
    }),
    Factor: DB.EnumCase({
      comment: "The cost is a percentage of the cost of the item it is applied to.",
      type: DB.Float({ minimum: { value: 0, isExclusive: true } }),
    }),
    DerivedFromOption: DB.EnumCase({
      comment: "The cost depends on the selected option.",
      type: null,
    }),
  }),
})

const ItemFeatureCostByCombatTechnique = DB.TypeAlias(import.meta.url, {
  name: "ItemFeatureCostByCombatTechnique",
  type: () =>
    DB.Object(
      {
        close: DB.Optional({
          comment: "The cost in silverthalers for close combat techniques.",
          type: DB.NestedEntityMap({
            name: "ItemFeatureCostByCloseCombatTechnique",
            namePlural: "ItemFeatureCostsByCloseCombatTechnique",
            secondaryEntity: CloseCombatTechnique,
            type: DB.Object({
              value: DB.Required({
                comment: "The cost in silverthalers for the close combat technique.",
                type: DB.Float({ minimum: { value: 0, isExclusive: true } }),
              }),
              translations: NestedTranslationMap(
                DB.Optional,
                "ItemFeatureCostByCloseCombatTechnique",
                DB.Object({
                  label: DB.Required({
                    comment:
                      "The label for cost, if different from the name of the combat technique.",
                    type: DB.String({ minLength: 1 }),
                  }),
                }),
              ),
            }),
          }),
        }),
        ranged: DB.Optional({
          comment: "The cost in silverthalers for ranged combat techniques.",
          type: DB.NestedEntityMap({
            name: "ItemFeatureCostByRangedCombatTechnique",
            namePlural: "ItemFeatureCostsByRangedCombatTechnique",
            secondaryEntity: RangedCombatTechnique,
            type: DB.Object({
              value: DB.Required({
                comment: "The cost in silverthalers for the ranged combat technique.",
                type: DB.Float({ minimum: { value: 0, isExclusive: true } }),
              }),
              translations: NestedTranslationMap(
                DB.Optional,
                "ItemFeatureCostByRangedCombatTechnique",
                DB.Object({
                  label: DB.Required({
                    comment:
                      "The label for cost, if different from the name of the combat technique.",
                    type: DB.String({ minLength: 1 }),
                  }),
                }),
              ),
            }),
          }),
        }),
      },
      { minProperties: 1 },
    ),
})

const ApplicableItems = DB.Enum(import.meta.url, {
  name: "ApplicableItems",
  comment: "The items the feature can be applied to.",
  values: () => ({
    MeleeWeapon: DB.EnumCase({ type: DB.IncludeIdentifier(ApplicableMeleeWeapons) }),
    RangedWeapon: DB.EnumCase({ type: DB.IncludeIdentifier(ApplicableRangedWeapons) }),
    Ammunition: DB.EnumCase({ type: DB.IncludeIdentifier(ApplicableAmmunition) }),
    Armor: DB.EnumCase({ type: DB.IncludeIdentifier(ApplicableArmor) }),
  }),
})

const ApplicableMeleeWeapons = DB.TypeAlias(import.meta.url, {
  name: "ApplicableMeleeWeapons",
  type: () =>
    DB.Object(
      {
        weapons: DB.Optional({
          comment: "Specific weapons this feature can be applied to.",
          type: DB.Array(WeaponIdentifier(), {
            minItems: 1,
            uniqueItems: true,
          }),
        }),
        combatTechniques: DB.Optional({
          comment: "Weapons of combat techniques this feature can be applied to.",
          type: DB.Array(CloseCombatTechniqueIdentifier(), {
            minItems: 1,
            uniqueItems: true,
          }),
        }),
        category: DB.Optional({
          comment: "The category of weapons this feature can be applied to.",
          type: DB.IncludeIdentifier(ApplicableMeleeWeaponCategory),
        }),
      },
      { minProperties: 1 },
    ),
})

const ApplicableMeleeWeaponCategory = DB.Enum(import.meta.url, {
  name: "ApplicableMeleeWeaponCategory",
  values: () => ({
    HasMetalSurface: DB.EnumCase({ type: null }),
    HasMetalBladeOrTip: DB.EnumCase({ type: null }),
  }),
})

const ApplicableRangedWeapons = DB.TypeAlias(import.meta.url, {
  name: "ApplicableRangedWeapons",
  type: () =>
    DB.Object(
      {
        weapons: DB.Optional({
          comment: "Specific weapons this feature can be applied to.",
          type: DB.Array(WeaponIdentifier(), {
            minItems: 1,
            uniqueItems: true,
          }),
        }),
        combatTechniques: DB.Optional({
          comment: "Weapons of combat techniques this feature can be applied to.",
          type: DB.Array(RangedCombatTechniqueIdentifier(), {
            minItems: 1,
            uniqueItems: true,
          }),
        }),
        minimumReloadTime: DB.Optional({
          comment:
            "The minimum reload time a crossbow must have for it to be compatible with this component.",
          type: DB.Integer({ minimum: 1 }),
        }),
        usesBullets: DB.Optional({
          comment: "Whether the crossbow must use bullets to be compatible with this component.",
          type: DB.Boolean(),
        }),
      },
      { minProperties: 1 },
    ),
})

const ApplicableAmmunition = DB.TypeAlias(import.meta.url, {
  name: "ApplicableAmmunition",
  type: () =>
    DB.Object(
      {
        ammunition: DB.Optional({
          comment: "Specific ammunition this feature can be applied to.",
          type: DB.Array(AmmunitionIdentifier(), {
            minItems: 1,
            uniqueItems: true,
          }),
        }),
        category: DB.Optional({
          comment: "The category of weapons this feature can be applied to.",
          type: DB.IncludeIdentifier(ApplicableAmmunitionCategory),
        }),
      },
      { minProperties: 1 },
    ),
})

const ApplicableAmmunitionCategory = DB.Enum(import.meta.url, {
  name: "ApplicableAmmunitionCategory",
  values: () => ({
    ArrowOrBolt: DB.EnumCase({ type: null }),
  }),
})

const ApplicableArmor = DB.TypeAlias(import.meta.url, {
  name: "ApplicableArmor",
  type: () =>
    DB.Object({
      armor: DB.Optional({
        comment: "Specific armor this feature can be applied to.",
        type: DB.Array(ArmorIdentifier(), {
          minItems: 1,
          uniqueItems: true,
        }),
      }),
      category: DB.Optional({
        comment: "The category of weapons this feature can be applied to.",
        type: DB.IncludeIdentifier(ApplicableArmorCategory),
      }),
    }),
})

const ApplicableArmorCategory = DB.Enum(import.meta.url, {
  name: "ApplicableArmorCategory",
  values: () => ({
    Metal: DB.EnumCase({ type: null }),
  }),
})
