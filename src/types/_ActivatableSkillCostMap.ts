import * as DB from "tsondb/schema/dsl"
import { ResponsiveTextOptional } from "./_ResponsiveText.ts"
import { NestedTranslationMap } from "./Locale.ts"

export const CostMap = DB.GenTypeAlias(import.meta.url, {
  name: "CostMap",
  parameters: [DB.Param("Value")],
  comment: `A content that is \`2/4/8/16 AE (activation) + 1/2/4/8 per 5 minutes for an item the size of a cup/chest/door/castle gate\` can be represented as a cost map.

The \`an item the size of a\` would be the *list prefix* string, while the list of options would contain four options with the activation cost and the name.`,
  type: Value =>
    DB.Object({
      options: DB.Required({
        comment: "The possible costs and associated labels.",
        type: DB.Array(DB.GenIncludeIdentifier(CostMapOption, [DB.TypeArgument(Value)]), {
          minItems: 2,
        }),
      }),
      style: DB.Required({
        comment:
          "The style of the generated string. It may either be displayed in a compressed way (e.g. `1/2/3 AE for a small/medium/large object`) or in a verbose way (e.g. `1 AE for a small object, 2 AE for a medium object, 3 AE for a large object`).",
        type: DB.IncludeIdentifier(CostMapStyle),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "CostMap",
        DB.Object(
          {
            listPrefix: DB.Optional({
              comment: "Place a string between the `for` and the grouped map option labels.",
              type: DB.IncludeIdentifier(ResponsiveTextOptional),
            }),
            listSuffix: DB.Optional({
              comment: "Place a string after the grouped map option labels.",
              type: DB.IncludeIdentifier(ResponsiveTextOptional),
            }),
            replacement: DB.Optional({
              comment:
                "If the string from the book cannot be generated using the default generation technique, use this string. All options still need to be inserted propertly, since it may be used by in-game tools to provide a selection to players.",
              type: DB.IncludeIdentifier(ResponsiveTextOptional),
            }),
          },
          { minProperties: 1 },
        ),
      ),
    }),
})

const CostMapStyle = DB.Enum(import.meta.url, {
  name: "CostMapStyle",
  comment:
    "The style of the generated string. It may either be displayed in a compressed way (e.g. `1/2/3 AE for a small/medium/large object`) or in a verbose way (e.g. `1 AE for a small object, 2 AE for a medium object, 3 AE for a large object`).",
  values: () => ({
    Compressed: DB.EnumCase({ type: null }),
    Verbose: DB.EnumCase({ type: null }),
  }),
})

const CostMapOption = DB.GenTypeAlias(import.meta.url, {
  name: "CostMapOption",
  parameters: [DB.Param("Value")],
  type: Value =>
    DB.Object({
      value: DB.Required({
        comment:
          "The activation cost value for this option. If used for sustained cost, the interval cost is always half of this value.",
        type: DB.TypeArgument(Value),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "CostMapOption",
        DB.Object({
          label: DB.Required({
            comment: "The description of the option for cost string generation.",
            type: DB.IncludeIdentifier(ResponsiveTextOptional),
          }),
          standaloneLabel: DB.Optional({
            comment:
              "The description of the option if used standalone (e.g. in an in-game tool where you can select how many AE you have to pay). Only used if different from `label`.",
            type: DB.IncludeIdentifier(ResponsiveTextOptional),
          }),
        }),
      ),
    }),
})
