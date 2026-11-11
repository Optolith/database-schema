import * as DB from "tsondb/schema/dsl"
import {
  AdvantageIdentifier,
  AspectIdentifier,
  AttributeIdentifier,
  DerivedCharacteristicIdentifier,
  ExperienceLevelIdentifier,
  FocusRuleIdentifier,
  OptionalRuleIdentifier,
  PublicationIdentifier,
} from "./_Identifier.ts"
import { ActivatableIdentifier, SpecialAbilityIdentifier } from "./_IdentifierGroup.ts"
import { ImprovementCost } from "./_ImprovementCost.ts"

export const Settings = DB.SingletonEntity(import.meta.url, {
  name: "Settings",
  type: () =>
    DB.Object({
      defaultExperienceLevel: DB.Required({
        comment: "The default experience level for new characters and profession packages.",
        type: ExperienceLevelIdentifier(),
      }),
      focusRules: DB.Required({
        comment: FocusRuleSettings.comment,
        type: DB.IncludeIdentifier(FocusRuleSettings),
      }),
      // optionalRules: DB.Required({
      //   comment: OptionalRuleSettings.comment,
      //   type: DB.IncludeIdentifier(OptionalRuleSettings),
      // }),
      additionalArmorPenalties: DB.Required({
        comment: "Which derived characteristics are affected by additional armor penalties.",
        type: DB.Array(DerivedCharacteristicIdentifier(), {
          minItems: 1,
          uniqueItems: true,
        }),
      }),
      derivedTradeSecrets: DB.Required({
        comment: DerivedTradeSecretsSettings.comment,
        type: DB.IncludeIdentifier(DerivedTradeSecretsSettings),
      }),
      supernaturalBaseAdvantages: DB.Required({
        comment: SupernaturalBaseAdvantageSettings.comment,
        type: DB.IncludeIdentifier(SupernaturalBaseAdvantageSettings),
      }),
      sexualCharacteristicsPublication: DB.Required({
        comment:
          "The publication that uses sexual characteristics. This makes sexual characteristic selection available for characters outside of male and female sex presets.",
        type: PublicationIdentifier(),
      }),
      extendedBookDescriptionPublication: DB.Required({
        comment:
          "The publication that extends the description of books with additional information.",
        type: PublicationIdentifier(),
      }),
      skills: DB.Required({
        comment: SkillSettings.comment,
        type: DB.IncludeIdentifier(SkillSettings),
      }),
      combatTechniques: DB.Required({
        comment: CombatTechniqueSettings.comment,
        type: DB.IncludeIdentifier(CombatTechniqueSettings),
      }),
      spellworks: DB.Required({
        comment: SpellworkSettings.comment,
        type: DB.IncludeIdentifier(SpellworkSettings),
      }),
      magicalActions: DB.Required({
        comment: MagicalActionSettings.comment,
        type: DB.IncludeIdentifier(MagicalActionSettings),
      }),
      liturgicalChants: DB.Required({
        comment: LiturgicalChantSettings.comment,
        type: DB.IncludeIdentifier(LiturgicalChantSettings),
      }),
      language: DB.Required({
        comment:
          "The entry representing languages. This is used to add native languages to characters, for example.",
        type: DB.IncludeIdentifier(ActivatableIdentifier),
      }),
      script: DB.Required({
        comment:
          "The entry representing languages. This is used to add native literacy to characters, for example.",
        type: DB.IncludeIdentifier(ActivatableIdentifier),
      }),
      skillSpecialization: DB.Required({
        comment:
          "The entry representing skill specializations. This is used to add skill specializations to characters, for example.",
        type: DB.IncludeIdentifier(ActivatableIdentifier),
      }),
    }),
})

const FocusRuleSettings = DB.TypeAlias(import.meta.url, {
  name: "FocusRuleSettings",
  comment:
    "Settings for focus rules. This may include references to specific focus rules for implementing specific logic that cannot be expressed in the database schema in a meaningful way.",
  type: () =>
    DB.Object({
      styles: DB.Required({
        comment: StyleSpecialAbilitySettings.comment,
        type: DB.IncludeIdentifier(StyleSpecialAbilitySettings),
      }),
    }),
})

