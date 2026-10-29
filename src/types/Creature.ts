import * as DB from "tsondb/schema/dsl"
import { activatableDisplayNameCustomizer } from "./_ActivatableNames.ts"
import { NestedTranslationMap } from "./Locale.ts"
import { src } from "./source/_PublicationRef.js"
import { Dice } from "./_Dice.js"
import { MeleeWeapon, ParryModifier } from "./equipment/item/_MeleeWeapon.js"
import { RangedWeapon } from "./equipment/item/_RangedWeapon.js"
import { MeleeDamage } from "./equipment/item/_MeleeWeapon.js"
import { RangedDamage, RangeBrackets, ReloadTime } from "./equipment/item/_RangedWeapon.js"
import {
  ArmorIdentifier,
  AttributeIdentifier,
  ReachIdentifier,
  AdvantageIdentifier,
  DisadvantageIdentifier,
  PoisonIdentifier,
  DiseaseIdentifier,
  SkillIdentifier } from "./_Identifier.js"
import { Complexity } from "./equipment/item/_Item.ts"
import { CommonnessRatedAdvantageDisadvantage } from "./_CommonnessRatedAdvantageDisadvantage.js"

export const Creature = DB.Entity(import.meta.url, {
  name: "Creature",
  namePlural: "Creatures",
  type: () =>
    DB.Object({
      attributes: DB.Required({
        comment: "The attributes of the creature.",
        type: DB.Array(DB.IncludeIdentifier(CreatureAttribute), {
          minItems: 4,
          uniqueItems: true,
        }),
      }),
      live_energy: DB.Required({
        comment: "The live energy of the creature.",
        type: DB.Integer({ minimum: 0 }),
      }),
      astral_energy: DB.Optional({
        comment: "The astral energy of the creature.",
        type: DB.Integer({ minimum: 0 }),
      }),
      karma_energy: DB.Optional({
        comment: "The karma energy of the creature.",
        type: DB.Integer({ minimum: 0 }),
      }),
      initiative: DB.Required({
        comment: "The initiative of the creature.",
        type: DB.IncludeIdentifier(CreatureInitiative),
      }),
      defense: DB.Required({
        comment: "The defense of the creature.",
        type: DB.Integer(),
      }),
      spirit: DB.Required({
        comment: "The spirit of the creature.",
        type: DB.Integer(),
      }),
      toughness: DB.Required({
        comment: "The toughness of the creature.",
        type: DB.Integer(),
      }),
      speed: DB.Required({
        comment: "The speed of the creature.",
        type: DB.Array( DB.IncludeIdentifier(CreatureSpeed), { minItems: 1, uniqueItems: true } )
      }),
      attacks: DB.Optional({
        comment: "The attacks of the creature.",
        type: DB.Array(DB.IncludeIdentifier(CreatureAttack), {
          minItems: 1,
          uniqueItems: true,
        }),
      }),
      armor: DB.Required({
        comment: "The armor of the creature.",
        type: DB.IncludeIdentifier(CreatureArmor),
      }),
      actions: DB.Required({
        comment: "The number of actions the creature can perform.",
        type: DB.Integer({ minimum: 1 }),
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
      advantages: DB.Optional({
        comment: "A list of advantages, this creature has.",
        type: DB.Array(
          DB.GenIncludeIdentifier(CommonnessRatedAdvantageDisadvantage, [AdvantageIdentifier()]),
          { minItems: 1 },
        ),
      }),
      disadvantages: DB.Optional({
        comment: "A list of disadvantages, this creature has.",
        type: DB.Array(
          DB.GenIncludeIdentifier(CommonnessRatedAdvantageDisadvantage, [DisadvantageIdentifier()]),
          { minItems: 1 },
        ),
      }),
      special_abilities,
      skills: DB.Required({
        comment: "The skills of the creature.",
        type: DB.Array(DB.IncludeIdentifier(CreatureSkill), {
          minItems: 1,
          uniqueItems: true,
        }),
      }),
      spellworks,
      number: DB.Required({
        comment: "The numbers, this creature usually appears in.",
        type: DB.Array(DB.IncludeIdentifier(CreatureNumber), {
          minItems: 1,
          uniqueItems: true,
        })
      }),
      size_category: DB.Required({
        comment: "The size of the creature.",
        type: DB.IncludeIdentifier(CreatureSizeCategory),
      }),
      type: DB.Required({
        comment: "The type of the creature.",
        type: DB.IncludeIdentifier(CreatureType),
      }),
      is_humanoid: DB.Required({
        comment: "Is the creature humanoid?",
        type: DB.IncludeIdentifier(CreatureHumanoid),
      }),
      loot: DB.Optional({
        comment: "The loot of the creature.",
        type: DB.IncludeIdentifier(CreatureLoot),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "Creature",
        DB.Object({
          name: DB.Required({
            comment: "The creature’s name.",
            type: DB.String({ minLength: 1 }),
          }),
          size: DB.Required({
            comment: "The creature’s size.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          weight: DB.Required({
            comment: "The weight of the creature.",
            type: DB.IncludeIdentifier(CreatureWeight),
          }),
          combat_behavior: DB.Optional({
            comment: "The creature’s behavior.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          knowledge: DB.Optional({
            comment:
              "What one knows about this creature for each quality level. The first element represents QL 1, the second element QL 2, and so on.",
            type: DB.Array(DB.String({ minLength: 1, markdown: "block" }), {
              minItems: 3,
              maxItems: 6,
            }),
          }),
        }),
      ),
      special_rules: DB.NestedEntityMap({
        name: "CreatureSpecialRule",
        namePlural: "CreatureSpecialRules",
        type: CreatureSpecialRule,
        minProperties: 1,
      }),
    }),
  instanceDisplayName: {},
  instanceDisplayNameCustomizer: activatableDisplayNameCustomizer,
  uniqueConstraints: [
    [
      {
        entityMapKeyPath: "translations",
      },
    ],
  ],
})

const CreatureAttribute = DB.TypeAlias(import.meta.url, {
  name: "CreatureAttribute",
  type: () =>
    DB.Object({
      attribute: DB.Required({
        comment: "The attribute of the creature.",
        type: AttributeIdentifier(),
      }),
      value: DB.Optional({
        comment: "The value of the attribute.",
        type: DB.Integer({ minimum: 0 }),
      }),
    }),
})

const CreatureSkill = DB.TypeAlias(import.meta.url, {
  name: "CreatureSkill",
  type: () =>
    DB.Object({
      skill: DB.Required({
        comment: "The skill of the creature.",
        type: SkillIdentifier(),
      }),
      value: DB.Optional({
        comment: "The value of the skill.",
        type: DB.IncludeIdentifier(CreatureSkillValue),
      }),
      rule: DB.Optional({
        comment: "The special rule associated with the skill, if any.",
        type: DB.IncludeIdentifier(CreatureSpecialRule),
      }),
    }),
})

const CreatureSkillValue = DB.Enum(import.meta.url, {
  name: "CreatureSkillValue",
  values: () => ({
    Fixed: DB.EnumCase({ type: DB.Integer({ minimum: 0 }) }),
    AutoSuccess: DB.EnumCase({ type: null }),
    AutoFail: DB.EnumCase({ type: null }),
  }),
})

const CreatureSizeCategory = DB.Enum(import.meta.url, {
  name: "CreatureSizeCategory",
  values: () => ({
    Tiny: DB.EnumCase({ type: null }),
    Small: DB.EnumCase({ type: null }),
    Medium: DB.EnumCase({ type: null }),
    Large: DB.EnumCase({ type: null }),
    Huge: DB.EnumCase({ type: null }),
  }),
})

const CreatureType = DB.TypeAlias(import.meta.url, {
  name: "CreatureType",
  type: () =>
    DB.Object({
      type: DB.Required({
        comment: "The type of the creature.",
        type: DB.IncludeIdentifier(CreatureTypeType),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "CreatureType",
        DB.Object({
          note: DB.Required({
            comment: "The creature type note.",
            type: DB.String({ minLength: 1, markdown: "inline" }),
          }),
        }),
      ),
    }),
})

const CreatureTypeType = DB.Enum(import.meta.url, {
  name: "CreatureTypeType",
  values: () => ({
    Animal: DB.EnumCase({ type: DB.IncludeIdentifier(CreatureTypeHuntable) }),
    Chimera: DB.EnumCase({ type: null }),
    Deamon: DB.EnumCase({ type: DB.IncludeIdentifier(CreatureTypeSummonable) }),
    Daemonoid: DB.EnumCase({ type: null }),
    Dragon: DB.EnumCase({ type: null }),
    Elemental: DB.EnumCase({ type: DB.IncludeIdentifier(CreatureTypeSummonable) }),
    Fairy: DB.EnumCase({ type: null }),
    Golem: DB.EnumCase({ type: DB.IncludeIdentifier(CreatureTypeCreatable) }),
    Ghost: DB.EnumCase({ type: null }),
    Golemoid: DB.EnumCase({ type: null }),
    Homunculus: DB.EnumCase({ type: null }),
    Intelligent_Being: DB.EnumCase({ type: null }),
    Magical_Being: DB.EnumCase({ type: null }),
    Plant: DB.EnumCase({ type: null }),
    Plantchimera: DB.EnumCase({ type: null }),
    Animal_Form: DB.EnumCase({ type: null }),
    Undead: DB.EnumCase({ type: DB.IncludeIdentifier(CreatureTypeCreatable) }),
    Supernatural_Being: DB.EnumCase({ type: null }),
    Other: DB.EnumCase({ type: null }),
  }),
})

const CreatureTypeSummonable = DB.TypeAlias(import.meta.url, {
  name: "CreatureTypeSummonable",
  type: () =>
    DB.Object({
      summoning_difficulty: DB.Required({
        comment: "The summoning difficulty of the creature.",
        type: DB.Integer(),
      }),
    }),
})

const CreatureTypeCreatable = DB.TypeAlias(import.meta.url, {
  name: "CreatureTypeCreatable",
  type: () =>
    DB.Object({
      creation_difficulty: DB.Required({
        comment: "The creation difficulty of the creature.",
        type: DB.Integer(),
      }),
      creation_complexity: DB.Optional({
        comment: "The complexity of crafting the item.",
        type: DB.IncludeIdentifier(Complexity),
      }),
    }),
})

const CreatureTypeHuntable = DB.TypeAlias(import.meta.url, {
  name: "CreatureTypeHuntable",
  type: () =>
    DB.Object({
      hunting_difficulty: DB.Required({
        comment: "The hunting difficulty of the creature.",
        type: DB.Integer(),
      }),
    }),
})

const CreatureHumanoid = DB.Enum(import.meta.url, {
  name: "CreatureHumanoid",
  values: () => ({
    Humanoid: DB.EnumCase({ type: null }),
    Non_Humanoid: DB.EnumCase({ type: null }),
    Both: DB.EnumCase({ type: null }),
  }),
})

const CreatureInitiative = DB.TypeAlias(import.meta.url, {
  name: "CreatureInitiative",
  type: () =>
    DB.Object({
      dice: DB.Optional({
        comment: "How many dice of which type are rolled to get the initiative.",
        type: DB.IncludeIdentifier(Dice),
      }),
      flat: DB.Required({
        comment: "Flat initiative. It gets added to the result of the dice rolls.",
        type: DB.Integer(),
      }),
    }),
})

const CreatureWeight = DB.Enum(import.meta.url, {
  name: "CreatureWeight",
  values: () => ({
    None: DB.EnumCase({ type: null }),
    Range: DB.EnumCase({ type: DB.IncludeIdentifier(Range) }),
  }),
})

const Range = DB.TypeAlias(import.meta.url, {
  name: "Range",
  type: () =>
    DB.Object({
      minimum: DB.Required({
        comment: "The minimum weight of the creature.",
        type: DB.Integer({ minimum: 0 }),
      }),
      maximum: DB.Required({
        comment: "The maximum weight of the creature.",
        type: DB.Integer({ minimum: 0 }),
      }),
    }),
})

const CreatureArmor = DB.Enum(import.meta.url, {
  name: "CreatureArmor",
  values: () => ({
    Flat: DB.EnumCase({ type: DB.IncludeIdentifier(CreatureArmorFlat) }),
    Item: DB.EnumCase({ type: ArmorIdentifier() }),
  }),
})

const CreatureArmorFlat = DB.TypeAlias(import.meta.url, {
  name: "CreatureArmorFlat",
  type: () =>
    DB.Object({
      protection: DB.Required({
        comment: "The protection value of the creature.",
        type: DB.Integer({ minimum: 0 }),
      }),
      encumbrance: DB.Required({
        comment: "The encumbrance value of the creature.",
        type: DB.Integer({ minimum: 0 }),
      }),
    }),
})

const CreatureAttack = DB.TypeAlias(import.meta.url, {
  name: "CreatureAttack",
  type: () =>
    DB.Object({
      type: DB.Required({
        comment: "The type of the attack.",
        type: DB.IncludeIdentifier(CreatureAttackType),
      }),
      special: DB.Optional({
        comment: "The special properties of the attack.",
        type: DB.Array(
          DB.IncludeIdentifier(CreatureAttackSpecial),
          { minItems: 1, uniqueItems: true }),
      }),
    }),
})

const CreatureAttackSpecial = DB.Enum(import.meta.url, {
  name: "CreatureAttackSpecial",
  values: () => ({
    Poison: DB.EnumCase({ type: PoisonIdentifier() }),
    Disease: DB.EnumCase({ type: DiseaseIdentifier() }),
    Rule: DB.EnumCase({ type: DB.IncludeIdentifier(CreatureSpecialRule) }),
  }),
})

const CreatureAttackType = DB.Enum(import.meta.url, {
  name: "CreatureAttackType",
  values: () => ({
    MeleeFlat: DB.EnumCase({ type: DB.IncludeIdentifier(CreatureMeleeAttackFlat) }),
    MeleeItem: DB.EnumCase({ type: DB.IncludeIdentifier(MeleeWeapon) }),
    RangedFlat: DB.EnumCase({ type: DB.IncludeIdentifier(CreatureRangedAttackFlat) }),
    RangedItem: DB.EnumCase({ type: DB.IncludeIdentifier(RangedWeapon) }),
  }),
})

const CreatureMeleeAttackFlat = DB.TypeAlias(import.meta.url, {
  name: "CreatureMeleeAttackFlat",
  type: () =>
    DB.Object({
      attack: DB.Required({
        comment: "The attack of the creature.",
        type: DB.Integer(),
      }),
      parry: DB.Optional({
        comment: "The parry of the creature.",
        type: DB.IncludeIdentifier(ParryModifier),
      }),
      damage: DB.Required({
        comment: "The damage of the creature.",
        type: DB.IncludeIdentifier(MeleeDamage),
      }),
      reach: DB.Required({
        comment: "The reach of the creature in cm/halffingers.",
        type: ReachIdentifier(),
      }),
    }),
})

const CreatureRangedAttackFlat = DB.TypeAlias(import.meta.url, {
  name: "CreatureRangedAttackFlat",
  type: () =>
    DB.Object({
      attack: DB.Required({
        comment: "The attack of the creature.",
        type: DB.Integer(),
      }),
      damage: DB.Required({
        comment: "The damage of the creature.",
        type: DB.IncludeIdentifier(RangedDamage),
      }),
      reload_time: DB.Required({
        comment: "One or multiple reload times.",
        type: DB.Array(DB.IncludeIdentifier(ReloadTime), {
          minItems: 1,
          uniqueItems: true,
        }),
      }),
      range: DB.Required({
        comment: "The range brackets for the creature: close, medium, far. Distances in m.",
        type: DB.IncludeIdentifier(RangeBrackets),
      }),
    }),
})

const CreatureNumber = DB.TypeAlias(import.meta.url, {
  name: "CreatureNumber",
  type: () =>
    DB.Object({
      dice: DB.Optional({
        comment: "How many dice of which type are rolled.",
        type: DB.IncludeIdentifier(Dice),
      }),
      flat: DB.Required({
        comment: "Flat number. It gets added to the result of the dice rolls.",
        type: DB.Integer(),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "CreatureNumber",
        DB.Object({
          note: DB.Required({
            comment: "The creature number note, which is shown in parentheses.",
            type: DB.String({ minLength: 1, markdown: "inline" }),
          }),
        }),
      ),
    }),
})

export const CreatureSpecialRule = DB.Entity(import.meta.url, {
  name: "CreatureSpecialRule",
  namePlural: "CreatureSpecialRules",
  type: () =>
    DB.Object({
      translations: NestedTranslationMap(
        DB.Required,
        "CreatureSpecialRule",
        DB.Object({
          name: DB.Required({
            comment: "The name of the special rule.",
            type: DB.String({ minLength: 1 }),
          }),
          description: DB.Required({
            comment: "The description of the special rule.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
        }),
      ),
    }),
})

const CreatureLoot = DB.TypeAlias(import.meta.url, {
  name: "CreatureLoot",
  type: () =>
    DB.Object({
      meat: DB.Optional({
        comment: "The meat of the creature.",
        type: DB.IncludeIdentifier(CreatureMeat),
      }),
      items: DB.Optional({
        comment: "The items of the creature.",
        type: DB.Array(DB.IncludeIdentifier(CreatureLootItem), {
          minItems: 1,
          uniqueItems: true,
        }),
      }),
    }),
})

const CreatureLootItem = DB.TypeAlias(import.meta.url, {
  name: "CreatureLootItem",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The value of the loot item in silver.",
        type: DB.Float({ minimum: 0 }),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "CreatureLootItem",
        DB.Object({
          name: DB.Required({
            comment: "The name of the loot item.",
            type: DB.String({ minLength: 1 }),
          }),
          Category: DB.Optional({
            comment: "The category for the loot item.",
            type: DB.String({ minLength: 1 }),
          }),
        }),
      ),
    }),
})

const CreatureMeat = DB.TypeAlias(import.meta.url, {
  name: "CreatureMeat",
  type: () =>
    DB.Object({
      rations: DB.Required({
        comment: "The number of rations of meat.",
        type: DB.Float({ minimum: 0 }),
      }),
      quality: DB.Optional({
        comment: "The quality of the meat.",
        type: DB.IncludeIdentifier(CreaturemeatQuality),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "CreatureMeat",
        DB.Object({
          note: DB.Required({
            comment: "The creature meat note.",
            type: DB.String({ minLength: 1, markdown: "inline" }),
          }),
        }),
      ),
    }),
})

const CreaturemeatQuality = DB.Enum(import.meta.url, {
  name: "CreaturemeatQuality",
  values: () => ({
    Premium: DB.EnumCase({ type: null }),
    Average: DB.EnumCase({ type: null }),
    Tough: DB.EnumCase({ type: null }),
    Inedible: DB.EnumCase({ type: null }),
  }),
})

const CreatureSpeed = DB.TypeAlias(import.meta.url, {
  name: "CreatureSpeed",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The Speed of the creature",
        type: DB.Integer({ minimum: 0 })
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "CreatureSpeed",
        DB.Object({
          note: DB.Required({
            comment: "In which case this speed applies.",
            type: DB.String({ minLength: 1, markdown: "inline" }),
          }),
        }),
      )
    }),
})