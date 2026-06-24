import * as DB from "tsondb/schema/dsl"
import { ActivatablePrerequisite } from "./single/ActivatablePrerequisite.js"
import { AncestorBloodPrerequisite } from "./single/AncestorBloodPrerequisite.js"
import { AnimistPowerPrerequisite } from "./single/AnimistPowerPrerequisite.js"
import { BlessingPrerequisite } from "./single/BlessingPrerequisite.js"
import { CantripPrerequisite } from "./single/CantripPrerequisite.js"
import { CulturePrerequisite } from "./single/CulturePrerequisite.js"
import { EnhancementPrerequisite } from "./single/EnhancementPrerequisite.js"
import { InfluencePrerequisite } from "./single/InfluencePrerequisite.js"
import { PactPrerequisite } from "./single/PactPrerequisite.js"
import { PersonalityTraitPrerequisite } from "./single/PersonalityTraitPrerequisite.js"
import { PrimaryAttributePrerequisite } from "./single/PrimaryAttributePrerequisite.js"
import { ProfessionPrerequisite } from "./single/ProfessionPrerequisite.js"
import { PublicationPrerequisite } from "./single/PublicationPrerequisite.js"
import { RacePrerequisite } from "./single/RacePrerequisite.js"
import { RatedMinimumNumberPrerequisite } from "./single/RatedMinimumNumberPrerequisite.js"
import { RatedPrerequisite } from "./single/RatedPrerequisite.js"
import { RatedSumPrerequisite } from "./single/RatedSumPrerequisite.js"
import { RulePrerequisite } from "./single/RulePrerequisite.js"
import { SexPrerequisite } from "./single/SexPrerequisite.js"
import { SexualCharacteristicPrerequisite } from "./single/SexualCharacteristicPrerequisite.js"
import { SocialStatusPrerequisite } from "./single/SocialStatusPrerequisite.js"
import { StatePrerequisite } from "./single/StatePrerequisite.js"
import { TextPrerequisite } from "./single/TextPrerequisite.js"
import {
  BlessedTraditionPrerequisite,
  MagicalTraditionPrerequisite,
} from "./single/TraditionPrerequisite.js"

export const RulePrerequisiteGroup = DB.Enum(import.meta.url, {
  name: "RulePrerequisiteGroup",
  values: () => ({
    Rule: DB.EnumCase({ type: DB.IncludeIdentifier(RulePrerequisite) }),
  }),
})

export const DerivedCharacteristicPrerequisiteGroup = DB.Enum(import.meta.url, {
  name: "DerivedCharacteristicPrerequisiteGroup",
  values: () => ({
    Rule: DB.EnumCase({ type: DB.IncludeIdentifier(RulePrerequisite) }),
    BlessedTradition: DB.EnumCase({ type: DB.IncludeIdentifier(BlessedTraditionPrerequisite) }),
    MagicalTradition: DB.EnumCase({ type: DB.IncludeIdentifier(MagicalTraditionPrerequisite) }),
  }),
})

export const DerivedCharacteristicModifierPrerequisiteGroup = DB.Enum(import.meta.url, {
  name: "DerivedCharacteristicModifierPrerequisiteGroup",
  values: () => ({
    Rule: DB.EnumCase({ type: DB.IncludeIdentifier(RulePrerequisite) }),
    Activatable: DB.EnumCase({ type: DB.IncludeIdentifier(ActivatablePrerequisite) }),
  }),
})

export const PublicationPrerequisiteGroup = DB.Enum(import.meta.url, {
  name: "PublicationPrerequisiteGroup",
  values: () => ({
    Publication: DB.EnumCase({ type: DB.IncludeIdentifier(PublicationPrerequisite) }),
  }),
})

