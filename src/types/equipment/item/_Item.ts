import * as DB from "tsondb/schema/dsl"
import type { CombatUse as CombatUseType } from "../../../../gen/types.js"
import {
  BlessedTraditionIdentifier,
  CultureIdentifier,
  MagicalTraditionIdentifier,
  ProfessionIdentifier,
  RaceIdentifier,
} from "../../_Identifier.js"
import { ResponsiveTextOptional, ResponsiveTextReplace } from "../../_ResponsiveText.ts"
import { NestedTranslationMap } from "../../Locale.js"
import { Errata } from "../../source/_Erratum.js"
import { src } from "../../source/_PublicationRef.js"
import { checkWeaponCombatTechniqueIntegrity } from "./_Weapon.js"
import { SecondaryArmor } from "./Armor.js"
import { ImprovisedWeapon } from "./Weapon.js"

const COMBAT_USE = "combat_use"

export const DefaultItem = (sourceUrl: string, singularName: string, pluralName?: string) =>
  DB.Entity(sourceUrl, {
    name: singularName,
    namePlural: pluralName ?? `${singularName}s`,
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
        structure_points: DB.Required({
          comment:
            "The structure points of the item. Use an array if the item consists of multiple components that have individual structure points.",
          type: DB.IncludeIdentifier(StructurePoints),
        }),
        [COMBAT_USE]: DB.Optional({
          comment:
            "The item can also be used either as an improvised weapon or as an armor, although this is not the primary use case of the item.",
          type: DB.IncludeIdentifier(CombatUse),
        }),
        src,
        translations: DefaultItemTranslations(singularName),
      }),
    instanceDisplayName: {},
    uniqueConstraints: [
      {
        entityMapKeyPath: "translations",
        keyPathInEntityMap: "name",
      },
    ],
    customConstraints: ({ instanceContent, ...rest }) => {
      const combatUse = (
        instanceContent as {
          [K in typeof COMBAT_USE]?: CombatUseType
        }
      ).combat_use

      if (combatUse && combatUse.kind === "Weapon") {
        return checkWeaponCombatTechniqueIntegrity(
          {
            ...rest,
            instanceContent: combatUse.Weapon,
          },
          { secondary: true },
        )
      }

      return []
    },
  })

export const DefaultItemTranslations = (singularName: string) =>
  NestedTranslationMap(
    DB.Required,
    singularName,
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
      errata: DB.Optional({
        type: DB.IncludeIdentifier(Errata),
      }),
    }),
  )

export const CombatUse = DB.Enum(import.meta.url, {
  name: "CombatUse",
  comment:
    "The item can also be used either as an improvised weapon or as an armor, although this is not the primary use case of the item.",
  values: () => ({
    Weapon: DB.EnumCase({ type: DB.IncludeIdentifier(ImprovisedWeapon) }),
    Armor: DB.EnumCase({ type: DB.IncludeIdentifier(SecondaryArmor) }),
  }),
})

export const StructurePoints = DB.TypeAlias(import.meta.url, {
  name: "StructurePoints",
  comment:
    "The structure points of the item. Use an array if the item consists of multiple components that have individual structure points.",
  type: () => DB.Array(DB.IncludeIdentifier(StructurePointsComponent), { minItems: 1 }),
})

