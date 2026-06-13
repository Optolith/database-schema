import * as DB from "tsondb/schema/dsl"
import { ExpressionBasedParameterValue } from "./_ActivatableSkill.ts"
import { SkillModificationLevelIdentifier } from "./_Identifier.js"
import { ResponsiveTextOptional, ResponsiveTextReplace } from "./_ResponsiveText.js"
import { NestedTranslationMap } from "./Locale.js"

export const Range = DB.TypeAlias(import.meta.url, {
  name: "Range",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The range value.",
        type: DB.IncludeIdentifier(RangeValue),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "Range",
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

const RangeValue = DB.Enum(import.meta.url, {
  name: "RangeValue",
  values: () => ({
    Modifiable: DB.EnumCase({ type: DB.IncludeIdentifier(ModifiableRange) }),
    Sight: DB.EnumCase({ type: null }),
    Self: DB.EnumCase({ type: null }),
    Global: DB.EnumCase({ comment: "German: *dereumfassend*", type: null }),
    Touch: DB.EnumCase({ type: null }),
    Expression: DB.EnumCase({ type: DB.IncludeIdentifier(ExpressionBasedRange) }),
  }),
})

const ModifiableRange = DB.TypeAlias(import.meta.url, {
  name: "ModifiableRange",
  type: () =>
    DB.Object({
      is_maximum: DB.Optional({
        comment: "If `true`, the range is a maximum range.",
        type: DB.Boolean(),
      }),
      initial_modification_level: DB.Required({
        comment: "The initial skill modification identifier/level.",
        type: SkillModificationLevelIdentifier(),
      }),
      is_radius: DB.Optional({
        comment: "If `true`, the range is a radius.",
        type: DB.Boolean(),
      }),
    }),
})

export const FixedRange = DB.TypeAlias(import.meta.url, {
  name: "FixedRange",
  type: () =>
    DB.Object({
      is_maximum: DB.Optional({
        comment: "If `true`, the range is a maximum range.",
        type: DB.Boolean(),
      }),
      value: DB.Required({
        comment: "The (unitless) range value.",
        type: DB.Integer({ minimum: 1 }),
      }),
      unit: DB.Required({
        comment: "The unit of the `value`.",
        type: DB.IncludeIdentifier(RangeUnit),
      }),
      is_radius: DB.Optional({
        comment: "If `true`, the range is a radius.",
        type: DB.Boolean(),
      }),
    }),
})

export const ExpressionBasedRange = DB.TypeAlias(import.meta.url, {
  name: "ExpressionBasedRange",
  type: () =>
    DB.Object({
      is_maximum: DB.Optional({
        comment: "If the range is the maximum range.",
        type: DB.Boolean(),
      }),
      value: DB.Required({
        comment: "An expression that evaluates to the range.",
        type: DB.IncludeIdentifier(ExpressionBasedParameterValue),
      }),
      unit: DB.Required({
        comment: "The duration unit.",
        type: DB.IncludeIdentifier(RangeUnit),
      }),
      is_radius: DB.Optional({
        comment: "If `true`, the range is a radius.",
        type: DB.Boolean(),
      }),
    }),
})

const RangeUnit = DB.Enum(import.meta.url, {
  name: "RangeUnit",
  values: () => ({
    Steps: DB.EnumCase({ type: null }),
    Miles: DB.EnumCase({ type: null }),
  }),
})
