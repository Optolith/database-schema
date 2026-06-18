import { Schema } from "tsondb/schema"
import type { ChildEntityMap, EntityMap, EnumMap, TypeAliasMap } from "../gen/types.js"
import * as Types from "./types/index.js"

declare module "tsondb/schema/gen" {
  interface Register {
    entityMap: EntityMap
    childEntityMap: ChildEntityMap
    enumMap: EnumMap
    typeAliasMap: TypeAliasMap
  }
}

export interface TSONDBTypes {
  entityMap: EntityMap
  childEntityMap: ChildEntityMap
  enumMap: EnumMap
  typeAliasMap: TypeAliasMap
}

export const schema = new Schema<TSONDBTypes>(
  [
    Types.AdvancedCombatSpecialAbility,
    Types.AdvancedKarmaSpecialAbility,
    Types.AdvancedMagicalSpecialAbility,
    Types.AdvancedSkillSpecialAbility,
    Types.Advantage,
    Types.AlternativeRule,
    Types.Ammunition,
    Types.AncestorGlyph,
    Types.Animal,
    Types.AnimalCare,
    Types.AnimalDisease,
    Types.AnimalShape,
    Types.AnimalShapePath,
    Types.AnimalShapeSize,
    Types.AnimalType,
    Types.AnimistPower,
    Types.ArcaneBardTradition,
    Types.ArcaneDancerTradition,
    Types.ArcaneOrbEnchantment,
    Types.Armor,
    Types.ArmorType,
    Types.Aspect,
    Types.AttireEnchantment,
    Types.Attribute,
    Types.BandageOrRemedy,
    Types.Bannzeichen,
    Types.Beutelzauber,
    Types.Biome,
    Types.BlessedTradition,
    Types.Blessing,
    Types.Book,
    Types.BotanicRegion,
    Types.BowlEnchantment,
    Types.BrawlingSpecialAbility,
    Types.Brew,
    Types.Cantrip,
    Types.CauldronEnchantment,
    Types.CeremonialItem,
    Types.CeremonialItemSpecialAbility,
    Types.Ceremony,
    Types.ChronicleEnchantment,
    Types.CloseCombatTechnique,
    Types.Clothes,
    Types.ClothingPackage,
    Types.CombatSpecialAbility,
    Types.CombatStyleSpecialAbility,
    Types.CommandSpecialAbility,
    Types.Condition,
    Types.Container,
    Types.Continent,
    Types.CoreRule,
    Types.Culture,
    Types.Curriculum,
    Types.Curse,
    Types.DaggerRitual,
    Types.DerivedCharacteristic,
    Types.Disadvantage,
    Types.Disease,
    Types.DominationRitual,
    Types.Element,
    Types.Elixir,
    Types.ElvenMagicalSong,
    Types.EquipmentOfBlessedOnes,
    Types.EquipmentPackage,
    Types.ExperienceLevel,
    Types.EyeColor,
    Types.FamiliarSpecialAbility,
    Types.FamiliarsTrick,
    Types.FatePointSexSpecialAbility,
    Types.FatePointSpecialAbility,
    Types.FocusRule,
    Types.FoolsHatEnchantment,
    Types.GemOrPreciousStone,
    Types.GeneralSpecialAbility,
    Types.GeodeRitual,
    Types.GoblinRitual,
    Types.Guideline,
    Types.HairColor,
    Types.Haubenzauber,
    Types.HerbalAid,
    Types.HerbalPreservation,
    Types.HomunculusType,
    Types.IlluminationLightSource,
    Types.IlluminationRefillOrSupply,
    Types.InstrumentEnchantment,
    Types.JesterTrick,
    Types.Jewelry,
    Types.KarmaSpecialAbility,
    Types.Krallenkettenzauber,
    Types.Kristallkugelzauber,
    Types.Laboratory,
    Types.Language,
    Types.Liebesspielzeug,
    Types.LiturgicalChant,
    Types.LiturgicalStyleSpecialAbility,
    Types.LuxuryGood,
    Types.LycantropicGift,
    Types.MagicalArtifact,
    Types.MagicalDance,
    Types.MagicalMelody,
    Types.MagicalRune,
    Types.MagicalSign,
    Types.MagicalSpecialAbility,
    Types.MagicalTradition,
    Types.MagicStyleSpecialAbility,
    Types.MetaCondition,
    Types.MusicalInstrument,
    Types.Newspaper,
    Types.OptionalRule,
    Types.OrbEnchantment,
    Types.OrienteeringAid,
    Types.PactCategory,
    Types.PactGift,
    Types.Patron,
    Types.PatronCategory,
    Types.PersonalityTrait,
    Types.PlayerType,
    Types.Plant,
    Types.Poison,
    Types.Profession,
    Types.Property,
    Types.ProtectiveWardingCircleSpecialAbility,
    Types.Publication,
    Types.Race,
    Types.RangedCombatTechnique,
    Types.Reach,
    Types.Region,
    Types.RingEnchantment,
    Types.Ritual,
    Types.RopeOrChain,
    Types.Script,
    Types.Sermon,
    Types.Service,
    Types.SexPractice,
    Types.SexSpecialAbility,
    Types.SickleRitual,
    Types.SikaryanDrainSpecialAbility,
    Types.Skill,
    Types.SkillGroup,
    Types.SkillModificationLevel,
    Types.SkillStyleSpecialAbility,
    Types.SocialStatus,
    Types.Spell,
    Types.SpellSwordEnchantment,
    Types.StaffEnchantment,
    Types.State,
    Types.Stationery,
    Types.SubBiome,
    Types.Subject,
    Types.Talisman,
    Types.TargetCategory,
    Types.ThievesTool,
    Types.ToolOfTheTrade,
    Types.ToyEnchantment,
    Types.TradeSecret,
    Types.TravelGearOrTool,
    Types.Tribe,
    Types.Trinkhornzauber,
    Types.VampiricGift,
    Types.Vehicle,
    Types.Vision,
    Types.WandEnchantment,
    Types.Weapon,
    Types.WeaponAccessory,
    Types.WeaponEnchantment,
    Types.WorkingSupernaturalCreature,
    Types.ZibiljaRitual,
  ],
  Types.Locale,
)

