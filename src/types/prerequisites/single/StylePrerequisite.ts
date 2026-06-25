import * as DB from "tsondb/schema/dsl"
import { DisplayOption } from "../DisplayOption.js"

export const SkillStylePrerequisite = DB.TypeAlias(import.meta.url, {
  name: "SkillStylePrerequisite",
  type: () =>
    DB.Object({
      display_option: DB.Optional({
        type: DB.IncludeIdentifier(DisplayOption),
      }),
    }),
})

export const CombatStylePrerequisite = DB.TypeAlias(import.meta.url, {
  name: "CombatStylePrerequisite",
  type: () =>
    DB.Object({
      display_option: DB.Optional({
        type: DB.IncludeIdentifier(DisplayOption),
      }),
    }),
})

export const MagicalStylePrerequisite = DB.TypeAlias(import.meta.url, {
  name: "MagicalStylePrerequisite",
  type: () =>
    DB.Object({
      display_option: DB.Optional({
        type: DB.IncludeIdentifier(DisplayOption),
      }),
    }),
})

export const LiturgicalStylePrerequisite = DB.TypeAlias(import.meta.url, {
  name: "LiturgicalStylePrerequisite",
  type: () =>
    DB.Object({
      display_option: DB.Optional({
        type: DB.IncludeIdentifier(DisplayOption),
      }),
    }),
})