const StructurePointsComponent = DB.TypeAlias(import.meta.url, {
  name: "StructurePointsComponent",
  type: () =>
    DB.Object({
      points: DB.Required({
        comment: "The structure points.",
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})

export const Cost = DB.Enum(import.meta.url, {
  name: "Cost",
  comment: "The cost in silverthalers.",
  values: () => ({
    Free: DB.EnumCase({ type: null }),
    Various: DB.EnumCase({ type: null }),
    Invaluable: DB.EnumCase({ type: null }),
    Fixed: DB.EnumCase({ type: DB.IncludeIdentifier(FixedCost) }),
    Range: DB.EnumCase({ type: DB.IncludeIdentifier(CostRange) }),
  }),
})

const wrap_in_text = DB.Required({
  comment: "The cost get wrapped by this text using a placeholder in the text.",
  type: DB.String({ minLength: 1, pattern: /\{0\}/ }),
})

export const FixedCost = DB.TypeAlias(import.meta.url, {
  name: "FixedCost",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The cost in silverthalers.",
        type: DB.Float({ minimum: { value: 0, isExclusive: true } }),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "FixedCost",
        DB.Object({
          wrap_in_text,
        }),
      ),
    }),
})

const CostRange = DB.TypeAlias(import.meta.url, {
  name: "CostRange",
  type: () =>
    DB.Object({
      from: DB.Required({
        comment: "The lower bound of the cost in silverthalers.",
        type: DB.Float({ minimum: { value: 0, isExclusive: true } }),
      }),
      to: DB.Required({
        comment: "The upper bound of the cost in silverthalers.",
        type: DB.Float({ minimum: { value: 0, isExclusive: true } }),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "CostRange",
        DB.Object({
          wrap_in_text,
        }),
      ),
    }),
})

export const Weight = DB.TypeAlias(import.meta.url, {
  name: "Weight",
  comment: "The weight in kg.",
  type: () => DB.Float({ minimum: { value: 0, isExclusive: true }, fractionDigits: 3 }),
})

export const Complexity = DB.Enum(import.meta.url, {
  name: "Complexity",
  comment: "The complexity of crafting the item.",
  values: () => ({
    Primitive: DB.EnumCase({ type: null }),
    Simple: DB.EnumCase({ type: null }),
    Complex: DB.EnumCase({ type: DB.IncludeIdentifier(ComplexComplexity) }),
  }),
})

export const ComplexComplexity = DB.TypeAlias(import.meta.url, {
  name: "ComplexComplexity",
  type: () =>
    DB.Object({
      ap_value: DB.Required({
        comment: "The AP value for the trade secret.",
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})

export const RestrictedTo = DB.TypeAlias(import.meta.url, {
  name: "RestrictedTo",
  comment:
    "If the item is in any case restricted to a subset of characters. The differenciating aspect may be tradition, race, culture, or a profession. Each element must be applicable to a character. ",
  type: () =>
    DB.Object(
      {
        races: DB.Optional({
          comment:
            "The item is restricted to one of a list of races. If only one race is allowed, the list may only have a single element.",
          type: DB.IncludeIdentifier(RestrictedToRaces),
        }),
        cultures: DB.Optional({
          comment:
            "The item is restricted to one of a list of cultures. If only one culture is allowed, the list may only have a single element.",
          type: DB.IncludeIdentifier(RestrictedToCultures),
        }),
        professions: DB.Optional({
          comment:
            "The item is restricted to one of a list of professions. If only one profession is allowed, the list may only have a single element.",
          type: DB.IncludeIdentifier(RestrictedToProfessions),
        }),
        magicalTraditions: DB.Optional({
          comment:
            "The item is restricted to one of a list of magical traditions. If only one magical tradition is allowed, the list may only have a single element.",
          type: DB.IncludeIdentifier(RestrictedToMagicalTraditions),
        }),
        blessedTraditions: DB.Optional({
          comment:
            "The item is restricted to one of a list of blessed traditions. If only one blessed tradition is allowed, the list may only have a single element.",
          type: DB.IncludeIdentifier(RestrictedToBlessedTraditions),
        }),
      },
      { minProperties: 1 },
    ),
})

export const RestrictedToRaces = DB.TypeAlias(import.meta.url, {
  name: "RestrictedToRaces",
  comment:
    "The item is restricted to one of a list of races. If only one race is allowed, the list may only have a single element.",
  type: () =>
    DB.Object({
      scope: DB.Required({
        comment:
          "The item is restricted to one of a list of races. If only one race is allowed, the list may only have a single element.",
        type: DB.Array(RaceIdentifier(), { minItems: 1, uniqueItems: true }),
      }),
    }),
})

export const RestrictedToCultures = DB.TypeAlias(import.meta.url, {
  name: "RestrictedToCultures",
  comment:
    "The item is restricted to one of a list of cultures. If only one culture is allowed, the list may only have a single element.",
  type: () =>
    DB.Object({
      scope: DB.Required({
        comment:
          "The item is restricted to one of a list of cultures. If only one culture is allowed, the list may only have a single element.",
        type: DB.Array(CultureIdentifier(), { minItems: 1, uniqueItems: true }),
      }),
    }),
})

export const RestrictedToProfessions = DB.TypeAlias(import.meta.url, {
  name: "RestrictedToProfessions",
  comment:
    "The item is restricted to one of a list of professions. If only one profession is allowed, the list may only have a single element.",
  type: () =>
    DB.Object({
      scope: DB.Required({
        comment:
          "The item is restricted to one of a list of professions. If only one profession is allowed, the list may only have a single element.",
        type: DB.Array(ProfessionIdentifier(), { minItems: 1, uniqueItems: true }),
      }),
    }),
})

export const RestrictedToMagicalTraditions = DB.TypeAlias(import.meta.url, {
  name: "RestrictedToMagicalTraditions",
  comment:
    "The item is restricted to one of a list of magical traditions. If only one magical tradition is allowed, the list may only have a single element.",
  type: () =>
    DB.Object({
      scope: DB.Required({
        comment:
          "The item is restricted to one of a list of magical traditions. If only one magical tradition is allowed, the list may only have a single element.",
        type: DB.Array(MagicalTraditionIdentifier(), { minItems: 1, uniqueItems: true }),
      }),
    }),
})

export const RestrictedToBlessedTraditions = DB.TypeAlias(import.meta.url, {
  name: "RestrictedToBlessedTraditions",
  comment:
    "The item is restricted to one of a list of blessed traditions. If only one blessed tradition is allowed, the list may only have a single element. The item may also be declared as sanctified.",
  type: () =>
    DB.Object({
      scope: DB.Required({
        comment:
          "The item is restricted to one of a list of blessed traditions. If only one blessed tradition is allowed, the list may only have a single element.",
        type: DB.IncludeIdentifier(RestrictedToBlessedTraditionsScope),
      }),
      isSanctifiedBy: DB.Required({
        comment: "The item is sanctified by the applicable listed tradition.",
        type: DB.Boolean(),
      }),
    }),
})

export const RestrictedToBlessedTraditionsScope = DB.Enum(import.meta.url, {
  name: "RestrictedToBlessedTraditionsScope",
  comment:
    "The item is restricted to one of a list of blessed traditions. If only one blessed tradition is allowed, the list may only have a single element. Instead of providing an specific set of traditions, the restriction may also cover a category of blessed traditions.",
  values: () => ({
    Specific: DB.EnumCase({
      type: DB.Array(BlessedTraditionIdentifier(), { minItems: 1, uniqueItems: true }),
    }),
    Church: DB.EnumCase({ type: null }),
    Shamanistic: DB.EnumCase({ type: null }),
  }),
})

export const KnownItemSpecifics = DB.TypeAlias(import.meta.url, {
  name: "KnownItemSpecifics",
  type: () =>
    DB.Object({
      age: DB.Optional({
        comment: "The age of the item is known.",
        type: DB.IncludeIdentifier(KnownItemAge),
      }),
      condition: DB.Optional({
        comment: "The condition of the item is known and well specified.",
        type: DB.IncludeIdentifier(KnownItemCondition),
      }),
      stabilityRating: DB.Optional({
        comment:
          "The breaking point rating (weapon) or sturdiness rating (armor) of the item. Either a specific rating or a general unbreakability.",
        type: DB.IncludeIdentifier(KnownItemStabilityRating),
      }),
      damageLevel: DB.Optional({
        comment: "The *Damaged* (weapon) or *Wear* (armor) level of the item, if any.",
        type: DB.Integer({ minimum: 1, maximum: 4 }),
      }),
      collectorsValue: DB.Required({
        comment: "The collector’s value of the known item.",
        type: DB.IncludeIdentifier(CollectorsValue),
      }),
    }),
})

export const KnownItemSpecificsTranslation = DB.TypeAlias(import.meta.url, {
  name: "KnownItemSpecificsTranslation",
  type: () =>
    DB.Object({
      condition: DB.Required({
        comment: "The condition of the item.",
        type: DB.String({ minLength: 1, markdown: "inline" }),
      }),
    }),
})

const KnownItemAge = DB.Enum(import.meta.url, {
  name: "KnownItemAge",
  comment: "The age of the item is known.",
  values: () => ({
    Antique: DB.EnumCase({ type: null }),
    Old: DB.EnumCase({ type: null }),
  }),
})

const KnownItemCondition = DB.Enum(import.meta.url, {
  name: "KnownItemCondition",
  comment: "The condition of the item is known and well specified.",
  values: () => ({
    Broken: DB.EnumCase({ type: null }),
    Poor: DB.EnumCase({ type: null }),
    Good: DB.EnumCase({ type: null }),
    VeryGood: DB.EnumCase({ type: null }),
    AsNew: DB.EnumCase({ type: null }),
  }),
})

const KnownItemStabilityRating = DB.Enum(import.meta.url, {
  name: "KnownItemStabilityRating",
  comment: "Either a specific rating or a general unbreakability.",
  values: () => ({
    Constant: DB.EnumCase({ type: DB.Integer({ minimum: 1 }) }),
    Unbreakable: DB.EnumCase({ type: null }),
  }),
})

const CollectorsValue = DB.Enum(import.meta.url, {
  name: "CollectorsValue",
  comment: "The item has a collector’s value.",
  values: () => ({
    Constant: DB.EnumCase({
      comment: "The collector’s value is a fixed price in silverthalers.",
      type: DB.IncludeIdentifier(ConstantCollectorsValue),
    }),
    Minimum: DB.EnumCase({
      comment:
        "The collector’s value is a range with an open end and the specified price in silverthalers as the minimum.",
      type: DB.IncludeIdentifier(MinimumCollectorsValue),
    }),
    Invaluable: DB.EnumCase({
      comment: "The item is invaluable to collectors.",
      type: null,
    }),
  }),
})

const ConstantCollectorsValue = DB.TypeAlias(import.meta.url, {
  name: "ConstantCollectorsValue",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The collector’s value is a fixed price in silverthalers.",
        type: DB.Float({ minimum: { value: 0, isExclusive: true } }),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "ConstantCollectorsValue",
        DB.Object(
          {
            note: DB.Optional({
              comment: "A note, appended to the generated string in parenthesis.",
              type: DB.IncludeIdentifier(ResponsiveTextOptional),
            }),
            replacement: DB.Optional({
              comment: "A replacement string.",
              type: DB.IncludeIdentifier(ResponsiveTextReplace),
            }),
          },
          { minProperties: 1 },
        ),
      ),
    }),
})

const MinimumCollectorsValue = DB.TypeAlias(import.meta.url, {
  name: "MinimumCollectorsValue",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment:
          "The collector’s value is a range with an open end and the specified price in silverthalers as the minimum.",
        type: DB.Float({ minimum: { value: 0, isExclusive: true } }),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "MinimumCollectorsValue",
        DB.Object(
          {
            note: DB.Optional({
              comment: "A note, appended to the generated string in parenthesis.",
              type: DB.IncludeIdentifier(ResponsiveTextOptional),
            }),
            replacement: DB.Optional({
              comment: "A replacement string.",
              type: DB.IncludeIdentifier(ResponsiveTextReplace),
            }),
          },
          { minProperties: 1 },
        ),
      ),
    }),
})

