import { ReferenceIdentifier as R } from "tsondb/schema/dsl"
import { GeneralSelectOption } from "./_ActivatableSelectOptions.js"
import { NewSkillApplication, SkillUse } from "./_ActivatableSkillApplicationsAndUses.js"
import { Enhancement } from "./_Enhancements.js"
import { Advantage } from "./Advantage.js"
import { AnimalType } from "./AnimalType.js"
import { ArcaneBardTradition } from "./ArcaneBardTradition.js"
import { ArcaneDancerTradition } from "./ArcaneDancerTradition.js"
import { Aspect } from "./Aspect.js"
import { Attribute } from "./Attribute.js"
import { Blessing } from "./Blessing.js"
import { Cantrip } from "./Cantrip.js"
import { Ceremony } from "./Ceremony.js"
import { CloseCombatTechnique, RangedCombatTechnique } from "./CombatTechnique.js"
import { Condition } from "./Condition.js"
import { Continent } from "./Continent.js"
import { Culture } from "./Culture.js"
import { DerivedCharacteristic } from "./DerivedCharacteristic.ts"
import { Disadvantage } from "./Disadvantage.js"
import { Disease } from "./Disease.js"
import { Element } from "./Element.js"
import { Ammunition } from "./equipment/item/Ammunition.js"
import { Animal } from "./equipment/item/Animal.js"
import { AnimalCare } from "./equipment/item/AnimalCare.js"
import { Armor } from "./equipment/item/Armor.js"
import { BandageOrRemedy } from "./equipment/item/BandageOrRemedy.js"
import { Book } from "./equipment/item/Book.js"
import { CeremonialItem } from "./equipment/item/CeremonialItem.js"
import { Clothes } from "./equipment/item/Clothes.js"
import { ClothingPackage } from "./equipment/item/ClothingPackage.js"
import { Container } from "./equipment/item/Container.js"
import { Elixir } from "./equipment/item/Elixir.js"
import { EquipmentOfBlessedOnes } from "./equipment/item/EquipmentOfBlessedOnes.js"
import { GemOrPreciousStone } from "./equipment/item/GemOrPreciousStone.js"
import { IlluminationLightSource } from "./equipment/item/IlluminationLightSource.js"
import { IlluminationRefillOrSupply } from "./equipment/item/IlluminationRefillOrSupply.js"
import { Jewelry } from "./equipment/item/Jewelry.js"
import { Laboratory } from "./equipment/item/Laboratory.js"
import { Liebesspielzeug } from "./equipment/item/Liebesspielzeug.js"
import { LuxuryGood } from "./equipment/item/LuxuryGood.js"
import { MagicalArtifact } from "./equipment/item/MagicalArtifact.js"
import { MusicalInstrument } from "./equipment/item/MusicalInstrument.js"
import { Newspaper } from "./equipment/item/Newspaper.js"
import { OrienteeringAid } from "./equipment/item/OrienteeringAid.js"
import { Plant } from "./equipment/item/Plant.js"
import { Poison } from "./equipment/item/Poison.js"
import { RopeOrChain } from "./equipment/item/RopeOrChain.js"
import { Stationery } from "./equipment/item/Stationery.js"
import { ArmorType } from "./equipment/item/sub/ArmorType.js"
import { PlantType } from "./equipment/item/sub/PlantType.js"
import { Reach } from "./equipment/item/sub/Reach.js"
import { ThievesTool } from "./equipment/item/ThievesTool.js"
import { ToolOfTheTrade } from "./equipment/item/ToolOfTheTrade.js"
import { TravelGearOrTool } from "./equipment/item/TravelGearOrTool.js"
import { Vehicle } from "./equipment/item/Vehicle.js"
import { Weapon } from "./equipment/item/Weapon.js"
import { WeaponAccessory } from "./equipment/item/WeaponAccessory.js"
import { WorkingSupernaturalCreature } from "./equipment/item/WorkingSupernaturalCreature.ts"
import { ExperienceLevel } from "./ExperienceLevel.js"
import { EyeColor } from "./EyeColor.js"
import { HairColor } from "./HairColor.js"
import { Influence } from "./Influence.ts"
import { Curriculum, Guideline, LessonPackage } from "./Lessons.js"
import { LiturgicalChant } from "./LiturgicalChant.js"
import { AnimistPower } from "./magicalActions/AnimistPower.js"
import { Tribe } from "./magicalActions/AnimistPower_Tribe.js"
import { Bannzeichen } from "./magicalActions/Bannzeichen.js"
import { Curse } from "./magicalActions/Curse.js"
import { DominationRitual } from "./magicalActions/DominationRitual.js"
import { ElvenMagicalSong } from "./magicalActions/ElvenMagicalSong.js"
import { GeodeRitual } from "./magicalActions/GeodeRitual.js"
import { GoblinRitual } from "./magicalActions/GoblinRitual.js"
import { JesterTrick } from "./magicalActions/JesterTrick.js"
import { MagicalDance } from "./magicalActions/MagicalDance.js"
import { MagicalMelody } from "./magicalActions/MagicalMelody.js"
import { MagicalRune, MagicalRuneOption } from "./magicalActions/MagicalRune.js"
import { ZibiljaRitual } from "./magicalActions/ZibiljaRitual.js"
import { PactCategory, PactDomain, PactType } from "./PactCategory.js"
import { Patron } from "./Patron.js"
import { PatronCategory } from "./PatronCategory.js"
import { PersonalityTrait } from "./PersonalityTrait.js"
import {
  Profession,
  ProfessionPackage,
  ProfessionVariant,
  ProfessionVersion,
} from "./Profession.js"
import { Property } from "./Property.js"
import { Race, RaceVariant } from "./Race.js"
import { Ritual } from "./Ritual.js"
import { AlternativeRule } from "./rule/AlternativeRule.js"
import { PlayerType } from "./rule/AlternativeRule_PlayerType.js"
import { CoreRule } from "./rule/CoreRule.js"
import { FocusRule } from "./rule/FocusRule.js"
import { Subject } from "./rule/FocusRule_Subject.js"
import { OptionalRule } from "./rule/OptionalRule.js"
import { SexPractice } from "./SexPractice.js"
import { Skill, SkillApplication } from "./Skill.js"
import { SkillGroup } from "./SkillGroup.js"
import { SkillModificationLevel } from "./SkillModificationLevel.js"
import { SocialStatus } from "./SocialStatus.js"
import { Publication } from "./source/Publication.js"
import { AdvancedCombatSpecialAbility } from "./specialAbility/AdvancedCombatSpecialAbility.js"
import { AdvancedKarmaSpecialAbility } from "./specialAbility/AdvancedKarmaSpecialAbility.js"
import { AdvancedMagicalSpecialAbility } from "./specialAbility/AdvancedMagicalSpecialAbility.js"
import { AdvancedSkillSpecialAbility } from "./specialAbility/AdvancedSkillSpecialAbility.js"
import { AncestorGlyph } from "./specialAbility/AncestorGlyph.js"
import { BlessedTradition } from "./specialAbility/BlessedTradition.js"
import { BrawlingSpecialAbility } from "./specialAbility/BrawlingSpecialAbility.js"
import { CeremonialItemSpecialAbility } from "./specialAbility/CeremonialItemSpecialAbility.js"
import { CombatSpecialAbility } from "./specialAbility/CombatSpecialAbility.js"
import { CombatStyleSpecialAbility } from "./specialAbility/CombatStyleSpecialAbility.js"
import { CommandSpecialAbility } from "./specialAbility/CommandSpecialAbility.js"
import { FamiliarSpecialAbility } from "./specialAbility/FamiliarSpecialAbility.js"
import { FatePointSexSpecialAbility } from "./specialAbility/FatePointSexSpecialAbility.js"
import { FatePointSpecialAbility } from "./specialAbility/FatePointSpecialAbility.js"
import { GeneralSpecialAbility } from "./specialAbility/GeneralSpecialAbility.js"
import { KarmaSpecialAbility } from "./specialAbility/KarmaSpecialAbility.js"
import { LiturgicalStyleSpecialAbility } from "./specialAbility/LiturgicalStyleSpecialAbility.js"
import { LycantropicGift } from "./specialAbility/LycantropicGift.js"
import { MagicalSign } from "./specialAbility/MagicalSign.js"
import { MagicalSpecialAbility } from "./specialAbility/MagicalSpecialAbility.js"
import { MagicalTradition } from "./specialAbility/MagicalTradition.js"
import { MagicStyleSpecialAbility } from "./specialAbility/MagicStyleSpecialAbility.js"
import { PactGift } from "./specialAbility/PactGift.js"
import { ProtectiveWardingCircleSpecialAbility as PWCSpecialAbility } from "./specialAbility/ProtectiveWardingCircleSpecialAbility.js"
import { Sermon } from "./specialAbility/Sermon.js"
import { SexSpecialAbility } from "./specialAbility/SexSpecialAbility.js"
import { SikaryanDrainSpecialAbility } from "./specialAbility/SikaryanDrainSpecialAbility.js"
import { SkillStyleSpecialAbility } from "./specialAbility/SkillStyleSpecialAbility.js"
import { Language, LanguageSpecialization } from "./specialAbility/sub/Language.js"
import { Script } from "./specialAbility/sub/Script.js"
import { TradeSecret } from "./specialAbility/sub/TradeSecret.js"
import { VampiricGift } from "./specialAbility/VampiricGift.js"
import { Vision } from "./specialAbility/Vision.js"
import { Spell } from "./Spell.js"
import { State } from "./State.js"
import { TargetCategory } from "./TargetCategory.js"
import { ArcaneOrbEnchantment } from "./traditionArtifacts/ArcaneOrbEnchantment.js"
import { AttireEnchantment } from "./traditionArtifacts/AttireEnchantment.js"
import { Beutelzauber } from "./traditionArtifacts/Beutelzauber.js"
import { BowlEnchantment } from "./traditionArtifacts/BowlEnchantment.js"
import { CauldronEnchantment } from "./traditionArtifacts/CauldronEnchantment.js"
import { ChronicleEnchantment } from "./traditionArtifacts/ChronicleEnchantment.js"
import { DaggerRitual } from "./traditionArtifacts/DaggerRitual.js"
import { FoolsHatEnchantment } from "./traditionArtifacts/FoolsHatEnchantment.js"
import { Haubenzauber } from "./traditionArtifacts/Haubenzauber.js"
import { InstrumentEnchantment } from "./traditionArtifacts/InstrumentEnchantment.js"
import { Krallenkettenzauber } from "./traditionArtifacts/Krallenkettenzauber.js"
import { Kristallkugelzauber } from "./traditionArtifacts/Kristallkugelzauber.js"
import { OrbEnchantment } from "./traditionArtifacts/OrbEnchantment.js"
import { RingEnchantment } from "./traditionArtifacts/RingEnchantment.js"
import { SickleRitual } from "./traditionArtifacts/SickleRitual.js"
import { SpellSwordEnchantment } from "./traditionArtifacts/SpellSwordEnchantment.js"
import { StaffEnchantment } from "./traditionArtifacts/StaffEnchantment.js"
import { AnimalShape } from "./traditionArtifacts/sub/AnimalShape.js"
import { AnimalShapePath } from "./traditionArtifacts/sub/AnimalShapePath.js"
import { AnimalShapeSize } from "./traditionArtifacts/sub/AnimalShapeSize.js"
import { Brew } from "./traditionArtifacts/sub/Brew.js"
import { ToyEnchantment } from "./traditionArtifacts/ToyEnchantment.js"
import { Trinkhornzauber } from "./traditionArtifacts/Trinkhornzauber.js"
import { WandEnchantment } from "./traditionArtifacts/WandEnchantment.js"
import { WeaponEnchantment } from "./traditionArtifacts/WeaponEnchantment.js"

