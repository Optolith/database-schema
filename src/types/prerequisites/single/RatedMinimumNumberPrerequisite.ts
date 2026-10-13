import * as DB from "tsondb/schema/dsl"
import { AspectIdentifier, PropertyIdentifier, SkillIdentifier } from "../../_Identifier.js"
import { DisplayOption } from "../DisplayOption.js"

export const RatedMinimumNumberPrerequisite = DB.TypeAlias(import.meta.url, {
  name: "RatedMinimumNumberPrerequisite",
  type: () =>
    DB.Object({
      number: DB.Required({
        comment:
          "The minimum number of skills that need to be on the defined minimum skill rating.",
        type: DB.Integer({ minimum: 1 }),
      }),
      value: DB.Required({
        comment: "The minimum skill rating the defined minimum number of skills need to be on.",
        type: DB.Integer({ minimum: 1 }),
      }),
      targets: DB.Required({
        comment: "The targets that contribute to satisfying the prerequisite.",
        type: DB.IncludeIdentifier(RatedMinimumNumberPrerequisiteTarget),
      }),
      display_option: DB.Optional({
        type: DB.IncludeIdentifier(DisplayOption),
      }),
    }),
})

const RatedMinimumNumberPrerequisiteTarget = DB.Enum(import.meta.url, {
  name: "RatedMinimumNumberPrerequisiteTarget",
  values: () => ({
    Skills: DB.EnumCase({ type: DB.IncludeIdentifier(RatedMinimumNumberPrerequisiteSkillsTarget) }),
    CombatTechniques: DB.EnumCase({
      type: DB.IncludeIdentifier(RatedMinimumNumberPrerequisiteCombatTechniquesTarget),
    }),
    Spellworks: DB.EnumCase({
      type: DB.IncludeIdentifier(RatedMinimumNumberPrerequisiteSpellworksTarget),
    }),
    Liturgies: DB.EnumCase({
      type: DB.IncludeIdentifier(RatedMinimumNumberPrerequisiteLiturgiesTarget),
    }),
  }),
})

export const RatedMinimumNumberPrerequisiteSkillsTarget = DB.TypeAlias(import.meta.url, {
  name: "RatedMinimumNumberPrerequisiteSkillsTarget",
  type: () =>
    DB.Object({
      targets: DB.Required({
        comment: "The skills that are taken into account for satisfying the prerequisite.",
        type: DB.Array(SkillIdentifier(), { minItems: 2, uniqueItems: true }),
      }),
    }),
})

export const RatedMinimumNumberPrerequisiteCombatTechniquesTarget = DB.TypeAlias(import.meta.url, {
  name: "RatedMinimumNumberPrerequisiteCombatTechniquesTarget",
  type: () =>
    DB.Object({
      group: DB.Required({
        comment: "The skills that are taken into account for satisfying the prerequisite.",
        type: DB.IncludeIdentifier(RatedMinimumNumberPrerequisiteCombatTechniquesTargetGroup),
      }),
    }),
})

const RatedMinimumNumberPrerequisiteCombatTechniquesTargetGroup = DB.Enum(import.meta.url, {
  name: "RatedMinimumNumberPrerequisiteCombatTechniquesTargetGroup",
  values: () => ({
    All: DB.EnumCase({ type: null }),
    Close: DB.EnumCase({ type: null }),
    Ranged: DB.EnumCase({ type: null }),
  }),
})

export const RatedMinimumNumberPrerequisiteSpellworksTarget = DB.TypeAlias(import.meta.url, {
  name: "RatedMinimumNumberPrerequisiteSpellworksTarget",
  type: () =>
    DB.Object({
      property: DB.Required({
        comment:
          "The property of which the spells are taken into account for satisfying the prerequisite.",
        type: PropertyIdentifier(),
      }),
    }),
})

export const RatedMinimumNumberPrerequisiteLiturgiesTarget = DB.TypeAlias(import.meta.url, {
  name: "RatedMinimumNumberPrerequisiteLiturgiesTarget",
  type: () =>
    DB.Object({
      aspect: DB.Required({
        comment:
          "The aspect of which the liturgical chants are taken into account for satisfying the prerequisite.",
        type: AspectIdentifier(),
      }),
    }),
})
