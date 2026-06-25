import * as DB from "tsondb/schema/dsl"
import {
  CloseCombatTechniqueIdentifier,
  RaceIdentifier,
  RangedCombatTechniqueIdentifier,
  WeaponIdentifier,
} from "./_Identifier.js"
import {
  CombatRelatedSpecialAbilityIdentifier,
  CombatTechniqueIdentifier,
} from "./_IdentifierGroup.js"
import { NestedTranslationMap } from "./Locale.js"

const CombatSpecialAbilityUsageType = DB.Enum(import.meta.url, {
  name: "CombatSpecialAbilityUsageType",
  comment: "The definition of how the combat special ability can be used in combat.",
  values: () => ({
    Passive: DB.EnumCase({ type: null }),
    BasicManeuver: DB.EnumCase({ type: null }),
    SpecialManeuver: DB.EnumCase({ type: null }),
  }),
})

export const usage_type = DB.Required({
  comment: "The definition of how the combat special ability can be used in combat.",
  type: DB.IncludeIdentifier(CombatSpecialAbilityUsageType),
})

const CombatSpecialAbilityType = DB.Enum(import.meta.url, {
  name: "CombatSpecialAbilityType",
  comment:
    "The definition of if the combat special ability can be used when armed or when unarmed.",
  values: () => ({
    Armed: DB.EnumCase({ type: null }),
    Unarmed: DB.EnumCase({ type: null }),
  }),
})

export const type = DB.Required({
  comment:
    "The definition of if the combat special ability can be used when armed or when unarmed.",
  type: DB.IncludeIdentifier(CombatSpecialAbilityType),
})

const Penalty = DB.Enum(import.meta.url, {
  name: "Penalty",
  comment: "The penalty the special ability gives when used.",
  values: () => ({
    Single: DB.EnumCase({ type: DB.IncludeIdentifier(SinglePenalty) }),
    ByHandedness: DB.EnumCase({ type: DB.IncludeIdentifier(PenaltyByHandedness) }),
    ByActivation: DB.EnumCase({ type: DB.IncludeIdentifier(PenaltyByActivation) }),
    Selection: DB.EnumCase({ type: DB.IncludeIdentifier(PenaltySelection) }),
    ByLevel: DB.EnumCase({ type: DB.IncludeIdentifier(PenaltyByLevel) }),
    ByAttack: DB.EnumCase({ type: DB.IncludeIdentifier(PenaltyByAttack) }),
    DependsOnHitZone: DB.EnumCase({ type: null }),
  }),
})

export const penalty = DB.Optional({
  comment: "The penalty the special ability gives when used.",
  type: DB.IncludeIdentifier(Penalty),
})

export const penalty_l10n = DB.Optional({
  comment: "The penalty the special ability gives when used.",
  isDeprecated: true,
  type: DB.String({ minLength: 1 }),
})

const SinglePenalty = DB.TypeAlias(import.meta.url, {
  name: "SinglePenalty",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The penalty value.",
        type: DB.Integer(),
      }),
      applies_to_parry: DB.Optional({
        comment: "Set to `true` if the penalty applies to the parry instead of the attack.",
        type: DB.Boolean(),
      }),
    }),
})

const PenaltyByHandedness = DB.TypeAlias(import.meta.url, {
  name: "PenaltyByHandedness",
  type: () =>
    DB.Object({
      one_handed: DB.Required({
        comment: "The penalty value for one-handed weapons.",
        type: DB.Integer(),
      }),
      two_handed: DB.Required({
        comment: "The penalty value for two-handed weapons.",
        type: DB.Integer(),
      }),
      applies_to_parry: DB.Optional({
        comment: "Set to `true` if the penalty applies to the parry instead of the attack.",
        type: DB.Boolean(),
      }),
    }),
})

const PenaltyByActivation = DB.TypeAlias(import.meta.url, {
  name: "PenaltyByActivation",
  type: () =>
    DB.Object({
      active: DB.Required({
        comment: "The penalty value if the entry has been bought by the character.",
        type: DB.Integer(),
      }),
      inactive: DB.Required({
        comment: "The penalty value if the entry has not been bought by the character.",
        type: DB.Integer(),
      }),
      applies_to_parry: DB.Optional({
        comment: "Set to `true` if the penalty applies to the parry instead of the attack.",
        type: DB.Boolean(),
      }),
    }),
})

