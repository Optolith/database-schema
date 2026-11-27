import * as DB from "tsondb/schema/dsl"
import { verifyOptionsForActivatableEntry } from "../../_ActivatableSelectOptions.ts"
import { ActivatableIdentifier, RequirableSelectOptionIdentifier } from "../../_IdentifierGroup.js"
import { ProfessionActivatableOption } from "../../Profession.ts"
import { Preconditions } from "../ConditionalPrerequisites.js"
import { DisplayOption } from "../DisplayOption.js"

export const ActivatablePrerequisite = DB.TypeAlias(import.meta.url, {
  name: "ActivatablePrerequisite",
  comment: "Requires a specific advantage, disadvantage or special ability.",
  type: () =>
    DB.Object({
      id: DB.Required({
        comment: "The activatable entry’s identifier.",
        type: DB.IncludeIdentifier(ActivatableIdentifier),
      }),
      active: DB.Required({
        comment: "If the required entry should be required to be active or inactive.",
        type: DB.Boolean(),
      }),
      level: DB.Optional({
        comment: "The required minimum level of the entry.",
        type: DB.Integer({ minimum: 1 }),
      }),
      options: DB.Optional({
        comment:
          "Required select options. Order is important. Typically, you only need the first array index, though.",
        type: DB.Array(DB.IncludeIdentifier(RequirableSelectOptionIdentifier), { minItems: 1 }),
      }),
      display_option: DB.Optional({
        type: DB.IncludeIdentifier(DisplayOption),
      }),
      when: DB.Optional({
        type: DB.IncludeIdentifier(Preconditions),
      }),
    }),
  customConstraints: ({ value, getInstanceById, getAllChildInstancesForParent }) =>
    verifyOptionsForActivatableEntry(value, getInstanceById, getAllChildInstancesForParent, false),
})

export const ProfessionActivatablePrerequisite = DB.TypeAlias(import.meta.url, {
  name: "ProfessionActivatablePrerequisite",
  comment: "Requires a specific advantage, disadvantage or special ability in a profession.",
  type: () =>
    DB.Object({
      id: DB.Required({
        comment: "The activatable entry’s identifier.",
        type: DB.IncludeIdentifier(ActivatableIdentifier),
      }),
      active: DB.Required({
        comment: "If the required entry should be required to be active or inactive.",
        type: DB.Boolean(),
      }),
      level: DB.Optional({
        comment: "The required minimum level of the entry.",
        type: DB.Integer({ minimum: 1 }),
      }),
      options: DB.Optional({
        comment:
          "Required select options. Order is important. Typically, you only need the first array index, though.",
        type: DB.Array(DB.IncludeIdentifier(ProfessionActivatableOption), { minItems: 1 }),
      }),
      display_option: DB.Optional({
        type: DB.IncludeIdentifier(DisplayOption),
      }),
      when: DB.Optional({
        type: DB.IncludeIdentifier(Preconditions),
      }),
    }),
  customConstraints: ({ value, getInstanceById, getAllChildInstancesForParent }) =>
    verifyOptionsForActivatableEntry(value, getInstanceById, getAllChildInstancesForParent, true),
})