/*

Possible known item conditions:
-------------------------------

Die Waffe ist antik, aber gut erhalten.
Der Schild ist antik, aber gut erhalten.
Die Waffe ist antik, aber sehr gut erhalten und sieht aus wie neu.
Die Waffe ist antik, aber sehr gut erhalten.
Die Waffe ist zwar antik, aber sehr gut erhalten.
Die Waffe ist antik und weist einige Scharten in der Klinge auf.
Die Waffe ist antik und zerbrochen.
Die Waffe ist antik, aber neuwertig.
Die Waffe ist alt.
Die Waffe ist alt, aber gut gepflegt.
Der Magierstab ist alt, aber gut gepflegt.
Die Waffen sind alt, aber gut gepflegt.
Die Waffe ist alt, aber neuwertig.
Das Schwert ist alt, aber neuwertig.
Die Waffe ist alt, aber gut erhalten.
Die Waffe ist alt, aber sie wurde vermutlich niemals eingesetzt und ist gut erhalten.
Die Waffe ist alt und in schlechtem Zustand.
Die Waffe ist alt und schlecht gepflegt.
Die Waffe ist alt, aber in gepflegtem Zustand.
Die Waffe ist gebraucht.
Die Waffe ist gebraucht, aber neuwertig.
Die Waffe ist gebraucht, aber unzerbrechlich.
Die Waffe ist gebraucht, aber gepflegt.
Die Rüstung ist gebraucht, aber gut erhalten.
Die Rüstung ist gebraucht und in einem schlechten Zustand.
Die Waffe ist neuwertig.
Die Waffe ist neuwertig und unbenutzt.
*leer*

Wenn er gebunden wird, wird der
Stab wie alle Traditionsartefakte nahezu unzerbrechlich.
Sie weist 1 Stufe Beschädigung auf.
Er weist 1 Stufe Beschädigung auf.
Der Bruchfaktor beträgt 14.
Der Bruchfaktor beträgt 12 und sie weist 3 Stufen Beschädigung auf.
Sie ist unzerbrechlich.
Einzig elementares Feuer, das heißer brennt als ein Drachenodem oder ein IGNIFAXIUS, oder aber das Eingreifen eines Gottes können die Axt zerstören.
Einzig elementares Feuer, das heißer brennt als ein Drachenodem oder ein IGNIFAXIUS, spezielle Zauberei oder das Eingreifen eines Gottes können die Axt zerstören.
Die Waffe war lange Zeit dem Salzwasser der Zyklopensee ausgesetzt, was allerdings bei Weitem nicht so große Schäden angerichtet hat, wie zu erwarten wäre.
Die Waffe kann nicht benutzt werden, bis die geborstene Klinge neu geschmiedet wurde.
Sie weist 3 Stufen Verschleiß auf und ist unbrauchbar, bis sie repariert wurde.

Possible collector's values:
----------------------------

750+ S (nur Personen mit sehr zweifelhaftem Ruf würden eine solche Waffe erwerben)
1.500+ S
2.500 S
500+ S (1.500+ S für ein zusammenpassendes Paar)
unbezahlbar

*/