const PenaltySelection = DB.TypeAlias(import.meta.url, {
  name: "PenaltySelection",
  type: () =>
    DB.Object({
      options: DB.Required({
        type: DB.IncludeIdentifier(PenaltySelectionOptions),
      }),
    }),
})

const PenaltySelectionOptions = DB.Enum(import.meta.url, {
  name: "PenaltySelectionOptions",
  values: () => ({
    Specific: DB.EnumCase({ type: DB.IncludeIdentifier(SpecificPenaltySelectionOptions) }),
    Range: DB.EnumCase({ type: DB.IncludeIdentifier(PenaltySelectionOptionsRange) }),
  }),
})

const SpecificPenaltySelectionOptions = DB.TypeAlias(import.meta.url, {
  name: "SpecificPenaltySelectionOptions",
  type: () =>
    DB.Object({
      list: DB.Required({
        comment: "The list of specific penalty options.",
        type: DB.Array(DB.IncludeIdentifier(SpecificPenaltySelectionOption), { minItems: 2 }),
      }),
    }),
})

const SpecificPenaltySelectionOption = DB.TypeAlias(import.meta.url, {
  name: "SpecificPenaltySelectionOption",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The penalty value.",
        type: DB.Integer(),
      }),
    }),
})

const PenaltySelectionOptionsRange = DB.TypeAlias(import.meta.url, {
  name: "PenaltySelectionOptionsRange",
  type: () =>
    DB.Object({
      minimum: DB.Required({
        comment: "The minimum penalty value.",
        type: DB.Integer(),
      }),
      maximum: DB.Required({
        comment: "The maximum penalty value.",
        type: DB.Integer(),
      }),
    }),
})

const PenaltyByLevel = DB.TypeAlias(import.meta.url, {
  name: "PenaltyByLevel",
  type: () =>
    DB.Object({
      levels: DB.Required({
        comment:
          "A continuous range of penalties for each level. The first element is the penalty for the first level, the second element is the penalty for the second level, and so on.",
        type: DB.Array(DB.IncludeIdentifier(PenaltyByLevelLevel), { minItems: 2 }),
      }),
      external: DB.Optional({
        comment:
          "The combat-related special ability of which the level defines the penalty instead.",
        type: DB.IncludeIdentifier(PenaltyByExternalLevel),
      }),
    }),
})

const PenaltyByLevelLevel = DB.TypeAlias(import.meta.url, {
  name: "PenaltyByLevelLevel",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The penalty value for this level.",
        type: DB.Integer(),
      }),
    }),
})

const PenaltyByExternalLevel = DB.TypeAlias(import.meta.url, {
  name: "PenaltyByExternalLevel",
  comment: "The combat-related special ability of which the level defines the penalty instead.",
  type: () =>
    DB.Object({
      id: DB.Required({
        comment:
          "The identifier of the combat-related special ability of which the level defines the penalty instead.",
        type: DB.IncludeIdentifier(CombatRelatedSpecialAbilityIdentifier),
      }),
    }),
})

const PenaltyByAttack = DB.TypeAlias(import.meta.url, {
  name: "PenaltyByAttack",
  type: () =>
    DB.Object({
      list: DB.Required({
        comment:
          "A list of penalties for subsequent attacks. The first element is the penalty for the first attack, the second element is the penalty for the second attack, and so on. The order of the first element may be changed using `initial_order`, so that e.g. if set to `2`, the first element is the penalty for the second attack, the second element is the penalty for the third attack, and so on.",
        type: DB.Array(DB.IncludeIdentifier(PenaltyByAttackOrderItem), { minItems: 1 }),
      }),
      initial_order: DB.Optional({
        comment: "The order of the first element in the `list` of penalties.",
        type: DB.Integer(),
      }),
      attack_replacement: DB.Optional({
        comment:
          "Set if a predefined different word should be used instead of the word `attack` for display purposes.",
        type: DB.IncludeIdentifier(PenaltyByAttackReplacement),
      }),
    }),
})