// const OptionalRuleSettings = DB.TypeAlias(import.meta.url, {
//   name: "OptionalRuleSettings",
//   comment:
//     "Settings for optional rules. This may include references to specific optional rules for implementing specific logic that cannot be expressed in the database schema in a meaningful way.",
//   type: () => DB.Object({}),
// })

const SupernaturalBaseAdvantageSettings = DB.TypeAlias(import.meta.url, {
  name: "SupernaturalBaseAdvantageSettings",
  comment: "Settings for supernatural base advantages.",
  type: () =>
    DB.Object({
      spellcasters: DB.Required({
        comment: "The central advantage for spellcasters.",
        type: AdvantageIdentifier(),
      }),
      blessed: DB.Required({
        comment: "The central advantage for Blessed Ones.",
        type: AdvantageIdentifier(),
      }),
    }),
})

const DerivedTradeSecretsSettings = DB.TypeAlias(import.meta.url, {
  name: "DerivedTradeSecretsSettings",
  comment: "Settings for derived trade secrets.",
  type: () =>
    DB.Object({
      requiredSpecialAbilityForWeapons: DB.Required({
        displayName: "Required Special Ability for Weapons",
        comment: "The special ability required to buy derived trade secrets for weapons.",
        type: DB.IncludeIdentifier(SpecialAbilityIdentifier),
      }),
      requiredSpecialAbilityForAmmunition: DB.Required({
        displayName: "Required Special Ability for Ammunition",
        comment: "The special ability required to buy derived trade secrets for ammunition.",
        type: DB.IncludeIdentifier(SpecialAbilityIdentifier),
      }),
      requiredSpecialAbilityForArmor: DB.Required({
        displayName: "Required Special Ability for Armor",
        comment: "The special ability required to buy derived trade secrets for armor.",
        type: DB.IncludeIdentifier(SpecialAbilityIdentifier),
      }),
      requiredFocusRuleForTalismans: DB.Required({
        displayName: "Required Focus Rule for Talismans",
        comment: "The focus rule required to buy derived trade secrets for talismans.",
        type: FocusRuleIdentifier(),
      }),
    }),
})

const StyleSpecialAbilitySettings = DB.TypeAlias(import.meta.url, {
  name: "StyleSpecialAbilitySettings",
  comment:
    "Style Special Abilities and Advanced Special Abilities are part of focus rules. This type defines which focus rule must be enabled in order to use any of these special abilities. Essentially, this is a default prerequisite all of these special abilities must meet, but manually inserting them with every special ability is a lot of work and error-prone. Therefore, in order to use any of these special abilities, prerequisites for the respective focus rule must be generated for every entry.",
  type: () =>
    DB.Object({
      skill: DB.Required({
        comment: "The focus rule for skill style special abilities and its advanced complements.",
        type: FocusRuleIdentifier(),
      }),
      combat: DB.Required({
        comment: "The focus rule for combat style special abilities and its advanced complements.",
        type: FocusRuleIdentifier(),
      }),
      combatCombination: DB.Required({
        comment: "The entry that allows a third combat style special ability from either type.",
        type: DB.IncludeIdentifier(ActivatableIdentifier),
      }),
      magic: DB.Required({
        comment: "The focus rule for magic style special abilities and its advanced complements.",
        type: FocusRuleIdentifier(),
      }),
      magicCombination: DB.Required({
        comment: "The entry that allows a second magic style special ability.",
        type: DB.IncludeIdentifier(ActivatableIdentifier),
      }),
      liturgical: DB.Required({
        comment:
          "The focus rule for liturgical style special abilities and its advanced complements.",
        type: FocusRuleIdentifier(),
      }),
    }),
})

const SkillSettings = DB.TypeAlias(import.meta.url, {
  name: "SkillSettings",
  type: () =>
    DB.Object({
      maximumSkillRatingBonusEntry: DB.Required({
        comment:
          "The entry that grants a bonus of 1 towards the maximum skill rating per selection.",
        type: DB.IncludeIdentifier(ActivatableIdentifier),
      }),
    }),
})

