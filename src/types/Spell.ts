import * as DB from "tsondb/schema/dsl"
import { FastPerformanceParameters, OldParameter } from "./_ActivatableSkill.js"
import { ActivatableSkillEffect } from "./_ActivatableSkillEffect.js"
import { AffectedTargetCategories } from "./_ActivatableSkillTargetCategory.js"
import { Enhancement } from "./_Enhancements.js"
import { PropertyIdentifier } from "./_Identifier.js"
import { AnyPropertySpecializationIdentifier } from "./_IdentifierGroup.ts"
import { ImprovementCost } from "./_ImprovementCost.js"
import { SpellworkPrerequisites } from "./_Prerequisite.js"
import { SkillCheck, SkillCheckPenalty } from "./_SkillCheck.js"
import { reversalis, SpellworkTraditions } from "./_Spellwork.js"
import { NestedTranslationMap } from "./Locale.js"
import { Errata } from "./source/_Erratum.js"
import { src } from "./source/_PublicationRef.js"

export const Spell = DB.Entity(import.meta.url, {
  name: "Spell",
  namePlural: "Spells",
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
        comment: "Measurable parameters of a spell.",
        type: DB.IncludeIdentifier(FastPerformanceParameters),
      }),
      target: DB.Required({
        comment: "The target category – the kind of creature or object – the skill affects.",
        type: DB.IncludeIdentifier(AffectedTargetCategories),
      }),
      property: DB.Required({
        comment: "The associated property.",
        type: PropertyIdentifier(),
      }),
      propertySpecialization: DB.Optional({
        comment: "The associated property specialization.",
        type: DB.IncludeIdentifier(AnyPropertySpecializationIdentifier),
      }),
      traditions: DB.Required({
        comment:
          "The tradition(s) the spell is available for. It may be *generally* available to all traditions or it may be only familiar in specific traditions.",
        type: DB.IncludeIdentifier(SpellworkTraditions),
      }),
      improvement_cost: DB.Required({
        comment: "States which column is used to improve the skill.",
        type: DB.IncludeIdentifier(ImprovementCost),
      }),
      prerequisites: DB.Optional({
        comment: "The prerequisites for the spell.",
        type: DB.IncludeIdentifier(SpellworkPrerequisites),
      }),
      reversalis,
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "Spell",
        DB.Object({
          name: DB.Required({
            comment: "The spell’s name.",
            type: DB.String({ minLength: 1 }),
          }),
          effect: DB.Required({
            comment:
              "The effect description may be either a plain text or a text that is divided by a list of effects for each quality level. It may also be a list for each two quality levels.",
            type: DB.IncludeIdentifier(ActivatableSkillEffect),
          }),
          casting_time: DB.Optional({
            isDeprecated: true,
            type: DB.IncludeIdentifier(OldParameter),
          }),
          cost: DB.Optional({
            isDeprecated: true,
            type: DB.IncludeIdentifier(OldParameter),
          }),
          range: DB.Optional({
            isDeprecated: true,
            type: DB.IncludeIdentifier(OldParameter),
          }),
          duration: DB.Optional({
            isDeprecated: true,
            type: DB.IncludeIdentifier(OldParameter),
          }),
          target: DB.Optional({
            isDeprecated: true,
            type: DB.String({ minLength: 1 }),
          }),
          errata: DB.Optional({
            type: DB.IncludeIdentifier(Errata),
          }),
        }),
      ),
      enhancements: DB.Required({
        type: DB.ChildEntities(Enhancement),
      }),
    }),
  instanceDisplayName: {},
  uniqueConstraints: [
    {
      entityMapKeyPath: "translations",
      keyPathInEntityMap: "name",
    },
  ],
})
