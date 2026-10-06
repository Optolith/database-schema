import { isNotNullish, nullableToArray } from "@elyukai/utils/nullable"
import * as DB from "tsondb/schema/dsl"
import type { GetInstanceById } from "tsondb/schema/gen"
import { AttributeIdentifier, DerivedCharacteristicIdentifier } from "./_Identifier.js"

export const SkillCheck = DB.TypeAlias(import.meta.url, {
  name: "SkillCheck",
  comment: "The attributes’ identifiers of the skill check.",
  type: () =>
    DB.Array(AttributeIdentifier(), {
      minItems: 3,
      maxItems: 3,
    }),
})

export const SkillCheckPenalty = DB.Enum(import.meta.url, {
  name: "SkillCheckPenalty",
  comment: "A specific value that represents a penalty for the associated skill check.",
  values: () => ({
    DerivedCharacteristic: DB.EnumCase({
      type: DB.IncludeIdentifier(DerivedCharacteristicSkillCheckPenalty),
    }),
    SummoningDifficulty: DB.EnumCase({ type: null }),
    CreationDifficulty: DB.EnumCase({ type: null }),
    Object: DB.EnumCase({ type: null }),
  }),
})

const DerivedCharacteristicSkillCheckPenalty = DB.Enum(import.meta.url, {
  name: "DerivedCharacteristicSkillCheckPenalty",
  comment:
    "A derived characteristic that classifies as a resistance that represents a penalty for the associated skill check.",
  values: () => ({
    Single: DB.EnumCase({
      type: DB.IncludeIdentifier(SingleDerivedCharacteristicSkillCheckPenalty),
    }),
    Maximum: DB.EnumCase({
      type: DB.IncludeIdentifier(MaximumDerivedCharacteristicSkillCheckPenalty),
    }),
  }),
})

const checkDerivedCharacteristicIsResistance = (id: string, getInstanceById: GetInstanceById) =>
  getInstanceById("DerivedCharacteristic", id)?.type?.kind !== "Resistance"
    ? `The derived characteristic with the identifier "${id}" is not a resistance.`
    : undefined

const SingleDerivedCharacteristicSkillCheckPenalty = DB.TypeAlias(import.meta.url, {
  name: "SingleDerivedCharacteristicSkillCheckPenalty",
  comment:
    "A single derived characteristic that classifies as a resistance that represents a penalty for the associated skill check. It may be halved for the skill check.",
  type: () =>
    DB.Object({
      derivedCharacteristic: DB.Required({
        comment: "The derived characteristic that is used for the skill check.",
        type: DerivedCharacteristicIdentifier(),
      }),
      halved: DB.Required({
        comment: "Is the penalty halved for this skill check?",
        type: DB.Boolean(),
      }),
    }),
  customConstraints: ({ instanceContent, getInstanceById }) =>
    nullableToArray(
      checkDerivedCharacteristicIsResistance(
        instanceContent.derivedCharacteristic,
        getInstanceById,
      ),
    ),
})

const MaximumDerivedCharacteristicSkillCheckPenalty = DB.TypeAlias(import.meta.url, {
  name: "MaximumDerivedCharacteristicSkillCheckPenalty",
  comment:
    "Multiple derived characteristics that classify as resistances whose maximum value represents a penalty for the associated skill check.",
  type: () =>
    DB.Object({
      derivedCharacteristics: DB.Required({
        comment: "The derived characteristic that is used for the skill check.",
        type: DB.Array(DerivedCharacteristicIdentifier(), {
          minItems: 2,
          uniqueItems: true,
        }),
      }),
    }),
  customConstraints: ({ instanceContent, getInstanceById }) =>
    instanceContent.derivedCharacteristics
      .map(id => checkDerivedCharacteristicIsResistance(id, getInstanceById))
      .filter(isNotNullish),
})
