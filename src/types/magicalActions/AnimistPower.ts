import * as DB from "tsondb/schema/dsl"
import { name_in_library } from "../_Activatable.js"
import { OldParameter } from "../_ActivatableSkill.js"
import { CheckResultBasedDuration, DurationUnitValue } from "../_ActivatableSkillDuration.js"
import { ActivatableSkillEffect } from "../_ActivatableSkillEffect.js"
import { AffectedTargetCategories } from "../_ActivatableSkillTargetCategory.ts"
import { PropertyIdentifier, TribeIdentifier } from "../_Identifier.js"
import { ImprovementCost } from "../_ImprovementCost.js"
import { AnimistPowerPrerequisites } from "../_Prerequisite.js"
import { ResponsiveTextOptional } from "../_ResponsiveText.js"
import { SkillCheck, SkillCheckPenalty } from "../_SkillCheck.js"
import { NestedTranslationMap } from "../Locale.js"
import { Errata } from "../source/_Erratum.js"
import { PublicationRefs, src } from "../source/_PublicationRef.js"

export const AnimistPower = DB.Entity(import.meta.url, {
  name: "AnimistPower",
  namePlural: "AnimistPowers",
  type: () =>
    DB.Object({
      check: DB.Required({
        comment: "Lists the linked three attributes used to make a skill check.",
        type: DB.IncludeIdentifier(SkillCheck),
      }),
      check_penalty: DB.Optional({
        comment: "In some cases, the target's Spirit or Toughness is applied as a penalty.",
        type: DB.IncludeIdentifier(SkillCheckPenalty),
      }),
      parameters: DB.Required({
        comment: "Measurable parameters of an animist power.",
        type: DB.IncludeIdentifier(AnimistPowerPerformanceParameters),
      }),
      target: DB.Optional({
        comment: "The target category – the kind of creature or object – the skill affects.",
        type: DB.IncludeIdentifier(AffectedTargetCategories),
      }),
      property: DB.Required({
        comment: "The associated property.",
        type: PropertyIdentifier(),
      }),
      tribe_tradition: DB.Required({
        comment: `The tribe traditions the animist power is available to. It may be available to all or only specific tribes.

If no tribe tradition is given, the animist power is generally available to all tribe traditions.`,
        type: DB.Array(TribeIdentifier(), { uniqueItems: true }),
      }),
      improvement_cost: DB.Required({
        comment: "States which column is used to improve the skill.",
        type: DB.IncludeIdentifier(AnimistPowerImprovementCost),
      }),
      prerequisites: DB.Optional({
        comment: "The prerequisites for the animist power.",
        type: DB.IncludeIdentifier(AnimistPowerPrerequisites),
      }),
      levels: DB.Optional({
        comment:
          "The animist power can have multiple levels. Each level is skilled separately. A previous level must be on at least 10 so that the next higher level can be activated and skilled. A higher level cannot be skilled higher than a lower level. Each level also adds an effect text to the text of the first level.",
        type: DB.Array(DB.IncludeIdentifier(AnimistPowerLevel), { minItems: 1 }),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "AnimistPower",
        DB.Object({
          name: DB.Required({
            comment: "The animist power’s name.",
            type: DB.String({ minLength: 1 }),
          }),
          name_in_library,
          effect: DB.Required({
            comment:
              "The effect description may be either a plain text or a text that is divided by a list of effects for each quality level. It may also be a list for each two quality levels.",
            type: DB.IncludeIdentifier(ActivatableSkillEffect),
          }),
          cost: DB.Optional({
            isDeprecated: true,
            type: DB.IncludeIdentifier(OldParameter),
          }),
          duration: DB.Optional({
            isDeprecated: true,
            type: DB.IncludeIdentifier(OldParameter),
          }),
          prerequisites: DB.Optional({
            isDeprecated: true,
            type: DB.String({ minLength: 1 }),
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

const AnimistPowerLevel = DB.TypeAlias(import.meta.url, {
  name: "AnimistPowerLevel",
  type: () =>
    DB.Object({
      level: DB.Required({
        comment: "The level number.",
        type: DB.Integer({ minimum: 2 }),
      }),
      src: DB.Optional({
        comment: "The source references, if different than the references for level 1.",
        type: DB.IncludeIdentifier(PublicationRefs),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "AnimistPowerLevel",
        DB.Object({
          effect: DB.Required({
            comment: "An additional effect description for this level.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
        }),
      ),
    }),
})

const AnimistPowerPerformanceParameters = DB.Enum(import.meta.url, {
  name: "AnimistPowerPerformanceParameters",
  comment: "Measurable parameters of an animist power.",
  values: () => ({
    OneTime: DB.EnumCase({ type: DB.IncludeIdentifier(OneTimeAnimistPowerPerformanceParameters) }),
    Sustained: DB.EnumCase({
      type: DB.IncludeIdentifier(SustainedAnimistPowerPerformanceParameters),
    }),
  }),
})

const OneTimeAnimistPowerPerformanceParameters = DB.TypeAlias(import.meta.url, {
  name: "OneTimeAnimistPowerPerformanceParameters",
  type: () =>
    DB.Object({
      cost: DB.Required({
        comment:
          "The AE cost value, either a flat value or defined dynamically by the primary patron.",
        type: DB.IncludeIdentifier(OneTimeAnimistPowerCost),
      }),
      duration: DB.Required({
        comment: "The duration.",
        type: DB.IncludeIdentifier(OneTimeAnimistPowerDuration),
      }),
    }),
})

const OneTimeAnimistPowerCost = DB.Enum(import.meta.url, {
  name: "OneTimeAnimistPowerCost",
  values: () => ({
    Fixed: DB.EnumCase({ type: DB.IncludeIdentifier(FixedOneTimeAnimistPowerCost) }),
    ByPrimaryPatron: DB.EnumCase({ type: DB.IncludeIdentifier(AnimistPowerCostByPrimaryPatron) }),
  }),
})

const FixedOneTimeAnimistPowerCost = DB.TypeAlias(import.meta.url, {
  name: "FixedOneTimeAnimistPowerCost",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The (temporary) AE cost value.",
        type: DB.Integer({ minimum: 1 }),
      }),
      interval: DB.Optional({
        comment: "If defined, the AE cost has to be paid each interval.",
        type: DB.IncludeIdentifier(DurationUnitValue),
      }),
    }),
})

const AnimistPowerCostByPrimaryPatron = DB.TypeAlias(import.meta.url, {
  name: "AnimistPowerCostByPrimaryPatron",
  type: () =>
    DB.Object({
      interval: DB.Optional({
        comment: "If defined, half of the AE cost `value` has to be paid each interval.",
        type: DB.IncludeIdentifier(DurationUnitValue),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "AnimistPowerCostByPrimaryPatron",
        DB.Object({
          note: DB.Required({
            comment: "A note, appended to the generated string in parenthesis.",
            type: DB.IncludeIdentifier(ResponsiveTextOptional),
          }),
        }),
      ),
    }),
})

const OneTimeAnimistPowerDuration = DB.Enum(import.meta.url, {
  name: "OneTimeAnimistPowerDuration",
  values: () => ({
    Immediate: DB.EnumCase({ type: null }),
    Fixed: DB.EnumCase({ type: DB.IncludeIdentifier(DurationUnitValue) }),
    CheckResultBased: DB.EnumCase({ type: DB.IncludeIdentifier(CheckResultBasedDuration) }),
  }),
})

const SustainedAnimistPowerPerformanceParameters = DB.TypeAlias(import.meta.url, {
  name: "SustainedAnimistPowerPerformanceParameters",
  type: () =>
    DB.Object({
      cost: DB.Required({
        comment:
          "The AE cost value, either a flat value or defined dynamically by the primary patron.",
        type: DB.IncludeIdentifier(SustainedAnimistPowerCost),
      }),
    }),
})

const SustainedAnimistPowerCost = DB.Enum(import.meta.url, {
  name: "SustainedAnimistPowerCost",
  values: () => ({
    Fixed: DB.EnumCase({ type: DB.IncludeIdentifier(FixedSustainedAnimistPowerCost) }),
    ByPrimaryPatron: DB.EnumCase({ type: DB.IncludeIdentifier(AnimistPowerCostByPrimaryPatron) }),
  }),
})

const FixedSustainedAnimistPowerCost = DB.TypeAlias(import.meta.url, {
  name: "FixedSustainedAnimistPowerCost",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The (temporary) AE cost value.",
        type: DB.Integer({ minimum: 1 }),
      }),
      interval: DB.Required({
        comment: "Half of the AE cost `value` has to be paid each interval.",
        type: DB.IncludeIdentifier(DurationUnitValue),
      }),
    }),
})

const AnimistPowerImprovementCost = DB.Enum(import.meta.url, {
  name: "AnimistPowerImprovementCost",
  values: () => ({
    Fixed: DB.EnumCase({ type: DB.IncludeIdentifier(ImprovementCost) }),
    ByPrimaryPatron: DB.EnumCase({ type: null }),
  }),
})
