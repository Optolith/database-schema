import * as DB from "tsondb/schema/dsl"
import { name_in_library } from "../_Activatable.js"
import { OneTimeCostMap } from "../_ActivatableSkillCost.ts"
import { ExpressionBasedDuration } from "../_ActivatableSkillDuration.js"
import { ActivatableSkillEffect } from "../_ActivatableSkillEffect.js"
import { BannzeichenIdentifier, PropertyIdentifier } from "../_Identifier.js"
import { ImprovementCost } from "../_ImprovementCost.js"
import { ResponsiveText, ResponsiveTextOptional } from "../_ResponsiveText.js"
import { SkillCheck } from "../_SkillCheck.js"
import { NestedTranslationMap } from "../Locale.js"
import { Errata } from "../source/_Erratum.js"
import { src } from "../source/_PublicationRef.js"

export const Bannzeichen = DB.Entity(import.meta.url, {
  name: "Bannzeichen",
  namePlural: "Bannzeichen",
  type: () =>
    DB.Object({
      options: DB.Required({
        comment: `The options the Bannzeichen has, if any.

If there are multiple options, the Bannzeichen may be activated for each option, that is, multiple times.`,
        type: DB.ChildEntities(BannzeichenOption),
      }),
      check: DB.Required({
        comment: "Lists the linked three attributes used to make a skill check.",
        type: DB.IncludeIdentifier(SkillCheck),
      }),
      parameters: DB.Required({
        comment: "Measurable parameters of a Bannzeichen.",
        type: DB.IncludeIdentifier(BannzeichenPerformanceParameters),
      }),
      property: DB.Required({
        comment: "The associated property.",
        type: PropertyIdentifier(),
      }),
      improvement_cost: DB.Required({
        comment: "States which column is used to improve the skill.",
        type: DB.IncludeIdentifier(BannzeichenImprovementCost),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "Bannzeichen",
        DB.Object({
          name: DB.Required({
            comment: `The Bannzeichen’s name.

If the Bannzeichen has an option, the option’s name will/should not be included in the name as well as its surrounding parenthesis. It will/should be combined on demand.`,
            type: DB.String({ minLength: 1 }),
          }),
          name_in_library,
          native_name: DB.Optional({
            comment:
              "The native name of the Bannzeichen. It has to be specified unless it is defined by an option.",
            type: DB.String({ minLength: 1 }),
          }),
          effect: DB.Required({
            comment:
              "The effect description may be either a plain text or a text that is divided by a list of effects for each quality level. It may also be a list for each two quality levels.",
            type: DB.IncludeIdentifier(ActivatableSkillEffect),
          }),
          cost: DB.Optional({
            comment: "The ae-cost of the Bannzeichen",
            type: DB.String({ minLength: 1 }),
          }),
          crafting_time: DB.Optional({
            comment: "The crafting time of the Bannzeichen",
            type: DB.String({ minLength: 1 }),
          }),
          duration: DB.Optional({
            comment: "The duration of the Bannzeichen",
            type: DB.String({ minLength: 1 }),
          }),
          errata: DB.Optional({
            type: DB.IncludeIdentifier(Errata),
          }),
        }),
      ),
    }),
  instanceDisplayName: {},
  uniqueConstraints: [
    {
      entityMapKeyPath: "translations",
      keyPathInEntityMap: "name",
    },
  ],
})

const BannzeichenPerformanceParameters = DB.TypeAlias(import.meta.url, {
  name: "BannzeichenPerformanceParameters",
  comment: "Measurable parameters of a Bannzeichen.",
  type: () =>
    DB.Object({
      cost: DB.Required({
        comment: "The AE cost.",
        type: DB.IncludeIdentifier(BannzeichenCost),
      }),
      crafting_time: DB.Required({
        comment: "The crafting time.",
        type: DB.IncludeIdentifier(BannzeichenCraftingTime),
      }),
      duration: DB.Required({
        comment: "The duration.",
        type: DB.IncludeIdentifier(BannzeichenDuration),
      }),
    }),
})

const BannzeichenCost = DB.Enum(import.meta.url, {
  name: "BannzeichenCost",
  values: () => ({
    Single: DB.EnumCase({ type: DB.IncludeIdentifier(SingleBannzeichenCost) }),
    Disjunction: DB.EnumCase({ type: DB.IncludeIdentifier(BannzeichenCostDisjunction) }),
    Map: DB.EnumCase({ type: DB.IncludeIdentifier(OneTimeCostMap) }),
    DerivedFromOption: DB.EnumCase({ type: null }),
  }),
})

const SingleBannzeichenCost = DB.TypeAlias(import.meta.url, {
  name: "SingleBannzeichenCost",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The AE cost value.",
        type: DB.Integer({ minimum: 1 }),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "SingleBannzeichenCost",
        DB.Object({
          note: DB.Required({
            comment: "A note, appended to the generated string in parenthesis.",
            type: DB.IncludeIdentifier(ResponsiveTextOptional),
          }),
        }),
      ),
    }),
})

