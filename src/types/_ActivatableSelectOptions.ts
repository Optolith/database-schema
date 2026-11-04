import { isEmpty, isNotEmpty } from "@elyukai/utils/array/nonEmpty"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import * as DB from "tsondb/schema/dsl"
import {
  type Case,
  fromUniformCase,
  type GetAllChildInstanceContainersForParent,
  type GetInstanceById,
} from "tsondb/schema/gen"
import type * as Gen from "../../gen/types.js"
import { SelectOptionCategory } from "./_ActivatableSelectOptionCategory.ts"
import { NewSkillApplication, SkillUse } from "./_ActivatableSkillApplicationsAndUses.js"
import { SelectOptionParentIdentifier } from "./_IdentifierGroup.js"
import { GeneralPrerequisites } from "./_Prerequisite.js"
import { NestedTranslationMap } from "./Locale.js"
import { Errata } from "./source/_Erratum.js"
import { optionalSrc } from "./source/_PublicationRef.js"

const SelectOptions = DB.TypeAlias(import.meta.url, {
  name: "SelectOptions",
  comment: `Definitions for possible options for the activatable entry. They can either be derived from entry categories or be defined explicitly. Both can happen as well, but if there is an explicitly defined select option and a derived select option has the same identifier (which may only happen if skill or combat technique identifiers are used for explicit select options), the explicit definition overwrites the derived option.

Note that this is only a full definition of options for simple logic that can be made explicit using the more detailed configuration for both derived categories and explicit options. There are quite a few entries whose option logic cannot be fully represented here, so that it needs to be implemented manually.`,
  type: () =>
    DB.Object(
      {
        derived: DB.Optional({
          comment: `An entry category with optional further configuration. All available entries from the specified categories will be included as separate select options. You can also specify a set of groups that should only be included. Groups not mentioned will be excluded then.`,
          type: DB.IncludeIdentifier(SelectOptionCategory),
        }),
        rules: DB.Optional({
          comment: `Rules for how options can be selected and relate to each other. Defaults to a single predefined option if the entry has select options defined, otherwise undefined.`,
          type: DB.IncludeIdentifier(SelectOptionRules),
        }),
      },
      { minProperties: 1 },
    ),
})

export const select_options = DB.Optional({
  comment: `Definitions for possible options for the activatable entry, derived from entry categories.

Note that this is only a full definition of options for simple logic that can be made explicit using the more detailed configuration for both derived categories and explicit options. There are quite a few entries whose option logic cannot be fully represented here, so that it needs to be implemented manually.`,
  type: DB.IncludeIdentifier(SelectOptions),
})

