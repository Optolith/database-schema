import * as DB from "tsondb/schema/dsl"
import { LanguageIdentifier } from "../../_Identifier.js"
//import { DisplayOption } from "../DisplayOption.js"

export const LanguagePrerequisite = DB.TypeAlias(import.meta.url, {
    name: "LanguagePrerequisite",
    type: () =>
        DB.Object({
            id: DB.Required({
                comment: "The languages’s identifier.",
                type: LanguageIdentifier(),
            }),
            value: DB.Required({
                comment: "The required minimum value.",
                type: DB.Integer({ minimum: 0 }),
            }),
            //display_option: DB.Optional({
            //    type: DB.IncludeIdentifier(DisplayOption),
            //}),
        }),
})
