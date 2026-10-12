import * as DB from "tsondb/schema/dsl"
import { LanguageIdentifier } from "../../_Identifier.js"

export const LanguagePrerequisite = DB.TypeAlias(import.meta.url, {
  name: "LanguagePrerequisite",
  type: () =>
    DB.Object({
      id: DB.Required({
        comment: "The language’s identifier.",
        type: LanguageIdentifier(),
      }),
    }),
})
