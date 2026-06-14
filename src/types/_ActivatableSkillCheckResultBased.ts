import * as DB from "tsondb/schema/dsl"

const CheckResultArithmetic = DB.Enum(import.meta.url, {
  name: "CheckResultArithmetic",
  comment: "Defines how the the `value` is set off against the check result.",
  values: () => ({
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
