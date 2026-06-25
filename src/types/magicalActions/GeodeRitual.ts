import * as DB from "tsondb/schema/dsl"
import { OldParameter } from "../_ActivatableSkill.js"
import { SlowSkillNonModifiableCastingTime } from "../_ActivatableSkillCastingTime.js"
import { OneTimeCostMap } from "../_ActivatableSkillCost.js"
import { ExpressionBasedDuration } from "../_ActivatableSkillDuration.js"
import { ActivatableSkillEffect } from "../_ActivatableSkillEffect.js"
import { AffectedTargetCategories } from "../_ActivatableSkillTargetCategory.js"
import { PropertyIdentifier } from "../_Identifier.js"
import { GeodeRitualPrerequisites } from "../_Prerequisite.js"
import { SkillCheck } from "../_SkillCheck.js"
import { NestedTranslationMap } from "../Locale.js"
import { Errata } from "../source/_Erratum.js"
import { src } from "../source/_PublicationRef.js"

export const GeodeRitual = DB.Entity(import.meta.url, {
  name: "GeodeRitual",
  namePlural: "GeodeRituals",
  type: () =>
    DB.Object({
      check: DB.Required({
        comment: "Lists the linked three attributes used to make a skill check.",
        type: DB.IncludeIdentifier(SkillCheck),
      }),
      parameters: DB.Required({
        comment: "Measurable parameters of a geode ritual.",
        type: DB.IncludeIdentifier(GeodeRitualPerformanceParameters),
      }),
      target: DB.Required({
        comment: "The target category – the kind of creature or object – the skill affects.",
        type: DB.IncludeIdentifier(AffectedTargetCategories),
      }),
      property: DB.Required({
        comment: "The associated property.",
        type: PropertyIdentifier(),
      }),
      prerequisites: DB.Optional({
        comment: "The prerequisites for the geode ritual.",
        type: DB.IncludeIdentifier(GeodeRitualPrerequisites),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "GeodeRitual",
        DB.Object({
          name: DB.Required({
            comment: "The geode ritual’s name.",
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

const GeodeRitualPerformanceParameters = DB.TypeAlias(import.meta.url, {
  name: "GeodeRitualPerformanceParameters",
  comment: "Measurable parameters of a geode ritual.",
  type: () =>
    DB.Object({
      casting_time: DB.Required({
        comment: "The casting time.",
        type: DB.IncludeIdentifier(SlowSkillNonModifiableCastingTime),
      }),
      cost: DB.Required({
        comment: "The AE cost.",
        type: DB.IncludeIdentifier(GeodeRitualCost),
      }),
      range: DB.Required({
        comment: "The range.",
        type: DB.IncludeIdentifier(GeodeRitualRange),
      }),
      duration: DB.Required({
        comment: "The duration.",
        type: DB.IncludeIdentifier(GeodeRitualDuration),
      }),
    }),
})

const GeodeRitualCost = DB.Enum(import.meta.url, {
  name: "GeodeRitualCost",
  values: () => ({
    Fixed: DB.EnumCase({ type: DB.IncludeIdentifier(FixedGeodeRitualCost) }),
    Map: DB.EnumCase({ type: DB.IncludeIdentifier(OneTimeCostMap) }),
  }),
})

const FixedGeodeRitualCost = DB.TypeAlias(import.meta.url, {
  name: "FixedGeodeRitualCost",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The AE cost value.",
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})

const GeodeRitualRange = DB.Enum(import.meta.url, {
  name: "GeodeRitualRange",
  values: () => ({
    Self: DB.EnumCase({ type: null }),
    Fixed: DB.EnumCase({ type: DB.IncludeIdentifier(FixedGeodeRitualRange) }),
  }),
})

const FixedGeodeRitualRange = DB.TypeAlias(import.meta.url, {
  name: "FixedGeodeRitualRange",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The range in steps/m.",
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})

const GeodeRitualDuration = DB.Enum(import.meta.url, {
  name: "GeodeRitualDuration",
  values: () => ({
    Immediate: DB.EnumCase({ type: null }),
    Expression: DB.EnumCase({ type: DB.IncludeIdentifier(ExpressionBasedDuration) }),
  }),
})
