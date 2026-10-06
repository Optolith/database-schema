import { isNotNullish } from "@elyukai/utils/nullable"
import * as DB from "tsondb/schema/dsl"
import type { GetInstanceById } from "tsondb/schema/gen"
import type * as Gen from "../../../../gen/types.js"
import { ArmorIdentifier } from "../../_Identifier.js"
import { NestedTranslationMap } from "../../Locale.js"
import { Errata } from "../../source/_Erratum.js"
import { src } from "../../source/_PublicationRef.js"
import {
  ComplexComplexity,
  Cost,
  KnownItemSpecifics,
  KnownItemSpecificsTranslation,
  RestrictedTo,
  Weight,
} from "./_Item.js"

export const Armor = DB.Entity(import.meta.url, {
  name: "Armor",
  namePlural: "Armor",
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
        type: DB.IncludeIdentifier(ArmorComplexity),
      }),
      protection: DB.Required({
        comment: "The PRO value.",
        type: DB.IncludeIdentifier(Protection),
      }),
      encumbrance: DB.Required({
        comment: "The ENC value.",
        type: DB.IncludeIdentifier(Encumbrance),
      }),
      has_additional_penalties: DB.Required({
        comment: "Does the armor have additional penalties (MOV -1, INI -1)?",
        type: DB.IncludeIdentifier(HasAdditionalPenalties),
      }),
      armorType: DB.Required({
        comment: "The armor type.",
        type: DB.IncludeIdentifier(ArmorType),
      }),
      hit_zone: DB.Optional({
        comment: "Specify if armor is only available for a specific hit zone.",
        type: DB.IncludeIdentifier(HitZone),
      }),
      restrictedTo: DB.Optional({
        comment:
          "Define if during character creation this weapon can only be bought by a specific subset of characters.",
        type: DB.IncludeIdentifier(RestrictedTo),
      }),
      knownItemSpecifics: DB.Optional({
        comment: "The armor is a known item, which implies some additional values.",
        type: DB.IncludeIdentifier(KnownItemSpecifics),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "Armor",
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
            comment: "The armor advantage text.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          disadvantage: DB.Optional({
            comment: "The armor disadvantage text.",
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
})

const ArmorType = DB.Enum(import.meta.url, {
  name: "ArmorType",
  comment: "The armor type.",
  values: () => ({
    Standard: DB.EnumCase({ type: DB.IncludeIdentifier(StandardArmorType) }),
    StandardVariant: DB.EnumCase({ type: DB.IncludeIdentifier(StandardVariantArmorType) }),
    Variant: DB.EnumCase({ type: DB.IncludeIdentifier(VariantArmorType) }),
  }),
})

const StandardArmorType = DB.TypeAlias(import.meta.url, {
  name: "StandardArmorType",
  comment: "A standard armor.",
  type: () =>
    DB.Object({
      sturdinessRating: DB.Required({
        comment:
          "An armor type can have a *sturdiness rating*. The higher the rating, the more durable the armor. Rolling higher than this rating during a sturdiness check means the armor receives one level of the new condition *Wear*.",
        type: DB.Integer({ minimum: 1, maximum: 20 }),
      }),
    }),
})

const validateArmorTypeReference = (deps: {
  getInstanceById: GetInstanceById
  // eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents
  instanceContent: { variantOf: Gen.Armor_ID | Gen.Item_ID }
}) =>
  [
    deps.getInstanceById("Armor", deps.instanceContent.variantOf)?.armorType.kind !== "Standard" &&
    deps.getInstanceById("Item", deps.instanceContent.variantOf)?.armorUse?.armorType.kind !==
      "Standard"
      ? "The armor is a variant of a standard armor, but the referenced armor is not a standard armor."
      : undefined,
  ].filter(isNotNullish)

const StandardVariantArmorType = DB.TypeAlias(import.meta.url, {
  name: "StandardVariantArmorType",
  comment:
    "The armor is a variant of a standard armor but still defines its own sturdiness rating and thus its own armor type.",
  type: () =>
    DB.Object({
      variantOf: DB.Required({
        comment: "The standard armor this armor is a variant of.",
        type: ArmorIdentifier(),
      }),
      sturdinessRating: DB.Required({
        comment:
          "An armor type can have a *sturdiness rating*. The higher the rating, the more durable the armor. Rolling higher than this rating during a sturdiness check means the armor receives one level of the new condition *Wear*.",
        type: DB.Integer({ minimum: 1, maximum: 20 }),
      }),
    }),
  customConstraints: validateArmorTypeReference,
})