export const GeneralSelectOption = DB.Entity(import.meta.url, {
  name: "GeneralSelectOption",
  namePlural: "GeneralSelectOptions",
  type: () =>
    DB.Object({
      parent: DB.Required({
        comment: "The entry that contains select option.",
        type: DB.IncludeIdentifier(SelectOptionParentIdentifier),
      }),
      profession_only: DB.Optional({
        comment:
          "Sometimes, professions use specific text selections that are not contained in described lists. This ensures you can use them for professions only. They are not going to be displayed as options to the user.",
        type: DB.Boolean(),
      }),
      skill_applications: DB.Required({
        comment:
          "Registers new applications, which get enabled once this entry is activated with its respective select option. It specifies an entry-unique identifier and the skill it belongs to. A translation can be left out if its name equals the name of the origin select option.",
        type: DB.ChildEntities(NewSkillApplication),
      }),
      skill_uses: DB.Required({
        comment:
          "Registers uses, which get enabled once this entry is activated with its respective select option. It specifies an entry-unique identifier and the skill it belongs to. A translation can be left out if its name equals the name of the origin select option.",
        type: DB.ChildEntities(SkillUse),
      }),
      prerequisites: DB.Optional({
        comment: "Prerequisites for the select option.",
        type: DB.IncludeIdentifier(GeneralPrerequisites),
      }),
      // maximum: DB.Optional({
      //   comment:
      //     "Usually, a select option may only be chosen once. Setting this to a higher number allows the user to select the same option multiple times.",
      //   type: DB.Integer({ minimum: 2 }),
      // }),
      binding_cost: DB.Optional({
        comment:
          "Specific binding cost for the select option. Only has an effect if the associated entry supports binding costs.",
        type: DB.Integer({ minimum: 0 }),
      }),
      ap_value: DB.Optional({
        comment: "Specific AP cost for the select option.",
        type: DB.Integer({ minimum: 1 }),
      }),
      src: optionalSrc,
      translations: NestedTranslationMap(
        DB.Required,
        "GeneralSelectOption",
        DB.Object({
          name: DB.Required({
            comment: "The name of the select option.",
            type: DB.String({ minLength: 1 }),
          }),
          name_in_profession: DB.Optional({
            comment: "The name of the select option when displayed in a generated profession text.",
            type: DB.String({ minLength: 1 }),
          }),
          description: DB.Optional({
            comment:
              "The description of the select option. Useful for Bad Habits, Trade Secrets and other entries where a description is available.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          errata: DB.Optional({
            type: DB.IncludeIdentifier(Errata),
          }),
        }),
      ),
    }),
  parentReferenceKey: "parent",
  instanceDisplayName: {},
  instanceDisplayNameCustomizer: ({
    instance,
    instanceDisplayName,
    instanceDisplayNameLocaleId,
    getDisplayNameForInstanceId,
  }) => ({
    name: `${
      getDisplayNameForInstanceId(instance.parent)?.name ?? "[unknown parent]"
    } — ${instanceDisplayName}`,
    localeId: instanceDisplayNameLocaleId,
  }),
  uniqueConstraints: [
    [
      {
        keyPath: "parent",
      },
      {
        entityMapKeyPath: "translations",
        keyPathInEntityMap: "name",
      },
    ],
  ],
})

export const explicit_select_options = DB.Required({
  comment: `Explicit definitions for possible options for the activatable entry.

Note that this is only a full definition of options for simple logic that can be made explicit using the more detailed configuration for both derived categories and explicit options. There are quite a few entries whose option logic cannot be fully represented here, so that it needs to be implemented manually.`,
  type: DB.ChildEntities(GeneralSelectOption),
})
const ChildEntityForSelectOption = DB.Enum(import.meta.url, {
  name: "ChildEntityForSelectOption",
  comment: `The possible child entities for select options.`,
  values: () => ({
    SkillApplication: DB.EnumCase({ type: null }),
  }),
})

const ChildSelectOptionRuleValue = DB.TypeAlias(import.meta.url, {
  name: "ChildSelectOptionRuleValue",
  type: () =>
    DB.Object({
      parentIndex: DB.Required({
        comment: "The index of the parent select option in the list of selected options.",
        type: DB.Integer({ minimum: 0 }),
      }),
      entity: DB.Required({
        comment: "The entity you can choose from.",
        type: DB.IncludeIdentifier(ChildEntityForSelectOption),
      }),
    }),
})

const PredefinedOrTextInputSelectOptionRuleValue = DB.TypeAlias(import.meta.url, {
  name: "PredefinedOrTextInputSelectOptionRuleValue",
  type: () =>
    DB.Object({
      translations: NestedTranslationMap(
        DB.Required,
        "PredefinedOrTextInputSelectOptionRuleValue",
        DB.Object({
          inputLabel: DB.Required({
            comment: "The label for the text input field.",
            type: DB.String({ minLength: 1 }),
          }),
          optionLabel: DB.Required({
            comment:
              "The label for the extra option in the list of select options that unlocks the text input field.",
            type: DB.String({ minLength: 1 }),
          }),
        }),
      ),
    }),
})

const TextInputSelectOptionRuleValue = DB.TypeAlias(import.meta.url, {
  name: "TextInputSelectOptionRuleValue",
  type: () =>
    DB.Object({
      translations: NestedTranslationMap(
        DB.Required,
        "TextInputSelectOptionRuleValue",
        DB.Object({
          inputLabel: DB.Required({
            comment: "The label for the text input field.",
            type: DB.String({ minLength: 1 }),
          }),
        }),
      ),
    }),
})

