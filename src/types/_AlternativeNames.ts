import * as DB from "tsondb/schema/dsl"
//import { Language } from "./specialAbility/sub/Language.js"

export const AlternativeName = DB.TypeAlias(import.meta.url, {
  name: "AlternativeName",
  type: () =>
    DB.Object({
      name: DB.Required({
        comment: "An alternative name of the disease.",
        type: DB.String({ minLength: 1 }),
      }),
      region: DB.Optional({
        comment: "The region where this alternative name is used.",
        type: DB.String({ minLength: 1 }),
      }),
      //language: DB.Optional({
      //  comment: "The language of that alternative name if any.",
      //  type: DB.IncludeIdentifier(Language),
      //}),
    }),
})
