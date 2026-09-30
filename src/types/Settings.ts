import * as DB from "tsondb/schema/dsl"
import {
  AdvantageIdentifier,
  DerivedCharacteristicIdentifier,
  ExperienceLevelIdentifier,
  FocusRuleIdentifier,
} from "./_Identifier.ts"
import { SpecialAbilityIdentifier } from "./_IdentifierGroup.ts"

export const Settings = DB.SingletonEntity(import.meta.url, {
  name: "Settings",
  type: () =>
    DB.Object({
      defaultExperienceLevel: DB.Required({
        comment: "The default experience level for new characters and profession packages.",
        type: ExperienceLevelIdentifier(),
      }),
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
      styles: DB.Required({
        comment: StyleSpecialAbilitySettings.comment,
        type: DB.IncludeIdentifier(StyleSpecialAbilitySettings),
      }),
    }),
})

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
      requiredSpecialAbilityForArmor: DB.Required({
        displayName: "Required Special Ability for Armor",
        comment: "The special ability required to buy derived trade secrets for armor.",
        type: DB.IncludeIdentifier(SpecialAbilityIdentifier),
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
      magic: DB.Required({
        comment: "The focus rule for magic style special abilities and its advanced complements.",
        type: FocusRuleIdentifier(),
      }),
      liturgical: DB.Required({
        comment:
          "The focus rule for liturgical style special abilities and its advanced complements.",
        type: FocusRuleIdentifier(),
      }),
    }),
})
