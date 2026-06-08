import { isNotNullish } from "@elyukai/utils/nullable"
import * as DB from "tsondb/schema/dsl"
import { CommonnessRatedAdvantageDisadvantage } from "./_CommonnessRatedAdvantageDisadvantage.js"
import { Dice, DieType } from "./_Dice.js"
import {
  AdvantageIdentifier,
  AttributeIdentifier,
  CultureIdentifier,
  DisadvantageIdentifier,
  EyeColorIdentifier,
  HairColorIdentifier,
  RaceIdentifier,
} from "./_Identifier.js"
import { calculationContainsRaceBase, DerivedCharacteristic } from "./DerivedCharacteristic.ts"
import { ExperienceLevel } from "./ExperienceLevel.js"
import { NestedTranslationMap } from "./Locale.js"
import { Errata } from "./source/_Erratum.js"
import { src } from "./source/_PublicationRef.js"

export const Race = DB.Entity(import.meta.url, {
  name: "Race",
  namePlural: "Races",
  type: () =>
    DB.Object({
      ap_value: DB.Required({
        comment: "How many Adventure Points does the race cost during character creation?",
        type: DB.Integer({ minimum: 0 }),
      }),
      base_values: DB.Required({
        comment: "The race’s base values.",
        type: DB.IncludeIdentifier(BaseValues),
      }),
      hairColorCount: DB.Optional({
        comment:
          "How many different hair colors a race may have. By default, they have a single one that is for their whole body, but a race may have multiple if their hair color is different for different body parts. Additionally, if the hair color is labelled differently (e.g. scale color), there might be multiple colors for different body parts as well. This should only be set if the hair color count is higher than 1.",
        type: DB.Integer({ minimum: 2 }),
      }),
      weight: DB.Required({
        comment: "Configuration for random weight generation.",
        type: DB.IncludeIdentifier(RandomWeightGeneration),
      }),
      starting_age: DB.Required({
        comment:
          "Defines the starting ages for the race. It depends on the selected experience level.",
        type: DB.NestedEntityMap({
          name: "StartingAgeConfigForExperienceLevel",
          namePlural: "StartingAgeConfigsForExperienceLevel",
          secondaryEntity: ExperienceLevel,
          type: DB.Object({
            base: DB.Required({
              comment: "The base value for the selected experience level.",
              type: DB.Integer({ minimum: 1 }),
            }),
            random: DB.Required({
              comment:
                "The random value for the selected experience level. It is going to be added to the base value.",
              type: DB.IncludeIdentifier(Dice),
            }),
          }),
          minProperties: 1,
        }),
      }),
      variants: DB.Required({
        comment:
          "A list of available race variants where one has to be selected. If no variants are to be selected, a single variant with no name has to be provided which will be used as the missing values for the base race.",
        type: DB.ChildEntities(RaceVariant),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "Race",
        DB.Object({
          name: DB.Required({
            comment: "The race’s name.",
            type: DB.String({ minLength: 1 }),
          }),
          hairColorLabel: DB.Optional({
            comment:
              "The label for hair colors if it is not a hair color in that sense: Some races may have different labels for hair color such as scale color.",
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
  customConstraints: ({ instanceContent, getAllInstanceContainers, getDisplayNameAndId }) => {
    const expectedBaseValues = getAllInstanceContainers("DerivedCharacteristic").filter(dc =>
      calculationContainsRaceBase(dc.content.calculation.base),
    )

    const actualBaseValues = Object.keys(instanceContent.base_values)

    return [
      expectedBaseValues.length !== actualBaseValues.length ||
      actualBaseValues.some(actual => !expectedBaseValues.some(expected => actual === expected.id))
        ? `The race needs to define base values for ${expectedBaseValues.map(dc => getDisplayNameAndId("DerivedCharacteristic", dc.id)).join(", ")}, but defines ${actualBaseValues.map(dcId => getDisplayNameAndId("DerivedCharacteristic", dcId)).join(", ")}.`
        : null,
    ].filter(isNotNullish)
  },
})

const BaseValues = DB.TypeAlias(import.meta.url, {
  name: "BaseValues",
  type: () =>
    DB.NestedEntityMap({
      name: "RaceBaseValue",
      namePlural: "RaceBaseValues",
      comment: "The base value for a derived characteristic that is granted by the race.",
      secondaryEntity: DerivedCharacteristic,
      type: DB.Object({
        value: DB.Required({
          comment: "The base value for the derived characteristic that is granted by the race.",
          type: DB.Integer(),
        }),
      }),
    }),
})

const AttributeAdjustments = DB.TypeAlias(import.meta.url, {
  name: "AttributeAdjustments",
  comment: "Describes how to raise or lower maximum attribute values during character creation.",
  type: () =>
    DB.Object(
      {
        fixed: DB.Optional({
          comment: "The values by which the maximum of the respective attribute is modified.",
          type: DB.Array(DB.IncludeIdentifier(FixedAttributeAdjustment), { minItems: 1 }),
        }),
        selectable: DB.Optional({
          comment: `An array of attribute maximum modifiers, where the attribute they apply to is selected from a list of options.

The array only permits a single entry because no race specified more than one selectable attribute adjustment so far. But the schema allows for multiple entries to be future-proof.`,
          type: DB.Array(DB.IncludeIdentifier(SelectableAttributeAdjustment), {
            minItems: 1,
            maxItems: 1,
          }),
        }),
      },
      { minProperties: 1 },
    ),
})

const FixedAttributeAdjustment = DB.TypeAlias(import.meta.url, {
  name: "FixedAttributeAdjustment",
  comment: "A value by which the maximum of the respective attribute is modified.",
  type: () =>
    DB.Object({
      id: DB.Required({
        comment: "The attribute the modifier applies to.",
        type: AttributeIdentifier(),
      }),
      value: DB.Required({
        comment:
          "The value by which the specified attribute’s maximum is modified (negative values will lower the maximum).",
        type: DB.Integer(),
      }),
    }),
})

const SelectableAttributeAdjustment = DB.TypeAlias(import.meta.url, {
  name: "SelectableAttributeAdjustment",
  comment:
    "A value that will be added to the current maximum of the selected attribute that has been chosen from the listed attributes (negative values will lower the maximum).",
  type: () =>
    DB.Object({
      list: DB.Required({
        comment: "A list of attributes the player has to choose from.",
        type: DB.Array(AttributeIdentifier(), { minItems: 2 }),
      }),
      value: DB.Required({
        comment:
          "The value by which the selected attribute’s maximum is modified (negative values will lower the maximum).",
        type: DB.Integer(),
      }),
    }),
})

const RandomWeightGeneration = DB.TypeAlias(import.meta.url, {
  name: "RandomWeightGeneration",
  comment: "Configuration for random weight generation.",
  type: () =>
    DB.Object({
      base: DB.Required({
        comment:
          "The base value used for random weight. The height subtrahend; in case of `Height - 110 + 2D6` it is `110`.",
        type: DB.Integer({ minimum: 1 }),
      }),
      random: DB.Required({
        comment: "The dice used for random weight.",
        type: DB.Array(DB.IncludeIdentifier(WeightDice), { minItems: 1 }),
      }),
    }),
})

const WeightDice = DB.TypeAlias(import.meta.url, {
  name: "WeightDice",
  type: () =>
    DB.Object({
      number: DB.Required({
        comment: "Number of dice of the same type. Example: 2 in 2D6.",
        type: DB.Integer({ minimum: 1 }),
      }),
      sides: DB.Required({
        comment: "Number of sides on every die. Example: 6 in 2D6.",
        type: DB.IncludeIdentifier(DieType),
      }),
      offset_strategy: DB.Required({
        comment:
          "The strategy how to offset the randomly generated values against the base value. Either they are all added or subtracted or even results are added and odd results are subtracted.",
        type: DB.IncludeIdentifier(WeightDiceOffsetStrategy),
      }),
    }),
})

const WeightDiceOffsetStrategy = DB.Enum(import.meta.url, {
  name: "WeightDiceOffsetStrategy",
  comment:
    "The strategy how to offset the randomly generated values against the base value. Either they are all added or subtracted or even results are added and odd results are subtracted.",
  values: () => ({
    Add: DB.EnumCase({ type: null }),
    Subtract: DB.EnumCase({ type: null }),
    AddEvenSubtractOdd: DB.EnumCase({ type: null }),
  }),
})

export const RaceVariant = DB.Entity(import.meta.url, {
  name: "RaceVariant",
  namePlural: "RaceVariants",
  type: () =>
    DB.Object({
      race: DB.Required({
        comment: "The associated race.",
        type: RaceIdentifier(),
      }),
      attribute_adjustments: DB.Required({
        comment:
          "Describes how to raise or lower maximum attribute values during character creation.",
        type: DB.IncludeIdentifier(AttributeAdjustments),
      }),
      common_cultures: DB.Optional({
        comment: "The list of common cultures.",
        type: DB.Array(CultureIdentifier(), { minItems: 1 }),
      }),
      automatic_advantages: DB.Optional({
        comment:
          "A list of automatically applied advantages.",
        type: DB.Array(
            DB.GenIncludeIdentifier(CommonnessRatedAdvantageDisadvantage, [AdvantageIdentifier()]),
          {
            minItems: 1,
          },
        ),
      }),
      automatic_disadvantages: DB.Optional({
        comment:
          "A list of automatically applied disadvantages.",
        type: DB.Array(
            DB.GenIncludeIdentifier(CommonnessRatedAdvantageDisadvantage, [DisadvantageIdentifier()]),
          { minItems: 1 },
        ),
      }),
      strongly_recommended_advantages: DB.Optional({
        comment: "A list of strongly recommended advantages.",
        type: DB.Array(
          DB.GenIncludeIdentifier(CommonnessRatedAdvantageDisadvantage, [AdvantageIdentifier()]),
          { minItems: 1 },
        ),
      }),
      strongly_recommended_disadvantages: DB.Optional({
        comment: "A list of strongly recommended disadvantages.",
        type: DB.Array(
          DB.GenIncludeIdentifier(CommonnessRatedAdvantageDisadvantage, [DisadvantageIdentifier()]),
          { minItems: 1 },
        ),
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
      hair_color: DB.Required({
        comment:
          "An array containing 20 (numeric) hair color identifiers. The array also represents the 20-sided die for a random hair color.",
        type: DB.Array(HairColorIdentifier(), { minItems: 20, maxItems: 20 }),
      }),
      eye_color: DB.Required({
        comment:
          "An array containing 20 (numeric) eye color identifiers. The array also represents the 20-sided die for a random eye color.",
        type: DB.Array(EyeColorIdentifier(), { minItems: 20, maxItems: 20 }),
      }),
      height: DB.Required({
        comment: "Configuration for random height generation.",
        type: DB.IncludeIdentifier(RandomHeightGeneration),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "RaceVariant",
        DB.Object({
          name: DB.Required({
            comment:
              "The race variant’s name. If this is the only variant for a base race and thus just provides the missing information without actually being able to select, fill in the name of the base race.",
            type: DB.String({ minLength: 1 }),
          }),
          attribute_adjustments: DB.Optional({
            comment: "The respective attribute adjustments text from the source book.",
            type: DB.String({ minLength: 1 }),
          }),
          automatic_advantages: DB.Optional({
            comment: "The respective automatic advantages text from the source book.",
            type: DB.String({ minLength: 1 }),
          }),
          automatic_disadvantages: DB.Optional({
            comment: "The respective automatic disadvantages text from the source book.",
            type: DB.String({ minLength: 1 }),
          }),
          strongly_recommended_advantages: DB.Optional({
            comment: "The respective strongly recommended advantages text from the source book.",
            type: DB.String({ minLength: 1 }),
          }),
          strongly_recommended_disadvantages: DB.Optional({
            comment: "The respective strongly recommended disadvantages text from the source book.",
            type: DB.String({ minLength: 1 }),
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
        }),
      ),
    }),
  parentReferenceKey: "race",
  instanceDisplayName: {},
  uniqueConstraints: [
    [
      {
        keyPath: "race",
      },
      {
        entityMapKeyPath: "translations",
        keyPathInEntityMap: "name",
      },
    ],
  ],
})

const RandomHeightGeneration = DB.TypeAlias(import.meta.url, {
  name: "RandomHeightGeneration",
  comment: "Configuration for random height generation.",
  type: () =>
    DB.Object({
      base: DB.Required({
        comment: "The base value used for random height.",
        type: DB.Integer({ minimum: 1 }),
      }),
      random: DB.Required({
        comment: "The dice used for random height.",
        type: DB.Array(DB.IncludeIdentifier(Dice), { minItems: 1 }),
      }),
    }),
})
