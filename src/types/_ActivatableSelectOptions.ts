import { isEmpty, isNotEmpty } from "@elyukai/utils/array/nonEmpty"
import * as DB from "tsondb/schema/dsl"
import {
  Case,
  fromUniformCase,
  type GetAllChildInstanceContainersForParent,
  type GetInstanceById,
} from "tsondb/schema/gen"
import type {
  ActivatableIdentifier,
  ProfessionSpecialAbilityOption,
  RequirableSelectOptionIdentifier,
  SelectOptions,
} from "../../gen/types.js"
import { SelectOptionCategory } from "./_ActivatableSelectOptionCategory.js"
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
})

export const verifySelectOptionRules = (
  _entity: ActivatableIdentifier["kind"],
  deps: {
    instanceId: string
    instanceContent: {
      select_options?: SelectOptions
    }
    getAllChildInstancesForParent: GetAllChildInstanceContainersForParent
  },
): string[] => {
  const errorMessages: string[] = []
  const rules = deps.instanceContent.select_options?.rules

  if (rules) {
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
  }
  return errorMessages
}

/**
 * Stub for once option rules are formalized in the database schema.
 */
export const verifyOptionsForActivatableEntry = (
  value: {
    id: ActivatableIdentifier | Case<"Enhancement", string>
    level?: number
    options?: (RequirableSelectOptionIdentifier | ProfessionSpecialAbilityOption)[]
  },
  getInstanceById: GetInstanceById,
  getAllChildInstancesForParent: GetAllChildInstanceContainersForParent,
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
      `The referenced instance of entity ${value.id.kind} with id ${fromUniformCase(
        value.id,
      )} does not have levels, but a level was specified in the prerequisite.`,
    )
  }

  if (
    (("select_options" in referencedInstance &&
      referencedInstance.select_options?.derived !== undefined) ||
      isNotEmpty(generalSelectOptions)) &&
    (value.options === undefined || isEmpty(value.options))
  ) {
    errorMessages.push(
      `The referenced instance of entity ${value.id.kind} with id ${fromUniformCase(
        value.id,
      )} has select options, but no options were specified in the prerequisite.`,
    )
  }

  for (const option of value.options ?? []) {
    if (option.kind === "General") {
      const referencedOption = getInstanceById(Case("GeneralSelectOption", option.General))

      if (!referencedOption) {
        errorMessages.push(
          `Referenced select option of entity GeneralSelectOption with id ${fromUniformCase(
            option,
          )} not found.`,
        )
      }

      if (referencedOption?.parent !== value.id) {
        errorMessages.push(
          `Referenced select option of entity GeneralSelectOption with id ${fromUniformCase(
            option,
          )} does not belong to the instance of entity ${value.id.kind} with id ${fromUniformCase(
            value.id,
          )}.`,
        )
      }
    }
  }

  return []
}