const PenaltyByAttackOrderItem = DB.TypeAlias(import.meta.url, {
  name: "PenaltyByAttackOrderItem",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The penalty value for this order.",
        type: DB.Integer(),
      }),
    }),
})

const PenaltyByAttackReplacement = DB.Enum(import.meta.url, {
  name: "PenaltyByAttackReplacement",
  comment:
    "Set if a predefined different word should be used instead of the word `attack` for display purposes.",
  values: () => ({
    Throw: DB.EnumCase({ type: null }),
  }),
})

const ApplicableCombatTechniques = DB.Enum(import.meta.url, {
  name: "ApplicableCombatTechniques",
  values: () => ({
    None: DB.EnumCase({ type: null }),
    DependingOnCombatStyle: DB.EnumCase({ type: null }),
    All: DB.EnumCase({ type: DB.IncludeIdentifier(AllApplicableCombatTechniques) }),
    AllClose: DB.EnumCase({ type: DB.IncludeIdentifier(AllApplicableCloseCombatTechniques) }),
    AllRanged: DB.EnumCase({ type: DB.IncludeIdentifier(AllApplicableRangedCombatTechniques) }),
    Specific: DB.EnumCase({ type: DB.IncludeIdentifier(SpecificApplicableCombatTechniques) }),
  }),
})

export const combat_techniques = DB.Required({
  comment: "The combat techniques the special ability is applicable to.",
  type: DB.IncludeIdentifier(ApplicableCombatTechniques),
})

const AllApplicableCombatTechniques = DB.TypeAlias(import.meta.url, {
  name: "AllApplicableCombatTechniques",
  type: () =>
    DB.Object({
      restriction: DB.Optional({
        type: DB.IncludeIdentifier(ApplicableAllCombatTechniquesRestriction),
      }),
    }),
})

const AllApplicableCloseCombatTechniques = DB.TypeAlias(import.meta.url, {
  name: "AllApplicableCloseCombatTechniques",
  type: () =>
    DB.Object({
      restriction: DB.Optional({
        type: DB.IncludeIdentifier(ApplicableCloseCombatTechniquesRestriction),
      }),
    }),
})

const AllApplicableRangedCombatTechniques = DB.TypeAlias(import.meta.url, {
  name: "AllApplicableRangedCombatTechniques",
  type: () =>
    DB.Object({
      restriction: DB.Optional({
        type: DB.IncludeIdentifier(ApplicableRangedCombatTechniquesRestriction),
      }),
    }),
})

const SpecificApplicableCombatTechniques = DB.TypeAlias(import.meta.url, {
  name: "SpecificApplicableCombatTechniques",
  type: () =>
    DB.Object({
      list: DB.Required({
        type: DB.Array(DB.IncludeIdentifier(SpecificApplicableCombatTechnique), { minItems: 1 }),
      }),
    }),
})

const SpecificApplicableCombatTechnique = DB.TypeAlias(import.meta.url, {
  name: "SpecificApplicableCombatTechnique",
  type: () =>
    DB.Object({
      id: DB.Required({
        type: DB.IncludeIdentifier(CombatTechniqueIdentifier),
      }),
      restriction: DB.Optional({
        type: DB.IncludeIdentifier(ApplicableSpecificCombatTechniquesRestriction),
      }),
      translation: NestedTranslationMap(
        DB.Optional,
        "SpecificApplicableCombatTechnique",
        DB.Object({
          restriction: DB.Required({
            comment: "The additional restriction of the combat technique.",
            type: DB.String({ minLength: 1, markdown: "inline" }),
          }),
        }),
      ),
      weapons: DB.Optional({
        comment: "The specific weapons this combat special ability is only applicable to.",
        type: DB.Array(WeaponIdentifier(), { minItems: 1 }),
      }),
    }),
})

