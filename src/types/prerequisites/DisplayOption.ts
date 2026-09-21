import * as DB from "tsondb/schema/dsl"
import { NestedTranslationMap } from "../Locale.js"
import { SentenceType } from "./single/TextPrerequisite.js"

export const DisplayOption = DB.Enum(import.meta.url, {
  name: "DisplayOption",
  values: () => ({
    Hide: DB.EnumCase({ type: null }),
    ReplaceWith: DB.EnumCase({ type: DB.IncludeIdentifier(ReplacementDisplayOption) }),
  }),
})

const ReplacementDisplayOption = DB.TypeAlias(import.meta.url, {
  name: "ReplacementDisplayOption",
  type: () =>
    DB.Object({
      sentence_type: DB.Optional({
        comment: `If the replacement text is a sentence or sentence-like fragment, this property ensures it is integrated into the prerequisite string correctly.

A standalone sentence is connected to the previous prerequisite string with a period and a period is also added at the end of the sentence automatically, if it is not present. A connected sentence is connected to the previous prerequisite string with a semicolon and a period is not added to the end of the sentence. In this case, if there are prerequisites after this one, they will be connected using a semicolon again, unless a different punctuation mark is present at the end of the given text.`,
        type: DB.IncludeIdentifier(SentenceType),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "ReplacementDisplayOption",
        DB.Object({
          replacement: DB.Required({
            comment: "The replacement text.",
            type: DB.String({ minLength: 1, markdown: "inline" }),
          }),
        }),
      ),
    }),
})
