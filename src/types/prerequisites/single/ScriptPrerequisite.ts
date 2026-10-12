import * as DB from "tsondb/schema/dsl"
import { ScriptIdentifier } from "../../_Identifier.js"

export const ScriptPrerequisite = DB.TypeAlias(import.meta.url, {
  name: "ScriptPrerequisite",
  type: () =>
    DB.Object({
      id: DB.Required({
        comment: "The script’s identifier.",
        type: ScriptIdentifier(),
      }),
    }),
})
