import * as DB from "tsondb/schema/dsl"

export const CheckResultValue = DB.Enum(import.meta.url, {
  name: "CheckResultValue",
  comment: "Defines the derived (unitless) value.",
  values: () => ({
    QualityLevels: DB.EnumCase({ type: null }),
    SkillPoints: DB.EnumCase({ type: null }),
    SkillRating: DB.EnumCase({ type: null }),
  }),
})

const CheckResultArithmetic = DB.Enum(import.meta.url, {
  name: "CheckResultArithmetic",
  comment: "Defines how the the `value` is set off against the check result.",
  values: () => ({
    Add: DB.EnumCase({ type: null }),
    Subtract: DB.EnumCase({ type: null }),
    Multiply: DB.EnumCase({ type: null }),
    Divide: DB.EnumCase({ type: null }),
  }),
})

export const CheckResultBasedModifier = DB.TypeAlias(import.meta.url, {
  name: "CheckResultBasedModifier",
  type: () =>
    DB.Object({
      arithmetic: DB.Required({
        comment: "The arithmetic how to apply the `value` to the `base`.",
        type: DB.IncludeIdentifier(CheckResultArithmetic),
      }),
      value: DB.Required({
        comment: "The value that is applied to the `base` using the defined `arithmetic`.",
        type: DB.Integer({ minimum: 2 }),
      }),
    }),
})

export const CheckResultBased = DB.TypeAlias(import.meta.url, {
  name: "CheckResultBased",
  comment: "Defines a parameter being based on a check result.",
  type: () =>
    DB.Object({
      base: DB.Required({
        comment: "The base value that is derived from the check result.",
        type: DB.IncludeIdentifier(CheckResultValue),
      }),
      modifier: DB.Optional({
        comment: "If defined, it modifies the base value.",
        type: DB.IncludeIdentifier(CheckResultBasedModifier),
      }),
    }),
})