export const GeneralPrerequisiteGroup = DB.Enum(import.meta.url, {
  name: "GeneralPrerequisiteGroup",
  values: () => ({
    Activatable: DB.EnumCase({ type: DB.IncludeIdentifier(ActivatablePrerequisite) }),
    Sex: DB.EnumCase({ type: DB.IncludeIdentifier(SexPrerequisite) }),
    Race: DB.EnumCase({ type: DB.IncludeIdentifier(RacePrerequisite) }),
    Culture: DB.EnumCase({ type: DB.IncludeIdentifier(CulturePrerequisite) }),
    Pact: DB.EnumCase({ type: DB.IncludeIdentifier(PactPrerequisite) }),
    SocialStatus: DB.EnumCase({ type: DB.IncludeIdentifier(SocialStatusPrerequisite) }),
    State: DB.EnumCase({ type: DB.IncludeIdentifier(StatePrerequisite) }),
    Rule: DB.EnumCase({ type: DB.IncludeIdentifier(RulePrerequisite) }),
    PrimaryAttribute: DB.EnumCase({ type: DB.IncludeIdentifier(PrimaryAttributePrerequisite) }),
    BlessedTradition: DB.EnumCase({ type: DB.IncludeIdentifier(BlessedTraditionPrerequisite) }),
    MagicalTradition: DB.EnumCase({ type: DB.IncludeIdentifier(MagicalTraditionPrerequisite) }),
    Cantrip: DB.EnumCase({ type: DB.IncludeIdentifier(CantripPrerequisite) }),
    Blessing: DB.EnumCase({ type: DB.IncludeIdentifier(BlessingPrerequisite) }),
    Rated: DB.EnumCase({ type: DB.IncludeIdentifier(RatedPrerequisite) }),
    RatedMinimumNumber: DB.EnumCase({ type: DB.IncludeIdentifier(RatedMinimumNumberPrerequisite) }),
    RatedSum: DB.EnumCase({ type: DB.IncludeIdentifier(RatedSumPrerequisite) }),
    Enhancement: DB.EnumCase({ type: DB.IncludeIdentifier(EnhancementPrerequisite) }),
    Text: DB.EnumCase({ type: DB.IncludeIdentifier(TextPrerequisite) }),
    SexualCharacteristic: DB.EnumCase({
      type: DB.IncludeIdentifier(SexualCharacteristicPrerequisite),
    }),
    PersonalityTrait: DB.EnumCase({ type: DB.IncludeIdentifier(PersonalityTraitPrerequisite) }),
  }),
})

export const ProfessionPrerequisiteGroup = DB.Enum(import.meta.url, {
  name: "ProfessionPrerequisiteGroup",
  values: () => ({
    Sex: DB.EnumCase({ type: DB.IncludeIdentifier(SexPrerequisite) }),
    Race: DB.EnumCase({ type: DB.IncludeIdentifier(RacePrerequisite) }),
    Culture: DB.EnumCase({ type: DB.IncludeIdentifier(CulturePrerequisite) }),
    Activatable: DB.EnumCase({ type: DB.IncludeIdentifier(ActivatablePrerequisite) }),
    Rated: DB.EnumCase({ type: DB.IncludeIdentifier(RatedPrerequisite) }),
  }),
})

export const AdvantageDisadvantagePrerequisiteGroup = DB.Enum(import.meta.url, {
  name: "AdvantageDisadvantagePrerequisiteGroup",
  values: () => {
    return {
      CommonSuggestedByRCP: DB.EnumCase({ type: null }),
      NoOtherAncestorBloodAdvantage: DB.EnumCase({
        type: AncestorBloodPrerequisite,
      }),
      ...GeneralPrerequisiteGroup.type.value.values,
    }
  },
})

export const ArcaneTraditionPrerequisiteGroup = DB.Enum(import.meta.url, {
  name: "ArcaneTraditionPrerequisiteGroup",
  values: () => ({
    Sex: DB.EnumCase({ type: DB.IncludeIdentifier(SexPrerequisite) }),
    Culture: DB.EnumCase({ type: DB.IncludeIdentifier(CulturePrerequisite) }),
  }),
})

export const PersonalityTraitPrerequisiteGroup = DB.Enum(import.meta.url, {
  name: "PersonalityTraitPrerequisiteGroup",
  values: () => ({
    Race: DB.EnumCase({ type: DB.IncludeIdentifier(RacePrerequisite) }),
    Culture: DB.EnumCase({ type: DB.IncludeIdentifier(CulturePrerequisite) }),
    PersonalityTrait: DB.EnumCase({ type: DB.IncludeIdentifier(PersonalityTraitPrerequisite) }),
    Text: DB.EnumCase({ type: DB.IncludeIdentifier(TextPrerequisite) }),
  }),
})

