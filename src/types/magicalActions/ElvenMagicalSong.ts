import * as DB from "tsondb/schema/dsl"
import { OldParameter } from "../_ActivatableSkill.js"
import { NonModifiableOneTimeCostPerCountable } from "../_ActivatableSkillCost.ts"
import { DurationUnitValue } from "../_ActivatableSkillDuration.js"
import { ActivatableSkillEffect } from "../_ActivatableSkillEffect.js"
import { PropertyIdentifier, SkillIdentifier } from "../_Identifier.js"
import { ImprovementCost } from "../_ImprovementCost.js"
import { ResponsiveTextReplace } from "../_ResponsiveText.js"
import { SkillCheck, SkillCheckPenalty } from "../_SkillCheck.js"
import { NestedTranslationMap } from "../Locale.js"
import { Errata } from "../source/_Erratum.js"
import { src } from "../source/_PublicationRef.js"

export const ElvenMagicalSong = DB.Entity(import.meta.url, {
  name: "ElvenMagicalSong",
  namePlural: "ElvenMagicalSongs",
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
        comment: "Measurable parameters of an Elven magical song.",
        type: DB.IncludeIdentifier(ElvenMagicalSongPerformanceParameters),
      }),
      skill: DB.Required({
        comment:
          "To enhance their songs, elves can make a check on either *Singing (Two-Voiced Singing)* or *Music (appropriate application)* (or both) before making the check for the song.",
        type: DB.Array(SkillIdentifier(), {
          minItems: 1,
          maxItems: 2,
          uniqueItems: true,
        }),
      }),
      property: DB.Required({
        comment: "The associated property.",
        type: PropertyIdentifier(),
      }),
      improvement_cost: DB.Required({
        comment: "States which column is used to improve the skill.",
        type: DB.IncludeIdentifier(ImprovementCost),
      }),
      is_distorted: DB.Required({
        comment: "Is the song a distorted Elven magical song?",
        type: DB.Boolean(),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "ElvenMagicalSong",
        DB.Object({
          name: DB.Required({
            comment: "The Elven magical song’s name.",
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

const ElvenMagicalSongPerformanceParameters = DB.TypeAlias(import.meta.url, {
  name: "ElvenMagicalSongPerformanceParameters",
  comment: "Measurable parameters of an Elven magical song.",
  type: () =>
    DB.Object({
      cost: DB.Required({
        comment: "The AE cost.",
        type: DB.IncludeIdentifier(ElvenMagicalSongCost),
      }),
    }),
})

const ElvenMagicalSongCost = DB.TypeAlias(import.meta.url, {
  name: "ElvenMagicalSongCost",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The (temporary) AE cost value.",
        type: DB.Integer({ minimum: 1 }),
      }),
      interval: DB.Optional({
        comment: "Specified if the AE cost `value` has to be paid for each time interval.",
        type: DB.IncludeIdentifier(DurationUnitValue),
      }),
      permanent: DB.Optional({
        comment: "A permanent AE cost, independent from a possible interval.",
        type: DB.IncludeIdentifier(ElvenMagicalSongPermanentCost),
      }),
      per: DB.Optional({
        comment: "The cost have to be per a specific countable entity, e.g. `8 KP per person`.",
        type: DB.IncludeIdentifier(NonModifiableOneTimeCostPerCountable),
      }),
    }),
})

const ElvenMagicalSongPermanentCost = DB.TypeAlias(import.meta.url, {
  name: "ElvenMagicalSongPermanentCost",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The permanent AE cost value.",
        type: DB.Integer({ minimum: 1 }),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "ElvenMagicalSongPermanentCost",
        DB.Object({
          replacement: DB.Required({
            comment: "A replacement string for the permanent cost.",
            type: DB.IncludeIdentifier(ResponsiveTextReplace),
          }),
        }),
      ),
    }),
})
