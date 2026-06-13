import * as DB from "tsondb/schema/dsl"
import { OldParameter } from "../_ActivatableSkill.js"
import { ExpressionBasedDuration } from "../_ActivatableSkillDuration.js"
import { ActivatableSkillEffect } from "../_ActivatableSkillEffect.js"
import { AffectedTargetCategories } from "../_ActivatableSkillTargetCategory.js"
import { PropertyIdentifier } from "../_Identifier.js"
import { ImprovementCost } from "../_ImprovementCost.js"
import { SkillCheck, SkillCheckPenalty } from "../_SkillCheck.js"
import { NestedTranslationMap } from "../Locale.js"
import { Errata } from "../source/_Erratum.js"
import { src } from "../source/_PublicationRef.js"

export const JesterTrick = DB.Entity(import.meta.url, {
  name: "JesterTrick",
  namePlural: "JesterTricks",
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
        comment: "Measurable parameters of a jester trick.",
        type: DB.IncludeIdentifier(JesterTrickPerformanceParameters),
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
        "JesterTrick",
        DB.Object({
          name: DB.Required({
            comment: "The jester trick’s name.",
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

export const JesterTrickPerformanceParameters = DB.TypeAlias(import.meta.url, {
  name: "JesterTrickPerformanceParameters",
  comment: "Measurable parameters of a jester trick.",
  type: () =>
    DB.Object({
      casting_time: DB.Required({
        comment: "The casting time.",
        type: DB.IncludeIdentifier(JesterTrickCastingTime),
      }),
      cost: DB.Required({
        comment: "The AE cost.",
        type: DB.IncludeIdentifier(JesterTrickCost),
      }),
      range: DB.Required({
        comment: "The range.",
        type: DB.IncludeIdentifier(JesterTrickRange),
      }),
      duration: DB.Required({
        comment: "The duration.",
        type: DB.IncludeIdentifier(JesterTrickDuration),
      }),
    }),
})

export const JesterTrickCastingTime = DB.TypeAlias(import.meta.url, {
  name: "JesterTrickCastingTime",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The casting time in actions.",
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})

export const JesterTrickCost = DB.TypeAlias(import.meta.url, {
  name: "JesterTrickCost",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The AE cost value.",
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})

const JesterTrickRange = DB.Enum(import.meta.url, {
  name: "JesterTrickRange",
  values: () => ({
    Touch: DB.EnumCase({ type: null }),
    Self: DB.EnumCase({ type: null }),
    Fixed: DB.EnumCase({ type: DB.IncludeIdentifier(FixedJesterTrickRange) }),
  }),
})

export const FixedJesterTrickRange = DB.TypeAlias(import.meta.url, {
  name: "FixedJesterTrickRange",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The range in steps/m.",
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})

export const JesterTrickDuration = DB.Enum(import.meta.url, {
  name: "JesterTrickDuration",
  values: () => ({
    Immediate: DB.EnumCase({ type: null }),
    Expression: DB.EnumCase({ type: DB.IncludeIdentifier(ExpressionBasedDuration) }),
  }),
})
