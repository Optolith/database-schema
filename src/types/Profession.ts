import { isNotNullish } from "@elyukai/utils/nullable"
import * as DB from "tsondb/schema/dsl"
import { CommonnessRatedAdvantageDisadvantage } from "./_CommonnessRatedAdvantageDisadvantage.js"
import {
  AdvantageIdentifier,
  CantripIdentifier,
  CurriculumIdentifier,
  DisadvantageIdentifier,
  ExperienceLevelIdentifier,
  MagicalTraditionIdentifier,
  ProfessionIdentifier,
  ProfessionPackageIdentifier,
  ProfessionVersionIdentifier,
  SkillGroupIdentifier,
  SkillIdentifier,
} from "./_Identifier.js"
import {
  CombatTechniqueIdentifier,
  LiturgyIdentifier,
  MagicalActionIdentifier,
  ProfessionSpecialAbilityIdentifier,
  RequirableSelectOptionIdentifier,
  SpellworkIdentifier,
} from "./_IdentifierGroup.js"
import { ProfessionPrerequisites } from "./_Prerequisite.js"
import { NestedTranslationMap } from "./Locale.js"
import { Errata } from "./source/_Erratum.js"
import { src } from "./source/_PublicationRef.js"

export const Profession = DB.Entity(import.meta.url, {
  name: "Profession",
  namePlural: "Professions",
  type: () =>
    DB.Object({
      group: DB.Required({
        comment: "The profession group.",
        type: DB.IncludeIdentifier(ProfessionGroup),
      }),
      versions: DB.Required({
        comment: `A list of professions representing the same profession but with (slightly) different stats. For example, there may be a profession in a regional sourcebook or in the core rules and a profession in an extension rulebook like Magic of Aventuria, where the profession is basically called the same and almost has the same values, but the version from Magic of Aventuria features a spell style special ability that does not exist in the core rules or regional sourcebook.

      The profession representation may feature different values for different explicitly mentioned experience levels. In most cases, there is only one stats package, which targets the experience level *Experienced*.`,
        type: DB.ChildEntities(ProfessionVersion),
      }),
    }),
  instanceDisplayName: null,
  instanceDisplayNameCustomizer: ({
    instanceId,
    getDisplayNameForInstanceId,
    getAllChildInstancesForParent,
  }) => {
    const [firstProfessionVersion, ...otherProfessionVersions] = getAllChildInstancesForParent(
      "ProfessionVersion",
      instanceId,
    )

    if (!firstProfessionVersion) {
      return { name: "(Profession with no version)" }
    }

    const displayName = getDisplayNameForInstanceId(
      "ProfessionVersion",
      firstProfessionVersion.id,
    ) ?? {
      name: firstProfessionVersion.id,
    }

    if (otherProfessionVersions.length === 0) {
      return displayName
    }

    return {
      ...displayName,
      name: `${displayName.name} (+${otherProfessionVersions.length.toString()} version${
        otherProfessionVersions.length > 1 ? "s" : ""
      })`,
    }
  },
})

const ProfessionGroup = DB.Enum(import.meta.url, {
  name: "ProfessionGroup",
  values: () => ({
    Mundane: DB.EnumCase({ type: DB.IncludeIdentifier(MundaneProfessionGroup) }),
    Magical: DB.EnumCase({ type: DB.IncludeIdentifier(MagicalProfessionGroup) }),
    Blessed: DB.EnumCase({ type: null }),
  }),
})

export const MundaneProfessionGroup = DB.Enum(import.meta.url, {
  name: "MundaneProfessionGroup",
  values: () => ({
    Profane: DB.EnumCase({ type: null }),
    Fighter: DB.EnumCase({ type: null }),
    Religious: DB.EnumCase({ type: null }),
  }),
})

const MagicalProfessionGroup = DB.TypeAlias(import.meta.url, {
  name: "MagicalProfessionGroup",
  type: () =>
    DB.Object({
      curriculum: DB.Optional({
        comment: "The curriculum/academy associated with this magical profession, if any.",
        type: CurriculumIdentifier(),
      }),
    }),
})

