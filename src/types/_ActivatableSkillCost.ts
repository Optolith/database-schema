import * as DB from "tsondb/schema/dsl"
import { DurationUnitValue } from "./_ActivatableSkillDuration.js"
import { SkillModificationLevelIdentifier } from "./_Identifier.js"
import { ResponsiveText, ResponsiveTextOptional, ResponsiveTextReplace } from "./_ResponsiveText.js"
import { NestedTranslationMap } from "./Locale.js"

export const OneTimeCost = DB.Enum(import.meta.url, {
  name: "OneTimeCost",
  values: () => ({
    Single: DB.EnumCase({ type: DB.IncludeIdentifier(SingleOneTimeCost) }),
    Conjunction: DB.EnumCase({ type: DB.IncludeIdentifier(MultipleOneTimeCosts) }),
    Disjunction: DB.EnumCase({ type: DB.IncludeIdentifier(MultipleOneTimeCosts) }),
    Map: DB.EnumCase({ type: DB.IncludeIdentifier(OneTimeCostMap) }),
  }),
})

const SingleOneTimeCost = DB.Enum(import.meta.url, {
  name: "SingleOneTimeCost",
  values: () => ({
    Modifiable: DB.EnumCase({ type: DB.IncludeIdentifier(ModifiableOneTimeCost) }),
    NonModifiable: DB.EnumCase({ type: DB.IncludeIdentifier(NonModifiableOneTimeCost) }),
    Indefinite: DB.EnumCase({ type: DB.IncludeIdentifier(IndefiniteOneTimeCost) }),
  }),
})

const MultipleOneTimeCosts = DB.TypeAlias(import.meta.url, {
  name: "MultipleOneTimeCosts",
  type: () =>
    DB.Array(DB.IncludeIdentifier(SingleOneTimeCost), {
      minItems: 2,
    }),
})

