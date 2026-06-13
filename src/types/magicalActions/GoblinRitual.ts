import * as DB from "tsondb/schema/dsl"
import { OldParameter } from "../_ActivatableSkill.js"
import { NonModifiableOneTimeCost, NonModifiableSustainedCost } from "../_ActivatableSkillCost.js"
import { ExpressionBasedDuration } from "../_ActivatableSkillDuration.js"
import { ActivatableSkillEffect } from "../_ActivatableSkillEffect.js"
import { ExpressionBasedRange } from "../_ActivatableSkillRange.js"
import { AffectedTargetCategories } from "../_ActivatableSkillTargetCategory.js"
import { PropertyIdentifier } from "../_Identifier.js"
import { ImprovementCost } from "../_ImprovementCost.js"
import { ResponsiveTextOptional, ResponsiveTextReplace } from "../_ResponsiveText.js"
import { SkillCheck, SkillCheckPenalty } from "../_SkillCheck.js"
import { NestedTranslationMap } from "../Locale.js"
import { Errata } from "../source/_Erratum.js"
import { src } from "../source/_PublicationRef.js"

export const GoblinRitual = DB.Entity(import.meta.url, {
  name: "GoblinRitual",
  namePlural: "GoblinRituals",
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
        comment: "Measurable parameters of a goblin ritual.",
        type: DB.IncludeIdentifier(GoblinRitualPerformanceParameters),
      }),
      target: DB.Required({
        comment: "The target category – the kind of creature or object – the skill affects.",
        type: DB.IncludeIdentifier(AffectedTargetCategories),
      }),
      property: DB.Required({
        comment: "The associated property.",
        type: PropertyIdentifier(),
      }),
      improvement_cost: DB.Required({
        comment: "States which column is used to improve the skill.",
        type: DB.IncludeIdentifier(ImprovementCost),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "GoblinRitual",
        DB.Object({
          name: DB.Required({
            comment: "The goblin ritual’s name.",
            type: DB.String({ minLength: 1 }),
          }),
          effect: DB.Required({
            comment:
              "The effect description may be either a plain text or a text that is divided by a list of effects for each quality level. It may also be a list for each two quality levels.",
            type: DB.IncludeIdentifier(ActivatableSkillEffect),
          }),
          casting_time: DB.Optional({
            isDeprecated: true,
            type: DB.IncludeIdentifier(OldParameter),
          }),
          cost: DB.Optional({
            isDeprecated: true,
            type: DB.IncludeIdentifier(OldParameter),
          }),
          range: DB.Optional({
            isDeprecated: true,
            type: DB.IncludeIdentifier(OldParameter),
          }),
          duration: DB.Optional({
            isDeprecated: true,
            type: DB.IncludeIdentifier(OldParameter),
          }),
          target: DB.Optional({
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

const GoblinRitualPerformanceParameters = DB.Enum(import.meta.url, {
  name: "GoblinRitualPerformanceParameters",
  comment: "Measurable parameters of a goblin ritual.",
  values: () => ({
    OneTime: DB.EnumCase({ type: DB.IncludeIdentifier(GoblinRitualOneTimePerformanceParameters) }),
    Sustained: DB.EnumCase({
      type: DB.IncludeIdentifier(GoblinRitualSustainedPerformanceParameters),
    }),
  }),
})

const GoblinRitualSustainedPerformanceParameters = DB.TypeAlias(import.meta.url, {
  name: "GoblinRitualSustainedPerformanceParameters",
  type: () =>
    DB.Object({
      casting_time: DB.Required({
        comment: "The casting time.",
        type: DB.IncludeIdentifier(GoblinRitualCastingTime),
      }),
      cost: DB.Required({
        comment: "The AE cost.",
        type: DB.IncludeIdentifier(GoblinRitualSustainedCost),
      }),
      range: DB.Required({
        comment: "The range.",
        type: DB.IncludeIdentifier(GoblinRitualRange),
      }),
    }),
})

const GoblinRitualOneTimePerformanceParameters = DB.TypeAlias(import.meta.url, {
  name: "GoblinRitualOneTimePerformanceParameters",
  type: () =>
    DB.Object({
      casting_time: DB.Required({
        comment: "The casting time.",
        type: DB.IncludeIdentifier(GoblinRitualCastingTime),
      }),
      cost: DB.Required({
        comment: "The AE cost.",
        type: DB.IncludeIdentifier(GoblinRitualOneTimeCost),
      }),
      range: DB.Required({
        comment: "The range.",
        type: DB.IncludeIdentifier(GoblinRitualRange),
      }),
      duration: DB.Required({
        comment: "The duration.",
        type: DB.IncludeIdentifier(GoblinRitualDuration),
      }),
    }),
})

const GoblinRitualCastingTime = DB.TypeAlias(import.meta.url, {
  name: "GoblinRitualCastingTime",
  type: () =>
    DB.Object({
      value: DB.Required({
        type: DB.Integer({ minimum: 1 }),
      }),
      unit: DB.Required({
        type: DB.IncludeIdentifier(GoblinRitualCastingTimeUnit),
      }),
    }),
})

const GoblinRitualCastingTimeUnit = DB.Enum(import.meta.url, {
  name: "GoblinRitualCastingTimeUnit",
  values: () => ({
    Actions: DB.EnumCase({ type: null }),
    Minutes: DB.EnumCase({ type: null }),
    Hours: DB.EnumCase({ type: null }),
  }),
})

const GoblinRitualOneTimeCost = DB.TypeAlias(import.meta.url, {
  name: "GoblinRitualOneTimeCost",
  type: () => DB.IncludeIdentifier(NonModifiableOneTimeCost),
})

const GoblinRitualSustainedCost = DB.TypeAlias(import.meta.url, {
  name: "GoblinRitualSustainedCost",
  type: () => DB.IncludeIdentifier(NonModifiableSustainedCost),
})

const GoblinRitualRange = DB.TypeAlias(import.meta.url, {
  name: "GoblinRitualRange",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The range value.",
        type: DB.IncludeIdentifier(GoblinRitualRangeValue),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "GoblinRitualRange",
        DB.Object(
          {
            note: DB.Optional({
              comment:
                "A note, appended to the generated string in parenthesis. If the generated is modified using `replacement`, the note is appended to the modifier string.",
              type: DB.IncludeIdentifier(ResponsiveTextOptional),
            }),
            replacement: DB.Optional({
              comment:
                "A replacement string. If `note` is provided, it is appended to the replaced string.",
              type: DB.IncludeIdentifier(ResponsiveTextReplace),
            }),
          },
          { minProperties: 1 },
        ),
      ),
    }),
})

const GoblinRitualRangeValue = DB.Enum(import.meta.url, {
  name: "GoblinRitualRangeValue",
  values: () => ({
    Sight: DB.EnumCase({ type: null }),
    Self: DB.EnumCase({ type: null }),
    Touch: DB.EnumCase({ type: null }),
    Expression: DB.EnumCase({ type: DB.IncludeIdentifier(ExpressionBasedRange) }),
  }),
})

const GoblinRitualDuration = DB.Enum(import.meta.url, {
  name: "GoblinRitualDuration",
  values: () => ({
    Immediate: DB.EnumCase({ type: null }),
    Expression: DB.EnumCase({ type: DB.IncludeIdentifier(ExpressionBasedDuration) }),
  }),
})
