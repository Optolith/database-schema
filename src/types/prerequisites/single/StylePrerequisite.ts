import * as DB from "tsondb/schema/dsl"
import { SpecialAbilityIdentifier } from "../../_IdentifierGroup.js"
import { DisplayOption } from "../DisplayOption.js"

export const StylePrerequisite = DB.TypeAlias(import.meta.url, {
  name: "AnySpecialAbilityOfGroup",
  type: () =>
    DB.Object({
      category: DB.Required({
        type: DB.IncludeIdentifier(SpecialAbilityCategory),
      }),
      display_option: DB.Optional({
        type: DB.IncludeIdentifier(DisplayOption),
      }),
    }),
})

export const SpecialAbilityCategory = DB.Enum(import.meta.url, {
  name: "SpecialAbilityCategory",
  values: () => ({
    ...Object.fromEntries(
      Object.keys(SpecialAbilityIdentifier).map(entity => [entity, DB.EnumCase({ type: null })]),
    ),
  }),
})
