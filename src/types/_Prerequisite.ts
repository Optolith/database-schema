/**
 * @title Prerequisites
 */

import * as DB from "tsondb/schema/dsl"
import { NestedTranslationMap } from "./Locale.js"
import { DisplayOption } from "./prerequisites/DisplayOption.js"
import {
  AdvantageDisadvantagePrerequisiteGroup,
  AnimistPowerPrerequisiteGroup,
  ArcaneTraditionPrerequisiteGroup,
  DerivedCharacteristicPrerequisiteGroup,
  EnhancementPrerequisiteGroup,
  GeneralPrerequisiteGroup,
  GeodeRitualPrerequisiteGroup,
  InfluencePrerequisiteGroup,
  LanguagePrerequisiteGroup,
  LiturgyPrerequisiteGroup,
  PersonalityTraitPrerequisiteGroup,
  ProfessionPrerequisiteGroup,
  PublicationPrerequisiteGroup,
  RulePrerequisiteGroup,
  SpellworkPrerequisiteGroup,
  TribePrerequisiteGroup,
  LinguisticPrerequisiteGroup,
} from "./prerequisites/PrerequisiteGroups.js"

const PrerequisiteGroup = DB.GenTypeAlias(import.meta.url, {
  name: "PrerequisiteGroup",
  comment:
    "A prerequisite group has no influence on validation logic. It serves as a single unit for displaying purposes, where the source uses a prerequisites item that cannot be represented as a single prerequisite.",
  parameters: [DB.Param("T")],
  type: T =>
    DB.Object({
      list: DB.Required({
        type: DB.Array(DB.TypeArgument(T), { minItems: 2 }),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "PrerequisiteGroup",
        DB.Object({
          text: DB.Required({
            type: DB.String({ minLength: 1 }),
          }),
        }),
      ),
    }),
})

const PrerequisitesDisjunction = DB.GenTypeAlias(import.meta.url, {
  name: "PrerequisitesDisjunction",
  parameters: [DB.Param("T")],
  type: T =>
    DB.Object({
      list: DB.Required({
        type: DB.Array(DB.TypeArgument(T), { minItems: 2 }),
      }),
      display_option: DB.Optional({
        type: DB.IncludeIdentifier(DisplayOption),
      }),
    }),
})

const PrerequisitesElement = DB.GenEnum(import.meta.url, {
  name: "PrerequisitesElement",
  parameters: [DB.Param("T")],
  values: T => ({
    Single: DB.EnumCase({ type: DB.TypeArgument(T) }),
    Disjunction: DB.EnumCase({
      type: DB.GenIncludeIdentifier(PrerequisitesDisjunction, [DB.TypeArgument(T)]),
    }),
    Group: DB.EnumCase({
      type: DB.GenIncludeIdentifier(PrerequisiteGroup, [DB.TypeArgument(T)]),
    }),
  }),
})

const PlainPrerequisites = DB.GenTypeAlias(import.meta.url, {
  name: "PlainPrerequisites",
  parameters: [DB.Param("T")],
  type: T =>
    DB.Array(DB.GenIncludeIdentifier(PrerequisitesElement, [DB.TypeArgument(T)]), { minItems: 1 }),
})

const PrerequisiteForLevel = DB.GenTypeAlias(import.meta.url, {
  name: "PrerequisiteForLevel",
  parameters: [DB.Param("T")],
  type: T =>
    DB.Object({
      level: DB.Required({
        comment: "The level to which the prerequisite applies.",
        type: DB.Integer({ minimum: 1 }),
      }),
      prerequisite: DB.Required({
        comment: "The prerequisite.",
        type: DB.GenIncludeIdentifier(PrerequisitesElement, [DB.TypeArgument(T)]),
      }),
    }),
})

const PrerequisitesForLevels = DB.GenTypeAlias(import.meta.url, {
  name: "PrerequisitesForLevels",
  parameters: [DB.Param("T")],
  type: T =>
    DB.Array(DB.GenIncludeIdentifier(PrerequisiteForLevel, [DB.TypeArgument(T)]), {
      minItems: 1,
    }),
})

export const RulePrerequisites = DB.TypeAlias(import.meta.url, {
  name: "RulePrerequisites",
  type: () =>
    DB.GenIncludeIdentifier(PlainPrerequisites, [DB.IncludeIdentifier(RulePrerequisiteGroup)]),
})

export const DerivedCharacteristicPrerequisites = DB.TypeAlias(import.meta.url, {
  name: "DerivedCharacteristicPrerequisites",
  type: () =>
    DB.GenIncludeIdentifier(PlainPrerequisites, [
      DB.IncludeIdentifier(DerivedCharacteristicPrerequisiteGroup),
    ]),
})

export const PublicationPrerequisites = DB.TypeAlias(import.meta.url, {
  name: "PublicationPrerequisites",
  type: () =>
    DB.GenIncludeIdentifier(PlainPrerequisites, [
      DB.IncludeIdentifier(PublicationPrerequisiteGroup),
    ]),
})

export const PlainGeneralPrerequisites = DB.TypeAlias(import.meta.url, {
  name: "PlainGeneralPrerequisites",
  type: () =>
    DB.GenIncludeIdentifier(PlainPrerequisites, [DB.IncludeIdentifier(GeneralPrerequisiteGroup)]),
})

export const GeneralPrerequisites = DB.TypeAlias(import.meta.url, {
  name: "GeneralPrerequisites",
  type: () =>
    DB.GenIncludeIdentifier(PrerequisitesForLevels, [
      DB.IncludeIdentifier(GeneralPrerequisiteGroup),
    ]),
})

export const ProfessionPrerequisites = DB.TypeAlias(import.meta.url, {
  name: "ProfessionPrerequisites",
  type: () =>
    DB.GenIncludeIdentifier(PlainPrerequisites, [
      DB.IncludeIdentifier(ProfessionPrerequisiteGroup),
    ]),
})

export const AdvantageDisadvantagePrerequisites = DB.TypeAlias(import.meta.url, {
  name: "AdvantageDisadvantagePrerequisites",
  type: () =>
    DB.GenIncludeIdentifier(PrerequisitesForLevels, [
      DB.IncludeIdentifier(AdvantageDisadvantagePrerequisiteGroup),
    ]),
})

export const ArcaneTraditionPrerequisites = DB.TypeAlias(import.meta.url, {
  name: "ArcaneTraditionPrerequisites",
  type: () =>
    DB.GenIncludeIdentifier(PlainPrerequisites, [
      DB.IncludeIdentifier(ArcaneTraditionPrerequisiteGroup),
    ]),
})

export const PersonalityTraitPrerequisites = DB.TypeAlias(import.meta.url, {
  name: "PersonalityTraitPrerequisites",
  type: () =>
    DB.GenIncludeIdentifier(PlainPrerequisites, [
      DB.IncludeIdentifier(PersonalityTraitPrerequisiteGroup),
    ]),
})

export const SpellworkPrerequisites = DB.TypeAlias(import.meta.url, {
  name: "SpellworkPrerequisites",
  type: () =>
    DB.GenIncludeIdentifier(PlainPrerequisites, [DB.IncludeIdentifier(SpellworkPrerequisiteGroup)]),
})

export const LiturgyPrerequisites = DB.TypeAlias(import.meta.url, {
  name: "LiturgyPrerequisites",
  type: () =>
    DB.GenIncludeIdentifier(PlainPrerequisites, [DB.IncludeIdentifier(LiturgyPrerequisiteGroup)]),
})

export const InfluencePrerequisites = DB.TypeAlias(import.meta.url, {
  name: "InfluencePrerequisites",
  type: () =>
    DB.GenIncludeIdentifier(PlainPrerequisites, [DB.IncludeIdentifier(InfluencePrerequisiteGroup)]),
})

export const LanguagePrerequisites = DB.TypeAlias(import.meta.url, {
  name: "LanguagePrerequisites",
  type: () =>
    DB.GenIncludeIdentifier(PrerequisitesForLevels, [
      DB.IncludeIdentifier(LanguagePrerequisiteGroup),
    ]),
})

export const AnimistPowerPrerequisites = DB.TypeAlias(import.meta.url, {
  name: "AnimistPowerPrerequisites",
  type: () =>
    DB.GenIncludeIdentifier(PlainPrerequisites, [
      DB.IncludeIdentifier(AnimistPowerPrerequisiteGroup),
    ]),
})

export const TribePrerequisites = DB.TypeAlias(import.meta.url, {
  name: "TribePrerequisites",
  type: () =>
    DB.GenIncludeIdentifier(PlainPrerequisites, [DB.IncludeIdentifier(TribePrerequisiteGroup)]),
})

export const GeodeRitualPrerequisites = DB.TypeAlias(import.meta.url, {
  name: "GeodeRitualPrerequisites",
  type: () =>
    DB.GenIncludeIdentifier(PlainPrerequisites, [
      DB.IncludeIdentifier(GeodeRitualPrerequisiteGroup),
    ]),
})

export const EnhancementPrerequisites = DB.TypeAlias(import.meta.url, {
  name: "EnhancementPrerequisites",
  type: () =>
    DB.GenIncludeIdentifier(PlainPrerequisites, [
      DB.IncludeIdentifier(EnhancementPrerequisiteGroup),
    ]),
})

export const LinguisticPrerequisites = DB.TypeAlias(import.meta.url, {
  name: "BookLinguisticPrerequisites",
  type: () =>
    DB.GenIncludeIdentifier(PlainPrerequisites, [
      DB.IncludeIdentifier(LinguisticPrerequisiteGroup),
    ]),
})