export const ProfessionVersion = DB.Entity(import.meta.url, {
  name: "ProfessionVersion",
  namePlural: "ProfessionVersions",
  type: () =>
    DB.Object({
      profession: DB.Required({
        comment: "The associated profession.",
        type: ProfessionIdentifier(),
      }),
      package: DB.Required({
        comment:
          "A list of available race variants where one has to be selected. If no variants are to be selected, a single variant with no name has to be provided which will be used as the missing values for the base race.",
        type: DB.ChildEntities(ProfessionPackage),
      }),
      suggested_advantages: DB.Optional({
        comment: "A list of typical advantages.",
        type: DB.Array(
          DB.GenIncludeIdentifier(CommonnessRatedAdvantageDisadvantage, [AdvantageIdentifier()]),
          { minItems: 1 },
        ),
      }),
      suggested_disadvantages: DB.Optional({
        comment: "A list of typical disadvantages.",
        type: DB.Array(
          DB.GenIncludeIdentifier(CommonnessRatedAdvantageDisadvantage, [DisadvantageIdentifier()]),
          { minItems: 1 },
        ),
      }),
      unsuitable_advantages: DB.Optional({
        comment:
          "A list of advantages that do not fit well with this profession; to be checked with the GM before taking any of them.",
        type: DB.Array(
          DB.GenIncludeIdentifier(CommonnessRatedAdvantageDisadvantage, [AdvantageIdentifier()]),
          { minItems: 1 },
        ),
      }),
      unsuitable_disadvantages: DB.Optional({
        comment:
          "A list of disadvantages that do not fit well with this profession; to be checked with the GM before taking any of them.",
        type: DB.Array(
          DB.GenIncludeIdentifier(CommonnessRatedAdvantageDisadvantage, [DisadvantageIdentifier()]),
          { minItems: 1 },
        ),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "ProfessionVersion",
        DB.Object({
          name: DB.Required({
            comment: "The basic profession’s name.",
            type: DB.IncludeIdentifier(ProfessionName),
          }),
          specification: DB.Optional({
            comment:
              "A name addition of the profession. This will contain texts like name of the academy or the witch circle. It is enclosed in parenthesis, but the database entry must not contain parenthesis.",
            type: DB.IncludeIdentifier(ProfessionName),
          }),
          suggested_advantages: DB.Optional({
            comment: "A list of typical advantages.",
            type: DB.String({ minLength: 1 }),
          }),
          suggested_disadvantages: DB.Optional({
            comment: "A list of typical disadvantages.",
            type: DB.String({ minLength: 1 }),
          }),
          unsuitable_advantages: DB.Optional({
            comment:
              "A list of advantages that do not fit well with this profession; to be checked with the GM before taking any of them.",
            type: DB.String({ minLength: 1 }),
          }),
          unsuitable_disadvantages: DB.Optional({
            comment:
              "A list of disadvantages that do not fit well with this profession; to be checked with the GM before taking any of them.",
            type: DB.String({ minLength: 1 }),
          }),
          errata: DB.Optional({
            type: DB.IncludeIdentifier(Errata),
          }),
        }),
      ),
    }),
  parentReferenceKey: "profession",
  instanceDisplayName: {
    pathToLocaleMap: "translations",
    pathInLocaleMap: "name.default",
  },
  instanceDisplayNameCustomizer: ({ instance, instanceId, locales }) => {
    const translations = Object.entries(instance.translations)
    for (const locale of locales) {
      const translation = translations.find(([key]) => key === locale)
      if (translation) {
        const [, value] = translation
        return {
          name:
            value.name.default + (value.specification ? ` (${value.specification.default})` : ""),
          localeId: locale,
        }
      }
    }

    return {
      name: instanceId,
    }
  },
})

export const ProfessionPackage = DB.Entity(import.meta.url, {
  name: "ProfessionPackage",
  namePlural: "ProfessionPackages",
  type: () =>
    DB.Object({
      profession_version: DB.Required({
        comment: "The associated profession version.",
        type: ProfessionVersionIdentifier(),
      }),
      experience_level: DB.Required({
        comment:
          "The associated experience level. By default, profession packages are associated with the experience level *Experienced*.",
        type: ExperienceLevelIdentifier(),
      }),
      ap_value: DB.Required({
        comment: "What does the professional package cost in adventure points?",
        type: DB.Integer({ minimum: 0 }),
      }),
      prerequisites: DB.Optional({
        comment:
          "Which prerequisites must be met to buy the stat block? For example, a character might need the advantage Spellcaster or Blessed. Note: the AP cost for a profession package does not include these prerequisites.",
        type: DB.IncludeIdentifier(ProfessionPrerequisites),
      }),
      options: DB.Optional({
        comment:
          "In some areas, the profession package grants a loose set of stats where the player must choose between different options for the profession package.",
        type: DB.IncludeIdentifier(ProfessionPackageOptions),
      }),
      special_abilities: DB.Optional({
        comment: "Any special abilities the profession receives from the package.",
        type: DB.Array(DB.IncludeIdentifier(ProfessionSpecialAbility), { minItems: 1 }),
      }),
      combat_techniques: DB.Optional({
        comment:
          "Provides ratings for the combat techniques that the hero receives from the package.",
        type: DB.Array(DB.IncludeIdentifier(CombatTechniqueRating), { minItems: 1 }),
      }),
      skills: DB.Optional({
        comment: "The skill ratings the package grants to the hero.",
        type: DB.Array(DB.IncludeIdentifier(SkillRating), { minItems: 1 }),
      }),
      spells: DB.Optional({
        comment:
          "The skill ratings a magical profession receives for spells; these spells are considered activated. Spells from an unfamiliar Tradition, if any, are identified as such.",
        type: DB.Array(DB.IncludeIdentifier(MagicalSkillRating), { minItems: 1 }),
      }),
      liturgical_chants: DB.Optional({
        comment:
          "Clerical professions receive these liturgical chants at the listed skill ratings. These liturgical chants are considered activated.",
        type: DB.Array(DB.IncludeIdentifier(LiturgicalChantRating), { minItems: 1 }),
      }),
      is_variant_selection_required: DB.Required({
        comment: "If the selection of a profession variant is required.",
        type: DB.Boolean(),
      }),
      variants: DB.Required({
        comment:
          "Provides examples of variants for the profession, which may include changes to AP values and additional or modified skill ratings, special abilities, or combat techniques, as compared to the basic profession. Usually picking a variant is optional, but there are some rare exceptions where picking a variant is required.",
        type: DB.ChildEntities(ProfessionVariant),
      }),
    }),
  parentReferenceKey: "profession_version",
  instanceDisplayName: null,
  instanceDisplayNameCustomizer: ({ instance, getDisplayNameForInstanceId }) => {
    const baseName = getDisplayNameForInstanceId("ProfessionVersion", instance.profession_version)

    if (!baseName) {
      return { name: "(Profession Package with no Profession Version)" }
    }

    if (instance.experience_level) {
      const experienceLevelName = getDisplayNameForInstanceId(
        "ExperienceLevel",
        instance.experience_level,
      )
      return {
        ...baseName,
        name: `${baseName.name} [${experienceLevelName?.name ?? instance.experience_level}]`,
      }
    }

    return baseName
  },
  uniqueConstraints: [
    [
      {
        keyPath: "profession_version",
      },
      {
        keyPath: "experience_level",
      },
    ],
  ],
})

export const ProfessionVariant = DB.Entity(import.meta.url, {
  name: "ProfessionVariant",
  namePlural: "ProfessionVariants",
  type: () =>
    DB.Object({
      profession_package: DB.Required({
        comment: "The associated profession package.",
        type: ProfessionPackageIdentifier(),
      }),
      ap_value: DB.Optional({
        comment:
          "The AP value you have to pay for the package variant. Some variants may reduce the AP value of the base package.",
        type: DB.Integer(),
      }),
      prerequisites: DB.Optional({
        comment:
          "Which prerequisites must be met to buy the stat block? For example, a character might need the advantage Spellcaster or Blessed. Note: the AP cost for a profession package does not include these prerequisites.",
        type: DB.IncludeIdentifier(ProfessionPrerequisites),
      }),
      options: DB.Optional({
        comment:
          "In some areas, the profession package grants a loose set of stats where the player must choose between different options for the profession package. The variant may override or remove those options.",
        type: DB.IncludeIdentifier(ProfessionVariantPackageOptions),
      }),
      special_abilities: DB.Optional({
        comment: "Any special abilities the profession receives from the package variant.",
        type: DB.Array(DB.IncludeIdentifier(ProfessionVariantSpecialAbility), { minItems: 1 }),
      }),
      combat_techniques: DB.Optional({
        comment:
          "Provides ratings for the combat techniques that the hero receives from the package variant.",
        type: DB.Array(DB.IncludeIdentifier(CombatTechniqueRating), { minItems: 1 }),
      }),
      skills: DB.Optional({
        comment: "The skill ratings the package variant grants to the hero.",
        type: DB.Array(DB.IncludeIdentifier(SkillRating), { minItems: 1 }),
      }),
      spells: DB.Optional({
        comment:
          "The skill ratings a magical profession variant receives for spells; these spells are considered activated. Spells from an unfamiliar Tradition, if any, are identified as such.",
        type: DB.Array(DB.IncludeIdentifier(MagicalSkillRating), { minItems: 1 }),
      }),
      liturgical_chants: DB.Optional({
        comment:
          "Clerical profession variants receive these liturgical chants at the listed skill ratings. These liturgical chants are considered activated.",
        type: DB.Array(DB.IncludeIdentifier(LiturgicalChantRating), { minItems: 1 }),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "ProfessionVariant",
        DB.Object({
          name: DB.Required({
            comment: "The profession variant’s name.",
            type: DB.IncludeIdentifier(ProfessionName),
          }),
          full_text: DB.Optional({
            comment: "A text that replaces the generated text for the profession variant.",
            type: DB.String({ minLength: 1 }),
          }),
          concluding_text: DB.Optional({
            comment: `A text that is appended to the generated text for the profession variant.`,
            type: DB.String({ minLength: 1 }),
          }),
        }),
      ),
    }),
  parentReferenceKey: "profession_package",
  instanceDisplayName: {
    pathToLocaleMap: "translations",
    pathInLocaleMap: "name.default",
  },
})

const VariantSpecialAbilityAction = DB.Enum(import.meta.url, {
  name: "VariantSpecialAbilityAction",
  values: () => ({
    Remove: DB.EnumCase({ type: null }),
    Override: DB.EnumCase({ type: null }),
  }),
})

const ProfessionSpecialAbility = DB.Enum(import.meta.url, {
  name: "ProfessionSpecialAbility",
  values: () => ({
    Constant: DB.EnumCase({ type: DB.IncludeIdentifier(ConstantProfessionSpecialAbility) }),
    Selection: DB.EnumCase({ type: DB.IncludeIdentifier(ProfessionSpecialAbilitySelection) }),
  }),
})

const ConstantProfessionSpecialAbility = DB.TypeAlias(import.meta.url, {
  name: "ConstantProfessionSpecialAbility",
  type: () =>
    DB.Object({
      id: DB.Required({
        comment: "The identifier of the special ability to grant.",
        type: DB.IncludeIdentifier(ProfessionSpecialAbilityIdentifier),
      }),
      level: DB.Optional({
        comment:
          "The level of the received special ability. If not specified and the special ability has levels, level 1 is used automatically.",
        type: DB.Integer({ minimum: 1 }),
      }),
      options: DB.Optional({
        comment:
          "Received select options. Order is important. Typically, you only need the first array index, though.",
        type: DB.Array(DB.IncludeIdentifier(RequirableSelectOptionIdentifier), { minItems: 1 }),
      }),
    }),
})

const ProfessionSpecialAbilitySelection = DB.TypeAlias(import.meta.url, {
  name: "ProfessionSpecialAbilitySelection",
  type: () =>
    DB.Object({
      options: DB.Required({
        comment: `The list of special abilities to choose from. Must contain at least two entries.`,
        type: DB.Array(DB.IncludeIdentifier(ConstantProfessionSpecialAbility), { minItems: 2 }),
      }),
    }),
})

const ProfessionVariantSpecialAbility = DB.TypeAlias(import.meta.url, {
  name: "ProfessionVariantSpecialAbility",
  type: () =>
    DB.Object({
      action: DB.Required({
        comment:
          "If the selection is added to the base profession or if it removes a selection from the base profession with the same values.",
        type: DB.IncludeIdentifier(VariantSpecialAbilityAction),
      }),
      value: DB.Required({
        comment: "The special ability to add or remove.",
        type: DB.IncludeIdentifier(ProfessionSpecialAbility),
      }),
    }),
})

const CombatTechniqueRating = DB.TypeAlias(import.meta.url, {
  name: "CombatTechniqueRating",
  type: () =>
    DB.Object({
      id: DB.Required({
        comment: "The identifier of the combat technique to provide the rating for.",
        type: DB.IncludeIdentifier(CombatTechniqueIdentifier),
      }),
      rating_modifier: DB.Required({
        comment:
          "The rating bonus provided for the combat technique. If used in a profession variant, it can also be used to lower the bonus of the base profession.\n\n**Note:** This is a rating *bonus*, so it will be *added* to the default value of 6.",
        type: DB.Integer(),
      }),
    }),
})

export const SkillRating = DB.TypeAlias(import.meta.url, {
  name: "SkillRating",
  type: () =>
    DB.Object({
      id: DB.Required({
        comment: "The identifier of the skill to provide the rating for.",
        type: SkillIdentifier(),
      }),
      rating_modifier: DB.Required({
        comment:
          "The rating bonus provided for the skill. If used in a profession variant, it can also be used to lower the bonus of the base profession",
        type: DB.Integer(),
      }),
    }),
})

const MagicalSkillRating = DB.TypeAlias(import.meta.url, {
  name: "MagicalSkillRating",
  type: () =>
    DB.Object({
      id: DB.Required({
        comment:
          "The identifier(s) of the spell(s) to choose from to provide the rating for. If multiple spells are provided, they must all have the same improvement cost.",
        type: DB.Array(DB.IncludeIdentifier(ProfessionMagicalSkillIdentifier), { minItems: 1 }),
      }),
      rating_modifier: DB.Required({
        comment:
          "The rating bonus provided for the (selected) magical skill. If used in a profession variant, it can also be used to lower the bonus of the base profession.\n\n**Note:** If due to a variant a spell rating is lowered to 0, the spell is considered deactivated. Both setting the value for a spell and deactivating it by setting it to 0 takes into account the additional activation cost for spells.",
        type: DB.Integer(),
      }),
    }),
})

const ProfessionMagicalSkillIdentifier = DB.Enum(import.meta.url, {
  name: "ProfessionMagicalSkillIdentifier",
  values: () => ({
    Spellwork: DB.EnumCase({ type: DB.IncludeIdentifier(ProfessionSpellworkIdentifier) }),
    MagicalAction: DB.EnumCase({ type: DB.IncludeIdentifier(ProfessionMagicalActionIdentifier) }),
  }),
})

const ProfessionSpellworkIdentifier = DB.TypeAlias(import.meta.url, {
  name: "ProfessionSpellworkIdentifier",
  type: () =>
    DB.Object({
      id: DB.Required({
        comment: "The identifier of the spell to provide the rating for.",
        type: DB.IncludeIdentifier(SpellworkIdentifier),
      }),
      tradition: DB.Optional({
        comment:
          "If the spell is not part of the magical tradition required by the package, this references the magical tradition it is part of. It can also be used to define the target magical tradition of a spell if multiple magical traditions are required and the spell is available to multiple of them.",
        type: MagicalTraditionIdentifier(),
      }),
    }),
})

const ProfessionMagicalActionIdentifier = DB.TypeAlias(import.meta.url, {
  name: "ProfessionMagicalActionIdentifier",
  type: () =>
    DB.Object({
      id: DB.Required({
        comment: "The identifier of the magical action to provide the rating for.",
        type: DB.IncludeIdentifier(MagicalActionIdentifier),
      }),
    }),
})

const LiturgicalChantRating = DB.TypeAlias(import.meta.url, {
  name: "LiturgicalChantRating",
  type: () =>
    DB.Object({
      id: DB.Required({
        comment:
          "The identifier(s) of the liturgical chant(s) to choose from to provide the rating for. If multiple liturgical chants are provided, they must all have the same improvement cost.",
        type: DB.Array(DB.IncludeIdentifier(LiturgyIdentifier), { minItems: 1 }),
      }),
      rating_modifier: DB.Required({
        comment:
          "The rating bonus provided for the selected liturgical chant. If used in a profession variant, it can also be used to lower the bonus of the base profession.\n\n**Note:** If due to a variant a liturgical chant rating is lowered to 0, the liturgical chant is considered deactivated. Both setting the value for a liturgical chant and deactivating it by setting it to 0 takes into account the additional activation cost for liturgical chants.",
        type: DB.Integer(),
      }),
    }),
})

const ProfessionPackageOptions = DB.TypeAlias(import.meta.url, {
  name: "ProfessionPackageOptions",
  comment:
    "In some areas, the profession package grants a loose set of stats where the player must choose between different options for the profession package.",
  type: () =>
    DB.Object(
      {
        skill_specialization: DB.Optional({
          type: DB.IncludeIdentifier(SkillSpecializationOptions),
        }),
        languages_scripts: DB.Optional({
          type: DB.IncludeIdentifier(LanguagesScriptsOptions),
        }),
        combat_techniques: DB.Optional({
          type: DB.IncludeIdentifier(CombatTechniquesOptions),
        }),
        cantrips: DB.Optional({
          type: DB.IncludeIdentifier(CantripsOptions),
        }),
        curses: DB.Optional({
          type: DB.IncludeIdentifier(CursesOptions),
        }),
        skills: DB.Optional({
          type: DB.IncludeIdentifier(SkillsOptions),
        }),
        liturgies: DB.Optional({
          type: DB.IncludeIdentifier(LiturgiesOptions),
        }),
      },
      { minProperties: 1 },
    ),
})

const ProfessionVariantPackageOptions = DB.TypeAlias(import.meta.url, {
  name: "ProfessionVariantPackageOptions",
  comment:
    "In some areas, the profession package grants a loose set of stats where the player must choose between different options for the profession package. The variant may override or remove those options.",
  type: () =>
    DB.Object(
      {
        skill_specialization: DB.Optional({
          type: DB.GenIncludeIdentifier(VariantOptionAction, [
            DB.IncludeIdentifier(SkillSpecializationOptions),
          ]),
        }),
        languages_scripts: DB.Optional({
          type: DB.GenIncludeIdentifier(VariantOptionAction, [
            DB.IncludeIdentifier(LanguagesScriptsOptions),
          ]),
        }),
        combat_techniques: DB.Optional({
          type: DB.GenIncludeIdentifier(VariantOptionAction, [
            DB.IncludeIdentifier(CombatTechniquesOptions),
          ]),
        }),
        cantrips: DB.Optional({
          type: DB.GenIncludeIdentifier(VariantOptionAction, [
            DB.IncludeIdentifier(CantripsOptions),
          ]),
        }),
        curses: DB.Optional({
          type: DB.GenIncludeIdentifier(VariantOptionAction, [DB.IncludeIdentifier(CursesOptions)]),
        }),
        skills: DB.Optional({
          type: DB.GenIncludeIdentifier(VariantOptionAction, [DB.IncludeIdentifier(SkillsOptions)]),
        }),
        liturgies: DB.Optional({
          type: DB.GenIncludeIdentifier(VariantOptionAction, [
            DB.IncludeIdentifier(LiturgiesOptions),
          ]),
        }),
      },
      { minProperties: 1 },
    ),
})

const VariantOptionAction = DB.GenEnum(import.meta.url, {
  name: "VariantOptionAction",
  parameters: [DB.Param("T")],
  values: T => ({
    Remove: DB.EnumCase({ type: null }),
    Override: DB.EnumCase({ type: DB.TypeArgument(T) }),
  }),
})

const SkillSpecializationOptions = DB.Enum(import.meta.url, {
  name: "SkillSpecializationOptions",
  comment: `Select an application from a skill or from one of a list of skills where you get a skill specialization for. You can also specify a skill group from which you can choose a skill.`,
  values: () => ({
    Specific: DB.EnumCase({ type: DB.IncludeIdentifier(SpecificSkillSpecializationOptions) }),
    Group: DB.EnumCase({ type: SkillGroupIdentifier() }),
  }),
})

const SpecificSkillSpecializationOptions = DB.TypeAlias(import.meta.url, {
  name: "SpecificSkillSpecializationOptions",
  comment: `Select an application from a skill or from one of a list of skills where you get a skill specialization for.`,
  type: () =>
    DB.Object({
      options: DB.Required({
        comment: `Possible skill(s) to get a skill specialization for.`,
        type: DB.Array(SkillIdentifier(), { minItems: 1, uniqueItems: true }),
      }),
    }),
})

const LanguagesScriptsOptions = DB.TypeAlias(import.meta.url, {
  name: "LanguagesScriptsOptions",
  comment: `Buy languages and scripts for a specific amount of AP.`,
  type: () =>
    DB.Object({
      ap_value: DB.Required({
        comment: "The AP value you can buy languages and scripts for.",
        type: DB.Integer({ minimum: 2 }),
      }),
    }),
})

const CombatTechniquesOptions = DB.TypeAlias(import.meta.url, {
  name: "CombatTechniquesOptions",
  comment: `Select one or more combat techniques you get a CtR bonus for.`,
  type: () =>
    DB.Object({
      fixed: DB.Required({
        comment: `Specify the number of combat techniques that can be selected so that they get increased to a specific CtR. There can be multiple selections with different CtRs.`,
        type: DB.Array(DB.IncludeIdentifier(RatingForCombatTechniquesNumber), { minItems: 1 }),
      }),
      rest_rating_modifier: DB.Optional({
        comment: `Define if after the fixed selections the remaining unselected combat techniques will receive a certain rating bonus as well.`,
        type: DB.Integer({ minimum: 1 }),
      }),
      options: DB.Required({
        comment: "The list of combat techniques to choose from.",
        type: DB.Array(DB.IncludeIdentifier(CombatTechniqueIdentifier), { minItems: 2 }),
      }),
    }),
})

const RatingForCombatTechniquesNumber = DB.TypeAlias(import.meta.url, {
  name: "RatingForCombatTechniquesNumber",
  type: () =>
    DB.Object({
      number: DB.Required({
        comment: "The number of selectable combat techniques.",
        type: DB.Integer({ minimum: 1 }),
      }),
      rating_modifier: DB.Required({
        comment: `The rating bonus provided for the selected combat technique(s).

**Note:** This is a rating *bonus*, so it will be *added* to the default value of 6.`,
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})

const CantripsOptions = DB.TypeAlias(import.meta.url, {
  name: "CantripsOptions",
  comment: `Select one or more cantrips you receive.`,
  type: () =>
    DB.Object({
      number: DB.Required({
        comment: "The number of selectable cantrips.",
        type: DB.Integer({ minimum: 1 }),
      }),
      options: DB.Required({
        comment: "The list of cantrips to choose from.",
        type: DB.Array(CantripIdentifier(), { minItems: 2 }),
      }),
    }),
})

const CursesOptions = DB.TypeAlias(import.meta.url, {
  name: "CursesOptions",
  comment: `Buy curses for a specific amount of AP.`,
  type: () =>
    DB.Object({
      ap_value: DB.Required({
        comment: "The AP value you can buy curses for.",
        type: DB.Integer({ minimum: 2 }),
      }),
    }),
})

const SkillsOptions = DB.TypeAlias(import.meta.url, {
  name: "SkillsOptions",
  comment: `Buy skills for a specific amount of AP.`,
  type: () =>
    DB.Object({
      group: DB.Required({
        comment: "If specified, you may only choose from skills of the specified group.",
        type: SkillGroupIdentifier(),
      }),
      specific: DB.Optional({
        comment: "The list of specific skills to distribute AP to.",
        type: DB.Array(SkillIdentifier(), { minItems: 2 }),
      }),
      ap_value: DB.Required({
        comment: "The AP value you can buy skills for.",
        type: DB.Integer({ minimum: 1 }),
      }),
      maximum: DB.Optional({
        comment: "If specified, you can only improve a single skill up to that many times with the provided AP value.",
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
  customConstraints: ({ instanceContent, getInstanceById }) =>
    [
      (instanceContent.specific?.some(
        skillId => getInstanceById("Skill", skillId)?.group !== instanceContent.group,
      ) ?? false)
        ? "All selected skills must be from the selected group."
        : undefined,
    ].filter(isNotNullish),
})

const LiturgiesOptions = DB.TypeAlias(import.meta.url, {
  name: "LiturgiesOptions",
  comment: `Buy liturgical chants and ceremonies for a specific amount of AP.`,
  type: () =>
    DB.Object({
      ap_value: DB.Required({
        comment: "The AP value you can buy liturgical chants and ceremonies for.",
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})

const ProfessionName = DB.TypeAlias(import.meta.url, {
  name: "ProfessionName",
  comment:
    "The name of the profession that may have sex-specific names. Useful if the term in generell is different (i.e. actor/actress) or if the language uses gendered nouns. The default name is also used in case neither the male nor female name strictly applies.",
  type: () =>
    DB.Object({
      default: DB.Required({
        comment:
          "The name from the source publication. This is also used if a character has no specified gender or is neither male nor female.",
        type: DB.String({ minLength: 1 }),
      }),
      male: DB.Optional({
        comment: "The male name, if different from the default name.",
        type: DB.String({ minLength: 1 }),
      }),
      female: DB.Optional({
        comment: "The female name, if different from the default name.",
        type: DB.String({ minLength: 1 }),
      }),
    }),
})
