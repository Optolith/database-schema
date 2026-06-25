/**
 * @title Enhancements
 */

import * as DB from "tsondb/schema/dsl"
import { input } from "./_Activatable.ts"
import { SkillWithEnhancementsIdentifier } from "./_IdentifierGroup.js"
import { EnhancementPrerequisites } from "./_Prerequisite.js"
import { NestedTranslationMap } from "./Locale.js"
import { Errata } from "./source/_Erratum.js"
import { PublicationRefs } from "./source/_PublicationRef.js"

export const Enhancements = DB.TypeAlias(import.meta.url, {
  name: "Enhancements",
  comment: "A list of enhancements.",
  type: () => DB.ChildEntities(Enhancement),
})

export const Enhancement = DB.Entity(import.meta.url, {
  name: "Enhancement",
  namePlural: "Enhancements",
  type: () =>
    DB.Object({
      parent: DB.Required({
        comment: "The spellwork or liturgy this enhancement belongs to",
        type: DB.IncludeIdentifier(SkillWithEnhancementsIdentifier),
      }),
      skill_rating: DB.Required({
        comment: "The skill rating required to learn this enhancement.",
        type: DB.Integer({
          minimum: 8,
          maximum: 16,
          multipleOf: 2,
        }),
      }),
      adventurePoints: DB.Required({
        comment: "Defines how to determine the AP cost of an enhancement.",
        type: DB.IncludeIdentifier(EnhancementAdventurePoints),
      }),
      prerequisites: DB.Optional({
        type: DB.IncludeIdentifier(EnhancementPrerequisites),
      }),
      src: DB.Optional({
        comment: "Only defined if different than the associated skill.",
        type: DB.IncludeIdentifier(PublicationRefs),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "Enhancement",
        DB.Object({
          name: DB.Required({
            comment: "The name of the enhancement.",
            type: DB.String({
              minLength: 1,
            }),
          }),
          effect: DB.Required({
            comment: "The effect description.",
            type: DB.String({
              minLength: 1,
              markdown: "block",
            }),
          }),
          input,
          errata: DB.Optional({
            type: DB.IncludeIdentifier(Errata),
          }),
        }),
      ),
    }),
  parentReferenceKey: "parent",
  instanceDisplayName: {},
  instanceDisplayNameCustomizer: ({
    instance,
    instanceDisplayName,
    instanceDisplayNameLocaleId,
    getDisplayNameForInstanceId,
  }) => ({
    name: `${getDisplayNameForInstanceId(instance.parent)?.name ?? ""} — ${instanceDisplayName}`,
    localeId: instanceDisplayNameLocaleId,
  }),
  uniqueConstraints: [
    [
      {
        keyPath: "parent",
      },
      {
        entityMapKeyPath: "translations",
        keyPathInEntityMap: "name",
      },
    ],
  ],
})

const EnhancementAdventurePoints = DB.Enum(import.meta.url, {
  name: "EnhancementAdventurePoints",
  comment: "Defines how to determine the AP cost of an enhancement.",
  values: () => ({
    DerivedFromImprovementCost: DB.EnumCase({
      comment:
        "Use the numeric representation of the associated skill's improvement cost as the AP cost of this enhancement.",
      type: DB.IncludeIdentifier(DerivedEnhancementAdventurePoints),
    }),
    Constant: DB.EnumCase({
      comment: "Use the specified constant value as the AP cost of this enhancement.",
      type: DB.Integer({
        minimum: 1,
      }),
    }),
  }),
})

const DerivedEnhancementAdventurePoints = DB.TypeAlias(import.meta.url, {
  name: "DerivedEnhancementAdventurePoints",
  type: () =>
    DB.Object({
      multiplier: DB.Required({
        comment:
          "The value to multiply with the numeric representation of the associated skill's improvement cost to form the final AP cost of this enhancement.",
        type: DB.Integer({
          minimum: 1,
          maximum: 3,
        }),
      }),
    }),
})