const CombatTechniqueSettings = DB.TypeAlias(import.meta.url, {
  name: "CombatTechniqueSettings",
  type: () =>
    DB.Object({
      maximumCombatTechniqueRatingBonusEntry: DB.Required({
        comment:
          "The entry that grants a bonus of 1 towards the maximum skill rating per selection.",
        type: DB.IncludeIdentifier(ActivatableIdentifier),
      }),
      closeCombatTechniqueAttackAttribute: DB.Required({
        comment: "The attribute that increases the attack value of a close combat technique.",
        type: AttributeIdentifier(),
      }),
      parryModifiers: DB.Optional({
        comment:
          "Character traits that modify the parry base of a close combat technique. If an optional rule. ",
        type: DB.Array(DB.IncludeIdentifier(CombatTechniqueParryModifier), {
          minItems: 1,
          uniqueItems: true,
        }),
      }),
    }),
})

const CombatTechniqueParryModifier = DB.TypeAlias(import.meta.url, {
  name: "CombatTechniqueParryModifier",
  type: () =>
    DB.Object({
      source: DB.Required({
        comment: "The entry that modifies the parry base of a close combat technique.",
        type: OptionalRuleIdentifier(),
      }),
      modifier: DB.Required({
        comment:
          "The modifier that is applied to the parry base of a close combat technique. If the optional rule has options, the modifier is multiplied by the option value and then applied to the parry base.",
        type: DB.Integer(),
      }),
    }),
})

const SpellworkSettings = DB.TypeAlias(import.meta.url, {
  name: "SpellworkSettings",
  type: () =>
    DB.Object({
      maximumRatingUnlockEntry: DB.Required({
        comment:
          "The entry that removes the maximum rating of 14 from spellworks for selected properties. It must provide the property as a selected option.",
        type: DB.IncludeIdentifier(ActivatableIdentifier),
      }),
      enhancementsFocusRule: DB.Required({
        comment:
          "Spell Enhancements are part of focus rules. This type defines which focus rule must be enabled in order to use an enhancement. Essentially, this is a default prerequisite they must meet, but manually inserting them with every enhancement is a lot of work and error-prone. Therefore, in order to use an enhancement, prerequisites for the focus rule must be generated for every entry.",
        type: FocusRuleIdentifier(),
      }),
    }),
})

const MagicalActionSettings = DB.TypeAlias(import.meta.url, {
  name: "MagicalActionSettings",
  type: () =>
    DB.Object({
      curseImprovementCost: DB.Required({
        comment: "The improvement cost for all curses.",
        type: DB.IncludeIdentifier(ImprovementCost),
      }),
      dominationRitualImprovementCost: DB.Required({
        comment: "The improvement cost for all domination rituals.",
        type: DB.IncludeIdentifier(ImprovementCost),
      }),
      geodeRitualImprovementCost: DB.Required({
        comment: "The improvement cost for all geode rituals.",
        type: DB.IncludeIdentifier(ImprovementCost),
      }),
    }),
})

const LiturgicalChantSettings = DB.TypeAlias(import.meta.url, {
  name: "LiturgicalChantSettings",
  type: () =>
    DB.Object({
      generalAspectForChurch: DB.Required({
        comment: "The general aspect for church traditions.",
        type: AspectIdentifier(),
      }),
      generalAspectForShamanistic: DB.Required({
        comment: "The general aspect for shamanistic traditions.",
        type: AspectIdentifier(),
      }),
      maximumRatingUnlockEntry: DB.Required({
        comment:
          "The entry that removes the maximum rating of 14 from liturgical chants for selected aspects. It must provide the aspect as a selected option.",
        type: DB.IncludeIdentifier(ActivatableIdentifier),
      }),
      enhancementsFocusRule: DB.Required({
        comment:
          "Liturgical Chant Enhancements are part of focus rules. This type defines which focus rule must be enabled in order to use an enhancement. Essentially, this is a default prerequisite they must meet, but manually inserting them with every enhancement is a lot of work and error-prone. Therefore, in order to use an enhancement, prerequisites for the focus rule must be generated for every entry.",
        type: FocusRuleIdentifier(),
      }),
    }),
})
