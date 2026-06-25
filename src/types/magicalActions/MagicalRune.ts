import * as DB from "tsondb/schema/dsl"
import { name_in_library } from "../_Activatable.js"
import { OldParameter } from "../_ActivatableSkill.js"
import { ExpressionBasedDuration } from "../_ActivatableSkillDuration.ts"
import { ActivatableSkillEffect } from "../_ActivatableSkillEffect.js"
import { MagicalRuneIdentifier, PropertyIdentifier } from "../_Identifier.js"
import { CombatTechniqueIdentifier } from "../_IdentifierGroup.js"
import { ImprovementCost } from "../_ImprovementCost.js"
import { ResponsiveText, ResponsiveTextOptional } from "../_ResponsiveText.js"
import { SkillCheck } from "../_SkillCheck.js"
import { NestedTranslationMap } from "../Locale.js"
import { Errata } from "../source/_Erratum.js"
import { src } from "../source/_PublicationRef.js"

export const MagicalRune = DB.Entity(import.meta.url, {
  name: "MagicalRune",
  namePlural: "MagicalRunes",
  type: () =>
    DB.Object({
      options: DB.Required({
        comment: `The options the magical rune has, if any.

If there are multiple options, the magical rune may be activated for each option, that is, multiple times.`,
        type: DB.ChildEntities(MagicalRuneOption),
      }),
      check: DB.Required({
        comment: "Lists the linked three attributes used to make a skill check.",
        type: DB.IncludeIdentifier(SkillCheck),
      }),
      check_penalty: DB.Optional({
        comment: "In some cases, the target's Spirit or Toughness is applied as a penalty.",
        type: DB.IncludeIdentifier(MagicalRuneCheckPenalty),
      }),
      parameters: DB.Required({
        comment: "Measurable parameters of a magical rune.",
        type: DB.IncludeIdentifier(MagicalRunePerformanceParameters),
      }),
      property: DB.Required({
        comment: "The associated property.",
        type: PropertyIdentifier(),
      }),
      improvement_cost: DB.Required({
        comment: "States which column is used to improve the skill.",
        type: DB.IncludeIdentifier(MagicalRuneImprovementCost),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "MagicalRune",
        DB.Object({
          name: DB.Required({
            comment: `The magical rune’s name.

If the rune has an option, the option’s name will/should not be included in the name as well as its surrounding parenthesis. It will/should be combined on demand.`,
            type: DB.String({ minLength: 1 }),
          }),
          name_in_library,
          native_name: DB.Optional({
            comment:
              "The native name of the magical rune. It has to be specified unless it is defined by an option.",
            type: DB.String({ minLength: 1 }),
          }),
          effect: DB.Required({
            comment:
              "The effect description may be either a plain text or a text that is divided by a list of effects for each quality level. It may also be a list for each two quality levels.",
            type: DB.IncludeIdentifier(ActivatableSkillEffect),
          }),
          cost: DB.Optional({
            isDeprecated: true,
            type: DB.IncludeIdentifier(OldParameter),
          }),
          crafting_time: DB.Optional({
            isDeprecated: true,
            type: DB.IncludeIdentifier(OldParameterBySpeed),
          }),
          duration: DB.Optional({
            isDeprecated: true,
            type: DB.IncludeIdentifier(OldParameterBySpeed),
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

const OldParameterBySpeed = DB.TypeAlias(import.meta.url, {
  name: "OldParameterBySpeed",
  type: () =>
    DB.Object({
      slow: DB.Required({
        type: DB.IncludeIdentifier(OldParameter),
      }),
      fast: DB.Required({
        type: DB.IncludeIdentifier(OldParameter),
      }),
    }),
})

const MagicalRuneCheckPenalty = DB.Enum(import.meta.url, {
  name: "MagicalRuneCheckPenalty",
  values: () => ({
    CombatTechnique: DB.EnumCase({
      type: DB.IncludeIdentifier(MagicalRuneCombatTechniqueCheckPenalty),
    }),
  }),
})

const MagicalRuneCombatTechniqueCheckPenalty = DB.TypeAlias(import.meta.url, {
  name: "MagicalRuneCombatTechniqueCheckPenalty",
  type: () =>
    DB.Object({
      map: DB.Required({
        comment: "A map from combat techniques to their modifiers.",
        type: DB.Array(DB.IncludeIdentifier(MagicalRuneCombatTechniqueCheckPenaltyMapping), {
          minItems: 1,
        }),
      }),
      rest: DB.Required({
        type: DB.IncludeIdentifier(MagicalRuneCombatTechniqueCheckPenaltyRest),
      }),
    }),
})

const MagicalRuneCombatTechniqueCheckPenaltyMapping = DB.TypeAlias(import.meta.url, {
  name: "MagicalRuneCombatTechniqueCheckPenaltyMapping",
  type: () =>
    DB.Object({
      id: DB.Required({
        comment: "The combat technique’s identifier.",
        type: DB.IncludeIdentifier(CombatTechniqueIdentifier),
      }),
      modifier: DB.Required({
        comment: "The check modifier for the specified combat technique.",
        type: DB.Integer(),
      }),
    }),
})

const MagicalRuneCombatTechniqueCheckPenaltyRest = DB.TypeAlias(import.meta.url, {
  name: "MagicalRuneCombatTechniqueCheckPenaltyRest",
  type: () =>
    DB.Object({
      modifier: DB.Required({
        comment: "The check modifier for combat techniques not specified in `map`.",
        type: DB.Integer(),
      }),
    }),
})

const MagicalRunePerformanceParameters = DB.TypeAlias(import.meta.url, {
  name: "MagicalRunePerformanceParameters",
  comment: "Measurable parameters of a magical rune.",
  type: () =>
    DB.Object({
      cost: DB.Required({
        comment: "The AE cost.",
        type: DB.IncludeIdentifier(MagicalRuneCost),
      }),
      crafting_time: DB.Required({
        comment: "The crafting time.",
        type: DB.IncludeIdentifier(MagicalRuneCraftingTime),
      }),
      duration: DB.Required({
        comment: "The duration.",
        type: DB.IncludeIdentifier(MagicalRuneDuration),
      }),
    }),
})

const MagicalRuneCost = DB.Enum(import.meta.url, {
  name: "MagicalRuneCost",
  values: () => ({
    Single: DB.EnumCase({ type: DB.IncludeIdentifier(SingleMagicalRuneCost) }),
    Disjunction: DB.EnumCase({ type: DB.IncludeIdentifier(MagicalRuneCostDisjunction) }),
    DerivedFromOption: DB.EnumCase({ type: null }),
  }),
})

const SingleMagicalRuneCost = DB.TypeAlias(import.meta.url, {
  name: "SingleMagicalRuneCost",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The AE cost value.",
        type: DB.Integer({ minimum: 1 }),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "SingleMagicalRuneCost",
        DB.Object({
          note: DB.Required({
            comment: "A note, appended to the generated string in parenthesis.",
            type: DB.IncludeIdentifier(ResponsiveTextOptional),
          }),
        }),
      ),
    }),
})

const MagicalRuneCostDisjunction = DB.TypeAlias(import.meta.url, {
  name: "MagicalRuneCostDisjunction",
  type: () =>
    DB.Object({
      list: DB.Required({
        comment: "A set of possible AE cost values.",
        type: DB.Array(DB.IncludeIdentifier(SingleMagicalRuneCost), {
          minItems: 2,
          uniqueItems: true,
        }),
      }),
    }),
})

const MagicalRuneCraftingTimePerCountable = DB.TypeAlias(import.meta.url, {
  name: "MagicalRuneCraftingTimePerCountable",
  type: () =>
    DB.Object({
      translations: NestedTranslationMap(
        DB.Required,
        "MagicalRuneCraftingTimePerCountable",
        DB.Object({
          countable: DB.Required({
            comment: "The countable entity name.",
            type: DB.IncludeIdentifier(ResponsiveText),
          }),
        }),
      ),
    }),
})

const MagicalRuneCraftingTime = DB.TypeAlias(import.meta.url, {
  name: "MagicalRuneCraftingTime",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The crafting time in actions.",
        type: DB.Integer({ minimum: 1 }),
      }),
      per: DB.Optional({
        comment:
          "The crafting time has to be per a specific countable entity, e.g. `8 Actions per person`.",
        type: DB.IncludeIdentifier(MagicalRuneCraftingTimePerCountable),
      }),
    }),
})

const MagicalRuneDuration = DB.TypeAlias(import.meta.url, {
  name: "MagicalRuneDuration",
  type: () =>
    DB.Object({
      slow: DB.Required({
        comment: "The duration on slow rune application.",
        type: DB.IncludeIdentifier(ExpressionBasedDuration),
      }),
      fast: DB.Required({
        comment: "The duration on fast rune application.",
        type: DB.IncludeIdentifier(ExpressionBasedDuration),
      }),
    }),
})

const MagicalRuneImprovementCost = DB.Enum(import.meta.url, {
  name: "MagicalRuneImprovementCost",
  values: () => ({
    Constant: DB.EnumCase({ type: DB.IncludeIdentifier(ImprovementCost) }),
    DerivedFromOption: DB.EnumCase({ type: null }),
  }),
})

export const MagicalRuneOption = DB.Entity(import.meta.url, {
  name: "MagicalRuneOption",
  namePlural: "MagicalRuneOptions",
  type: () =>
    DB.Object({
      parent: DB.Required({
        comment: "The magical rune this option belongs to.",
        type: MagicalRuneIdentifier(),
      }),
      cost: DB.Optional({
        comment: "The option-specific AE cost.",
        type: DB.IncludeIdentifier(SingleMagicalRuneCost),
      }),
      improvement_cost: DB.Optional({
        comment: "The option-specific improvement cost.",
        type: DB.IncludeIdentifier(ImprovementCost),
      }),
      suboption: DB.Optional({
        type: DB.IncludeIdentifier(MagicalRuneSuboption),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "MagicalRuneOption",
        DB.Object({
          name: DB.Required({
            comment: `The magical rune option’s name.

The surrounding parenthesis will/should not be included, they will/should be generated.`,
            type: DB.String({ minLength: 1 }),
          }),
          native_name: DB.Required({
            comment: "The native name of the magical rune option.",
            type: DB.String({ minLength: 1 }),
          }),
        }),
      ),
    }),
  parentReferenceKey: "parent",
  instanceDisplayName: {},
})

const MagicalRuneSuboption = DB.Enum(import.meta.url, {
  name: "MagicalRuneSuboption",
  values: () => ({
    Custom: DB.EnumCase({
      comment: "The sub-option may be defined by the user (as a arbitrary text).",
      type: DB.IncludeIdentifier(CustomMagicalRuneSuboption),
    }),
  }),
})

const CustomMagicalRuneSuboption = DB.TypeAlias(import.meta.url, {
  name: "CustomMagicalRuneSuboption",
  type: () =>
    DB.Object({
      translations: NestedTranslationMap(
        DB.Required,
        "CustomMagicalRuneSuboption",
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
