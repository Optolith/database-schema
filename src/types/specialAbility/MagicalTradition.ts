import * as DB from "tsondb/schema/dsl"
import { levels, name, name_in_library } from "../_Activatable.js"
import { ap_value, ap_value_append, ap_value_l10n } from "../_ActivatableAdventurePointsValue.js"
import { activatableDisplayNameCustomizer, nameBuilderRules } from "../_ActivatableNames.ts"
import { explicit_select_options, select_options } from "../_ActivatableSelectOptions.js"
import { skill_applications, skill_uses } from "../_ActivatableSkillApplicationsAndUses.js"
import {
  AttributeIdentifier,
  InfluenceIdentifier,
  MagicalTraditionIdentifier,
} from "../_Identifier.js"
import { GeneralPrerequisites } from "../_Prerequisite.js"
import { NestedTranslationMap } from "../Locale.js"
import { Errata } from "../source/_Erratum.js"
import { src } from "../source/_PublicationRef.js"
import { SpecialRule } from "./_Tradition.js"

export const MagicalTradition = DB.Entity(import.meta.url, {
  name: "MagicalTradition",
  namePlural: "MagicalTraditions",
  type: () =>
    DB.Object({
      levels,
      nameBuilderRules,
      select_options,
      explicit_select_options,
      skill_applications,
      skill_uses,
      primary: DB.Optional({
        comment:
          "The tradition’s primary attribute. Leave empty if the tradition does not have one.",
        type: DB.IncludeIdentifier(PrimaryAttribute),
      }),
      can_learn_cantrips: DB.Required({
        comment: "Can a member of the tradition learn cantrips?",
        type: DB.Boolean(),
      }),
      can_learn_spells: DB.Required({
        comment: "Can a member of the tradition learn spells?",
        type: DB.Boolean(),
      }),
      can_learn_rituals: DB.Required({
        comment: "Can a member of the tradition learn rituals?",
        type: DB.Boolean(),
      }),
      can_bind_familiars: DB.Required({
        comment: "Can this magical tradition bind familiars?",
        type: DB.Boolean(),
      }),
      allows_multiple_traditions: DB.Required({
        comment:
          "Does the tradition allow learning more traditions or having learned a different tradition before learning this tradition?",
        type: DB.Boolean(),
      }),
      alternative_magical_adventure_points_maximum: DB.Optional({
        comment:
          "Is the maximum AP you’re able to spent on magical advantages and able to get by magical disadvantages different than the default of 50 AP?",
        type: DB.Integer({ minimum: 25, maximum: 30, multipleOf: 5 }),
      }),
      require_non_spellwork_exclusive_effects: DB.Required({
        comment:
          "Are advantages/disadvantages required to not exclusively apply to arcane spellworks, but also to the tradition’s magical actions or applications?",
        type: DB.Boolean(),
      }),
      is_magical_dilettante: DB.Required({
        comment: "Is this a magical dilettante tradition?",
        type: DB.Boolean(),
      }),
      use_arcane_spellworks_from_tradition: DB.Optional({
        comment:
          "If arcane spellworks from a different tradition count as arcane spellworks of this tradition, this is the different tradition’s reference.",
        type: MagicalTraditionIdentifier(),
      }),
      influences: DB.Optional({
        comment: "The influences for the traditions. Influences are enabled by Focus Rules.",
        type: DB.Array(InfluenceIdentifier(), { minItems: 2 }),
      }),
      prerequisites: DB.Optional({
        type: DB.IncludeIdentifier(GeneralPrerequisites),
      }),
      ap_value,
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "MagicalTradition",
        DB.Object({
          name,
          name_for_arcane_spellworks: DB.Optional({
            comment:
              "The name used for the arcane spellworks of the tradition if it is different than the `name` of the special ability.",
            type: DB.String({ minLength: 1 }),
          }),
          name_in_library,
          nameOfSpellcasters: DB.Required({
            comment:
              "The name of spellcasters of this tradition. This is used to derive special rules from the data set already for this tradition.",
            type: DB.String({ minLength: 1 }),
          }),
          special_rules: DB.Required({
            comment:
              "The special rules of the tradition. They should be sorted like they are in the book.",
            type: DB.Array(DB.IncludeIdentifier(SpecialRule), { minItems: 1 }),
          }),
          supplemental_content: DB.Optional({
            comment:
              "Supplemental content for the tradition, such as additional information or clarifications.",
            type: DB.String({ minLength: 1, markdown: "block" }),
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

const PrimaryAttribute = DB.TypeAlias(import.meta.url, {
  name: "PrimaryAttribute",
  type: () =>
    DB.Object({
      id: DB.Required({
        comment: "The attribute’s identifier.",
        type: AttributeIdentifier(),
      }),
      use_half_for_arcane_energy: DB.Required({
        comment:
          "Typically, the value of the primary attribute (if one exists) is added onto the base of 20 AE to get the actual AE. But sometimes, only half the value is added.",
        type: DB.Boolean(),
      }),
    }),
})
