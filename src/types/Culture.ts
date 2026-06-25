import * as DB from "tsondb/schema/dsl"
import { CommonnessRatedAdvantageDisadvantage } from "./_CommonnessRatedAdvantageDisadvantage.js"
import {
  AdvantageIdentifier,
  BlessedTraditionIdentifier,
  DisadvantageIdentifier,
  LanguageIdentifier,
  LanguageSpecializationIdentifier,
  MagicalTraditionIdentifier,
  ProfessionIdentifier,
  ProfessionVariantIdentifier,
  ScriptIdentifier,
  SkillIdentifier,
  SocialStatusIdentifier,
} from "./_Identifier.js"
import { BinarySex } from "./_Sex.js"
import { NestedTranslationMap } from "./Locale.js"
import { Errata } from "./source/_Erratum.js"
import { src } from "./source/_PublicationRef.js"

export const Culture = DB.Entity(import.meta.url, {
  name: "Culture",
  namePlural: "Cultures",
  type: () =>
    DB.Object({
      language: DB.Required({
        comment: "A list of native languages (usually it is only one).",
        type: DB.Array(DB.IncludeIdentifier(CultureLanguage), { minItems: 1, uniqueItems: true }),
      }),
      script: DB.Optional({
        comment:
          "A list of native scripts (usually it is only one). If the culture does not use any script, leave this array empty.",
        type: DB.Array(ScriptIdentifier(), { minItems: 1, uniqueItems: true }),
      }),
      area_knowledge: DB.Required({
        comment: "If the area knowledge has a fixed value or can be adjusted.",
        type: DB.IncludeIdentifier(AreaKnowledge),
      }),
      social_status: DB.Required({
        comment: "A list of possible social status in the respective culture.",
        type: DB.Array(SocialStatusIdentifier(), { minItems: 1, uniqueItems: true }),
      }),
      common_professions: DB.Required({
        comment:
          "A list of professions that are typical for the culture, as well as professions that are rarely practiced or encountered in the culture. The list is either defined by group (as multiple lists) or plain (as a single list).",
        type: DB.IncludeIdentifier(CommonProfessions),
      }),
      common_advantages: DB.Optional({
        comment: "A list of common advantages.",
        type: DB.Array(
          DB.GenIncludeIdentifier(CommonnessRatedAdvantageDisadvantage, [AdvantageIdentifier()]),
          { minItems: 1 },
        ),
      }),
      common_disadvantages: DB.Optional({
        comment: "A list of common disadvantages.",
        type: DB.Array(
          DB.GenIncludeIdentifier(CommonnessRatedAdvantageDisadvantage, [DisadvantageIdentifier()]),
          { minItems: 1 },
        ),
      }),
      uncommon_advantages: DB.Optional({
        comment: "A list of uncommon advantages.",
        type: DB.Array(
          DB.GenIncludeIdentifier(CommonnessRatedAdvantageDisadvantage, [AdvantageIdentifier()]),
          { minItems: 1 },
        ),
      }),
      uncommon_disadvantages: DB.Optional({
        comment: "A list of uncommon disadvantages.",
        type: DB.Array(
          DB.GenIncludeIdentifier(CommonnessRatedAdvantageDisadvantage, [DisadvantageIdentifier()]),
          { minItems: 1 },
        ),
      }),
      common_skills: DB.Required({
        comment: "A list of common skills.",
        type: DB.Array(DB.IncludeIdentifier(CommonnessRatedSkill), { minItems: 1 }),
      }),
      uncommon_skills: DB.Optional({
        comment: "A list of uncommon skills.",
        type: DB.Array(DB.IncludeIdentifier(CommonnessRatedSkill), { minItems: 1 }),
      }),
      cultural_package: DB.Required({
        comment: "The skill points you get for buying the culture package.",
        type: DB.Array(DB.IncludeIdentifier(CulturalPackageItem), { minItems: 1 }),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "Culture",
        DB.Object({
          name: DB.Required({
            comment: "The race’s name.",
            type: DB.String({ minLength: 1 }),
          }),
          area_knowledge: DB.Required({
            comment: "The description of the area knowledge.",
            type: DB.IncludeIdentifier(AreaKnowledgeTranslation),
          }),
          common_advantages: DB.Optional({
            comment: "The respective common advantages text from the source book.",
            type: DB.String({ minLength: 1 }),
          }),
          common_disadvantages: DB.Optional({
            comment: "The respective common disadvantages text from the source book.",
            type: DB.String({ minLength: 1 }),
          }),
          uncommon_advantages: DB.Optional({
            comment: "The respective uncommon advantages text from the source book.",
            type: DB.String({ minLength: 1 }),
          }),
          uncommon_disadvantages: DB.Optional({
            comment: "The respective uncommon disadvantages text from the source book.",
            type: DB.String({ minLength: 1 }),
          }),
          common_names: DB.Required({
            comment: "Structured description of common names.",
            type: DB.IncludeIdentifier(CommonNames),
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

const CultureLanguage = DB.TypeAlias(import.meta.url, {
  name: "CultureLanguage",
  comment: "A native languages with optional specializations.",
  type: () =>
    DB.Object({
      id: DB.Required({
        comment: "The language’s identifier.",
        type: LanguageIdentifier(),
      }),
      specializations: DB.Optional({
        comment: "The language specializations, if any.",
        type: DB.Array(LanguageSpecializationIdentifier(), { minItems: 1, uniqueItems: true }),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "CultureLanguage",
        DB.Object(
          {
            specialization: DB.Optional({
              comment:
                "The concrete language specialization, if the language allows to specify arbitrary text.",
              type: DB.String({ minLength: 1 }),
            }),
            specializationPrompt: DB.Optional({
              comment:
                "A different promt fro the language specialization, if the language allows to specify arbitrary text.",
              type: DB.String({ minLength: 1 }),
            }),
          },
          { minProperties: 1 },
        ),
      ),
    }),
})

const AreaKnowledge = DB.TypeAlias(import.meta.url, {
  name: "AreaKnowledge",
  comment: "If the area knowledge has a fixed value or can be adjusted.",
  type: () =>
    DB.Object({
      is_fixed: DB.Required({
        comment: "`true` if the area knowledge has a fixed value, `false` if it can be adjusted.",
        type: DB.Boolean(),
      }),
    }),
})

const CommonnessWeight = DB.Enum(import.meta.url, {
  name: "CommonnessWeight",
  comment:
    "The “weight” difference compared to other professions or profession variants. Some professions or profession variants are simply more common (`Mostly`), but sometimes only specific elements are used (`Only`).",
  values: () => ({
    Mostly: DB.EnumCase({ type: null }),
    Only: DB.EnumCase({ type: null }),
  }),
})

const Weighted = DB.GenTypeAlias(import.meta.url, {
  name: "Weighted",
  comment:
    "Some professions or profession variants are more common than others. There may be cultures where some professions or profession variants are not represented at all.",
  parameters: [DB.Param("ProfessionOrVariant")],
  type: ProfessionOrVariant =>
    DB.Object({
      elements: DB.Required({
        comment: "The list of more common professions or profession variants.",
        type: DB.Array(DB.TypeArgument(ProfessionOrVariant), { minItems: 1 }),
      }),
      weight: DB.Required({
        comment: "The list of more common professions or profession variants.",
        type: DB.IncludeIdentifier(CommonnessWeight),
      }),
    }),
})

const CommonProfessionConstraintsOperation = DB.Enum(import.meta.url, {
  name: "CommonProfessionConstraintsOperation",
  comment:
    "This defines how the list of constraints should be offset against the list of all mundane professions: Either only the professions are kept that intersect with the constraints or only the professions are kept that are different from the constraints.",
  values: () => ({
    Intersection: DB.EnumCase({ type: null }),
    Difference: DB.EnumCase({ type: null }),
  }),
})

const CommonProfessionConstraints = DB.GenTypeAlias(import.meta.url, {
  name: "CommonProfessionConstraints",
  comment:
    "A list of professions. The filter specifies how the list is applied to all mundane professions.",
  parameters: [DB.Param("Constraint")],
  type: Constraint =>
    DB.Object({
      constraints: DB.Required({
        comment: "The list of constraints.",
        type: DB.Array(DB.TypeArgument(Constraint), { minItems: 1 }),
      }),
      operation: DB.Required({
        comment:
          "This defines how the list of constraints should be offset against the list of all mundane professions: Either only the professions are kept that intersect with the constraints or only the professions are kept that are different from the constraints.",
        type: DB.IncludeIdentifier(CommonProfessionConstraintsOperation),
      }),
    }),
})

const Rarity = DB.Enum(import.meta.url, {
  name: "Rarity",
  comment: "Some professions may be found in a culture, but are not that common.",
  values: () => ({
    Rare: DB.EnumCase({ type: null }),
    VeryRare: DB.EnumCase({ type: null }),
  }),
})

const ProfessionConstraint = DB.TypeAlias(import.meta.url, {
  name: "ProfessionConstraint",
  type: () =>
    DB.Object({
      id: DB.Required({
        comment: "The profession’s identifier.",
        type: ProfessionIdentifier(),
      }),
      weighted_variants: DB.Optional({
        comment:
          "Some profession variants are more common than others. There may be cultures where some variants are not represented at all.",
        type: DB.GenIncludeIdentifier(Weighted, [ProfessionVariantIdentifier()]),
      }),
      rarity: DB.Optional({
        comment: "Some professions may be found in a culture, but are not that common.",
        type: DB.IncludeIdentifier(Rarity),
      }),
    }),
})

const MagicalTraditionConstraint = DB.TypeAlias(import.meta.url, {
  name: "MagicalTraditionConstraint",
  type: () =>
    DB.Object({
      id: DB.Required({
        comment: "The magical tradition’s identifier.",
        type: MagicalTraditionIdentifier(),
      }),
      weighted_professions: DB.Optional({
        comment:
          "Some professions are more common than others. There may be cultures where some professions are not represented at all.",
        type: DB.GenIncludeIdentifier(Weighted, [ProfessionIdentifier()]),
      }),
      rarity: DB.Optional({
        comment: "Some traditions may be found in a culture, but are not that common.",
        type: DB.IncludeIdentifier(Rarity),
      }),
    }),
})

const BlessedTraditionConstraint = DB.TypeAlias(import.meta.url, {
  name: "BlessedTraditionConstraint",
  type: () =>
    DB.Object({
      id: DB.Required({
        comment: "The blessed tradition’s identifier.",
        type: BlessedTraditionIdentifier(),
      }),
      weighted_professions: DB.Optional({
        comment:
          "Some professions are more common than others. There may be cultures where some professions are not represented at all.",
        type: DB.GenIncludeIdentifier(Weighted, [ProfessionIdentifier()]),
      }),
      rarity: DB.Optional({
        comment: "Some traditions may be found in a culture, but are not that common.",
        type: DB.IncludeIdentifier(Rarity),
      }),
    }),
})

const MundaneCommonProfessionConstraint = DB.Enum(import.meta.url, {
  name: "MundaneCommonProfessionConstraint",
  values: () => ({
    Profession: DB.EnumCase({ type: DB.IncludeIdentifier(ProfessionConstraint) }),
  }),
})

const MagicCommonProfessionConstraint = DB.Enum(import.meta.url, {
  name: "MagicCommonProfessionConstraint",
  values: () => ({
    Tradition: DB.EnumCase({ type: DB.IncludeIdentifier(MagicalTraditionConstraint) }),
    MagicDilettante: DB.EnumCase({ type: null }),
    Profession: DB.EnumCase({ type: DB.IncludeIdentifier(ProfessionConstraint) }),
  }),
})

const BlessedCommonProfessionConstraint = DB.Enum(import.meta.url, {
  name: "BlessedCommonProfessionConstraint",
  values: () => ({
    Tradition: DB.EnumCase({ type: DB.IncludeIdentifier(BlessedTraditionConstraint) }),
    Profession: DB.EnumCase({ type: DB.IncludeIdentifier(ProfessionConstraint) }),
  }),
})

const PlainCommonProfessions = DB.TypeAlias(import.meta.url, {
  name: "PlainCommonProfessions",
  type: () => DB.GenIncludeIdentifier(CommonProfessionConstraints, [ProfessionIdentifier()]),
})

const GroupedCommonProfessions = DB.TypeAlias(import.meta.url, {
  name: "GroupedCommonProfessions",
  comment: "Lists of professions by group.",
  type: () =>
    DB.Object(
      {
        mundane: DB.Optional({
          type: DB.GenIncludeIdentifier(CommonProfessionConstraints, [
            DB.IncludeIdentifier(MundaneCommonProfessionConstraint),
          ]),
        }),
        magic: DB.Optional({
          type: DB.GenIncludeIdentifier(CommonProfessionConstraints, [
            DB.IncludeIdentifier(MagicCommonProfessionConstraint),
          ]),
        }),
        blessed: DB.Optional({
          type: DB.GenIncludeIdentifier(CommonProfessionConstraints, [
            DB.IncludeIdentifier(BlessedCommonProfessionConstraint),
          ]),
        }),
      },
      { minProperties: 1 },
    ),
})

const CommonProfessions = DB.Enum(import.meta.url, {
  name: "CommonProfessions",
  comment:
    "A list of professions that are typical for the culture, as well as professions that are rarely practiced or encountered in the culture. The list is either defined by group (as multiple lists) or plain (as a single list).",
  values: () => ({
    Plain: DB.EnumCase({ type: DB.IncludeIdentifier(PlainCommonProfessions) }),
    Grouped: DB.EnumCase({ type: DB.IncludeIdentifier(GroupedCommonProfessions) }),
  }),
})

const CommonnessRatedSkill = DB.TypeAlias(import.meta.url, {
  name: "CommonnessRatedSkill",
  type: () => SkillIdentifier(),
})

const CulturalPackageItem = DB.TypeAlias(import.meta.url, {
  name: "CulturalPackageItem",
  type: () =>
    DB.Object({
      id: DB.Required({
        comment: "The skill’s identifier.",
        type: SkillIdentifier(),
      }),
      points: DB.Required({
        comment:
          "The skill points for the respective skill you get for buying the cultural package.",
        type: DB.Integer({ minimum: 1, maximum: 2 }),
      }),
    }),
})

const AreaKnowledgeTranslation = DB.TypeAlias(import.meta.url, {
  name: "AreaKnowledgeTranslation",
  comment: "Description and examples of the area knowledge.",
  type: () =>
    DB.Object({
      description: DB.Required({
        comment: "The full description without examples in parenthesis.",
        type: DB.String({ minLength: 1 }),
      }),
      abbreviated: DB.Required({
        comment:
          "A shorter version of the description, used in input fields and other UI elements where the space might be to small to use the full description.",
        type: DB.String({ minLength: 1 }),
      }),
      examples: DB.Optional({
        comment: "Examples of areas, if applicable.",
        type: DB.Array(DB.IncludeIdentifier(AreaKnowledgeExample), { minItems: 1 }),
      }),
    }),
})

const AreaKnowledgeExample = DB.TypeAlias(import.meta.url, {
  name: "AreaKnowledgeExample",
  type: () =>
    DB.Object({
      area: DB.Required({
        type: DB.String({ minLength: 1 }),
      }),
    }),
})

const CommonNames = DB.TypeAlias(import.meta.url, {
  name: "CommonNames",
  comment: "Structured description of common names.",
  type: () =>
    DB.Object(
      {
        first_name_groups: DB.Optional({
          comment:
            "First names can be gender-neutral, but they can also be for a specific binary sex. They are sorted into groups.",
          type: DB.Array(DB.IncludeIdentifier(CommonNameGroup), { minItems: 1 }),
        }),
        last_name_groups: DB.Optional({
          comment:
            "Last names can be gender-neutral, like family names, but they can also be for a specific binary sex. They are sorted into groups.",
          type: DB.Array(DB.IncludeIdentifier(CommonNameGroup), { minItems: 1 }),
        }),
        naming_rules: DB.Optional({
          comment: "Special naming rules.",
          type: DB.String({ minLength: 1 }),
        }),
      },
      { minProperties: 1 },
    ),
})

const CommonNameGroup = DB.TypeAlias(import.meta.url, {
  name: "CommonNameGroup",
  type: () =>
    DB.Object(
      {
        label: DB.Required({
          comment: "The group label.",
          type: DB.String({ minLength: 1 }),
        }),
        sex: DB.Optional({
          comment: "The binary sex if the group is only for a certain binary sex.",
          type: DB.IncludeIdentifier(BinarySex),
        }),
        names: DB.Required({
          comment: "The names from the group.",
          type: DB.Array(DB.IncludeIdentifier(CommonName), { minItems: 1 }),
        }),
      },
      { minProperties: 1 },
    ),
})

const CommonName = DB.TypeAlias(import.meta.url, {
  name: "CommonName",
  type: () =>
    DB.Object(
      {
        name: DB.Required({
          type: DB.String({ minLength: 1 }),
        }),
        note: DB.Optional({
          comment: "Additional information about the name, appended in parenthesis.",
          type: DB.String({ minLength: 1 }),
        }),
      },
      { minProperties: 1 },
    ),
})
