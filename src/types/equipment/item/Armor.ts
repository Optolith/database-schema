import * as DB from "tsondb/schema/dsl"
import { ArmorIdentifier, ArmorTypeIdentifier } from "../../_Identifier.js"
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
      armor_type: DB.Required({
        comment: "The armor type..",
        type: ArmorTypeIdentifier(),
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
      armor_type: DB.Required({
        comment: "The armor type..",
        type: ArmorTypeIdentifier(),
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