export const SpellworkPrerequisiteGroup = DB.Enum(import.meta.url, {
  name: "SpellworkPrerequisiteGroup",
  values: () => ({
    Rule: DB.EnumCase({ type: DB.IncludeIdentifier(RulePrerequisite) }),
    Rated: DB.EnumCase({ type: DB.IncludeIdentifier(RatedPrerequisite) }),
  }),
})

export const LiturgyPrerequisiteGroup = DB.Enum(import.meta.url, {
  name: "LiturgyPrerequisiteGroup",
  values: () => ({
    Rule: DB.EnumCase({ type: DB.IncludeIdentifier(RulePrerequisite) }),
  }),
})

export const InfluencePrerequisiteGroup = DB.Enum(import.meta.url, {
  name: "InfluencePrerequisiteGroup",
  values: () => ({
    Influence: DB.EnumCase({ type: DB.IncludeIdentifier(InfluencePrerequisite) }),
    Race: DB.EnumCase({ type: DB.IncludeIdentifier(RacePrerequisite) }),
    Profession: DB.EnumCase({ type: DB.IncludeIdentifier(ProfessionPrerequisite) }),
    Activatable: DB.EnumCase({ type: DB.IncludeIdentifier(ActivatablePrerequisite) }),
    Text: DB.EnumCase({ type: DB.IncludeIdentifier(TextPrerequisite) }),
  }),
})

export const LanguagePrerequisiteGroup = DB.Enum(import.meta.url, {
  name: "LanguagePrerequisiteGroup",
  values: () => ({
    Race: DB.EnumCase({ type: DB.IncludeIdentifier(RacePrerequisite) }),
    Activatable: DB.EnumCase({ type: DB.IncludeIdentifier(ActivatablePrerequisite) }),
    Text: DB.EnumCase({ type: DB.IncludeIdentifier(TextPrerequisite) }),
  }),
})

export const AnimistPowerPrerequisiteGroup = DB.Enum(import.meta.url, {
  name: "AnimistPowerPrerequisiteGroup",
  values: () => ({
    AnimistPower: DB.EnumCase({ type: DB.IncludeIdentifier(AnimistPowerPrerequisite) }),
  }),
})

export const TribePrerequisiteGroup = DB.Enum(import.meta.url, {
  name: "TribePrerequisiteGroup",
  values: () => ({
    Race: DB.EnumCase({ type: DB.IncludeIdentifier(RacePrerequisite) }),
    Culture: DB.EnumCase({ type: DB.IncludeIdentifier(CulturePrerequisite) }),
  }),
})

export const GeodeRitualPrerequisiteGroup = DB.Enum(import.meta.url, {
  name: "GeodeRitualPrerequisiteGroup",
  values: () => ({
    Activatable: DB.EnumCase({ type: DB.IncludeIdentifier(ActivatablePrerequisite) }),
    Influence: DB.EnumCase({ type: DB.IncludeIdentifier(InfluencePrerequisite) }),
  }),
})

export const EnhancementPrerequisiteGroup = DB.Enum(import.meta.url, {
  name: "EnhancementPrerequisiteGroup",
  values: () => ({
    Enhancement: DB.EnumCase({ type: DB.IncludeIdentifier(EnhancementPrerequisite) }),
    Rated: DB.EnumCase({ type: DB.IncludeIdentifier(RatedPrerequisite) }),
  }),
})

export const PreconditionGroup = DB.Enum(import.meta.url, {
  name: "PreconditionGroup",
  values: () => ({
    Publication: DB.EnumCase({ type: DB.IncludeIdentifier(PublicationPrerequisite) }),
    Rule: DB.EnumCase({ type: DB.IncludeIdentifier(RulePrerequisite) }),
    SexualCharacteristic: DB.EnumCase({
      type: DB.IncludeIdentifier(SexualCharacteristicPrerequisite),
    }),
  }),
})