const SelectOptionRuleValue = DB.Enum(import.meta.url, {
  name: "SelectOptionRuleValue",
  comment: `The possible values for select option rules.`,
  values: () => ({
    Predefined: DB.EnumCase({
      comment: "An entry that has been defined explicitly or derived from a category.",
      type: null,
    }),
    PredefinedOrTextInput: DB.EnumCase({
      comment:
        "An entry that has been defined explicitly or derived from a category, or a text input if the user sees none of the predefined options fit.",
      type: DB.IncludeIdentifier(PredefinedOrTextInputSelectOptionRuleValue),
    }),
    Child: DB.EnumCase({
      comment: "A child instance of a selected entry, e.g. a skill application for a skill.",
      type: DB.IncludeIdentifier(ChildSelectOptionRuleValue),
    }),
    TextInput: DB.EnumCase({
      comment: "A text input field that can be filled in by the user.",
      type: DB.IncludeIdentifier(TextInputSelectOptionRuleValue),
    }),
  }),
})

const SelectOptionRuleMultiple = DB.Enum(import.meta.url, {
  name: "SelectOptionRuleMultiple",
  values: () => ({
    Constant: DB.EnumCase({
      comment: "A fixed number of options that have to be selected.",
      type: DB.Integer({ minimum: 2 }),
    }),
    Range: DB.EnumCase({
      comment: "A range of numbers of options that can be selected.",
      type: DB.Object({
        min: DB.Optional({
          comment:
            "The minimum number of options that need to be selected. If left empty it defaults to 1.",
          type: DB.Integer({ minimum: 2 }),
        }),
        max: DB.Required({
          comment: "The maximum number of options that need to be selected.",
          type: DB.Integer({ minimum: 2 }),
        }),
      }),
    }),
  }),
})

const SelectOptionRule = DB.TypeAlias(import.meta.url, {
  name: "SelectOptionRule",
  comment: `A rule for how options can be selected and relate to each other.`,
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The value of the rule.",
        type: DB.IncludeIdentifier(SelectOptionRuleValue),
      }),
      multiple: DB.Optional({
        comment: "Sometimes, multiple options from a single list have to or can be chosen.",
        type: DB.IncludeIdentifier(SelectOptionRuleMultiple),
      }),
    }),
})

export const SelectOptionRules = DB.TypeAlias(import.meta.url, {
  name: "SelectOptionRules",
  comment: `Rules for how options can be selected and relate to each other. Defaults to a single predefined option if the entry has select options defined, otherwise undefined.`,
  type: () => DB.Array(DB.IncludeIdentifier(SelectOptionRule), { minItems: 1 }),
  customConstraints: (deps: {
    value: Gen.SelectOptionRules
    getAllChildInstancesForParent: GetAllChildInstanceContainersForParent
  }): string[] => {
    const errorMessages: string[] = []
    const rules = deps.value

    const normalizedRules = rules.flatMap(rule =>
      rule.multiple
        ? Array.from(
            {
              length:
                rule.multiple.kind === "Constant"
                  ? rule.multiple.Constant
                  : rule.multiple.Range.max,
            },
            () => rule,
          )
        : [rule],
    )

    for (const [ruleIndex, rule] of rules.entries()) {
      if (rule.multiple?.kind === "Range" && ruleIndex !== rules.length - 1) {
        errorMessages.push(
          "A select option rule with a range of multiple options can only be the last rule in the list.",
        )
      }

      if (rule.value.kind === "Child") {
        const parentRule = normalizedRules[rule.value.Child.parentIndex]

        if (!parentRule || parentRule.value.kind !== "Predefined") {
          errorMessages.push(
            "A child select option rule must reference a predefined select option rule as its parent.",
          )
        }
      }
    }

    return errorMessages
  },
})