export const AdvancedCombatSpecialAbilityIdentifier: () => R = () => R(AdvancedCombatSpecialAbility)
export const AdvancedKarmaSpecialAbilityIdentifier: () => R = () => R(AdvancedKarmaSpecialAbility)
export const AdvancedMagicalSpecialAbilityIdentifier: () => R = () =>
  R(AdvancedMagicalSpecialAbility)
export const AdvancedSkillSpecialAbilityIdentifier: () => R = () => R(AdvancedSkillSpecialAbility)
export const AdvantageIdentifier: () => R = () => R(Advantage)
export const AlternativeRuleIdentifier: () => R = () => R(AlternativeRule)
export const AmmunitionIdentifier: () => R = () => R(Ammunition)
export const AncestorGlyphIdentifier: () => R = () => R(AncestorGlyph)
export const AnimalCareIdentifier: () => R = () => R(AnimalCare)
export const AnimalIdentifier: () => R = () => R(Animal)
export const AnimalShapeIdentifier: () => R = () => R(AnimalShape)
export const AnimalShapePathIdentifier: () => R = () => R(AnimalShapePath)
export const AnimalShapeSizeIdentifier: () => R = () => R(AnimalShapeSize)
export const AnimalTypeIdentifier: () => R = () => R(AnimalType)
export const AnimistPowerIdentifier: () => R = () => R(AnimistPower)
export const ArcaneBardTraditionIdentifier: () => R = () => R(ArcaneBardTradition)
export const ArcaneDancerTraditionIdentifier: () => R = () => R(ArcaneDancerTradition)
export const ArcaneOrbEnchantmentIdentifier: () => R = () => R(ArcaneOrbEnchantment)
export const ArmorIdentifier: () => R = () => R(Armor)
export const ArmorTypeIdentifier: () => R = () => R(ArmorType)
export const AspectIdentifier: () => R = () => R(Aspect)
export const AttireEnchantmentIdentifier: () => R = () => R(AttireEnchantment)
export const AttributeIdentifier: () => R = () => R(Attribute)
export const BandageOrRemedyIdentifier: () => R = () => R(BandageOrRemedy)
export const BannzeichenIdentifier: () => R = () => R(Bannzeichen)
export const BeutelzauberIdentifier: () => R = () => R(Beutelzauber)
export const BlessedTraditionIdentifier: () => R = () => R(BlessedTradition)
export const BlessingIdentifier: () => R = () => R(Blessing)
export const BookIdentifier: () => R = () => R(Book)
export const BowlEnchantmentIdentifier: () => R = () => R(BowlEnchantment)
export const BrawlingSpecialAbilityIdentifier: () => R = () => R(BrawlingSpecialAbility)
export const BrewIdentifier: () => R = () => R(Brew)
export const CantripIdentifier: () => R = () => R(Cantrip)
export const CauldronEnchantmentIdentifier: () => R = () => R(CauldronEnchantment)
export const CeremonialItemIdentifier: () => R = () => R(CeremonialItem)
export const CeremonialItemSpecialAbilityIdentifier: () => R = () => R(CeremonialItemSpecialAbility)
export const CeremonyIdentifier: () => R = () => R(Ceremony)
export const ChronicleEnchantmentIdentifier: () => R = () => R(ChronicleEnchantment)
export const CloseCombatTechniqueIdentifier: () => R = () => R(CloseCombatTechnique)
export const ClothesIdentifier: () => R = () => R(Clothes)
export const ClothingPackageIdentifier: () => R = () => R(ClothingPackage)
export const CombatSpecialAbilityIdentifier: () => R = () => R(CombatSpecialAbility)
export const CombatStyleSpecialAbilityIdentifier: () => R = () => R(CombatStyleSpecialAbility)
export const CommandSpecialAbilityIdentifier: () => R = () => R(CommandSpecialAbility)
export const ConditionIdentifier: () => R = () => R(Condition)
export const ContainerIdentifier: () => R = () => R(Container)
export const ContinentIdentifier: () => R = () => R(Continent)
export const CoreRuleIdentifier: () => R = () => R(CoreRule)
export const CultureIdentifier: () => R = () => R(Culture)
export const CurriculumIdentifier: () => R = () => R(Curriculum)
export const CurseIdentifier: () => R = () => R(Curse)
export const DaggerRitualIdentifier: () => R = () => R(DaggerRitual)
export const DerivedCharacteristicIdentifier: () => R = () => R(DerivedCharacteristic)
export const DisadvantageIdentifier: () => R = () => R(Disadvantage)
export const DiseaseIdentifier: () => R = () => R(Disease)
export const DominationRitualIdentifier: () => R = () => R(DominationRitual)
export const ElementIdentifier: () => R = () => R(Element)
export const ElixirIdentifier: () => R = () => R(Elixir)
export const ElvenMagicalSongIdentifier: () => R = () => R(ElvenMagicalSong)
export const EnhancementIdentifier: () => R = () => R(Enhancement)
export const EquipmentOfBlessedOnesIdentifier: () => R = () => R(EquipmentOfBlessedOnes)
export const ExperienceLevelIdentifier: () => R = () => R(ExperienceLevel)
export const EyeColorIdentifier: () => R = () => R(EyeColor)
export const FamiliarSpecialAbilityIdentifier: () => R = () => R(FamiliarSpecialAbility)
export const FatePointSexSpecialAbilityIdentifier: () => R = () => R(FatePointSexSpecialAbility)
export const FatePointSpecialAbilityIdentifier: () => R = () => R(FatePointSpecialAbility)
export const FocusRuleIdentifier: () => R = () => R(FocusRule)
export const FoolsHatEnchantmentIdentifier: () => R = () => R(FoolsHatEnchantment)
export const GemOrPreciousStoneIdentifier: () => R = () => R(GemOrPreciousStone)
export const GeneralSelectOptionIdentifier: () => R = () => R(GeneralSelectOption)
export { GeneralSelectOptionIdentifier as GeneralIdentifier }
export const GeneralSpecialAbilityIdentifier: () => R = () => R(GeneralSpecialAbility)
export const GeodeRitualIdentifier: () => R = () => R(GeodeRitual)
export const GoblinRitualIdentifier: () => R = () => R(GoblinRitual)
export const GuidelineIdentifier: () => R = () => R(Guideline)
export const HairColorIdentifier: () => R = () => R(HairColor)
export const HaubenzauberIdentifier: () => R = () => R(Haubenzauber)
export const IlluminationLightSourceIdentifier: () => R = () => R(IlluminationLightSource)
export const IlluminationRefillOrSupplyIdentifier: () => R = () => R(IlluminationRefillOrSupply)
export const InfluenceIdentifier: () => R = () => R(Influence)
export const InstrumentEnchantmentIdentifier: () => R = () => R(InstrumentEnchantment)
export const JesterTrickIdentifier: () => R = () => R(JesterTrick)
export const JewelryIdentifier: () => R = () => R(Jewelry)
export const KarmaSpecialAbilityIdentifier: () => R = () => R(KarmaSpecialAbility)
export const KrallenkettenzauberIdentifier: () => R = () => R(Krallenkettenzauber)
export const KristallkugelzauberIdentifier: () => R = () => R(Kristallkugelzauber)
export const LaboratoryIdentifier: () => R = () => R(Laboratory)
export const LanguageIdentifier: () => R = () => R(Language)
export const LanguageSpecializationIdentifier: () => R = () => R(LanguageSpecialization)
export const LessonPackageIdentifier: () => R = () => R(LessonPackage)
export const LiebesspielzeugIdentifier: () => R = () => R(Liebesspielzeug)
export const LiturgicalChantIdentifier: () => R = () => R(LiturgicalChant)
export const LiturgicalStyleSpecialAbilityIdentifier: () => R = () =>
  R(LiturgicalStyleSpecialAbility)
