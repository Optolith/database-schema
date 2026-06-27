import * as DB from "tsondb/schema/dsl"
import { PropertyIdentifier } from "../../_Identifier.js"
import { DisplayOption } from "../DisplayOption.js"

export const PropertyPrerequisite = DB.TypeAlias(import.meta.url, {
  name: "PropertyPrerequisite",
  comment: "Requires a specific property or one of a specific set of properties.",
  type: () =>
    DB.Object({
      id: DB.Required({
        comment: "The property�s identifier.",
        type: PropertyIdentifier(),
      }),
      display_option: DB.Optional({
        type: DB.IncludeIdentifier(DisplayOption),
      }),
    }),
})
