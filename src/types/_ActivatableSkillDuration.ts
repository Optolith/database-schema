import * as DB from "tsondb/schema/dsl"
import { ExpressionBasedParameterValue } from "./_ActivatableSkill.ts"
import { ResponsiveText, ResponsiveTextReplace } from "./_ResponsiveText.js"
import { NestedTranslationMap } from "./Locale.js"

export const DurationForOneTime = DB.Enum(import.meta.url, {
  name: "DurationForOneTime",
  values: () => ({
    Immediate: DB.EnumCase({ type: DB.IncludeIdentifier(Immediate) }),
    Permanent: DB.EnumCase({ type: DB.IncludeIdentifier(PermanentDuration) }),
    Expression: DB.EnumCase({ type: DB.IncludeIdentifier(ExpressionBasedDuration) }),
    Indefinite: DB.EnumCase({ type: DB.IncludeIdentifier(IndefiniteDuration) }),
  }),
})

const Immediate = DB.TypeAlias(import.meta.url, {
  name: "Immediate",
  type: () =>
    DB.Object({
      maximum: DB.Optional({
        comment: "Specified if the duration has a maximum time span.",
        type: DB.IncludeIdentifier(DurationUnitValue),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "Immediate",
        DB.Object({
          replacement: DB.Optional({
            comment: "A replacement string.",
            type: DB.IncludeIdentifier(ResponsiveTextReplace),
          }),
        }),
      ),
    }),
})

const PermanentDuration = DB.TypeAlias(import.meta.url, {
  name: "PermanentDuration",
  type: () =>
    DB.Object({
      translations: NestedTranslationMap(
        DB.Optional,
        "PermanentDuration",
        DB.Object({
          replacement: DB.Optional({
            comment: "A replacement string.",
            type: DB.IncludeIdentifier(ResponsiveTextReplace),
          }),
        }),
      ),
    }),
})

export const FixedDuration = DB.TypeAlias(import.meta.url, {
  name: "FixedDuration",
  type: () =>
    DB.Object({
      is_maximum: DB.Optional({
        comment: "If the duration is the maximum duration, so it may end earlier.",
        type: DB.Boolean(),
      }),
      value: DB.Required({
        comment: "The (unitless) duration.",
        type: DB.Integer({ minimum: 1 }),
      }),
      unit: DB.Required({
        comment: "The duration unit.",
        type: DB.IncludeIdentifier(DurationUnit),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "FixedDuration",
        DB.Object(
          {
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

export const ExpressionBasedDuration = DB.TypeAlias(import.meta.url, {
  name: "ExpressionBasedDuration",
  type: () =>
    DB.Object({
      is_maximum: DB.Optional({
        comment: "If the duration is the maximum duration, so it may end earlier.",
        type: DB.Boolean(),
      }),
      value: DB.Required({
        comment: "An expression that evaluates to the duration.",
        type: DB.IncludeIdentifier(ExpressionBasedParameterValue),
      }),
      unit: DB.Required({
        comment: "The duration unit.",
        type: DB.IncludeIdentifier(DurationUnit),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "ExpressionBasedDuration",
        DB.Object({
          replacement: DB.Optional({
            comment: "A replacement string.",
            type: DB.IncludeIdentifier(ResponsiveTextReplace),
          }),
        }),
      ),
    }),
})

export const IndefiniteDuration = DB.TypeAlias(import.meta.url, {
  name: "IndefiniteDuration",
  type: () =>
    DB.Object({
      translations: NestedTranslationMap(
        DB.Required,
        "IndefiniteDuration",
        DB.Object({
          description: DB.Required({
            comment: "A description of the duration.",
            type: DB.IncludeIdentifier(ResponsiveText),
          }),
        }),
      ),
    }),
})

export const DurationForSustained = DB.TypeAlias(import.meta.url, {
  name: "DurationForSustained",
  type: () =>
    DB.Object({
      maximum: DB.Required({
        comment: "The sustained skill can be active a maximum amount of time.",
        type: DB.IncludeIdentifier(DurationUnitValue),
      }),
    }),
})

export const DurationUnit = DB.Enum(import.meta.url, {
  name: "DurationUnit",
  values: () => ({
    Seconds: DB.EnumCase({ type: null }),
    Minutes: DB.EnumCase({ type: null }),
    Hours: DB.EnumCase({ type: null }),
    Days: DB.EnumCase({ type: null }),
    Weeks: DB.EnumCase({ type: null }),
    Months: DB.EnumCase({ type: null }),
    Years: DB.EnumCase({ type: null }),
    Decades: DB.EnumCase({ type: null }),
    Centuries: DB.EnumCase({ type: null }),
    Actions: DB.EnumCase({ type: null }),
    CombatRounds: DB.EnumCase({ type: null }),
  }),
})

export const DurationUnitValue = DB.TypeAlias(import.meta.url, {
  name: "DurationUnitValue",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The (unitless) duration value.",
        type: DB.Integer({ minimum: 1 }),
      }),
      unit: DB.Required({
        comment: "The unit of the `value`.",
        type: DB.IncludeIdentifier(DurationUnit),
      }),
    }),
})