const ApplicableAllCombatTechniquesRestriction = DB.Enum(import.meta.url, {
  name: "ApplicableAllCombatTechniquesRestriction",
  values: () => ({
    Improvised: DB.EnumCase({ type: null }),
    PointedBlade: DB.EnumCase({ type: null }),
    Mount: DB.EnumCase({ type: null }),
    Race: DB.EnumCase({ type: DB.IncludeIdentifier(ApplicableCombatTechniquesRaceRestriction) }),
    ExcludeCombatTechniques: DB.EnumCase({
      type: DB.GenIncludeIdentifier(ApplicableCombatTechniquesNegativeCombatTechniquesRestriction, [
        DB.IncludeIdentifier(CombatTechniqueIdentifier),
      ]),
    }),
  }),
})

const ApplicableCloseCombatTechniquesRestriction = DB.Enum(import.meta.url, {
  name: "ApplicableCloseCombatTechniquesRestriction",
  values: () => ({
    Improvised: DB.EnumCase({ type: null }),
    PointedBlade: DB.EnumCase({ type: null }),
    Mount: DB.EnumCase({ type: null }),
    HasParry: DB.EnumCase({ type: null }),
    OneHanded: DB.EnumCase({ type: null }),
    TwoHanded: DB.EnumCase({ type: null }),
    ParryingWeapon: DB.EnumCase({ type: null }),
    Race: DB.EnumCase({ type: DB.IncludeIdentifier(ApplicableCombatTechniquesRaceRestriction) }),
    ExcludeCombatTechniques: DB.EnumCase({
      type: DB.GenIncludeIdentifier(ApplicableCombatTechniquesNegativeCombatTechniquesRestriction, [
        CloseCombatTechniqueIdentifier(),
      ]),
    }),
  }),
})

const ApplicableRangedCombatTechniquesRestriction = DB.Enum(import.meta.url, {
  name: "ApplicableRangedCombatTechniquesRestriction",
  values: () => ({
    Improvised: DB.EnumCase({ type: null }),
    PointedBlade: DB.EnumCase({ type: null }),
    Mount: DB.EnumCase({ type: null }),
    Race: DB.EnumCase({ type: DB.IncludeIdentifier(ApplicableCombatTechniquesRaceRestriction) }),
    ExcludeCombatTechniques: DB.EnumCase({
      type: DB.GenIncludeIdentifier(ApplicableCombatTechniquesNegativeCombatTechniquesRestriction, [
        RangedCombatTechniqueIdentifier(),
      ]),
    }),
  }),
})

const ApplicableSpecificCombatTechniquesRestriction = DB.Enum(import.meta.url, {
  name: "ApplicableSpecificCombatTechniquesRestriction",
  values: () => ({
    Improvised: DB.EnumCase({ type: null }),
    PointedBlade: DB.EnumCase({ type: null }),
    Mount: DB.EnumCase({ type: null }),
    Race: DB.EnumCase({ type: DB.IncludeIdentifier(ApplicableCombatTechniquesRaceRestriction) }),
    Level: DB.EnumCase({ type: DB.IncludeIdentifier(ApplicableCombatTechniquesLevelRestriction) }),
    OneBluntSide: DB.EnumCase({ type: null }),
  }),
})

const ApplicableCombatTechniquesNegativeCombatTechniquesRestriction = DB.GenTypeAlias(
  import.meta.url,
  {
    name: "ApplicableCombatTechniquesNegativeCombatTechniquesRestriction",
    parameters: [DB.Param("Ref")],
    type: Ref =>
      DB.Object({
        list: DB.Required({
          comment: "The combat techniques this combat special ability is **not** applicable to.",
          type: DB.Array(DB.TypeArgument(Ref), { minItems: 1 }),
        }),
      }),
  },
)

const ApplicableCombatTechniquesRaceRestriction = DB.TypeAlias(import.meta.url, {
  name: "ApplicableCombatTechniquesRaceRestriction",
  type: () => RaceIdentifier(),
})

const ApplicableCombatTechniquesLevelRestriction = DB.TypeAlias(import.meta.url, {
  name: "ApplicableCombatTechniquesLevelRestriction",
  type: () =>
    DB.Object({
      level: DB.Required({
        comment: "The combat special ability is only applicable on a certain level.",
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})