export const LuxuryGoodIdentifier: () => R = () => R(LuxuryGood)
export const LycantropicGiftIdentifier: () => R = () => R(LycantropicGift)
export const MagicalArtifactIdentifier: () => R = () => R(MagicalArtifact)
export const MagicalDanceIdentifier: () => R = () => R(MagicalDance)
export const MagicalMelodyIdentifier: () => R = () => R(MagicalMelody)
export const MagicalRuneIdentifier: () => R = () => R(MagicalRune)
export const MagicalRuneOptionIdentifier: () => R = () => R(MagicalRuneOption)
export const MagicalSignIdentifier: () => R = () => R(MagicalSign)
export const MagicalSpecialAbilityIdentifier: () => R = () => R(MagicalSpecialAbility)
export const MagicalTraditionIdentifier: () => R = () => R(MagicalTradition)
export const MagicStyleSpecialAbilityIdentifier: () => R = () => R(MagicStyleSpecialAbility)
export const MusicalInstrumentIdentifier: () => R = () => R(MusicalInstrument)
export const NewspaperIdentifier: () => R = () => R(Newspaper)
export const OptionalRuleIdentifier: () => R = () => R(OptionalRule)
export const OrbEnchantmentIdentifier: () => R = () => R(OrbEnchantment)
export const OrienteeringAidIdentifier: () => R = () => R(OrienteeringAid)
export const PactCategoryIdentifier: () => R = () => R(PactCategory)
export const PactDomainIdentifier: () => R = () => R(PactDomain)
export const PactGiftIdentifier: () => R = () => R(PactGift)
export const PactTypeIdentifier: () => R = () => R(PactType)
export const PatronCategoryIdentifier: () => R = () => R(PatronCategory)
export const PatronIdentifier: () => R = () => R(Patron)
export const PersonalityTraitIdentifier: () => R = () => R(PersonalityTrait)
export const PlantIdentifier: () => R = () => R(Plant)
export const PlantTypeIdentifier: () => R = () => R(PlantType)
export const PlayerTypeIdentifier: () => R = () => R(PlayerType)
export const PoisonIdentifier: () => R = () => R(Poison)
export const ProfessionIdentifier: () => R = () => R(Profession)
export const ProfessionPackageIdentifier: () => R = () => R(ProfessionPackage)
export const ProfessionVersionIdentifier: () => R = () => R(ProfessionVersion)
export const ProfessionVariantIdentifier: () => R = () => R(ProfessionVariant)
export const PropertyIdentifier: () => R = () => R(Property)
export const ProtectiveWardingCircleSpecialAbilityIdentifier: () => R = () => R(PWCSpecialAbility)
export const PublicationIdentifier: () => R = () => R(Publication)
export const RaceIdentifier: () => R = () => R(Race)
export const RaceVariantIdentifier: () => R = () => R(RaceVariant)
export const RangedCombatTechniqueIdentifier: () => R = () => R(RangedCombatTechnique)
export const ReachIdentifier: () => R = () => R(Reach)
export const RingEnchantmentIdentifier: () => R = () => R(RingEnchantment)
export const RitualIdentifier: () => R = () => R(Ritual)
export const RopeOrChainIdentifier: () => R = () => R(RopeOrChain)
export const ScriptIdentifier: () => R = () => R(Script)
export const SermonIdentifier: () => R = () => R(Sermon)
export const SexPracticeIdentifier: () => R = () => R(SexPractice)
export const SexSpecialAbilityIdentifier: () => R = () => R(SexSpecialAbility)
export const SickleRitualIdentifier: () => R = () => R(SickleRitual)
export const SikaryanDrainSpecialAbilityIdentifier: () => R = () => R(SikaryanDrainSpecialAbility)
export const SkillApplicationIdentifier: () => R = () => R(SkillApplication)
export const NewSkillApplicationIdentifier: () => R = () => R(NewSkillApplication)
export const SkillUseIdentifier: () => R = () => R(SkillUse)
export const SkillGroupIdentifier: () => R = () => R(SkillGroup)
export const SkillIdentifier: () => R = () => R(Skill)
export const SkillModificationLevelIdentifier: () => R = () => R(SkillModificationLevel)
export const SkillStyleSpecialAbilityIdentifier: () => R = () => R(SkillStyleSpecialAbility)
export const SocialStatusIdentifier: () => R = () => R(SocialStatus)
export const SpellIdentifier: () => R = () => R(Spell)
export const SpellSwordEnchantmentIdentifier: () => R = () => R(SpellSwordEnchantment)
export const StaffEnchantmentIdentifier: () => R = () => R(StaffEnchantment)
export const StateIdentifier: () => R = () => R(State)
export const StationeryIdentifier: () => R = () => R(Stationery)
export const SubjectIdentifier: () => R = () => R(Subject)
export const TargetCategoryIdentifier: () => R = () => R(TargetCategory)
export const ThievesToolIdentifier: () => R = () => R(ThievesTool)
export const ToolOfTheTradeIdentifier: () => R = () => R(ToolOfTheTrade)
export const ToyEnchantmentIdentifier: () => R = () => R(ToyEnchantment)
export const TradeSecretIdentifier: () => R = () => R(TradeSecret)
export const TravelGearOrToolIdentifier: () => R = () => R(TravelGearOrTool)
export const TribeIdentifier: () => R = () => R(Tribe)
export const TrinkhornzauberIdentifier: () => R = () => R(Trinkhornzauber)
export const VampiricGiftIdentifier: () => R = () => R(VampiricGift)
export const VehicleIdentifier: () => R = () => R(Vehicle)
export const VisionIdentifier: () => R = () => R(Vision)
export const WandEnchantmentIdentifier: () => R = () => R(WandEnchantment)
export const WeaponAccessoryIdentifier: () => R = () => R(WeaponAccessory)
export const WeaponEnchantmentIdentifier: () => R = () => R(WeaponEnchantment)
export const WeaponIdentifier: () => R = () => R(Weapon)
export const WorkingSupernaturalCreatureIdentifier: () => R = () => R(WorkingSupernaturalCreature)
export const ZibiljaRitualIdentifier: () => R = () => R(ZibiljaRitual)
