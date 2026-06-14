import * as DB from "tsondb/schema/dsl"
import { name, name_in_library } from "../_Activatable.js"
import { ap_value, ap_value_append, ap_value_l10n } from "../_ActivatableAdventurePointsValue.js"
import { activatableDisplayNameCustomizer } from "../_ActivatableNames.ts"
import { explicit_select_options, select_options } from "../_ActivatableSelectOptions.js"
import { skill_applications, skill_uses } from "../_ActivatableSkillApplicationsAndUses.js"
import {
  AspectIdentifier,
  AttributeIdentifier,
  BlessingIdentifier,
  GeneralIdentifier,
  SkillIdentifier,
} from "../_Identifier.js"
import { CombatTechniqueIdentifier } from "../_IdentifierGroup.js"
import { GeneralPrerequisites } from "../_Prerequisite.js"
import { NestedTranslationMap } from "../Locale.js"
import { Errata } from "../source/_Erratum.js"
import { src } from "../source/_PublicationRef.js"
import { SpecialRule } from "./_Tradition.js"

export const BlessedTradition = DB.Entity(import.meta.url, {
  name: "BlessedTradition",
  namePlural: "BlessedTraditions",
  type: () =>
    DB.Object({
      select_options,
      explicit_select_options,
      skill_applications,
      skill_uses,
      primary: DB.Optional({
        comment:
          "The tradition’s primary attribute. Leave empty if the tradition does not have one.",
        type: AttributeIdentifier(),
      }),
      aspects: DB.Optional({
        comment: "The tradition’s aspects, if any.",
        type: DB.Array(AspectIdentifier(), { minItems: 2, maxItems: 2 }),
      }),
      primaryBlessing: DB.Optional({
        comment:
          "The tradition’s primary blessing. Leave empty if the tradition does not have one.",
        type: BlessingIdentifier(),
      }),
      restricted_blessings: DB.Optional({
        comment:
          "If a tradition restricts the possible blessings, the blessings that are **not** allowed.",
        type: DB.IncludeIdentifier(RestrictedBlessings),
      }),
      favored_combat_techniques: DB.Optional({
        comment: "A list of favored combat techniques.",
        type: DB.IncludeIdentifier(FavoredCombatTechniques),
      }),
      favored_skills: DB.Required({
        comment: "A list of favored skills.",
        type: DB.Array(SkillIdentifier(), { minItems: 1 }),
      }),
      favored_skills_selection: DB.Optional({
        comment:
          "On activation of the tradition, a specific number of skills from a list of skills must be selected as being favored.",
        type: DB.IncludeIdentifier(FavoredSkillsSelection),
      }),
      type: DB.Required({
        comment: "The type of the tradition. May be either church or shamanistic.",
        type: DB.IncludeIdentifier(BlessedTraditionType),
      }),
      associated_principles_id: DB.Optional({
        comment:
          "The select option’s identifier of the disadvantage *Principles* that represent this tradition’s code, if any.",
        type: GeneralIdentifier(),
      }),
      prerequisites: DB.Optional({
        type: DB.IncludeIdentifier(GeneralPrerequisites),
      }),
      ap_value,
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "BlessedTradition",
        DB.Object({
          name,
          name_compressed: DB.Optional({
            comment:
              "A shorter name of the tradition’s name, used in liturgical chant descriptions. This is not the same as the name in the library.",
            type: DB.String({ minLength: 1 }),
          }),
          name_in_library,
          nameOfBlessedOnes: DB.Required({
            comment: "The name of Blessed Ones of this tradition.",
            type: DB.String({ minLength: 1 }),
          }),
          special_rules: DB.Required({
            comment:
              "The special rules of the tradition. They should be sorted like they are in the book.",
            type: DB.Array(DB.IncludeIdentifier(SpecialRule), { minItems: 1 }),
          }),
          ap_value_append,
          ap_value: ap_value_l10n,
          errata: DB.Optional({
            type: DB.IncludeIdentifier(Errata),
          }),
        }),
      ),
    }),
  instanceDisplayName: {},
  instanceDisplayNameCustomizer: activatableDisplayNameCustomizer,
  uniqueConstraints: [
    {
      entityMapKeyPath: "translations",
      keyPathInEntityMap: "name_in_library",
      keyPathInEntityMapFallback: "name",
    },
  ],
})

const RestrictedBlessings = DB.Enum(import.meta.url, {
  name: "RestrictedBlessings",
  comment:
    "If a tradition restricts the possible blessings, the blessings that are **not** allowed.",
  values: () => ({
    Three: DB.EnumCase({ type: DB.Array(BlessingIdentifier(), { minItems: 3, maxItems: 3 }) }),
    Six: DB.EnumCase({ type: DB.Array(BlessingIdentifier(), { minItems: 6, maxItems: 6 }) }),
  }),
})

const FavoredCombatTechniques = DB.Enum(import.meta.url, {
  name: "FavoredCombatTechniques",
  values: () => ({
    All: DB.EnumCase({ type: null }),
    AllClose: DB.EnumCase({ type: null }),
    AllUsedInHunting: DB.EnumCase({ type: null }),
    Specific: DB.EnumCase({ type: DB.IncludeIdentifier(SpecificFavoredCombatTechniques) }),
  }),
})

const SpecificFavoredCombatTechniques = DB.TypeAlias(import.meta.url, {
  name: "SpecificFavoredCombatTechniques",
  type: () =>
    DB.Object({
      list: DB.Required({
        comment: "A list of specific favored combat techniques.",
        type: DB.Array(DB.IncludeIdentifier(CombatTechniqueIdentifier), {
          minItems: 1,
          uniqueItems: true,
        }),
      }),
    }),
})

const FavoredSkillsSelection = DB.TypeAlias(import.meta.url, {
  name: "FavoredSkillsSelection",
  type: () =>
    DB.Object({
      number: DB.Required({
        comment: "The number of skills that can be selected.",
        type: DB.Integer({ minimum: 1 }),
      }),
      options: DB.Required({
        comment: "The possible set of skills.",
        type: DB.Array(SkillIdentifier(), { minItems: 2, uniqueItems: true }),
      }),
    }),
})

const BlessedTraditionType = DB.Enum(import.meta.url, {
  name: "BlessedTraditionType",
  comment: "The type of the tradition. May be either church or shamanistic.",
  values: () => ({
    Church: DB.EnumCase({ type: null }),
    Shamanistic: DB.EnumCase({ type: DB.IncludeIdentifier(ShamanisticBlessedTradition) }),
  }),
})

const ShamanisticBlessedTradition = DB.TypeAlias(import.meta.url, {
  name: "ShamanisticBlessedTradition",
  comment: "Additional rules for shamanistic traditions.",
  type: () =>
    DB.Object({
      can_use_bone_mace_as_ceremonial_item: DB.Required({
        type: DB.Boolean(),
      }),
    }),
})
