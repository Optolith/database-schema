/**
 * Originally, this type was created to represent the text of a spell, which can
 * be displayed in full on the spell card, but also in a compressed version on
 * the character sheet. However, it can be used for any text that has a similar
 * requirement.
 *
 * The `ResponsiveTextReplace` type is a special case where the full and
 * compressed versions are not standalone texts, but rather templates that
 * include a placeholder (`$1`) for a generated string. The generated string is
 * expected to adapt to different size contexts as well.
 *
 * The `ResponsiveTextOptional` type allows for the possibility that a
 * compressed version may not be provided. In such cases, the full text should
 * be used in all contexts, and the absence of a compressed version indicates
 * that no special formatting is needed for smaller areas.
 * @module
 */

import * as DB from "tsondb/schema/dsl"

export const ResponsiveText = DB.TypeAlias(import.meta.url, {
  name: "ResponsiveText",
  comment:
    "A text from the source that can be also displayed in small areas using a compressed version.",
  type: () =>
    DB.Object({
      full: DB.Required({
        comment: "The full text from the source.",
        type: DB.String({ minLength: 1 }),
      }),
      compressed: DB.Required({
        comment: "A compressed text for use in small areas (e.g. on character sheet).",
        type: DB.String({ minLength: 1 }),
      }),
    }),
})

export const ResponsiveTextReplace = DB.TypeAlias(import.meta.url, {
  name: "ResponsiveTextReplace",
  comment:
    "A text from the source that can be also displayed in small areas using a compressed version. It is used as a replacement for a generated text while the generated text is still provided and should be used.",
  type: () =>
    DB.Object({
      full: DB.Required({
        comment:
          "The full replacement string. It must contain `$1`, which is going to be replaced with the generated string, so additional information can be provided without duplicating concrete numeric values.",
        type: DB.String({ minLength: 1, pattern: /\$1/ }),
      }),
      compressed: DB.Required({
        comment:
          "A compressed replacement string for use in small areas (e.g. on character sheet). It must contain `$1`, which is going to be replaced with the generated string, so additional information can be provided without duplicating concrete numeric values.",
        type: DB.String({ minLength: 1, pattern: /\$1/ }),
      }),
    }),
})
export const ResponsiveTextOptional = DB.TypeAlias(import.meta.url, {
  name: "ResponsiveTextOptional",
  comment:
    "A text from the source that can be also displayed in small areas using a compressed version, if available.",
  type: () =>
    DB.Object({
      full: DB.Required({
        comment: "The full text from the source.",
        type: DB.String({ minLength: 1 }),
      }),
      compressed: DB.Optional({
        comment:
          "A compressed text for use in small areas (e.g. on character sheet). If this is not present, it should not appear in those areas.",
        type: DB.String({ minLength: 1 }),
      }),
    }),
})
