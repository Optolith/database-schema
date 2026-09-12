import * as DB from "tsondb/schema/dsl"
import { NestedTranslationMap } from "./Locale.ts"
import { SlowSkillCastingTimeUnit } from "./SkillModificationLevel.js"
import { SkillModificationLevelIdentifier } from "./_Identifier.js"
import { ResponsiveTextOptional } from "./_ResponsiveText.ts"

export const CastingTime = DB.GenEnum(import.meta.url, {
  name: "CastingTime",
  parameters: [DB.Param("NonModifiable")],
  values: NonModifiable => ({
    Modifiable: DB.EnumCase({ type: DB.IncludeIdentifier(ModifiableCastingTime) }),
    NonModifiable: DB.EnumCase({ type: DB.TypeArgument(NonModifiable) }),
  }),
})

const ModifiableCastingTime = DB.TypeAlias(import.meta.url, {
  name: "ModifiableCastingTime",
  type: () =>
    DB.Object({
      initial_modification_level: DB.Required({
        comment: "The initial skill modification identifier/level.",
        type: SkillModificationLevelIdentifier(),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "ModifiableCastingTime",
        DB.Object(
          {
            note: DB.Optional({
              comment: "A note, appended to the generated string in parenthesis.",
              type: DB.IncludeIdentifier(ResponsiveTextOptional),
            }),
          },
          { minProperties: 1 },
        ),
      ),
    }),
})

export const CastingTimeIncludingLovemaking = DB.GenTypeAlias(import.meta.url, {
  name: "CastingTimeIncludingLovemaking",
  comment: `The casting time may have two different values: One for use in “normal” time, i. e. actions, combat rounds and others, and one for use during lovemaking, which is a rule set from Aventurian Intimacy.

There must always be at least one casting time value.`,
  parameters: [DB.Param("NonModifiable")],
  type: NonModifiable =>
    DB.Object(
      {
        default: DB.Optional({
          comment: "The default casting time definition.",
          type: DB.GenIncludeIdentifier(CastingTime, [DB.TypeArgument(NonModifiable)]),
        }),
        during_lovemaking: DB.Optional({
          comment:
            "The casting time during lovemaking. In Aventurian Intimacy, you may only use an activatable skill during lovemaking if it has a casting time used during lovemaking.",
          type: DB.IncludeIdentifier(CastingTimeDuringLovemaking),
        }),
      },
      { minProperties: 1 },
    ),
})

export const CastingTimeDuringLovemaking = DB.TypeAlias(import.meta.url, {
  name: "CastingTimeDuringLovemaking",
  comment:
    "The casting time during lovemaking. In Aventurian Intimacy, you may only use an activatable skill during lovemaking if it has a casting time used during lovemaking.",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The (unitless) casting time value.",
        type: DB.Integer({ minimum: 1 }),
      }),
      unit: DB.Required({
        comment: "The unit of the `value`.",
        type: DB.IncludeIdentifier(CastingTimeDuringLovemakingUnit),
      }),
    }),
})

const CastingTimeDuringLovemakingUnit = DB.Enum(import.meta.url, {
  name: "CastingTimeDuringLovemakingUnit",
  values: () => ({
    SeductionActions: DB.EnumCase({ type: null }),
    Rounds: DB.EnumCase({ type: null }),
  }),
})

const FastSkillNonModifiableCastingTime = DB.TypeAlias(import.meta.url, {
  name: "FastSkillNonModifiableCastingTime",
  type: () =>
    DB.Object({
      actions: DB.Required({
        comment: "The casting time value in actions.",
        type: DB.Integer({ minimum: 1 }),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "FastSkillNonModifiableCastingTime",
        DB.Object(
          {
            note: DB.Optional({
              comment: "A note, appended to the generated string in parenthesis.",
              type: DB.IncludeIdentifier(ResponsiveTextOptional),
            }),
          },
          { minProperties: 1 },
        ),
      ),
    }),
})

export const SlowSkillNonModifiableCastingTime = DB.TypeAlias(import.meta.url, {
  name: "SlowSkillNonModifiableCastingTime",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The (unitless) casting time value.",
        type: DB.Integer({ minimum: 1 }),
      }),
      unit: DB.Required({
        comment: "The unit of the `value`.",
        type: DB.IncludeIdentifier(SlowSkillCastingTimeUnit),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "SlowSkillNonModifiableCastingTime",
        DB.Object(
          {
            note: DB.Optional({
              comment: "A note, appended to the generated string in parenthesis.",
              type: DB.IncludeIdentifier(ResponsiveTextOptional),
            }),
          },
          { minProperties: 1 },
        ),
      ),
    }),
})

export const FastCastingTime = DB.TypeAlias(import.meta.url, {
  name: "FastCastingTime",
  type: () =>
    DB.GenIncludeIdentifier(CastingTimeIncludingLovemaking, [
      DB.IncludeIdentifier(FastSkillNonModifiableCastingTime),
    ]),
})

export const SlowCastingTime = DB.TypeAlias(import.meta.url, {
  name: "SlowCastingTime",
  type: () =>
    DB.GenIncludeIdentifier(CastingTimeIncludingLovemaking, [
      DB.IncludeIdentifier(SlowSkillNonModifiableCastingTime),
    ]),
})
