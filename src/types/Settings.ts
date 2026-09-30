import * as DB from "tsondb/schema/dsl"
import {
  AdvantageIdentifier,
  DerivedCharacteristicIdentifier,
  ExperienceLevelIdentifier,
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
        comment: "Settings for derived trade secrets.",
        type: DB.IncludeIdentifier(DerivedTradeSecretsSettings),
      }),
      supernaturalBaseAdvantages: DB.Required({
        comment: "Settings for supernatural base advantages.",
        type: DB.IncludeIdentifier(SupernaturalBaseAdvantageSettings),
      }),
    }),
})

const SupernaturalBaseAdvantageSettings = DB.TypeAlias(import.meta.url, {
  name: "SupernaturalBaseAdvantageSettings",
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
