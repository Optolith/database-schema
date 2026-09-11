import * as DB from "tsondb/schema/dsl"
import { NestedTranslationMap } from "../../Locale.js"
import { AlternativeName } from "../../_AlternativeNames.js"
import { Dice } from "../../_Dice.js"
import { Reduceable, Resistance } from "../../_DiseasePoison.js"
import { DiseaseIdentifier } from "../../_Identifier.ts"
import { MathOperation } from "../../_MathExpression.js"
import { Errata } from "../../source/_Erratum.js"
import { src } from "../../source/_PublicationRef.js"
import { EffectType, LaboratoryLevel, RecipeComplexity, RecipeTradeSecret } from "./_Herbary.js"
import { CostRange } from "./_Item.ts"

export const Poison = DB.Entity(import.meta.url, {
  name: "Poison",
  namePlural: "Poisons",
  type: () =>
    DB.Object({
      application_type: DB.Required({
        comment: "The poison’s application type(s).",
        type: DB.Array(DB.IncludeIdentifier(PoisonApplicationType), {
          minItems: 1,
          uniqueItems: true,
        }),
      }),
      source_type: DB.Required({
        comment: "The poison’s source type and dependent additional values.",
        type: DB.IncludeIdentifier(PoisonSourceType),
      }),
      resistance: DB.Required({
        comment: "Use Spirit or Toughness as a modifier for the poison.",
        type: DB.IncludeIdentifier(Resistance),
      }),
      start: DB.Required({
        comment: "When the poison takes effect.",
        type: DB.IncludeIdentifier(PoisonStart),
      }),
      duration: DB.Required({
        comment: "The normal and degraded poison’s duration.",
        type: DB.GenIncludeIdentifier(Reduceable, [DB.IncludeIdentifier(PoisonDuration)]),
      }),
      value: DB.Optional({
        comment: "The raw (ingredients) value per level, in silverthalers.",
        type: DB.Integer({ minimum: 1 }),
      }),
      cost: DB.Optional({
        comment: "Price for one dose, in silverthalers.",
        type: DB.IncludeIdentifier(PoisonCost),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "Poison",
        DB.Object({
          name: DB.Required({
            comment: "The name of the poison.",
            type: DB.String({ minLength: 1 }),
          }),
          alternative_names: DB.Optional({
            comment: "A list of alternative names.",
            type: DB.Array(DB.IncludeIdentifier(AlternativeName), { minItems: 1 }),
          }),
          effect: DB.Required({
            comment: "The normal and degraded poison’s effects.",
            type: DB.GenIncludeIdentifier(Reduceable, [
              DB.String({ minLength: 1, markdown: "block" }),
            ]),
          }),
          notes: DB.Optional({
            comment: "Notes on the poison’s special features.",
            type: DB.String({ minLength: 1, markdown: "block" }),
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

const PoisonApplicationType = DB.Enum(import.meta.url, {
  name: "PoisonApplicationType",
  values: () => ({
    Weapon: DB.EnumCase({ type: null }),
    Ingestion: DB.EnumCase({ type: null }),
    Inhalation: DB.EnumCase({ type: null }),
    Contact: DB.EnumCase({ type: null }),
  }),
})

const PoisonStart = DB.Enum(import.meta.url, {
  name: "PoisonStart",
  values: () => ({
    Immediate: DB.EnumCase({ type: null }),
    ExpressionBased: DB.EnumCase({ type: DB.IncludeIdentifier(ExpressionBasedPoisonTime) }),
    Indefinite: DB.EnumCase({ type: DB.IncludeIdentifier(IndefinitePoisonTime) }),
  }),
})

const PoisonDuration = DB.Enum(import.meta.url, {
  name: "PoisonDuration",
  values: () => ({
    Instant: DB.EnumCase({ type: null }),
    ExpressionBased: DB.EnumCase({ type: DB.IncludeIdentifier(ExpressionBasedPoisonTime) }),
    Indefinite: DB.EnumCase({ type: DB.IncludeIdentifier(IndefinitePoisonTime) }),
  }),
})

const PoisonCost = DB.Enum(import.meta.url, {
  name: "PoisonCost",
  values: () => ({
    CannotBeExtracted: DB.EnumCase({ type: null }),
    None: DB.EnumCase({ type: DB.IncludeIdentifier(NoPoisonCost) }),
    Constant: DB.EnumCase({ type: DB.Float({ minimum: { value: 0, isExclusive: true } }) }),
    Indefinite: DB.EnumCase({ type: DB.IncludeIdentifier(IndefinitePoisonCost) }),
    DependingOnPurchaseOrSale: DB.EnumCase({
      comment: "The cost depends on whether the poison is being purchased or sold.",
      type: DB.IncludeIdentifier(DependingOnPurchaseOrSalePoisonCost),
    }),
    Range: DB.EnumCase({ type: DB.IncludeIdentifier(CostRange) }),
  }),
})

export const NoPoisonCost = DB.TypeAlias(import.meta.url, {
  name: "NoPoisonCost",
  type: () =>
    DB.Object({
      translations: NestedTranslationMap(
        DB.Optional,
        "NoPoisonCost",
        DB.Object({
          description: DB.Required({
            comment: "A description of the cost.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
        }),
      ),
    }),
})

export const IndefinitePoisonCost = DB.TypeAlias(import.meta.url, {
  name: "IndefinitePoisonCost",
  type: () =>
    DB.Object({
      translations: NestedTranslationMap(
        DB.Required,
        "IndefinitePoisonCost",
        DB.Object({
          description: DB.Required({
            comment: "A description of the cost.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
        }),
      ),
    }),
})

const DependingOnPurchaseOrSalePoisonCost = DB.TypeAlias(import.meta.url, {
  name: "DependingOnPurchaseOrSalePoisonCost",
  comment: "The cost depends on whether the poison is being purchased or sold.",
  type: () =>
    DB.Object({
      purchase: DB.Required({
        comment: "The cost when purchasing the poison.",
        type: DB.Float({ minimum: { value: 0, isExclusive: true } }),
      }),
      sale: DB.Required({
        comment: "The cost when selling the poison.",
        type: DB.Float({ minimum: { value: 0, isExclusive: true } }),
      }),
    }),
})

export const ExpressionBasedPoisonTime = DB.TypeAlias(import.meta.url, {
  name: "ExpressionBasedPoisonTime",
  type: () =>
    DB.Object({
      value: DB.Required({
        type: DB.IncludeIdentifier(ExpressionBasedPoisonTimeValue),
      }),
      unit: DB.Required({
        type: DB.IncludeIdentifier(PoisonTimeUnit),
      }),
    }),
})

export const ExpressionBasedPoisonTimeValue = DB.TypeAlias(import.meta.url, {
  name: "ExpressionBasedPoisonTimeValue",
  type: () =>
    DB.GenIncludeIdentifier(MathOperation, [
      DB.IncludeIdentifier(ExpressionBasedPoisonTimeExpressionValue),
    ]),
})

export const ExpressionBasedPoisonTimeExpressionValue = DB.Enum(import.meta.url, {
  name: "ExpressionBasedPoisonTimeExpressionValue",
  values: () => ({
    Constant: DB.EnumCase({ type: DB.Integer({ minimum: 1 }) }),
    Dice: DB.EnumCase({ type: DB.IncludeIdentifier(Dice) }),
    CircleOfDamnation: DB.EnumCase({ type: null }),
  }),
})

const PoisonTimeUnit = DB.Enum(import.meta.url, {
  name: "PoisonTimeUnit",
  values: () => ({
    CombatRounds: DB.EnumCase({ type: null }),
    Minutes: DB.EnumCase({ type: null }),
    Hours: DB.EnumCase({ type: null }),
    Days: DB.EnumCase({ type: null }),
  }),
})

export const IndefinitePoisonTime = DB.TypeAlias(import.meta.url, {
  name: "IndefinitePoisonTime",
  type: () =>
    DB.Object({
      translations: NestedTranslationMap(
        DB.Optional,
        "IndefinitePoisonTime",
        DB.Object(
          {
            description: DB.Optional({
              comment: "A description of the duration.",
              type: DB.String({ minLength: 1, markdown: "block" }),
            }),
          },
          { minProperties: 1 },
        ),
      ),
    }),
})

const PoisonSourceType = DB.Enum(import.meta.url, {
  name: "PoisonSourceType",
  values: () => ({
    AnimalVenom: DB.EnumCase({ type: DB.IncludeIdentifier(AnimalVenom) }),
    AlchemicalPoison: DB.EnumCase({ type: DB.IncludeIdentifier(AlchemicalPoison) }),
    AlchemicalPactGiftPoison: DB.EnumCase({
      comment:
        "An alchemical poison that is part of a pact gift and cannot be obtained or brewed by means typical for an alchemical poison.",
      type: null,
    }),
    MineralPoison: DB.EnumCase({ type: DB.IncludeIdentifier(MineralPoison) }),
    PlantPoison: DB.EnumCase({ type: DB.IncludeIdentifier(PlantPoison) }),
    DemonicPoison: DB.EnumCase({ type: DB.IncludeIdentifier(DemonicPoison) }),
  }),
})

export const AnimalVenom = DB.TypeAlias(import.meta.url, {
  name: "AnimalVenom",
  type: () =>
    DB.Object({
      level: DB.Required({
        comment: "The poison’s level.",
        type: DB.IncludeIdentifier(AnimalVenomLevel),
      }),
      is_extractable: DB.Required({
        comment: "If `false`, the poison cannot be extracted.",
        type: DB.Boolean(),
      }),
      complexity: DB.Optional({
        comment:
          "The complexity of the poison. Complex poisons define AP value and prerequisites of the poison’s trade secret.",
        type: DB.IncludeIdentifier(RecipeComplexity),
      }),
    }),
})

const AnimalVenomLevel = DB.Enum(import.meta.url, {
  name: "AnimalVenomLevel",
  values: () => ({
    QualityLevel: DB.EnumCase({ type: null }),
    Constant: DB.EnumCase({ type: DB.Integer({ minimum: 1, maximum: 6 }) }),
    BySubtype: DB.EnumCase({ type: DB.IncludeIdentifier(AnimalVenomLevelBySubType) }),
  }),
})

const AnimalVenomLevelBySubType = DB.TypeAlias(import.meta.url, {
  name: "AnimalVenomLevelBySubType",
  type: () =>
    DB.Array(
      DB.Object({
        value: DB.Required({
          comment: "The poison’s level.",
          type: DB.Integer({ minimum: 1, maximum: 6 }),
        }),
        translations: NestedTranslationMap(
          DB.Required,
          "AnimalVenomLevelBySubType",
          DB.Object({
            name: DB.Required({
              comment:
                "The subtype name. If there are multiple subtypes with the same level, specify them separately.",
              type: DB.String({ minLength: 1 }),
            }),
          }),
        ),
      }),
      { minItems: 1 },
    ),
})

export const AlchemicalPoison = DB.TypeAlias(import.meta.url, {
  name: "AlchemicalPoison",
  type: () =>
    DB.Object({
      effect_types: DB.Required({
        comment: "Effect type(s) of an alchemical poison.",
        type: DB.Array(DB.IncludeIdentifier(EffectType), { minItems: 1, uniqueItems: true }),
      }),
      cost_per_ingredient_level: DB.Required({
        comment: "The cost per ingredient level in silverthalers.",
        type: DB.Integer({ minimum: 1 }),
      }),
      laboratory: DB.Required({
        comment: "The laboratory level needed to brew the poison.",
        type: DB.IncludeIdentifier(LaboratoryLevel),
      }),
      brewing_difficulty: DB.Required({
        comment: "The brewing difficulty, which represents the challenge of creating a poison.",
        type: DB.Integer(),
      }),
      trade_secret: DB.Required({
        comment: "AP value and prerequisites of the poison recipe’s trade secret.",
        type: DB.IncludeIdentifier(RecipeTradeSecret),
      }),
      intoxicant: DB.Optional({
        comment: "Additional information if the poison is an intoxicant.",
        type: DB.IncludeIdentifier(Intoxicant),
      }),
      isDemonic: DB.Optional({
        displayName: "Is demonic?",
        comment: "Whether the poison is of demonic nature or not.",
        type: DB.Boolean(),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "AlchemicalPoison",
        DB.Object({
          typical_ingredients: DB.Required({
            comment: "A list of typical ingredients.",
            type: DB.Array(DB.String({ minLength: 1 }), { minItems: 1, uniqueItems: true }),
          }),
          brewing_process_prerequisites: DB.Optional({
            comment: "Prerequsites for the brewing process, if any.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
        }),
      ),
    }),
})

export const MineralPoison = DB.TypeAlias(import.meta.url, {
  name: "MineralPoison",
  type: () =>
    DB.Object({
      level: DB.Required({
        comment: "The poison’s level.",
        type: DB.Integer({ minimum: 1, maximum: 6 }),
      }),
    }),
})

export const PlantPoison = DB.TypeAlias(import.meta.url, {
  name: "PlantPoison",
  type: () =>
    DB.Object({
      effect_types: DB.Required({
        comment: "Effect type(s) of a plant poison.",
        type: DB.Array(DB.IncludeIdentifier(EffectType), { minItems: 1, uniqueItems: true }),
      }),
      level: DB.Required({
        comment: "The poison’s level.",
        type: DB.Integer({ minimum: 1, maximum: 6 }),
      }),
      intoxicant: DB.Optional({
        comment: "Additional information if the poison is an intoxicant.",
        type: DB.IncludeIdentifier(Intoxicant),
      }),
    }),
})

export const DemonicPoison = DB.TypeAlias(import.meta.url, {
  name: "DemonicPoison",
  type: () =>
    DB.Object({
      level: DB.Required({
        comment: "The poison’s level.",
        type: DB.IncludeIdentifier(DemonicPoisonLevel),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "DemonicPoison",
        DB.Object(
          {
            note: DB.Optional({
              comment: "A note, if any.",
              type: DB.String({ minLength: 1, markdown: "block" }),
            }),
          },
          { minProperties: 1 },
        ),
      ),
    }),
})

const DemonicPoisonLevel = DB.Enum(import.meta.url, {
  name: "DemonicPoisonLevel",
  values: () => ({
    QualityLevel: DB.EnumCase({ type: DB.IncludeIdentifier(QualityLevelDemonicPoisonLevel) }),
    Constant: DB.EnumCase({ type: DB.IncludeIdentifier(ConstantDemonicPoisonLevel) }),
  }),
})

export const QualityLevelDemonicPoisonLevel = DB.TypeAlias(import.meta.url, {
  name: "QualityLevelDemonicPoisonLevel",
  type: () =>
    DB.Object({
      source: DB.Required({
        type: DB.IncludeIdentifier(QualityLevelDemonicPoisonLevelSource),
      }),
    }),
})

const QualityLevelDemonicPoisonLevelSource = DB.Enum(import.meta.url, {
  name: "QualityLevelDemonicPoisonLevelSource",
  values: () => ({
    Spellwork: DB.EnumCase({ type: null }),
  }),
})

export const ConstantDemonicPoisonLevel = DB.TypeAlias(import.meta.url, {
  name: "ConstantDemonicPoisonLevel",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The poison’s level.",
        type: DB.Integer({ minimum: 1, maximum: 6 }),
      }),
    }),
})

export const Intoxicant = DB.TypeAlias(import.meta.url, {
  name: "Intoxicant",
  type: () =>
    DB.Object({
      legality: DB.Required({
        comment:
          "Whether the use of the intoxicant is legal or not, usually from the perspective of most middle-Aventurian an northern-Aventurian nations.",
        type: DB.IncludeIdentifier(IntoxicantLegality),
      }),
      addiction: DB.Optional({
        comment:
          "The chance of getting addicted after an ingestion in addition to the maximum interval at which it, while addicted, must be ingested to not suffer from withdrawal symptoms.",
        type: DB.IncludeIdentifier(IntoxicantAddiction),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "Intoxicant",
        DB.Object({
          ingestion: DB.Required({
            comment: "How to ingest the intoxicant.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          side_effect: DB.Optional({
            comment:
              "The intoxicants side effects that always happen, no matter whether the intoxicant has the default or the reduced effect.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          overdose: DB.Optional({
            comment:
              "What happens if the intoxicant has been overdosed, that is, it has been ingested another time within the duration.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          special: DB.Optional({
            comment: "Special information about the intoxicant.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
        }),
      ),
    }),
})

export const IntoxicantLegality = DB.TypeAlias(import.meta.url, {
  name: "IntoxicantLegality",
  comment:
    "Whether the use of the intoxicant is legal or not, usually from the perspective of most middle-Aventurian an northern-Aventurian nations.",
  type: () =>
    DB.Object({
      is_legal: DB.Required({
        type: DB.Boolean(),
      }),
    }),
})

export const IntoxicantAddiction = DB.TypeAlias(import.meta.url, {
  name: "IntoxicantAddiction",
  comment:
    "The chance of getting addicted after an ingestion in addition to the maximum interval at which it, while addicted, must be ingested to not suffer from withdrawal symptoms.",
  type: () =>
    DB.Object({
      chance: DB.Optional({
        comment:
          "The chance of getting addicted after an ingestion in percent. Some intoxicants do not have a contant chance of addiction.",
        type: DB.Integer({ minimum: 0, maximum: 100, multipleOf: 5 }),
      }),
      check: DB.Optional({
        comment:
          "The interval at which to check for addiction after an ingestion. If set to one, every ingestion has to be checked for addiction. If set to two, every second ingestion has to be checked, and so on.",
        type: DB.IncludeIdentifier(IntoxicantAddictionCheck),
      }),
      withdrawalPrevention: DB.Optional({
        comment:
          "The maximum interval at which it, while addicted, must be ingested to not suffer from withdrawal symptoms.",
        type: DB.IncludeIdentifier(IntoxicantAddictionWithdrawalPrevention),
      }),
      disease: DB.Optional({
        comment: "The disease that represents the addiction.",
        type: DiseaseIdentifier(),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "IntoxicantAddiction",
        DB.Object({
          chance: DB.Required({
            comment:
              "The chance of getting addicted after an ingestion. Use if and only if the plain constant percent is not sufficient.",
            type: DB.String({ minLength: 1, markdown: "inline" }),
          }),
        }),
      ),
    }),
})

const IntoxicantAddictionCheck = DB.TypeAlias(import.meta.url, {
  name: "IntoxicantAddictionCheck",
  comment:
    "The interval at which to check for addiction after an ingestion. If set to one, every ingestion has to be checked for addiction. If set to two, every second ingestion has to be checked, and so on.",
  type: () =>
    DB.Object({
      interval: DB.Required({
        type: DB.Integer({ minimum: 1 }),
      }),
      onlySameMonth: DB.Optional({
        comment: "If true, only ingestions in the same month count for the check interval.",
        type: DB.Boolean(),
      }),
    }),
})

const IntoxicantAddictionWithdrawalPrevention = DB.TypeAlias(import.meta.url, {
  name: "IntoxicantAddictionWithdrawalPrevention",
  type: () =>
    DB.Object({
      amount: DB.Required({
        comment:
          "The amount that must be ingested within the interval to prevent withdrawal symptoms.",
        type: DB.Integer({ minimum: 1 }),
      }),
      interval: DB.Required({
        comment:
          "The maximum interval at which it, while addicted, must be ingested to not suffer from withdrawal symptoms.",
        type: DB.IncludeIdentifier(IntoxicantAddictionWithdrawalPreventionInterval),
      }),
    }),
})

const IntoxicantAddictionWithdrawalPreventionInterval = DB.Enum(import.meta.url, {
  name: "IntoxicantAddictionWithdrawalPreventionInterval",
  comment:
    "The maximum interval at which it, while addicted, must be ingested to not suffer from withdrawal symptoms.",
  values: () => ({
    Constant: DB.EnumCase({ type: DB.IncludeIdentifier(ConstantIntoxicantAddictionInterval) }),
    DiceBased: DB.EnumCase({ type: DB.IncludeIdentifier(DiceBasedIntoxicantAddictionInterval) }),
  }),
})

export const ConstantIntoxicantAddictionInterval = DB.TypeAlias(import.meta.url, {
  name: "ConstantIntoxicantAddictionInterval",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The interval value in days.",
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})

export const DiceBasedIntoxicantAddictionInterval = DB.TypeAlias(import.meta.url, {
  name: "DiceBasedIntoxicantAddictionInterval",
  type: () =>
    DB.Object({
      dice: DB.Required({
        comment: "The dice that define the interval value in days.",
        type: DB.IncludeIdentifier(Dice),
      }),
    }),
})
