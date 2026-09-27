import * as DB from "tsondb/schema/dsl"
import { createValueMapOption, ValueMap } from "./_ActivatableSkillParameterMap.ts"
import { ActivatableIdentifier } from "./_IdentifierGroup.js"
import { MathOperation } from "./_MathExpression.js"
import { BySizeCategory } from "./_SizeCategory.js"
import { NestedTranslationMap } from "./Locale.js"

const AdventurePointsValue = DB.Enum(import.meta.url, {
  name: "AdventurePointsValue",
  values: () => ({
    Fixed: DB.EnumCase({ type: DB.IncludeIdentifier(FixedAdventurePointsValue) }),
    ByLevel: DB.EnumCase({ type: DB.IncludeIdentifier(AdventurePointsValueByLevel) }),
    DerivedFromSelection: DB.EnumCase({
      type: DB.IncludeIdentifier(AdventurePointsDerivedFromSelection),
    }),
    DependingOnActive: DB.EnumCase({
      type: DB.IncludeIdentifier(AdventurePointsDependingOnActive),
    }),
    DependingOnActiveInstances: DB.EnumCase({
      type: DB.IncludeIdentifier(AdventurePointsDependingOnActiveInstances),
    }),
    Indefinite: DB.EnumCase({ type: null }),
  }),
})

export const ap_value = DB.Required({
  displayName: "AP Value",
  comment: "The adventure points value.",
  type: DB.IncludeIdentifier(AdventurePointsValue),
})

export const ap_value_l10n = DB.Optional({
  displayName: "AP Value",
  comment: "The adventure points value.",
  isDeprecated: true,
  type: DB.String({ minLength: 1 }),
})

export const ap_value_append = DB.Optional({
  displayName: "AP Value Suffix",
  comment: "The string to append to the generated AP value text.",
  isDeprecated: true,
  type: DB.String({ minLength: 1 }),
})

export const FixedAdventurePointsValue = DB.TypeAlias(import.meta.url, {
  name: "FixedAdventurePointsValue",
  comment:
    "A fixed adventure points value. If the entry has levels, this is the cost per level as well.",
  type: () => DB.IncludeIdentifier(AdventurePointsSingleValue),
})

const AdventurePointsValueByLevel = DB.TypeAlias(import.meta.url, {
  name: "AdventurePointsValueByLevel",
  comment: "An entry with levels may have different costs for each level.",
  type: () =>
    DB.Object({
      list: DB.Required({
        comment:
          "The list of adventure point values, where the position in the list corresponds to the level (i.e. the first value is for level I, the second value is for level II, and so on). The length of the list must match the amount of levels the special ability has.",
        type: DB.Array(DB.IncludeIdentifier(AdventurePointsSingleValue), { minItems: 2 }),
      }),
      additionalBySizeCategory: DB.Optional({
        comment:
          "Values may be added to each level based on the size category of the character. Negative values mean that the AP value is lowered.",
        type: DB.GenIncludeIdentifier(BySizeCategory, [DB.Integer()]),
      }),
    }),
})

const AdventurePointsDerivedFromSelection = DB.TypeAlias(import.meta.url, {
  name: "AdventurePointsDerivedFromSelection",
  comment:
    "The adventure points value is derived from the selection of the special ability. Its display value may be able to be derived from the given information for the select options. If that is not the case or the generated text would not match the original one, a replacement text can be provided.",
  type: () =>
    DB.Object({
      translations: NestedTranslationMap(
        DB.Optional,
        "AdventurePointsDerivedFromSelection",
        DB.Object(
          {
            listPrepend: DB.Optional({
              comment: "Place a string between the `for` and the grouped option names.",
              type: DB.String({ minLength: 1 }),
            }),
            replacement: DB.Optional({
              comment:
                "A replacement for the generated text if it would not match the original one.",
              type: DB.String({ minLength: 1, markdown: "inline" }),
            }),
          },
          { minProperties: 1 },
        ),
      ),
    }),
})

const AdventurePointsSingleValue = DB.TypeAlias(import.meta.url, {
  name: "AdventurePointsSingleValue",
  comment: "A single adventure points value.",
  type: () => DB.Integer({ minimum: 0 }),
})

export const AdventurePointsDependingOnActive = DB.TypeAlias(import.meta.url, {
  name: "AdventurePointsDependingOnActive",
  comment: "The adventure points cost depends on if an instance of an entry is active.",
  type: () =>
    DB.Object({
      id: DB.Required({
        comment: "The identifier of the entry to that decides which AP value to pick.",
        type: DB.IncludeIdentifier(ActivatableIdentifier),
      }),
      active: DB.Required({
        comment: "The adventure points value if an instance of the referenced entry is active.",
        type: DB.IncludeIdentifier(AdventurePointsSingleValue),
      }),
      inactive: DB.Required({
        comment: "The adventure points value if no instance of the referenced entry is active.",
        type: DB.IncludeIdentifier(AdventurePointsSingleValue),
      }),
    }),
})

