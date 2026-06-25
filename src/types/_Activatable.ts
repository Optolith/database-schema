/**
 * General type specifications used by multiple activatable entries.
 */

import * as DB from "tsondb/schema/dsl"

export const name = DB.Required({
  comment: "Name of the activatable entry.",
  type: DB.String({ minLength: 1 }),
})

export const name_in_library = DB.Optional({
  comment:
    "The full name of the entry as stated in the sources. Only use when `name` needs to be different from full name for text generation purposes.",
  type: DB.String({ minLength: 1 }),
})

export const additionalName = DB.Optional({
  comment:
    "A part of the name that is appended in parenthesis. This can be used to specify the group of people that typically uses this entry (e.g. the name of the witch circle for a magic style for witches).\n\nIf `name_in_library` is specified, this will be ignored for places where the `name_in_library` is used.",
  type: DB.String({ minLength: 1 }),
})

export const levels = DB.Optional({
  comment: "Number of available levels.",
  type: DB.Integer({ minimum: 2 }),
})

export const maximum = DB.Optional({
  comment: `The number stating how often you can buy the entry. The **default** depends on the entry type:

- **Advantage:** \`1\` in all cases (as specified in the **Core Rules**)
- **Disadvantage:** \`1\` in all cases (as specified in the **Core Rules**)
- **Special Abilities:** \`1\` if no options can be selected, otherwise the number of possible options

The maximum is only set if it differs from the defaults specified above.`,
  type: DB.Integer({ minimum: 1 }),
})

export const rules = DB.Required({
  comment: "The rule text.",
  type: DB.String({ minLength: 1, markdown: "block" }),
})

export const effect = DB.Required({
  comment: "The effect description.",
  type: DB.String({ minLength: 1, markdown: "block" }),
})

export const range_l10n = DB.Optional({
  comment: "The range of the advantage.",
  isDeprecated: true,
  type: DB.String({ minLength: 1 }),
})

export const input = DB.Optional({
  comment: "A string that is used as a label for an input field.",
  type: DB.String({ minLength: 1 }),
})
