import * as DB from "tsondb/schema/dsl"
import {
  ArmorIdentifier,
  CloseCombatTechniqueIdentifier,
  ItemComponentIdentifier,
  RangedCombatTechniqueIdentifier,
  SpecialAmmunitionIdentifier,
  WeaponIdentifier,
} from "../../_Identifier.ts"
import { EquipmentPrerequisites } from "../../_Prerequisite.ts"
import { CloseCombatTechnique, RangedCombatTechnique } from "../../CombatTechnique.ts"
import { NestedTranslationMap } from "../../Locale.ts"
import { Errata } from "../../source/_Erratum.ts"
import { src } from "../../source/_PublicationRef.ts"
import { FixedCost, Weight } from "./_Item.ts"

export const ItemComponent = DB.Entity(import.meta.url, {
  name: "ItemComponent",
  namePlural: "ItemComponents",
  type: () =>
    DB.Object({
      options: DB.Required({
        type: DB.ChildEntities(ItemComponentOption),
      }),
      cost: DB.Required({
        comment: ItemComponentCost.comment,
        type: DB.IncludeIdentifier(ItemComponentCost),
      }),
      weight: DB.Optional({
        comment: "The weight in kg.",
        type: DB.IncludeIdentifier(Weight),
      }),
      applicableItems: DB.Required({
        comment: "The items the component can be applied to.",
        type: DB.IncludeIdentifier(ApplicableItems),
      }),
      incompatibleWith: DB.Optional({
        comment: "Other components this component is not compatible with.",
        type: DB.Array(ItemComponentIdentifier(), {
          minItems: 1,
          uniqueItems: true,
        }),
      }),
      rules: DB.Optional({
        comment: "Special rules for the item component.",
        type: DB.IncludeIdentifier(ItemComponentRules),
      }),
      prerequisites: DB.Optional({
        comment:
          "The prerequisites of the item, if any. Note that this is fully separate from the prerequisites of the item’s trade secret, which are defined independently from this.",
        type: DB.IncludeIdentifier(EquipmentPrerequisites),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "ItemComponent",
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
              "The items the component can be applied to. Used if the generated text is not sufficient.",
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
  instanceDisplayName: { pathInLocaleMap: "label" },
  parentReferenceKey: "parent",
})

const ItemComponentCost = DB.Enum(import.meta.url, {
  name: "ItemComponentCost",
  comment: "The cost in silverthalers.",
  values: () => ({
    Fixed: DB.EnumCase({
      comment: "The cost is a fixed amount of silverthalers.",
      type: DB.IncludeIdentifier(FixedCost),
    }),
    ByCombatTechnique: DB.EnumCase({
      comment: "The cost depends on the combat technique of the item it is applied to.",
      type: DB.IncludeIdentifier(ItemComponentCostByCombatTechnique),
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

const ItemComponentCostByCombatTechnique = DB.TypeAlias(import.meta.url, {
  name: "ItemComponentCostByCombatTechnique",
  type: () =>
    DB.Object(
      {
        close: DB.Optional({
          comment: "The cost in silverthalers for close combat techniques.",
          type: DB.NestedEntityMap({
            name: "ItemComponentCostByCloseCombatTechnique",
            namePlural: "ItemComponentCostsByCloseCombatTechnique",
            secondaryEntity: CloseCombatTechnique,
            type: DB.Object({
              value: DB.Required({
                comment: "The cost in silverthalers for the close combat technique.",
                type: DB.Float({ minimum: { value: 0, isExclusive: true } }),
              }),
              translations: NestedTranslationMap(
                DB.Optional,
                "ItemComponentCostByCloseCombatTechnique",
                DB.IncludeIdentifier(ItemComponentCostByCombatTechniqueTranslation),
              ),
            }),
          }),
        }),
        ranged: DB.Optional({
          comment: "The cost in silverthalers for ranged combat techniques.",
          type: DB.NestedEntityMap({
            name: "ItemComponentCostByRangedCombatTechnique",
            namePlural: "ItemComponentCostsByRangedCombatTechnique",
            secondaryEntity: RangedCombatTechnique,
            type: DB.Object({
              value: DB.Required({
                comment: "The cost in silverthalers for the ranged combat technique.",
                type: DB.Float({ minimum: { value: 0, isExclusive: true } }),
              }),
              translations: NestedTranslationMap(
                DB.Optional,
                "ItemComponentCostByRangedCombatTechnique",
                DB.IncludeIdentifier(ItemComponentCostByCombatTechniqueTranslation),
              ),
            }),
          }),
        }),
      },
      { minProperties: 1 },
    ),
})

const ItemComponentCostByCombatTechniqueTranslation = DB.TypeAlias(import.meta.url, {
  name: "ItemComponentCostByCombatTechniqueTranslation",
  type: () =>
    DB.Object({
      label: DB.Required({
        comment: "The label for cost, if different from the name of the combat technique.",
        type: DB.String({ minLength: 1 }),
      }),
    }),
})

const ApplicableItems = DB.Enum(import.meta.url, {
  name: "ApplicableItems",
  comment: "The items the component can be applied to.",
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
          comment: "Specific weapons this component can be applied to.",
          type: DB.Array(WeaponIdentifier(), {
            minItems: 1,
            uniqueItems: true,
          }),
        }),
        combatTechniques: DB.Optional({
          comment: "Weapons of combat techniques this component can be applied to.",
          type: DB.Array(DB.IncludeIdentifier(ApplicableMeleeCombatTechnique), {
            minItems: 1,
            uniqueItems: true,
          }),
        }),
        category: DB.Optional({
          comment: "The category of weapons this component can be applied to.",
          type: DB.IncludeIdentifier(ApplicableMeleeWeaponCategory),
        }),
      },
      { minProperties: 1 },
    ),
})

const ApplicableMeleeCombatTechnique = DB.TypeAlias(import.meta.url, {
  name: "ApplicableMeleeCombatTechnique",
  type: () =>
    DB.Object({
      combatTechnique: DB.Required({
        comment: "The combat technique this component can be applied to.",
        type: CloseCombatTechniqueIdentifier(),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "ApplicableMeleeCombatTechnique",
        DB.Object({
          text: DB.Required({
            comment:
              "The name that should be displayed if the name of combat technique should not be used.",
            type: DB.String({ minLength: 1 }),
          }),
        }),
      ),
    }),
})

const ApplicableMeleeWeaponCategory = DB.Enum(import.meta.url, {
  name: "ApplicableMeleeWeaponCategory",
  values: () => ({
    HasMetalSurface: DB.EnumCase({ type: null }),
    HasMetalBladeOrTip: DB.EnumCase({ type: null }),
    HasWrappableHandle: DB.EnumCase({ type: null }),
  }),
})

const ApplicableRangedWeapons = DB.TypeAlias(import.meta.url, {
  name: "ApplicableRangedWeapons",
  type: () =>
    DB.Object(
      {
        weapons: DB.Optional({
          comment: "Specific weapons this component can be applied to.",
          type: DB.Array(WeaponIdentifier(), {
            minItems: 1,
            uniqueItems: true,
          }),
        }),
        combatTechniques: DB.Optional({
          comment: "Weapons of combat techniques this component can be applied to.",
          type: DB.Array(DB.IncludeIdentifier(ApplicableRangedCombatTechnique), {
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

const ApplicableRangedCombatTechnique = DB.TypeAlias(import.meta.url, {
  name: "ApplicableRangedCombatTechnique",
  type: () =>
    DB.Object({
      combatTechnique: DB.Required({
        comment: "The combat technique this component can be applied to.",
        type: RangedCombatTechniqueIdentifier(),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "ApplicableRangedCombatTechnique",
        DB.Object({
          text: DB.Required({
            comment:
              "The name that should be displayed if the name of combat technique should not be used.",
            type: DB.String({ minLength: 1 }),
          }),
        }),
      ),
    }),
})

const ApplicableAmmunition = DB.TypeAlias(import.meta.url, {
  name: "ApplicableAmmunition",
  type: () =>
    DB.Object(
      {
        ammunition: DB.Optional({
          comment: "Specific ammunition this component can be applied to.",
          type: DB.Array(SpecialAmmunitionIdentifier(), {
            minItems: 1,
            uniqueItems: true,
          }),
        }),
        invertAmmunition: DB.Optional({
          comment:
            "Whether the list of ammunition is inverted, i.e. whether the component can be applied to all ammunition – or those of the specified category – except for the listed ammunition.",
          type: DB.Boolean(),
        }),
        category: DB.Optional({
          comment: "The category of weapons this component can be applied to.",
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
        comment: "Specific armor this component can be applied to.",
        type: DB.Array(ArmorIdentifier(), {
          minItems: 1,
          uniqueItems: true,
        }),
      }),
      category: DB.Optional({
        comment: "The category of weapons this component can be applied to.",
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

const ItemComponentRules = DB.TypeAlias(import.meta.url, {
  name: "ItemComponentRules",
  type: () =>
    DB.Object(
      {
        baseItemModifications: DB.Optional({
          type: DB.IncludeIdentifier(ItemComponentBaseItemModifications),
        }),
      },
      { minProperties: 1 },
    ),
})

const ItemComponentBaseItemModifications = DB.TypeAlias(import.meta.url, {
  name: "ItemComponentBaseItemModifications",
  type: () =>
    DB.Object(
      {
        damagePoints: DB.Optional({
          comment:
            "The damage points added to the damage points of the base item. Negative values lower the damage points.",
          type: DB.Integer(),
        }),
        attackModifier: DB.Optional({
          comment:
            "The attack modifier added to the attack modifier of the base item. Negative values lower the attack modifier.",
          type: DB.Integer(),
        }),
        parryModifier: DB.Optional({
          comment:
            "The parry modifier added to the parry modifier of the base item. Negative values lower the parry modifier.",
          type: DB.Integer(),
        }),
        protection: DB.Optional({
          comment:
            "The protection added to the protection of the base item. Negative values lower the protection.",
          type: DB.Integer(),
        }),
        encumbrance: DB.Optional({
          comment:
            "The encumbrance added to the encumbrance of the base item. Negative values lower the encumbrance.",
          type: DB.Integer(),
        }),
        range: DB.Optional({
          comment:
            "The range added to the range of the base item. Negative values lower the range.",
          type: DB.Integer(),
        }),
        reloadTime: DB.Optional({
          comment:
            "The reload time added to the reload time of the base item. Negative values lower the reload time.",
          type: DB.Integer(),
        }),
        weight: DB.Optional({
          comment:
            "The weight added to the weight of the base item. Negative values lower the weight.",
          type: DB.Float(),
        }),
        breakingPointRating: DB.Optional({
          comment:
            "The breaking point rating added to the breaking point rating of the base item. Negative values lower the breaking point rating.",
          type: DB.Integer(),
        }),
      },
      { minProperties: 1 },
    ),
})
