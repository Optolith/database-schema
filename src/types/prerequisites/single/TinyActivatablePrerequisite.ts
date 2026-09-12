import * as DB from "tsondb/schema/dsl"
import { TinyActivatableIdentifier } from "../../_IdentifierGroup.js"
import { DisplayOption } from "../DisplayOption.js"

export const TinyActivatablePrerequisite = DB.TypeAlias(import.meta.url, {
  name: "TinyActivatablePrerequisite",
  comment: "Requires a specific cantrip or blessing.",
  type: () =>
    DB.Object({
      id: DB.Required({
        comment: "The required item.",
        type: DB.IncludeIdentifierType(TinyActivatableIdentifier),
      }),
      display_option: DB.Optional({
        type: DB.IncludeIdentifier(DisplayOption),
      }),
    }),
})
