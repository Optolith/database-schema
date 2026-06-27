import * as DB from "tsondb/schema/dsl"
import { DisplayOption } from "../DisplayOption.js"

export const StylePrerequisite = DB.TypeAlias(import.meta.url, {
  name: "SkillStylePrerequisite",
  type: () =>
    DB.Object({
      category: DB.Required({
        type: DB.IncludeIdentifier(StyleCategory),
      }),
      display_option: DB.Optional({
        type: DB.IncludeIdentifier(DisplayOption),
      }),
    }),
})

export const StyleCategory = DB.Enum(import.meta.url, {
  name: "StyleCategory",
  values: () => ({
    SkillStyle: DB.EnumCase({ type: null }),
  }),
})
