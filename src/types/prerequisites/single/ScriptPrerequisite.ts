import * as DB from "tsondb/schema/dsl"
import { ScriptIdentifier } from "../../_Identifier.js"
//import { DisplayOption } from "../DisplayOption.js"

export const ScriptPrerequisite = DB.TypeAlias(import.meta.url, {
  name: "ScriptPrerequisite",
  type: () =>
    DB.Object({
      id: DB.Required({
        comment: "The scripts�s identifier.",
        type: ScriptIdentifier(),
      }),
      //display_option: DB.Optional({
      //    type: DB.IncludeIdentifier(DisplayOption),
      //}),
    }),
})
