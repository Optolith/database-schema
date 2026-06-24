import * as DB from "tsondb/schema/dsl"
import { CantripIdentifier } from "../../_Identifier.js"
import { DisplayOption } from "../DisplayOption.js"

export const CantripPrerequisite = DB.TypeAlias(import.meta.url, {
  name: "CantripPrerequisite",
  comment: "Requires a specific cantrip.",
  type: () =>
    DB.Object({
      cantrip: DB.Required({
        comment: "The required cantrip.",
        type: CantripIdentifier(),
      }),
      display_option: DB.Optional({
        type: DB.IncludeIdentifier(DisplayOption),
      }),
    }),
})