const ModifiableOneTimeCost = DB.TypeAlias(import.meta.url, {
  name: "ModifiableOneTimeCost",
  type: () =>
    DB.Object({
      initial_modification_level: DB.Required({
        comment: "The initial skill modification identifier/level.",
        type: SkillModificationLevelIdentifier(),
      }),
      permanent_value: DB.Optional({
        comment: "The part of the cost value that has to be spent permanently.",
        type: DB.Integer({ minimum: 1 }),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "ModifiableOneTimeCost",
        DB.Object({
          replacement: DB.Required({
            comment: "A replacement string.",
            type: DB.IncludeIdentifier(ResponsiveTextReplace),
          }),
        }),
      ),
    }),
})

export const NonModifiableOneTimeCost = DB.TypeAlias(import.meta.url, {
  name: "NonModifiableOneTimeCost",
  type: () =>
    DB.Object({
      is_minimum: DB.Optional({
        comment: "If `true`, the non-modifiable value is a minimum value.",
        type: DB.Boolean(),
      }),
      value: DB.Required({
        comment: "The AE cost value.",
        type: DB.Integer({ minimum: 1 }),
      }),
      permanent_value: DB.Optional({
        comment: "The part of the cost value that has to be spent permanently.",
        type: DB.Integer({ minimum: 1 }),
      }),
      per: DB.Optional({
        comment: "The cost have to be per a specific countable entity, e.g. `8 KP per person`.",
        type: DB.IncludeIdentifier(NonModifiableOneTimeCostPerCountable),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "NonModifiableOneTimeCost",
        DB.Object({
          note: DB.Required({
            comment: "A note, appended to the generated string in parenthesis.",
            type: DB.IncludeIdentifier(ResponsiveTextOptional),
          }),
        }),
      ),
    }),
})

export const NonModifiableOneTimeCostPerCountable = DB.TypeAlias(import.meta.url, {
  name: "NonModifiableOneTimeCostPerCountable",
  type: () =>
    DB.Object({
      minimum_total: DB.Optional({
        comment: "If defined, the minimum total AE that have to be spent casting the skill.",
        type: DB.Integer({ minimum: 1 }),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "NonModifiableOneTimeCostPerCountable",
        DB.Object({
          countable: DB.Required({
            comment: "The countable entity name.",
            type: DB.IncludeIdentifier(ResponsiveText),
          }),
        }),
      ),
    }),
})

export const IndefiniteOneTimeCost = DB.TypeAlias(import.meta.url, {
  name: "IndefiniteOneTimeCost",
  type: () =>
    DB.Object({
      translations: NestedTranslationMap(
        DB.Required,
        "IndefiniteOneTimeCost",
        DB.Object({
          description: DB.Required({
            comment: "A description of where the cost come from.",
            type: DB.IncludeIdentifier(ResponsiveText),
          }),
        }),
      ),
    }),
})

export const OneTimeCostMap = DB.TypeAlias(import.meta.url, {
  name: "OneTimeCostMap",
  comment: `A content that is \`2/4/8/16 AE for an item the size of a cup/chest/door/castle gate\` may be respresented as the following map:

\`\`\`yaml
options:
  - value: 2
    label: "cup"
  - value: 4
    label: "chest"
  - value: 8
    label: "door"
  - value: 16
    label: "castle gate"
for_append: "an item the size of a"
\`\`\`

This will generate the exact same string as seen above – given it is set for a spellwork and thus \`AE\` is used.`,
  type: () =>
    DB.Object({
      options: DB.Required({
        comment: "The possible costs and associated labels.",
        type: DB.Array(DB.IncludeIdentifier(OneTimeCostMapOption), {
          minItems: 2,
        }),
      }),
      style: DB.Optional({
        comment:
          "The style of the generated string. It may either be displayed in a compressed way (e.g. `1/2/3 AE for a small/medium/large object`) or in a verbose way (e.g. `1 AE for a small object, 2 AE for a medium object, 3 AE for a large object`). The default is `compressed`.",
        type: DB.IncludeIdentifier(MapStyle),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "OneTimeCostMap",
        DB.Object(
          {
            list_prepend: DB.Optional({
              comment: "Place a string between the `for` and the grouped map option labels.",
              type: DB.IncludeIdentifier(ResponsiveTextOptional),
            }),
            list_append: DB.Optional({
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

const OneTimeCostMapOption = DB.TypeAlias(import.meta.url, {
  name: "OneTimeCostMapOption",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The full cost value for this option.",
        type: DB.Integer({ minimum: 1 }),
      }),
      permanent_value: DB.Optional({
        comment: "The part of the `value` that has to be paid permanently.",
        type: DB.Integer({ minimum: 0 }),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "OneTimeCostMapOption",
        DB.Object({
          label: DB.Required({
            comment: "The description of the option for cost string generation.",
            type: DB.IncludeIdentifier(ResponsiveTextOptional),
          }),
          label_standalone: DB.Optional({
            comment:
              "The description of the option if used standalone (e.g. in an in-game tool where you can select how many AE you have to pay). Only used if different from `label`.",
            type: DB.IncludeIdentifier(ResponsiveTextOptional),
          }),
        }),
      ),
    }),
})

export const MapStyle = DB.Enum(import.meta.url, {
  name: "MapStyle",
  comment:
    "The style of the generated string. It may either be displayed in a compressed way (e.g. `1/2/3 AE for a small/medium/large object`) or in a verbose way (e.g. `1 AE for a small object, 2 AE for a medium object, 3 AE for a large object`).",
  values: () => ({
    Compressed: DB.EnumCase({ type: null }),
    Verbose: DB.EnumCase({ type: null }),
  }),
})

export const SustainedCost = DB.Enum(import.meta.url, {
  name: "SustainedCost",
  values: () => ({
    Modifiable: DB.EnumCase({ type: DB.IncludeIdentifier(ModifiableSustainedCost) }),
    NonModifiable: DB.EnumCase({ type: DB.IncludeIdentifier(NonModifiableSustainedCost) }),
    Map: DB.EnumCase({ type: DB.IncludeIdentifier(SustainedCostMap) }),
  }),
})

const ModifiableSustainedCost = DB.TypeAlias(import.meta.url, {
  name: "ModifiableSustainedCost",
  type: () =>
    DB.Object({
      initial_modification_level: DB.Required({
        comment: "The initial skill modification identifier/level.",
        type: SkillModificationLevelIdentifier(),
      }),
      interval: DB.Required({
        comment: "The sustain interval.",
        type: DB.IncludeIdentifier(DurationUnitValue),
      }),
    }),
})

export const NonModifiableSustainedCost = DB.TypeAlias(import.meta.url, {
  name: "NonModifiableSustainedCost",
  type: () =>
    DB.Object({
      is_minimum: DB.Optional({
        comment: "If `true`, the non-modifiable value is a minimum value.",
        type: DB.Boolean(),
      }),
      value: DB.Required({
        comment: "The AE cost value.",
        type: DB.Integer({ minimum: 1 }),
      }),
      per: DB.Optional({
        comment: "The cost have to be per a specific countable entity, e.g. `8 KP per person`.",
        type: DB.IncludeIdentifier(NonModifiableSustainedCostPerCountable),
      }),
      interval: DB.Required({
        comment: "The sustain interval.",
        type: DB.IncludeIdentifier(DurationUnitValue),
      }),
    }),
})

const NonModifiableSustainedCostPerCountable = DB.TypeAlias(import.meta.url, {
  name: "NonModifiableSustainedCostPerCountable",
  type: () =>
    DB.Object({
      minimum_total: DB.Optional({
        comment: "If defined, the minimum total AE that have to be spent casting the skill.",
        type: DB.Integer({ minimum: 1 }),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "NonModifiableSustainedCostPerCountable",
        DB.Object({
          countable: DB.Required({
            comment: "The countable entity name.",
            type: DB.IncludeIdentifier(ResponsiveText),
          }),
        }),
      ),
    }),
})

export const SustainedCostMap = DB.TypeAlias(import.meta.url, {
  name: "SustainedCostMap",
  comment: `A content that is \`2/4/8/16 AE (activation) + 1/2/4/8 per 5 minutes for an item the size of a cup/chest/door/castle gate\` can be represented as a cost map.

The \`an item the size of a\` would be the *list prefix* string, while the list of options would contain four options with the activation cost and the name.`,
  type: () =>
    DB.Object({
      options: DB.Required({
        comment: "The possible costs and associated labels.",
        type: DB.Array(DB.IncludeIdentifier(SustainedCostMapOption), {
          minItems: 2,
        }),
      }),
      interval: DB.Required({
        comment: "The sustain interval.",
        type: DB.IncludeIdentifier(DurationUnitValue),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "SustainedCostMap",
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

const SustainedCostMapOption = DB.TypeAlias(import.meta.url, {
  name: "SustainedCostMapOption",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment:
          "The activation cost value for this option. The interval cost is always half of this value.",
        type: DB.Integer({ minimum: 1 }),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "SustainedCostMapOption",
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