// /**
//  * A dictionary of cache types and their associated location.
//  */
// export type CachePaths = {
//   [K in keyof CacheMap]: string
// }

// export type CacheOptions = {
//   /**
//    * Whether to pretty-print the JSON. Default is `false`.
//    */
//   pretty?: boolean
// }

// /**
//  * Builds the cache and writes it to the specified paths in JSON format.
//  * @param cachePaths The absolute paths to write each cache to.
//  * @param validResults The data to build the cache from. Usually the result of
//  * `getAllValidData`.
//  * @param options Configuration options for building the cache.
//  */
// export const buildCache = async (
//   cachePaths: CachePaths,
//   validResults: ValidResults,
//   options: CacheOptions = {}
// ): Promise<void> => {
//   const { pretty = false } = options

//   const activatableSelectOptionsCache = cacheMap.activatableSelectOptions.builder(validResults)
//   const ancestorBloodAdvantagesCache = cacheMap.ancestorBloodAdvantages.builder(validResults)
//   const magicalAndBlessedAdvantagesAndDisadvantagesCache =
//     cacheMap.magicalAndBlessedAdvantagesAndDisadvantages.builder(validResults)
//   const newApplicationsAndUsesCache = cacheMap.newApplicationsAndUses.builder(
//     validResults,
//     activatableSelectOptionsCache
//   )

//   const cacheData: CacheMap = {
//     activatableSelectOptions: activatableSelectOptionsCache,
//     ancestorBloodAdvantages: ancestorBloodAdvantagesCache,
//     magicalAndBlessedAdvantagesAndDisadvantages: magicalAndBlessedAdvantagesAndDisadvantagesCache,
//     newApplicationsAndUses: newApplicationsAndUsesCache,
//   }

//   for (const [cacheName, cachePath] of Object.entries(cachePaths)) {
//     await mkdir(dirname(cachePath), { recursive: true })
//     await writeFile(
//       cachePath,
//       JSON.stringify(cacheData[cacheName as keyof CachePaths], null, pretty ? 2 : undefined),
//       "utf-8"
//     )
//   }
// }

// /**
//  * Reads the cache from the specified paths in JSON format.
//  * @param cachePaths The absolute paths to read each cache from.
//  * @returns
//  */
// export const getCache = async (cachePaths: CachePaths): Promise<CacheMap> => {
//   const cache: Partial<CacheMap> = {}
//   for (const [cacheName, cachePath] of Object.entries(cachePaths)) {
//     const cacheData = JSON.parse(await readFile(cachePath, "utf-8"))
//     cache[cacheName as keyof CacheMap] = cacheData
//   }
//   return cache as CacheMap
// }
