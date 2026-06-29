import * as DB from "tsondb/schema/dsl"
import { BlessingIdentifier, CantripIdentifier } from "../../_Identifier.js"
import { DisplayOption } from "../DisplayOption.js"

export const TinyActivatablePrerequisite = DB.TypeAlias(import.meta.url, {
  name: "TinyActivatablePrerequisite",
  comment: "Requires a specific cantrip or blessing.",
  type: () =>
    DB.Object({
      id: DB.Required({
        comment: "The required item.",
        type: DB.IncludeIdentifierType(TinyActivatableCategory),
      }),
      display_option: DB.Optional({
        type: DB.IncludeIdentifier(DisplayOption),
      }),
    }),
})

const TinyActivatableCategory = DB.Enum(import.meta.url, {
  name: "TinyActivatableCategory",
  values: () => ({
    Blessing: DB.EnumCase({ type: BlessingIdentifier() }),
    Cantrip: DB.EnumCase({ type: CantripIdentifier() }),
  }),
})