const BannzeichenCostDisjunction = DB.TypeAlias(import.meta.url, {
  name: "BannzeichenCostDisjunction",
  type: () =>
    DB.Object({
      list: DB.Required({
        comment: "A set of possible AE cost values.",
        type: DB.Array(DB.IncludeIdentifier(SingleBannzeichenCost), {
          minItems: 2,
          uniqueItems: true,
        }),
      }),
    }),
})

const BannzeichenCraftingTimePerCountable = DB.TypeAlias(import.meta.url, {
  name: "BannzeichenCraftingTimePerCountable",
  type: () =>
    DB.Object({
      translations: NestedTranslationMap(
        DB.Required,
        "BannzeichenCraftingTimePerCountable",
        DB.Object({
          countable: DB.Required({
            comment: "The countable entity name.",
            type: DB.IncludeIdentifier(ResponsiveText),
          }),
        }),
      ),
    }),
})

const BannzeichenCraftingTime = DB.TypeAlias(import.meta.url, {
  name: "BannzeichenCraftingTime",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The crafting time in actions.",
        type: DB.Integer({ minimum: 1 }),
      }),
      per: DB.Optional({
        comment:
          "The crafting time has to be per a specific countable entity, e.g. `8 Actions per person`.",
        type: DB.IncludeIdentifier(BannzeichenCraftingTimePerCountable),
      }),
    }),
})

const BannzeichenDuration = DB.TypeAlias(import.meta.url, {
  name: "BannzeichenDuration",
  type: () =>
    DB.Object({
      slow: DB.Required({
        comment: "The duration on slow Bannzeichen application.",
        type: DB.IncludeIdentifier(ExpressionBasedDuration),
      }),
      fast: DB.Required({
        comment: "The duration on fast Bannzeichen application.",
        type: DB.IncludeIdentifier(ExpressionBasedDuration),
      }),
    }),
})

const BannzeichenImprovementCost = DB.Enum(import.meta.url, {
  name: "BannzeichenImprovementCost",
  values: () => ({
    Constant: DB.EnumCase({ type: DB.IncludeIdentifier(ImprovementCost) }),
    DerivedFromOption: DB.EnumCase({ type: null }),
  }),
})

export const BannzeichenOption = DB.Entity(import.meta.url, {
  name: "BannzeichenOption",
  namePlural: "BannzeichenOptions",
  type: () =>
    DB.Object({
      parent: DB.Required({
        comment: "The Bannzeichen this option belongs to.",
        type: BannzeichenIdentifier(),
      }),
      cost: DB.Optional({
        comment: "The option-specific AE cost.",
        type: DB.IncludeIdentifier(SingleBannzeichenCost),
      }),
      improvement_cost: DB.Optional({
        comment: "The option-specific improvement cost.",
        type: DB.IncludeIdentifier(ImprovementCost),
      }),
      suboption: DB.Optional({
        type: DB.IncludeIdentifier(BannzeichenSuboption),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "BannzeichenOption",
        DB.Object({
          name: DB.Required({
            comment: `The Bannzeichen option’s name.

The surrounding parenthesis will/should not be included, they will/should be generated.`,
            type: DB.String({ minLength: 1 }),
          }),
          native_name: DB.Required({
            comment: "The native name of the Bannzeichen option.",
            type: DB.String({ minLength: 1 }),
          }),
        }),
      ),
    }),
  parentReferenceKey: "parent",
  instanceDisplayName: {},
})

const BannzeichenSuboption = DB.Enum(import.meta.url, {
  name: "BannzeichenSuboption",
  values: () => ({
    Custom: DB.EnumCase({
      comment: "The sub-option may be defined by the user (as a arbitrary text).",
      type: DB.IncludeIdentifier(CustomBannzeichenSuboption),
    }),
  }),
})

const CustomBannzeichenSuboption = DB.TypeAlias(import.meta.url, {
  name: "CustomBannzeichenSuboption",
  type: () =>
    DB.Object({
      translations: NestedTranslationMap(
        DB.Required,
        "CustomBannzeichenSuboption",
        DB.Object(
          {
            examples: DB.Optional({
              comment: "One or more examples for the suboption.",
              type: DB.Array(DB.String({ minLength: 1 }), { minItems: 1, uniqueItems: true }),
            }),
          },
          { minProperties: 1 },
        ),
      ),
    }),
})