const VariantArmorType = DB.TypeAlias(import.meta.url, {
  name: "VariantArmorType",
  comment: "The armor is a variant of a standard armor but also defines its own .",
  type: () =>
    DB.Object({
      variantOf: DB.Required({
        comment: "The standard armor this armor is a variant of.",
        type: ArmorIdentifier(),
      }),
    }),
  customConstraints: validateArmorTypeReference,
})

export const SecondaryArmor = DB.TypeAlias(import.meta.url, {
  name: "SecondaryArmor",
  type: () =>
    DB.Object({
      protection: DB.Required({
        comment: "The PRO value.",
        type: DB.IncludeIdentifier(Protection),
      }),
      encumbrance: DB.Required({
        comment: "The ENC value.",
        type: DB.IncludeIdentifier(Encumbrance),
      }),
      has_additional_penalties: DB.Required({
        comment: "Does the armor have additional penalties (MOV -1, INI -1)?",
        type: DB.IncludeIdentifier(HasAdditionalPenalties),
      }),
      armorType: DB.Required({
        comment: "The armor type.",
        type: DB.IncludeIdentifier(ArmorType),
      }),
      hit_zone: DB.Optional({
        comment: "Specify if armor is only available for a specific hit zone.",
        type: DB.IncludeIdentifier(HitZone),
      }),
      restrictedTo: DB.Optional({
        comment:
          "Define if during character creation this armor can only be bought by a specific subset of characters.",
        type: DB.IncludeIdentifier(RestrictedTo),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "SecondaryArmor",
        DB.Object(
          {
            advantage: DB.Optional({
              comment: "The armor advantage text.",
              type: DB.String({ minLength: 1, markdown: "block" }),
            }),
            disadvantage: DB.Optional({
              comment: "The armor disadvantage text.",
              type: DB.String({ minLength: 1, markdown: "block" }),
            }),
          },
          { minProperties: 1 },
        ),
      ),
    }),
  customConstraints: ({ instanceContent, ...deps }) =>
    instanceContent.armorType.kind !== "Standard"
      ? validateArmorTypeReference({
          ...deps,
          instanceContent:
            instanceContent.armorType.kind === "Variant"
              ? instanceContent.armorType.Variant
              : instanceContent.armorType.StandardVariant,
        })
      : [],
})

const ArmorComplexity = DB.Enum(import.meta.url, {
  name: "ArmorComplexity",
  comment: "The complexity of crafting the armor.",
  values: () => ({
    Primitive: DB.EnumCase({ type: null }),
    Simple: DB.EnumCase({ type: null }),
    Complex: DB.EnumCase({ type: DB.IncludeIdentifier(ComplexComplexity) }),
    Various: DB.EnumCase({ type: null }),
  }),
})

export const Protection = DB.TypeAlias(import.meta.url, {
  name: "Protection",
  comment: "The PRO value.",
  type: () => DB.Integer({ minimum: 0 }),
})

export const Encumbrance = DB.TypeAlias(import.meta.url, {
  name: "Encumbrance",
  comment: "The ENC value.",
  type: () => DB.Integer({ minimum: 0 }),
})

export const HasAdditionalPenalties = DB.TypeAlias(import.meta.url, {
  name: "HasAdditionalPenalties",
  comment: "Does the armor have additional penalties (MOV -1, INI -1)?",
  type: () => DB.Boolean(),
})

const HitZone = DB.Enum(import.meta.url, {
  name: "HitZone",
  comment: "Specify if armor is only available for a specific hit zone.",
  values: () => ({
    Head: DB.EnumCase({ type: DB.IncludeIdentifier(HeadHitZone) }),
    Torso: DB.EnumCase({ type: null }),
    Arms: DB.EnumCase({ type: null }),
    Legs: DB.EnumCase({ type: null }),
  }),
})

const HeadHitZone = DB.TypeAlias(import.meta.url, {
  name: "HeadHitZone",
  type: () =>
    DB.Object({
      combination_possibilities: DB.Optional({
        comment:
          "In some cases, multiple armors for the same hit zone can be combined. They're listed at the item that can be combined with others.",
        type: DB.IncludeIdentifier(HeadHitZoneCombinationPossibilities),
      }),
    }),
})

const HeadHitZoneCombinationPossibilities = DB.TypeAlias(import.meta.url, {
  name: "HeadHitZoneCombinationPossibilities",
  type: () =>
    DB.Object({
      armors: DB.Required({
        comment: "A list of armors that can be combined with this armor.",
        type: DB.Array(ArmorIdentifier(), { minItems: 1, uniqueItems: true }),
      }),
      protection: DB.Optional({
        comment:
          "The PRO value that is added to the PRO value of the other armor instead of adding the normale PRO value.",
        type: DB.Integer({ minimum: 0 }),
      }),
    }),
})
