import * as DB from "tsondb/schema/dsl"
import { OldParameter } from "../_ActivatableSkill.js"
import { ExpressionBasedDuration } from "../_ActivatableSkillDuration.js"
import { ActivatableSkillEffect } from "../_ActivatableSkillEffect.js"
import { PropertyIdentifier, SkillModificationLevelIdentifier } from "../_Identifier.js"
import { ResponsiveText } from "../_ResponsiveText.js"
import { SkillCheck, SkillCheckPenalty } from "../_SkillCheck.js"
import { NestedTranslationMap } from "../Locale.js"
import { Errata } from "../source/_Erratum.js"
import { src } from "../source/_PublicationRef.js"

export const DominationRitual = DB.Entity(import.meta.url, {
  name: "DominationRitual",
  namePlural: "DominationRituals",
  type: () =>
    DB.Object({
      check: DB.Required({
        comment: "Lists the linked three attributes used to make a skill check.",
        type: DB.IncludeIdentifier(SkillCheck),
      }),
      check_penalty: DB.Optional({
        comment: "In some cases, the target's Spirit or Toughness is applied as a penalty.",
        type: DB.IncludeIdentifier(SkillCheckPenalty),
      }),
      parameters: DB.Required({
        comment: "Measurable parameters of a domination ritual.",
        type: DB.IncludeIdentifier(DominationRitualPerformanceParameters),
      }),
      property: DB.Required({
        comment: "The associated property.",
        type: PropertyIdentifier(),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "DominationRitual",
        DB.Object({
          name: DB.Required({
            comment: "The domination ritual’s name.",
            type: DB.String({ minLength: 1 }),
          }),
          effect: DB.Required({
            comment:
              "The effect description may be either a plain text or a text that is divided by a list of effects for each quality level. It may also be a list for each two quality levels.",
            type: DB.IncludeIdentifier(ActivatableSkillEffect),
          }),
          cost: DB.Optional({
            isDeprecated: true,
            type: DB.IncludeIdentifier(OldParameter),
          }),
          duration: DB.Optional({
            isDeprecated: true,
            type: DB.IncludeIdentifier(OldParameter),
          }),
          errata: DB.Optional({
            type: DB.IncludeIdentifier(Errata),
          }),
        }),
      ),
    }),
  instanceDisplayName: {},
  uniqueConstraints: [
    {
      entityMapKeyPath: "translations",
      keyPathInEntityMap: "name",
    },
  ],
})

const DominationRitualPerformanceParameters = DB.TypeAlias(import.meta.url, {
  name: "DominationRitualPerformanceParameters",
  comment: "Measurable parameters of a domination ritual.",
  type: () =>
    DB.Object({
      cost: DB.Required({
        comment: "The AE cost.",
        type: DB.IncludeIdentifier(DominationRitualCost),
      }),
      duration: DB.Required({
        comment: "The duration.",
        type: DB.IncludeIdentifier(DominationRitualDuration),
      }),
    }),
})

const DominationRitualCost = DB.TypeAlias(import.meta.url, {
  name: "DominationRitualCost",
  type: () =>
    DB.Object({
      initial_modification_level: DB.Required({
        comment: "The initial skill modification identifier/level.",
        type: SkillModificationLevelIdentifier(),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "DominationRitualCost",
        DB.Object({
          additional: DB.Required({
            comment: "AE cost in addition to the normal AE cost.",
            type: DB.IncludeIdentifier(ResponsiveText),
          }),
        }),
      ),
    }),
})

const DominationRitualDuration = DB.Enum(import.meta.url, {
  name: "DominationRitualDuration",
  values: () => ({
    Expression: DB.EnumCase({ type: DB.IncludeIdentifier(ExpressionBasedDuration) }),
    Indefinite: DB.EnumCase({ type: DB.IncludeIdentifier(IndefiniteDominationRitualDuration) }),
  }),
})

const IndefiniteDominationRitualDuration = DB.TypeAlias(import.meta.url, {
  name: "IndefiniteDominationRitualDuration",
  type: () =>
    DB.Object({
      maximum: DB.Optional({
        comment: "Specified if the duration has a maximum time span.",
        type: DB.IncludeIdentifier(MaximumIndefiniteDominationRitualDuration),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "IndefiniteDominationRitualDuration",
        DB.Object({
          description: DB.Required({
            comment: "A description of the duration.",
            type: DB.IncludeIdentifier(ResponsiveText),
          }),
        }),
      ),
    }),
})

const MaximumIndefiniteDominationRitualDuration = DB.Enum(import.meta.url, {
  name: "MaximumIndefiniteDominationRitualDuration",
  values: () => ({
    Expression: DB.EnumCase({ type: DB.IncludeIdentifier(ExpressionBasedDuration) }),
  }),
})