export const AdventurePointsDependingOnActiveInstances = DB.Enum(import.meta.url, {
  name: "AdventurePointsDependingOnActiveInstances",
  comment:
    "The adventure points cost depends on how many instances of the entry are already active.",
  values: () => ({
    Threshold: DB.EnumCase({
      type: DB.IncludeIdentifier(AdventurePointsDependingOnActiveInstancesThreshold),
    }),
    Expression: DB.EnumCase({
      type: DB.IncludeIdentifier(AdventurePointsDependingOnActiveInstancesExpression),
    }),
  }),
})

const AdventurePointsDependingOnActiveInstancesThreshold = DB.TypeAlias(import.meta.url, {
  name: "AdventurePointsDependingOnActiveInstancesThreshold",
  comment:
    "The adventure points cost depends on how many instances of the entry are already active.",
  type: () =>
    DB.Object({
      normal: DB.Required({
        comment: "The normal adventure points value.",
        type: DB.Integer({ minimum: 0 }),
      }),
      threshold: DB.Required({
        comment: "The number of active instances **after** which the alternative cost applies.",
        type: DB.Integer({ minimum: 1 }),
      }),
      alternative: DB.Required({
        comment: "The alternative adventure points value.",
        type: DB.Integer({ minimum: 0 }),
      }),
    }),
})

const AdventurePointsDependingOnActiveInstancesExpression = DB.TypeAlias(import.meta.url, {
  name: "AdventurePointsDependingOnActiveInstancesExpression",
  comment:
    "The adventure points cost depends on how many instances of the entry are already active.",
  type: () =>
    DB.Object({
      expression: DB.Required({
        comment: "The expression to calculate the AP value.",
        type: DB.IncludeIdentifier(AdventurePointsDependingOnActiveInstancesExpressionExpression),
      }),
      customLabels: DB.Optional({
        comment:
          "Custom labels for the expression values. If not provided, the default labels will be used.\n\nThe values to provide must be in the same order as they appear in the expression. For example, if the expression is `Active * 2 + 1`, the first option corresponds to `1`, the second option corresponds to `3`, and so on. Only the amount of options specified will be displayed.",
        type: DB.IncludeIdentifier(AdventurePointsDependingOnActiveInstancesExpressionLabels),
      }),
    }),
})

const AdventurePointsDependingOnActiveInstancesExpressionLabels = DB.TypeAlias(import.meta.url, {
  name: "AdventurePointsDependingOnActiveInstancesExpressionLabels",
  comment:
    "Custom labels for the expression values. If not provided, the default labels will be used.\n\nThe values to provide must be in the same order as they appear in the expression. For example, if the expression is `Active * 2 + 1`, the first option corresponds to `1`, the second option corresponds to `3`, and so on. Only the amount of options specified will be displayed.",
  type: () =>
    DB.GenIncludeIdentifier(ValueMap, [
      DB.IncludeIdentifier(AdventurePointsDependingOnActiveInstancesExpressionLabelsOption),
    ]),
})

const AdventurePointsDependingOnActiveInstancesExpressionLabelsOption = createValueMapOption(
  "AdventurePointsDependingOnActiveInstancesExpressionLabelsOption",
  [],
  () => ({}),
  false,
)

const AdventurePointsDependingOnActiveInstancesExpressionExpression = DB.TypeAlias(
  import.meta.url,
  {
    name: "AdventurePointsDependingOnActiveInstancesExpressionExpression",
    comment:
      "The adventure points cost depends on how many instances of the entry are already active.",
    type: () =>
      DB.GenIncludeIdentifier(MathOperation, [
        DB.IncludeIdentifier(AdventurePointsDependingOnActiveInstancesExpressionValue),
      ]),
  },
)

const AdventurePointsDependingOnActiveInstancesExpressionValue = DB.Enum(import.meta.url, {
  name: "AdventurePointsDependingOnActiveInstancesExpressionValue",
  comment: `The type of value allowed in the expression to calculate the AP value.`,
  values: () => ({
    Constant: DB.EnumCase({
      comment: "A constant integer value.",
      type: DB.Integer(),
    }),
    Active: DB.EnumCase({
      comment: "The number of active instances.",
      type: null,
    }),
  }),
})
