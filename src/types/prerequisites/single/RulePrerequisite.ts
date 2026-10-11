import * as DB from "tsondb/schema/dsl"
import { ExtensionRuleIdentifier } from "../../_IdentifierGroup.js"
import { DisplayOption } from "../DisplayOption.js"

export const RulePrerequisite = DB.TypeAlias(import.meta.url, {
  name: "RulePrerequisite",
  comment: "Requires a specific extension rule (focus rule or optional rule) to be used/active.",
  type: () =>
    DB.Object({
      id: DB.Required({
        type: DB.IncludeIdentifier(ExtensionRuleIdentifier),
      }),
      active: DB.Required({
        type: DB.Boolean(),
      }),
      display_option: DB.Optional({
        type: DB.IncludeIdentifier(DisplayOption),
      }),
    }),
})