const matchesGenericSkillsSelectOptionCategoryCategory = <Ref>(
  category: Gen.GenericSkillsSelectOptionCategoryCategory<Ref>,
  matchesRef: (ref: Ref) => boolean,
): boolean =>
  category.specific === undefined ||
  category.specific.list.some(matchesRef) === (category.specific.operation.kind === "Intersection")

const matchesGenericSkillsSelectOptionCategory = <Category extends string, Ref>(
  categories: { categories: Case<Category, Gen.GenericSkillsSelectOptionCategoryCategory<Ref>>[] },
  category: Category,
  matchesRef: (ref: Ref) => boolean,
): boolean =>
  categories.categories.some(
    cat =>
      cat.kind === category &&
      matchesGenericSkillsSelectOptionCategoryCategory(cat[category], matchesRef),
  )

const optionMatchesSelectOptions = (
  actualOption:
    | Exclude<Gen.ProfessionActivatableOption, { kind: "Identifier" }>
    | Gen.RequirableSelectOptionIdentifier,
  generalSelectOptions: { id: string; content: Gen.GeneralSelectOption }[],
  derivedSelectOptions: Gen.SelectOptionCategory | undefined,
  getInstanceById: GetInstanceById,
): boolean => {
  switch (actualOption.kind) {
    case "General":
      return generalSelectOptions.some(option => option.id === actualOption.General)
    case "AnimalShape":
      return derivedSelectOptions?.kind === "AnimalShapes"
    case "ArcaneBardTradition":
      return derivedSelectOptions?.kind === "ArcaneBardTraditions"
    case "ArcaneDancerTradition":
      return derivedSelectOptions?.kind === "ArcaneDancerTraditions"
    case "Aspect":
      return derivedSelectOptions?.kind === "Aspects"
    case "Skill":
      return (
        derivedSelectOptions?.kind === "Skills" &&
        derivedSelectOptions.Skills.categories.some(
          category =>
            category.kind === "Skills" &&
            ((category.Skills.specific === undefined && category.Skills.groups === undefined) ||
              category.Skills.specific === undefined ||
              category.Skills.specific.list.some(specific => specific === actualOption.Skill) ===
                (category.Skills.specific.operation.kind === "Intersection") ||
              category.Skills.groups === undefined ||
              (() => {
                const skillGroup = getInstanceById("Skill", actualOption.Skill)?.group
                return skillGroup === undefined || category.Skills.groups.includes(skillGroup)
              })()),
        )
      )
    case "CloseCombatTechnique":
      return (
        derivedSelectOptions?.kind === "CombatTechniques" &&
        matchesGenericSkillsSelectOptionCategory(
          derivedSelectOptions.CombatTechniques,
          "CloseCombatTechniques",
          ref => ref === actualOption.CloseCombatTechnique,
        )
      )
    case "RangedCombatTechnique":
      return (
        derivedSelectOptions?.kind === "CombatTechniques" &&
        matchesGenericSkillsSelectOptionCategory(
          derivedSelectOptions.CombatTechniques,
          "RangedCombatTechniques",
          ref => ref === actualOption.RangedCombatTechnique,
        )
      )
    case "Spell":
      return (
        derivedSelectOptions?.kind === "Skills" &&
        derivedSelectOptions.Skills.categories.some(category => {
          if (category.kind !== "Spells") {
            return false
          }

          const spell = getInstanceById("Spell", actualOption.Spell)

          if (!spell) {
            return false
          }

          return matchesGenericSkillsSelectOptionCategoryCategory(category.Spells, ref => {
            switch (ref.kind) {
              case "Property":
                return spell.property === ref.Property
              case "Single":
                return actualOption.Spell === ref.Single
              default:
                return assertExhaustive(ref)
            }
          })
        })
      )
    case "Ritual":
      return (
        derivedSelectOptions?.kind === "Skills" &&
        derivedSelectOptions.Skills.categories.some(category => {
          if (category.kind !== "Rituals") {
            return false
          }

          const spell = getInstanceById("Ritual", actualOption.Ritual)

          if (!spell) {
            return false
          }

          return matchesGenericSkillsSelectOptionCategoryCategory(category.Rituals, ref => {
            switch (ref.kind) {
              case "Property":
                return spell.property === ref.Property
              case "Single":
                return actualOption.Ritual === ref.Single
              default:
                return assertExhaustive(ref)
            }
          })
        })
      )
    case "LiturgicalChant":
      return (
        derivedSelectOptions?.kind === "Skills" &&
        derivedSelectOptions.Skills.categories.some(
          category =>
            category.kind === "LiturgicalChants" &&
            matchesGenericSkillsSelectOptionCategoryCategory(
              category.LiturgicalChants,
              ref => ref === actualOption.LiturgicalChant,
            ),
        )
      )
    case "Ceremony":
      return (
        derivedSelectOptions?.kind === "Skills" &&
        derivedSelectOptions.Skills.categories.some(
          category =>
            category.kind === "Ceremonies" &&
            matchesGenericSkillsSelectOptionCategoryCategory(
              category.Ceremonies,
              ref => ref === actualOption.Ceremony,
            ),
        )
      )
    case "Disease":
      return derivedSelectOptions?.kind === "Diseases"
    case "Element":
      return (
        derivedSelectOptions?.kind === "Elements" &&
        (derivedSelectOptions.Elements.specific === undefined ||
          derivedSelectOptions.Elements.specific.includes(actualOption.Element))
      )
    case "Language":
      return derivedSelectOptions?.kind === "Languages"
    case "Poison":
      return derivedSelectOptions?.kind === "Poisons"
    case "Property":
      return derivedSelectOptions?.kind === "Properties"
    case "Race":
      return derivedSelectOptions?.kind === "Races"
    case "SkillApplication":
      return false // only as Child config option
    case "TradeSecret":
      return derivedSelectOptions?.kind === "TradeSecrets"
    case "Select":
      return true
    case "Text":
      return false
    default:
      return assertExhaustive(actualOption, `Unknown select option kind`)
  }
}

