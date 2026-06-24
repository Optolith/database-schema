import * as DB from "tsondb/schema/dsl"
import { BlessingIdentifier } from "../../_Identifier.js"
import { DisplayOption } from "../DisplayOption.js"

export const BlessingPrerequisite = DB.TypeAlias(import.meta.url, {
  name: "BlessingPrerequisite",
  comment: "Requires a specific blessing.",
  type: () =>
    DB.Object({
      blessing: DB.Required({
        comment: "The required blessing.",
        type: BlessingIdentifier(),
      }),
      display_option: DB.Optional({
        type: DB.IncludeIdentifier(DisplayOption),
      }),
    }),
})
