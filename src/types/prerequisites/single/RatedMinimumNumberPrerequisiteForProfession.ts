import * as DB from "tsondb/schema/dsl"
import { PropertyIdentifier } from "../../_Identifier.ts"
import { SpecialAbilityIdentifier } from "../../_IdentifierGroup.ts"
import { DisplayOption } from "../DisplayOption.ts"
import {
  RatedMinimumNumberPrerequisiteCombatTechniquesTarget,
  RatedMinimumNumberPrerequisiteLiturgiesTarget,
  RatedMinimumNumberPrerequisiteSkillsTarget,
} from "./RatedMinimumNumberPrerequisite.ts"

export const RatedMinimumNumberPrerequisiteForProfession = DB.TypeAlias(import.meta.url, {
  name: "RatedMinimumNumberPrerequisiteForProfession",
  type: () =>
    DB.Object({
      number: DB.Required({
        comment:
          "The minimum number of skills that need to be on the defined minimum skill rating.",
        type: DB.Integer({ minimum: 1 }),
      }),
      value: DB.Required({
        comment: "The minimum skill rating the defined minimum number of skills need to be on.",
        type: DB.Integer({ minimum: 0 }),
      }),
      targets: DB.Required({
        comment: "The targets that contribute to satisfying the prerequisite.",
        type: DB.IncludeIdentifier(RatedMinimumNumberPrerequisiteTargetForProfession),
      }),
      display_option: DB.Optional({
        type: DB.IncludeIdentifier(DisplayOption),
      }),
    }),
})

const RatedMinimumNumberPrerequisiteTargetForProfession = DB.Enum(import.meta.url, {
  name: "RatedMinimumNumberPrerequisiteTargetForProfession",
  values: () => ({
    Skills: DB.EnumCase({ type: DB.IncludeIdentifier(RatedMinimumNumberPrerequisiteSkillsTarget) }),
    CombatTechniques: DB.EnumCase({
      type: DB.IncludeIdentifier(RatedMinimumNumberPrerequisiteCombatTechniquesTarget),
    }),
    Spellworks: DB.EnumCase({
      type: DB.IncludeIdentifier(RatedMinimumNumberPrerequisiteSpellworksTargetForProfession),
    }),
    Liturgies: DB.EnumCase({
      type: DB.IncludeIdentifier(RatedMinimumNumberPrerequisiteLiturgiesTarget),
    }),
  }),
})

export const RatedMinimumNumberPrerequisiteSpellworksTargetForProfession = DB.Enum(
  import.meta.url,
  {
    name: "RatedMinimumNumberPrerequisiteSpellworksTargetForProfession",
    values: () => ({
      Specific: DB.EnumCase({
        comment:
          "The property of which the spells are taken into account for satisfying the prerequisite.",
        type: PropertyIdentifier(),
      }),
      SelectOptions: DB.EnumCase({
        comment:
          "The property/-ies of which the spells are taken into account for satisfying the prerequisite is taken from a special ability with a property select option. All instances of the special ability and thus all selected properties, if the special ability has been bought multiple times, are used to collect applicable properties.",
        type: DB.IncludeIdentifier(SpecialAbilityIdentifier),
      }),
    }),
  },
)
