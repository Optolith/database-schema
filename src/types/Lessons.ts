import * as DB from "tsondb/schema/dsl"
import { NestedTranslationMap } from "./Locale.js"
import {
  CurriculumIdentifier,
  ElementIdentifier,
  GuidelineIdentifier,
  MagicalTraditionIdentifier,
  PropertyIdentifier,
  SkillIdentifier,
} from "./_Identifier.js"
import { CombatTechniqueIdentifier, SpellworkIdentifier } from "./_IdentifierGroup.js"
import { Errata } from "./source/_Erratum.js"
import { src } from "./source/_PublicationRef.js"

export const Guideline = DB.Entity(import.meta.url, {
  name: "Guideline",
  namePlural: "Guidelines",
  type: () =>
    DB.Object({
      spellwork_changes_allowed: DB.Required({
        comment: "Maximum number of spells that can be exchanged.",
        type: DB.Integer({ minimum: 0 }),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "Guideline",
        DB.Object({
          name: DB.Required({
            comment: "The guideline’s name.",
            type: DB.String({ minLength: 1 }),
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

export const Curriculum = DB.Entity(import.meta.url, {
  name: "Curriculum",
  namePlural: "Curricula",
  comment:
    "This is a curriculum of a specified or other institutions such as private teachers, containing the guideline, elective and restricted spellworks as well as the lesson packages of that academy. It is used with the focus rule *Lessons*.",
  type: () =>
    DB.Object({
      guideline: DB.Required({
        comment: "The institution’s guideline.",
        type: GuidelineIdentifier(),
      }),
      elective_spellworks: DB.Optional({
        comment: "The institution’s elective spellworks package.",
        type: DB.IncludeIdentifier(ElectiveSpellworks),
      }),
      restricted_spellworks: DB.Optional({
        comment: "The institution’s restricted spellworks package.",
        type: DB.IncludeIdentifier(RestrictedSpellworks),
      }),
      lesson_packages: DB.Required({
        comment: "A list of available lesson packages.",
        type: DB.ChildEntities(LessonPackage),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "Curriculum",
        DB.Object({
          name: DB.Required({
            comment: "The institution’s name.",
            type: DB.String({ minLength: 1 }),
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

const ElectiveSpellworks = DB.Enum(import.meta.url, {
  name: "ElectiveSpellworks",
  comment: "The institution’s elective spellworks package.",
  values: () => ({
    DefinedByGameMaster: DB.EnumCase({ type: null }),
    Specific: DB.EnumCase({ type: DB.IncludeIdentifier(SpecificElectiveSpellworks) }),
  }),
})

const SpecificElectiveSpellworks = DB.TypeAlias(import.meta.url, {
  name: "SpecificElectiveSpellworks",
  type: () =>
    DB.Object({
      list: DB.Required({
        type: DB.Array(DB.IncludeIdentifier(ElectiveSpellwork), { minItems: 1, uniqueItems: true }),
      }),
    }),
})

const ElectiveSpellwork = DB.TypeAlias(import.meta.url, {
  name: "ElectiveSpellwork",
  type: () =>
    DB.Object({
      id: DB.Required({
        type: DB.IncludeIdentifier(SpellworkIdentifier),
      }),
      restriction: DB.Optional({
        comment:
          "The elective spellwork may only take effect if a certain condition is met. The condition may be related to professions or profession variants, but it is designed so that it can work without a specific profession, as multiple may belong to an institute, but with referencing other entities instead.",
        type: DB.IncludeIdentifier(ElectiveSpellworkRestriction),
      }),
    }),
})

const ElectiveSpellworkRestriction = DB.Enum(import.meta.url, {
  name: "ElectiveSpellworkRestriction",
  comment:
    "The elective spellwork may only take effect if a certain condition is met. The condition may be related to professions or profession variants, but it is designed so that it can work without a specific profession, as multiple may belong to an institute, but with referencing other entities instead.",
  values: () => ({
    Element: DB.EnumCase({ type: ElementIdentifier() }),
  }),
})

const RestrictedSpellworks = DB.TypeAlias(import.meta.url, {
  name: "RestrictedSpellworks",
  comment: "The institution’s restricted spellworks package.",
  type: () =>
    DB.Array(DB.IncludeIdentifier(RestrictedSpellwork), { minItems: 1, uniqueItems: true }),
})

const RestrictedSpellwork = DB.Enum(import.meta.url, {
  name: "RestrictedSpellwork",
  values: () => ({
    Property: DB.EnumCase({ type: DB.IncludeIdentifier(RestrictedProperty) }),
    Spellwork: DB.EnumCase({ type: DB.IncludeIdentifier(SpellworkIdentifier) }),
    DemonSummoning: DB.EnumCase({ type: null }),
    Borbaradian: DB.EnumCase({ type: null }),
    DamageIntelligent: DB.EnumCase({ type: null }),
  }),
})

const RestrictedProperty = DB.TypeAlias(import.meta.url, {
  name: "RestrictedProperty",
  type: () =>
    DB.Object({
      id: DB.Required({
        comment: "The identifier of the property that spellworks are disallowed from.",
        type: PropertyIdentifier(),
      }),
      exclude: DB.Optional({
        comment: "Exclude specific spellworks from the restriction.",
        type: DB.Array(DB.IncludeIdentifier(SpellworkIdentifier), {
          minItems: 1,
          uniqueItems: true,
        }),
      }),
      maximum: DB.Optional({
        comment:
          "Spellworks from this property up to a certain number are allowed. Spellworks excluded from this restriction definition using `exclude` do not contribute to the maximum.",
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})

export const LessonPackage = DB.Entity(import.meta.url, {
  name: "LessonPackage",
  namePlural: "LessonPackages",
  type: () =>
    DB.Object(
      {
        curriculum: DB.Required({
          comment: "The associated curriculum.",
          type: CurriculumIdentifier(),
        }),
        apValue: DB.Optional({
          comment:
            "The AP value of the lesson package. This is only used to compare the generated AP value with the one in the book for error checking.",
          type: DB.Integer({ minimum: 1 }),
        }),
        spellwork_changes: DB.Optional({
          comment:
            "The spell values difference of the lesson package. This field reflects the changes (difference) to the field of the same name in the profession package. If a spell gets to SR 0 because of this, it will be removed completely.",
          type: DB.Array(DB.IncludeIdentifier(SpellworkChange), { minItems: 1, uniqueItems: true }),
        }),
        skills: DB.Optional({
          type: DB.Array(DB.IncludeIdentifier(AbilityAdjustment), {
            minItems: 1,
            uniqueItems: true,
          }),
        }),
        translations: NestedTranslationMap(
          DB.Required,
          "LessonPackage",
          DB.Object({
            name: DB.Required({
              comment: "The lesson package’s name.",
              type: DB.String({ minLength: 1 }),
            }),
            spellwork_changes: DB.Optional({
              comment:
                "The spell values difference of the lesson package. Use this field to specify a text that is displayed instead of the generated `spellwork_changes` list. The field is displayed even if no list is present.",
              type: DB.String({ minLength: 1 }),
            }),
          }),
        ),
      },
      { minProperties: 3 },
    ),
  parentReferenceKey: "curriculum",
  instanceDisplayName: {},
})

const SpellworkChange = DB.TypeAlias(import.meta.url, {
  name: "SpellworkChange",
  type: () =>
    DB.Object({
      base: DB.Required({
        type: DB.IncludeIdentifier(SpellworkAdjustment),
      }),
      replacement: DB.Required({
        type: DB.IncludeIdentifier(SpellworkAdjustment),
      }),
    }),
})

const AbilityAdjustment = DB.Enum(import.meta.url, {
  name: "AbilityAdjustment",
  values: () => ({
    CombatTechnique: DB.EnumCase({ type: DB.IncludeIdentifier(CombatTechniqueAdjustment) }),
    Skill: DB.EnumCase({ type: DB.IncludeIdentifier(SkillAdjustment) }),
    Spellwork: DB.EnumCase({ type: DB.IncludeIdentifier(SpellworkAdjustmentWithBase) }),
  }),
})

const CombatTechniqueAdjustment = DB.TypeAlias(import.meta.url, {
  name: "CombatTechniqueAdjustment",
  type: () =>
    DB.Object({
      id: DB.Required({
        type: DB.IncludeIdentifier(CombatTechniqueIdentifier),
      }),
      points: DB.Required({
        comment:
          "The combat technique points that will be added to the current combat technique rating.",
        type: DB.Integer({ minimum: -6, maximum: 6 }),
      }),
      basePoints: DB.Optional({
        comment:
          "The combat technique rating of the base profession package. This is only used to compare the derived rating from the profession package with the one in the book for error checking. Note that 6 is always added to that number, so to get a base rating of 10, this field should be 4.",
        type: DB.Integer({ minimum: 0, maximum: 6 }),
      }),
    }),
})

const SkillAdjustment = DB.TypeAlias(import.meta.url, {
  name: "SkillAdjustment",
  type: () =>
    DB.Object({
      id: DB.Required({
        type: SkillIdentifier(),
      }),
      points: DB.Required({
        comment: "The skill points that will be added to the current skill rating.",
        type: DB.Integer({ minimum: -8, maximum: 8 }),
      }),
      basePoints: DB.Optional({
        comment:
          "The skill rating of the base profession package. This is only used to compare the derived rating from the profession package with the one in the book for error checking.",
        type: DB.Integer({ minimum: 0, maximum: 8 }),
      }),
    }),
})

const SpellworkAdjustment = DB.TypeAlias(import.meta.url, {
  name: "SpellworkAdjustment",
  type: () =>
    DB.Object({
      id: DB.Required({
        type: DB.IncludeIdentifier(SpellworkIdentifier),
      }),
      points: DB.Required({
        comment:
          "The skill points that will be added to the current skill rating. If a spell gets to a skill rating of 0 because of this, it will be removed completely.",
        type: DB.Integer({ minimum: -10, maximum: 10 }),
      }),
      tradition: DB.Optional({
        comment:
          "The target tradition. If the target spell is not from the Guild Mage tradition, specify the tradition identifier here.",
        type: MagicalTraditionIdentifier(),
      }),
    }),
})

const SpellworkAdjustmentWithBase = DB.TypeAlias(import.meta.url, {
  name: "SpellworkAdjustmentWithBase",
  type: () =>
    DB.Object({
      id: DB.Required({
        type: DB.IncludeIdentifier(SpellworkIdentifier),
      }),
      points: DB.Required({
        comment:
          "The skill points that will be added to the current skill rating. If a spell gets to a skill rating of 0 because of this, it will be removed completely.",
        type: DB.Integer({ minimum: -10, maximum: 10 }),
      }),
      basePoints: DB.Optional({
        comment:
          "The spell rating of the base profession package. This is only used to compare the derived rating from the profession package with the one in the book for error checking.",
        type: DB.Integer({ minimum: 0, maximum: 10 }),
      }),
      tradition: DB.Optional({
        comment:
          "The target tradition. If the target spell is not from the Guild Mage tradition, specify the tradition identifier here.",
        type: MagicalTraditionIdentifier(),
      }),
    }),
})