/**
 * Stub for once option rules are formalized in the database schema.
 */
export const verifyOptionsForActivatableEntry = (
  value: {
    id: Gen.ActivatableIdentifier | Case<"Enhancement", string>
    level?: number
    options?: (Gen.RequirableSelectOptionIdentifier | Gen.ProfessionActivatableOption)[]
  },
  getInstanceById: GetInstanceById,
  getAllChildInstancesForParent: GetAllChildInstanceContainersForParent,
  enforceNumberOfOptions: boolean,
) => {
  if (value.id.kind === "Enhancement") {
    return []
  }

  const referencedInstance = getInstanceById(value.id)

  if (!referencedInstance) {
    return [
      `Referenced instance of entity ${value.id.kind} with id ${fromUniformCase(value.id)} not found.`,
    ]
  }

  const generalSelectOptions = getAllChildInstancesForParent("GeneralSelectOption", value.id)

  const errorMessages: string[] = []

  if (
    !("levels" in referencedInstance && typeof referencedInstance.levels === "number") &&
    value.level !== undefined
  ) {
    errorMessages.push(
      `Referenced instance of entity ${value.id.kind} with id ${fromUniformCase(value.id)} does not have levels, but a level was specified in the prerequisite.`,
    )
  }

  const selectOptions =
    "select_options" in referencedInstance ? referencedInstance.select_options : undefined

  if (
    enforceNumberOfOptions &&
    (selectOptions?.derived !== undefined || isNotEmpty(generalSelectOptions)) &&
    (value.options === undefined || isEmpty(value.options))
  ) {
    errorMessages.push(
      `Referenced instance of entity ${value.id.kind} with id ${fromUniformCase(value.id)} has select options, but no options were specified in the prerequisite.`,
    )
  }

  const optionsConfig: Gen.SelectOptionRules | undefined =
    selectOptions?.rules !== undefined
      ? selectOptions.rules
      : isNotEmpty(generalSelectOptions) || selectOptions?.derived !== undefined
        ? [{ value: { kind: "Predefined" } }]
        : undefined

  const normalizedOptionsConfig =
    optionsConfig?.flatMap(rule => {
      if (rule.multiple) {
        const count =
          rule.multiple.kind === "Constant" ? rule.multiple.Constant : rule.multiple.Range.max
        return Array.from({ length: count }, () => rule)
      }
      return [rule]
    }) ?? []

  const actualOptions = value.options ?? []

  const getNormalizedActualOptionAtIndex = (index: number) => {
    const opt = actualOptions[index]
    return opt === undefined ? undefined : opt.kind === "Identifier" ? opt.Identifier : opt
  }

  for (const [index, configOption] of normalizedOptionsConfig.entries()) {
    const normalizedActualOption = getNormalizedActualOptionAtIndex(index)
    if (!enforceNumberOfOptions && normalizedActualOption === undefined) {
      break
    }
    switch (configOption.value.kind) {
      case "Predefined":
      case "PredefinedOrTextInput": {
        if (normalizedActualOption === undefined) {
          errorMessages.push(
            `Referenced instance of entity ${value.id.kind} with id ${fromUniformCase(value.id)} expected a predefined${configOption.value.kind === "PredefinedOrTextInput" ? " or text input" : ""} option at index ${index.toFixed()}, but got none.`,
          )
        } else if (
          !optionMatchesSelectOptions(
            normalizedActualOption,
            generalSelectOptions,
            selectOptions?.derived,
            getInstanceById,
          ) &&
          !(
            configOption.value.kind === "PredefinedOrTextInput" &&
            normalizedActualOption.kind === "Text"
          )
        ) {
          errorMessages.push(
            `Referenced instance of entity ${value.id.kind} with id ${fromUniformCase(value.id)} expected a predefined${configOption.value.kind === "PredefinedOrTextInput" ? " or text input" : ""} option at index ${index.toFixed()}, but got an option that does not match any of the available select options.`,
          )
        }
        continue
      }
      case "Child": {
        if (normalizedActualOption === undefined) {
          errorMessages.push(
            `Referenced instance of entity ${value.id.kind} with id ${fromUniformCase(value.id)} expected a predefined child option at index ${index.toFixed()}, but got none.`,
          )
        } else {
          const {
            entity: { kind: entity },
            parentIndex,
          } = configOption.value.Child
          if (normalizedActualOption.kind !== entity) {
            errorMessages.push(
              `Referenced instance of entity ${value.id.kind} with id ${fromUniformCase(value.id)} expected a child option of entity ${entity} at index ${index.toFixed()}, but got ${normalizedActualOption.kind}.`,
            )
          } else {
            const childInstance = getInstanceById(entity, normalizedActualOption[entity])
            const parentEntry = getNormalizedActualOptionAtIndex(parentIndex)
            if (parentEntry?.kind !== "Skill" || childInstance?.parent !== parentEntry.Skill) {
              errorMessages.push(
                `Referenced instance of entity ${value.id.kind} with id ${fromUniformCase(value.id)} expected a child option of entity ${entity} at index ${index.toFixed()} that belongs to the skill selected at index ${parentIndex.toFixed()}, but got a child option that does not belong to that skill.`,
              )
            }
          }
        }
        continue
      }
      case "TextInput":
        if (actualOptions[index]?.kind !== "Text" && actualOptions[index]?.kind !== "Select") {
          errorMessages.push(
            `Referenced instance of entity ${value.id.kind} with id ${fromUniformCase(value.id)} expected a text input option at index ${index.toFixed()}, but got ${actualOptions[index]?.kind ?? "none"}.`,
          )
        }
        continue
      default:
        return assertExhaustive(configOption.value, `Unknown select option rule value kind`)
    }
  }

  if (actualOptions.length > normalizedOptionsConfig.length) {
    errorMessages.push(
      `Referenced instance of entity ${value.id.kind} with id ${fromUniformCase(value.id)} has more options specified (${actualOptions.length.toFixed()}) than allowed by the select option rules (${normalizedOptionsConfig.length.toFixed()}).`,
    )
  }

  return errorMessages
}
