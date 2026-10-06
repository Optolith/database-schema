/**
 * This file defines some shared types for different diseases and poisons.
 */

import { isNotNullish, nullableToArray } from "@elyukai/utils/nullable"
import * as DB from "tsondb/schema/dsl"
import type { GetInstanceById } from "tsondb/schema/gen"
import { NestedTranslationMap } from "./Locale.js"
import { AlternativeName } from "./_AlternativeNames.js"
import { DerivedCharacteristicIdentifier } from "./_Identifier.ts"
import { Errata } from "./source/_Erratum.js"

export const level = DB.Required({
  comment: "The disease’s level.",
  type: DB.Integer({ minimum: 1 }),
})

export const Resistance = DB.Enum(import.meta.url, {
  name: "Resistance",
  comment:
    "Depending on the disease or poison, apply a resistance as a penalty to the disease or poison roll. It may also happen that the minimum is applied as a penalty.",
  values: () => ({
    Single: DB.EnumCase({
      type: DB.IncludeIdentifier(SingleResistance),
    }),
    Minimum: DB.EnumCase({
      type: DB.IncludeIdentifier(MinimumResistance),
    }),
  }),
})

export const resistance = DB.Required({
  comment:
    "Depending on the disease or poison, apply Spirit or Toughness as a penalty to the disease or poison roll. It may also happen that the minimum is applied as a penalty.",
  type: DB.IncludeIdentifier(Resistance),
})

const checkDerivedCharacteristicIsResistance = (id: string, getInstanceById: GetInstanceById) =>
  getInstanceById("DerivedCharacteristic", id)?.type?.kind !== "Resistance"
    ? `The derived characteristic with the identifier "${id}" is not a resistance.`
    : undefined

const SingleResistance = DB.TypeAlias(import.meta.url, {
  name: "SingleResistance",
  comment: "A single derived characteristic that classifies as a resistance.",
  type: () =>
    DB.Object({
      derivedCharacteristic: DB.Required({
        comment: "The derived characteristic that is used for the skill check.",
        type: DerivedCharacteristicIdentifier(),
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

const MinimumResistance = DB.TypeAlias(import.meta.url, {
  name: "MinimumResistance",
  comment:
    "Multiple derived characteristics that classify as resistances whose minimum value represents the actual resistance against the disease.",
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

export const Cause = DB.TypeAlias(import.meta.url, {
  name: "Cause",
  comment:
    "What causes the disease? The GM rolls 1D20 to see if a character gets infected. If the infection check succeeds, the GM makes a disease check to determine the severity of the infection.",
  type: () =>
    DB.Object({
      chance: DB.Optional({
        comment:
          "The chance to get infected by this cause, in percent. Some causes do not have a specific chance.",
        type: DB.Integer({ minimum: 5, multipleOf: 5, maximum: 100 }),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "Cause",
        DB.Object({
          name: DB.Required({
            comment: "The cause’s name.",
            type: DB.String({ minLength: 1 }),
          }),
          chance: DB.Optional({
            comment:
              "The chance to get infected by this cause. If present for this language, this overrides the universal `chance` field; they cannot be used at the same time.",
            type: DB.String({ minLength: 1 }),
          }),
          note: DB.Optional({
            comment: "An additional note about this cause.",
            type: DB.String({ minLength: 1 }),
          }),
        }),
      ),
    }),
})

export const cause = DB.Required({
  comment:
    "What causes the disease? The GM rolls 1D20 to see if a character gets infected. If the infection check succeeds, the GM makes a disease check to determine the severity of the infection.",
  type: DB.Array(DB.IncludeIdentifier(Cause), { minItems: 1 }),
})

export const Reduceable = DB.GenTypeAlias(import.meta.url, {
  name: "Reduceable",
  comment: `An effect or other parameter that may be reduced by a failed disease check for lessening or a degraded poison.

This streamlines the wording for diseases and poison by using a unified wording for *lessened* (disease) and *degraded* (poison).`,
  parameters: [DB.Param("Content")],
  type: Content =>
    DB.Object({
      default: DB.Required({
        comment: "The default value. In the source, it's the text before the slash.",
        type: DB.TypeArgument(Content),
      }),
      reduced: DB.Optional({
        comment:
          "The reduced value. In the source, it's the text after the slash. Some entries may not have a reduced value, i.e. there is no slash with text after it. If the text after the slash is a dash, include it here as well.",
        type: DB.TypeArgument(Content),
      }),
      additonal: DB.Optional({
        comment: "An additional text that applies regardless of the effect being reduced or not.",
        type: DB.String({ minLength: 1, markdown: "inline" }),
      }),
    }),
})

export const DiseaseTranslation = DB.Object({
  name: DB.Required({
    comment: "The disease’s name.",
    type: DB.String({ minLength: 1 }),
  }),
  alternative_names: DB.Optional({
    comment: "A list of alternative names.",
    type: DB.Array(DB.IncludeIdentifier(AlternativeName), { minItems: 1 }),
  }),
  progress: DB.Required({
    comment: "The disease’s progress, in detail.",
    type: DB.String({ minLength: 1, markdown: "block" }),
  }),
  incubation_time: DB.Required({
    comment: "After infection, how much time passes before symptoms appear?",
    type: DB.String({ minLength: 1 }),
  }),
  damage: DB.Required({
    comment:
      "The damage caused by the disease. If the disease check fails, apply the lessened effects.",
    type: DB.GenIncludeIdentifier(Reduceable, [DB.String({ minLength: 1, markdown: "block" })]),
  }),
  duration: DB.Required({
    comment: "The duration of the disease. If the disease check fails, use the lessened duration.",
    type: DB.GenIncludeIdentifier(Reduceable, [DB.String({ minLength: 1, markdown: "block" })]),
  }),
  special: DB.Optional({
    comment: "Special information about the disease.",
    type: DB.String({ minLength: 1, markdown: "block" }),
  }),
  treatment: DB.Required({
    comment: "Methods known to lessen the disease’s progress or relieve symptoms.",
    type: DB.String({ minLength: 1, markdown: "block" }),
  }),
  cure: DB.Required({
    comment: "Known remedies for the disease.",
    type: DB.String({ minLength: 1, markdown: "block" }),
  }),
  errata: DB.Optional({
    type: DB.IncludeIdentifier(Errata),
  }),
})
