/**
 * @title Activatable Skill
 */

import * as DB from "tsondb/schema/dsl"
import { FastCastingTime, SlowCastingTime } from "./_ActivatableSkillCastingTime.js"
import { OneTimeCost, SustainedCost } from "./_ActivatableSkillCost.js"
import { DurationForOneTime, DurationForSustained } from "./_ActivatableSkillDuration.js"
import { Range } from "./_ActivatableSkillRange.js"
import { MathOperation } from "./_MathExpression.ts"

export const OneTimePerformanceParameters = DB.GenTypeAlias(import.meta.url, {
  name: "OneTimePerformanceParameters",
  parameters: [DB.Param("CastingTime")],
  type: CastingTime =>
    DB.Object({
      casting_time: DB.Required({
        type: DB.TypeArgument(CastingTime),
      }),
      cost: DB.Required({
        type: DB.IncludeIdentifier(OneTimeCost),
      }),
      range: DB.Required({
        type: DB.IncludeIdentifier(Range),
      }),
      duration: DB.Required({
        type: DB.IncludeIdentifier(DurationForOneTime),
      }),
    }),
})

const SustainedPerformanceParameters = DB.GenTypeAlias(import.meta.url, {
  name: "SustainedPerformanceParameters",
  parameters: [DB.Param("CastingTime")],
  type: CastingTime =>
    DB.Object({
      casting_time: DB.Required({
        type: DB.TypeArgument(CastingTime),
      }),
      cost: DB.Required({
        type: DB.IncludeIdentifier(SustainedCost),
      }),
      range: DB.Required({
        type: DB.IncludeIdentifier(Range),
      }),
      duration: DB.Optional({
        type: DB.IncludeIdentifier(DurationForSustained),
      }),
    }),
})

export const FastPerformanceParameters = DB.Enum(import.meta.url, {
  name: "FastPerformanceParameters",
  values: () => ({
    OneTime: DB.EnumCase({ type: DB.IncludeIdentifier(FastOneTimePerformanceParameters) }),
    Sustained: DB.EnumCase({ type: DB.IncludeIdentifier(FastSustainedPerformanceParameters) }),
  }),
})

const FastOneTimePerformanceParameters = DB.TypeAlias(import.meta.url, {
  name: "FastOneTimePerformanceParameters",
  type: () =>
    DB.GenIncludeIdentifier(OneTimePerformanceParameters, [DB.IncludeIdentifier(FastCastingTime)]),
})

const FastSustainedPerformanceParameters = DB.TypeAlias(import.meta.url, {
  name: "FastSustainedPerformanceParameters",
  type: () =>
    DB.GenIncludeIdentifier(SustainedPerformanceParameters, [
      DB.IncludeIdentifier(FastCastingTime),
    ]),
})

export const SlowPerformanceParameters = DB.Enum(import.meta.url, {
  name: "SlowPerformanceParameters",
  values: () => ({
    OneTime: DB.EnumCase({ type: DB.IncludeIdentifier(SlowOneTimePerformanceParameters) }),
    Sustained: DB.EnumCase({ type: DB.IncludeIdentifier(SlowSustainedPerformanceParameters) }),
  }),
})

const SlowOneTimePerformanceParameters = DB.TypeAlias(import.meta.url, {
  name: "SlowOneTimePerformanceParameters",
  type: () =>
    DB.GenIncludeIdentifier(OneTimePerformanceParameters, [DB.IncludeIdentifier(SlowCastingTime)]),
})

const SlowSustainedPerformanceParameters = DB.TypeAlias(import.meta.url, {
  name: "SlowSustainedPerformanceParameters",
  type: () =>
    DB.GenIncludeIdentifier(SustainedPerformanceParameters, [
      DB.IncludeIdentifier(SlowCastingTime),
    ]),
})

export const OldParameter = DB.TypeAlias(import.meta.url, {
  name: "OldParameter",
  type: () =>
    DB.Object({
      full: DB.Required({
        type: DB.String(),
      }),
      abbr: DB.Required({
        type: DB.String(),
      }),
    }),
})

export const ExpressionBasedParameterValue = DB.TypeAlias(import.meta.url, {
  name: "ExpressionBasedParameterValue",
  type: () =>
    DB.GenIncludeIdentifier(MathOperation, [
      DB.IncludeIdentifier(ExpressionBasedParameterExpressionValue),
    ]),
})

const ExpressionBasedParameterExpressionValue = DB.Enum(import.meta.url, {
  name: "ExpressionBasedParameterExpressionValue",
  values: () => ({
    Constant: DB.EnumCase({ type: DB.Integer({ minimum: 1 }) }),
    QualityLevels: DB.EnumCase({ type: null }),
    SkillPoints: DB.EnumCase({ type: null }),
    SkillRating: DB.EnumCase({ type: null }),
  }),
})
