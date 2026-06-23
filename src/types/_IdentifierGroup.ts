import { sortObjectKeys } from "@elyukai/utils/object"
import * as DB from "tsondb/schema/dsl"
import {
  AdvancedCombatSpecialAbilityIdentifier,
  AdvancedKarmaSpecialAbilityIdentifier,
  AdvancedMagicalSpecialAbilityIdentifier,
  AdvancedSkillSpecialAbilityIdentifier,
  AdvantageIdentifier,
  AmmunitionIdentifier,
  AncestorGlyphIdentifier,
  AnimalCareIdentifier,
  AnimalIdentifier,
  AnimalShapeIdentifier,
  AnimalShapeSizeIdentifier,
  AnimistPowerIdentifier,
  ArcaneBardTraditionIdentifier,
  ArcaneDancerTraditionIdentifier,
  ArcaneOrbEnchantmentIdentifier,
  ArmorIdentifier,
  AspectIdentifier,
  AttireEnchantmentIdentifier,
  AttributeIdentifier,
  BandageOrRemedyIdentifier,
  BannzeichenIdentifier,
  BeutelzauberIdentifier,
  BlessedTraditionIdentifier,
  BlessingIdentifier,
  BookIdentifier,
  BowlEnchantmentIdentifier,
  BrawlingSpecialAbilityIdentifier,
  CantripIdentifier,
  CauldronEnchantmentIdentifier,
  CeremonialItemIdentifier,
  CeremonialItemSpecialAbilityIdentifier,
  CeremonyIdentifier,
  ChronicleEnchantmentIdentifier,
  CloseCombatTechniqueIdentifier,
  ClothesIdentifier,
  ClothingPackageIdentifier,
  CombatSpecialAbilityIdentifier,
  CombatStyleSpecialAbilityIdentifier,
  CommandSpecialAbilityIdentifier,
  ContainerIdentifier,
  CultureIdentifier,
  CurseIdentifier,
  DaggerRitualIdentifier,
  DisadvantageIdentifier,
  DiseaseIdentifier,
  DominationRitualIdentifier,
  ElementIdentifier,
  ElixirIdentifier,
  ElvenMagicalSongIdentifier,
  EnhancementIdentifier,
  EquipmentOfBlessedOnesIdentifier,
  FamiliarSpecialAbilityIdentifier,
  FatePointSexSpecialAbilityIdentifier,
  FatePointSpecialAbilityIdentifier,
  FocusRuleIdentifier,
  FoolsHatEnchantmentIdentifier,
  GemOrPreciousStoneIdentifier,
  GeneralIdentifier,
  GeneralSpecialAbilityIdentifier,
  GeodeRitualIdentifier,
  GoblinRitualIdentifier,
  HaubenzauberIdentifier,
  HauerkettenZauberIdentifier,
  IlluminationLightSourceIdentifier,
  IlluminationRefillOrSupplyIdentifier,
  InstrumentEnchantmentIdentifier,
  JesterTrickIdentifier,
  JewelryIdentifier,
  KarmaSpecialAbilityIdentifier,
  KeulenzauberIdentifier,
  KrallenkettenzauberIdentifier,
  KristallkugelzauberIdentifier,
  LaboratoryIdentifier,
  LanguageIdentifier,
  LiebesspielzeugIdentifier,
  LiturgicalChantIdentifier,
  LiturgicalStyleSpecialAbilityIdentifier,
  LuxuryGoodIdentifier,
  LycantropicGiftIdentifier,
  MagicalArtifactIdentifier,
  MagicalDanceIdentifier,
  MagicalMelodyIdentifier,
  MagicalRuneIdentifier,
  MagicalSignIdentifier,
  MagicalSpecialAbilityIdentifier,
  MagicalTraditionIdentifier,
  MagicStyleSpecialAbilityIdentifier,
  MusicalInstrumentIdentifier,
  NewspaperIdentifier,
  OptionalRuleIdentifier,
  OrbEnchantmentIdentifier,
  OrienteeringAidIdentifier,
  PactGiftIdentifier,
  PatronIdentifier,
  PoisonIdentifier,
  PropertyIdentifier,
  ProtectiveWardingCircleSpecialAbilityIdentifier,
  RaceIdentifier,
  RangedCombatTechniqueIdentifier,
  RingEnchantmentIdentifier,
  RitualIdentifier,
  RopeOrChainIdentifier,
  SchweinetrommelzauberIdentifier,
  ScriptIdentifier,
  SermonIdentifier,
  SexPracticeIdentifier,
  SexSpecialAbilityIdentifier,
  SickleRitualIdentifier,
  SikaryanDrainSpecialAbilityIdentifier,
  SkillApplicationIdentifier,
  SkillIdentifier,
  SkillStyleSpecialAbilityIdentifier,
  SpellIdentifier,
  SpellSwordEnchantmentIdentifier,
  StaffEnchantmentIdentifier,
  StationeryIdentifier,
  TargetCategoryIdentifier,
  ThievesToolIdentifier,
  ToolOfTheTradeIdentifier,
  ToyEnchantmentIdentifier,
  TradeSecretIdentifier,
  TravelGearOrToolIdentifier,
  TrinkhornzauberIdentifier,
  VampiricGiftIdentifier,
  VehicleIdentifier,
  VisionIdentifier,
  WandEnchantmentIdentifier,
  WeaponAccessoryIdentifier,
  WeaponEnchantmentIdentifier,
  WeaponIdentifier,
  WorkingSupernaturalCreatureIdentifier,
  ZibiljaRitualIdentifier,
} from "./_Identifier.js"

export const ActivatableIdentifier = DB.Enum(import.meta.url, {
  name: "ActivatableIdentifier",
  values: () => ({
    Advantage: DB.EnumCase({ type: AdvantageIdentifier() }),
    Disadvantage: DB.EnumCase({ type: DisadvantageIdentifier() }),
    Cantrip: DB.EnumCase({ type: CantripIdentifier() }),
    Blessing: DB.EnumCase({ type: BlessingIdentifier() }),
    ...SpecialAbilityIdentifier.type.value.values,
  }),
})

export const NewSkillApplicationOrUseParentIdentifier = DB.Enum(import.meta.url, {
  name: "NewSkillApplicationOrUseParentIdentifier",
  values: () => ({
    GeneralSelectOption: DB.EnumCase({ type: GeneralIdentifier() }),
    Advantage: DB.EnumCase({ type: AdvantageIdentifier() }),
    Disadvantage: DB.EnumCase({ type: DisadvantageIdentifier() }),
    AdvancedCombatSpecialAbility: DB.EnumCase({ type: AdvancedCombatSpecialAbilityIdentifier() }),
    AdvancedKarmaSpecialAbility: DB.EnumCase({ type: AdvancedKarmaSpecialAbilityIdentifier() }),
    AdvancedMagicalSpecialAbility: DB.EnumCase({ type: AdvancedMagicalSpecialAbilityIdentifier() }),
    AdvancedSkillSpecialAbility: DB.EnumCase({ type: AdvancedSkillSpecialAbilityIdentifier() }),
    BlessedTradition: DB.EnumCase({ type: BlessedTraditionIdentifier() }),
    CeremonialItemSpecialAbility: DB.EnumCase({ type: CeremonialItemSpecialAbilityIdentifier() }),
    CombatSpecialAbility: DB.EnumCase({ type: CombatSpecialAbilityIdentifier() }),
    CombatStyleSpecialAbility: DB.EnumCase({ type: CombatStyleSpecialAbilityIdentifier() }),
    FatePointSpecialAbility: DB.EnumCase({ type: FatePointSpecialAbilityIdentifier() }),
    GeneralSpecialAbility: DB.EnumCase({ type: GeneralSpecialAbilityIdentifier() }),
    LiturgicalStyleSpecialAbility: DB.EnumCase({ type: LiturgicalStyleSpecialAbilityIdentifier() }),
    MagicalSpecialAbility: DB.EnumCase({ type: MagicalSpecialAbilityIdentifier() }),
    MagicalTradition: DB.EnumCase({ type: MagicalTraditionIdentifier() }),
    MagicStyleSpecialAbility: DB.EnumCase({ type: MagicStyleSpecialAbilityIdentifier() }),
    SexSpecialAbility: DB.EnumCase({ type: SexSpecialAbilityIdentifier() }),
  }),
})

export const TraditionArtifactEnchantmentIdentifier = DB.Enum(import.meta.url, {
  name: "TraditionArtifactEnchantmentIdentifier",
  values: () => ({
    ArcaneOrbEnchantment: DB.EnumCase({ type: ArcaneOrbEnchantmentIdentifier() }),
    AttireEnchantment: DB.EnumCase({ type: AttireEnchantmentIdentifier() }),
    Beutelzauber: DB.EnumCase({ type: BeutelzauberIdentifier() }),
    BowlEnchantment: DB.EnumCase({ type: BowlEnchantmentIdentifier() }),
    CauldronEnchantment: DB.EnumCase({ type: CauldronEnchantmentIdentifier() }),
    DaggerRitual: DB.EnumCase({ type: DaggerRitualIdentifier() }),
    FoolsHatEnchantment: DB.EnumCase({ type: FoolsHatEnchantmentIdentifier() }),
    Haubenzauber: DB.EnumCase({ type: HaubenzauberIdentifier() }),
    Hauerkettenzauber: DB.EnumCase({ type: HauerkettenZauberIdentifier() }),
    InstrumentEnchantment: DB.EnumCase({ type: InstrumentEnchantmentIdentifier() }),
    Keulenzauber: DB.EnumCase({ type: KeulenzauberIdentifier() }),
    Krallenkettenzauber: DB.EnumCase({ type: KrallenkettenzauberIdentifier() }),
    Kristallkugelzauber: DB.EnumCase({ type: KristallkugelzauberIdentifier() }),
    OrbEnchantment: DB.EnumCase({ type: OrbEnchantmentIdentifier() }),
    RingEnchantment: DB.EnumCase({ type: RingEnchantmentIdentifier() }),
    Schweinetrommelzauber: DB.EnumCase({ type: SchweinetrommelzauberIdentifier() }),
    SickleRitual: DB.EnumCase({ type: SickleRitualIdentifier() }),
    SpellSwordEnchantment: DB.EnumCase({ type: SpellSwordEnchantmentIdentifier() }),
    StaffEnchantment: DB.EnumCase({ type: StaffEnchantmentIdentifier() }),
    ToyEnchantment: DB.EnumCase({ type: ToyEnchantmentIdentifier() }),
    Trinkhornzauber: DB.EnumCase({ type: TrinkhornzauberIdentifier() }),
    WandEnchantment: DB.EnumCase({ type: WandEnchantmentIdentifier() }),
    WeaponEnchantment: DB.EnumCase({ type: WeaponEnchantmentIdentifier() }),
  }),
})

export const SpecialAbilityIdentifier = DB.Enum(import.meta.url, {
  name: "SpecialAbilityIdentifier",
  values: () =>
    sortObjectKeys({
      AdvancedCombatSpecialAbility: DB.EnumCase({ type: AdvancedCombatSpecialAbilityIdentifier() }),
      AdvancedKarmaSpecialAbility: DB.EnumCase({ type: AdvancedKarmaSpecialAbilityIdentifier() }),
      AdvancedMagicalSpecialAbility: DB.EnumCase({
        type: AdvancedMagicalSpecialAbilityIdentifier(),
      }),
      AdvancedSkillSpecialAbility: DB.EnumCase({ type: AdvancedSkillSpecialAbilityIdentifier() }),
      AncestorGlyph: DB.EnumCase({ type: AncestorGlyphIdentifier() }),
      BlessedTradition: DB.EnumCase({ type: BlessedTraditionIdentifier() }),
      BrawlingSpecialAbility: DB.EnumCase({ type: BrawlingSpecialAbilityIdentifier() }),
      CeremonialItemSpecialAbility: DB.EnumCase({ type: CeremonialItemSpecialAbilityIdentifier() }),
      ChronicleEnchantment: DB.EnumCase({ type: ChronicleEnchantmentIdentifier() }),
      CombatSpecialAbility: DB.EnumCase({ type: CombatSpecialAbilityIdentifier() }),
      CombatStyleSpecialAbility: DB.EnumCase({ type: CombatStyleSpecialAbilityIdentifier() }),
      CommandSpecialAbility: DB.EnumCase({ type: CommandSpecialAbilityIdentifier() }),
      FamiliarSpecialAbility: DB.EnumCase({ type: FamiliarSpecialAbilityIdentifier() }),
      FatePointSexSpecialAbility: DB.EnumCase({ type: FatePointSexSpecialAbilityIdentifier() }),
      FatePointSpecialAbility: DB.EnumCase({ type: FatePointSpecialAbilityIdentifier() }),
      GeneralSpecialAbility: DB.EnumCase({ type: GeneralSpecialAbilityIdentifier() }),
      KarmaSpecialAbility: DB.EnumCase({ type: KarmaSpecialAbilityIdentifier() }),
      LiturgicalStyleSpecialAbility: DB.EnumCase({
        type: LiturgicalStyleSpecialAbilityIdentifier(),
      }),
      LycantropicGift: DB.EnumCase({ type: LycantropicGiftIdentifier() }),
      MagicalSign: DB.EnumCase({ type: MagicalSignIdentifier() }),
      MagicalSpecialAbility: DB.EnumCase({ type: MagicalSpecialAbilityIdentifier() }),
      MagicalTradition: DB.EnumCase({ type: MagicalTraditionIdentifier() }),
      MagicStyleSpecialAbility: DB.EnumCase({ type: MagicStyleSpecialAbilityIdentifier() }),
      PactGift: DB.EnumCase({ type: PactGiftIdentifier() }),
      ProtectiveWardingCircleSpecialAbility: DB.EnumCase({
        type: ProtectiveWardingCircleSpecialAbilityIdentifier(),
      }),
      Sermon: DB.EnumCase({ type: SermonIdentifier() }),
      SexSpecialAbility: DB.EnumCase({ type: SexSpecialAbilityIdentifier() }),
      SikaryanDrainSpecialAbility: DB.EnumCase({ type: SikaryanDrainSpecialAbilityIdentifier() }),
      SkillStyleSpecialAbility: DB.EnumCase({ type: SkillStyleSpecialAbilityIdentifier() }),
      VampiricGift: DB.EnumCase({ type: VampiricGiftIdentifier() }),
      Vision: DB.EnumCase({ type: VisionIdentifier() }),
      ...TraditionArtifactEnchantmentIdentifier.type.value.values,
    }),
})

export const CombatRelatedSpecialAbilityIdentifier = DB.Enum(import.meta.url, {
  name: "CombatRelatedSpecialAbilityIdentifier",
  values: () => ({
    CombatSpecialAbility: DB.EnumCase({ type: CombatSpecialAbilityIdentifier() }),
    CombatStyleSpecialAbility: DB.EnumCase({ type: CombatStyleSpecialAbilityIdentifier() }),
    AdvancedCombatSpecialAbility: DB.EnumCase({ type: AdvancedCombatSpecialAbilityIdentifier() }),
    CommandSpecialAbility: DB.EnumCase({ type: CommandSpecialAbilityIdentifier() }),
  }),
})

export const ProfessionSpecialAbilityIdentifier = DB.Enum(import.meta.url, {
  name: "ProfessionSpecialAbilityIdentifier",
  values: () => ({
    ...SpecialAbilityIdentifier.type.value.values,
    Enhancement: DB.EnumCase({ type: EnhancementIdentifier() }),
  }),
})

export const TraditionIdentifier = DB.Enum(import.meta.url, {
  name: "TraditionIdentifier",
  values: () => ({
    MagicalTradition: DB.EnumCase({ type: MagicalTraditionIdentifier() }),
    BlessedTradition: DB.EnumCase({ type: BlessedTraditionIdentifier() }),
  }),
})

export const RatedIdentifier = DB.Enum(import.meta.url, {
  name: "RatedIdentifier",
  values: () => ({
    Attribute: DB.EnumCase({ type: AttributeIdentifier() }),
    Skill: DB.EnumCase({ type: SkillIdentifier() }),
    CloseCombatTechnique: DB.EnumCase({ type: CloseCombatTechniqueIdentifier() }),
    RangedCombatTechnique: DB.EnumCase({ type: RangedCombatTechniqueIdentifier() }),
    Spell: DB.EnumCase({ type: SpellIdentifier() }),
    Ritual: DB.EnumCase({ type: RitualIdentifier() }),
    LiturgicalChant: DB.EnumCase({ type: LiturgicalChantIdentifier() }),
    Ceremony: DB.EnumCase({ type: CeremonyIdentifier() }),
  }),
})

export const SkillishIdentifier = DB.Enum(import.meta.url, {
  name: "SkillishIdentifier",
  values: () => ({
    Skill: DB.EnumCase({ type: SkillIdentifier() }),
    Spell: DB.EnumCase({ type: SpellIdentifier() }),
    Ritual: DB.EnumCase({ type: RitualIdentifier() }),
    LiturgicalChant: DB.EnumCase({ type: LiturgicalChantIdentifier() }),
    Ceremony: DB.EnumCase({ type: CeremonyIdentifier() }),
  }),
})

export const AdvancedSpecialAbilityRestrictedOptionIdentifier = DB.Enum(import.meta.url, {
  name: "AdvancedSpecialAbilityRestrictedOptionIdentifier",
  values: () => ({
    General: DB.EnumCase({ type: GeneralIdentifier() }),
    Skill: DB.EnumCase({ type: SkillIdentifier() }),
    CloseCombatTechnique: DB.EnumCase({ type: CloseCombatTechniqueIdentifier() }),
    RangedCombatTechnique: DB.EnumCase({ type: RangedCombatTechniqueIdentifier() }),
    Element: DB.EnumCase({ type: ElementIdentifier() }),
    Aspect: DB.EnumCase({ type: AspectIdentifier() }),
  }),
})

export const VolumePointsOptionReferenceIdentifier = DB.Enum(import.meta.url, {
  name: "VolumePointsOptionReferenceIdentifier",
  values: () => ({
    General: DB.EnumCase({ type: GeneralIdentifier() }),
    AnimalShapeSize: DB.EnumCase({ type: AnimalShapeSizeIdentifier() }),
  }),
})

export const CombatTechniqueIdentifier = DB.Enum(import.meta.url, {
  name: "CombatTechniqueIdentifier",
  values: () => ({
    CloseCombatTechnique: DB.EnumCase({ type: CloseCombatTechniqueIdentifier() }),
    RangedCombatTechnique: DB.EnumCase({ type: RangedCombatTechniqueIdentifier() }),
  }),
})

export const ExtensionRuleIdentifier = DB.Enum(import.meta.url, {
  name: "ExtensionRuleIdentifier",
  values: () => ({
    FocusRule: DB.EnumCase({ type: FocusRuleIdentifier() }),
    OptionalRule: DB.EnumCase({ type: OptionalRuleIdentifier() }),
  }),
})

export const SkillWithEnhancementsIdentifier = DB.Enum(import.meta.url, {
  name: "SkillWithEnhancementsIdentifier",
  values: () => ({
    Spell: DB.EnumCase({ type: SpellIdentifier() }),
    Ritual: DB.EnumCase({ type: RitualIdentifier() }),
    LiturgicalChant: DB.EnumCase({ type: LiturgicalChantIdentifier() }),
    Ceremony: DB.EnumCase({ type: CeremonyIdentifier() }),
  }),
})

export const SpellworkIdentifier = DB.Enum(import.meta.url, {
  name: "SpellworkIdentifier",
  values: () => ({
    Spell: DB.EnumCase({ type: SpellIdentifier() }),
    Ritual: DB.EnumCase({ type: RitualIdentifier() }),
  }),
})

export const LiturgyIdentifier = DB.Enum(import.meta.url, {
  name: "LiturgyIdentifier",
  values: () => ({
    LiturgicalChant: DB.EnumCase({ type: LiturgicalChantIdentifier() }),
    Ceremony: DB.EnumCase({ type: CeremonyIdentifier() }),
  }),
})

export const MagicalActionIdentifier = DB.Enum(import.meta.url, {
  name: "MagicalActionIdentifier",
  values: () => ({
    Bannzeichen: DB.EnumCase({ type: BannzeichenIdentifier() }),
    Curse: DB.EnumCase({ type: CurseIdentifier() }),
    ElvenMagicalSong: DB.EnumCase({ type: ElvenMagicalSongIdentifier() }),
    DominationRitual: DB.EnumCase({ type: DominationRitualIdentifier() }),
    MagicalMelody: DB.EnumCase({ type: MagicalMelodyIdentifier() }),
    MagicalDance: DB.EnumCase({ type: MagicalDanceIdentifier() }),
    JesterTrick: DB.EnumCase({ type: JesterTrickIdentifier() }),
    AnimistPower: DB.EnumCase({ type: AnimistPowerIdentifier() }),
    GeodeRitual: DB.EnumCase({ type: GeodeRitualIdentifier() }),
    GoblinRitual: DB.EnumCase({ type: GoblinRitualIdentifier() }),
    ZibiljaRitual: DB.EnumCase({ type: ZibiljaRitualIdentifier() }),
    MagicalRune: DB.EnumCase({ type: MagicalRuneIdentifier() }),
  }),
})

export const SelectOptionIdentifier = DB.Enum(import.meta.url, {
  name: "SelectOptionIdentifier",
  values: () => ({
    General: DB.EnumCase({ type: GeneralIdentifier() }),
    Blessing: DB.EnumCase({ type: BlessingIdentifier() }),
    Cantrip: DB.EnumCase({ type: CantripIdentifier() }),
    TradeSecret: DB.EnumCase({ type: TradeSecretIdentifier() }),
    Script: DB.EnumCase({ type: ScriptIdentifier() }),
    AnimalShape: DB.EnumCase({ type: AnimalShapeIdentifier() }),
    ArcaneBardTradition: DB.EnumCase({ type: ArcaneBardTraditionIdentifier() }),
    ArcaneDancerTradition: DB.EnumCase({ type: ArcaneDancerTraditionIdentifier() }),
    SexPractice: DB.EnumCase({ type: SexPracticeIdentifier() }),
    Race: DB.EnumCase({ type: RaceIdentifier() }),
    Culture: DB.EnumCase({ type: CultureIdentifier() }),
    BlessedTradition: DB.EnumCase({ type: BlessedTraditionIdentifier() }),
    Element: DB.EnumCase({ type: ElementIdentifier() }),
    Property: DB.EnumCase({ type: PropertyIdentifier() }),
    Aspect: DB.EnumCase({ type: AspectIdentifier() }),
    Disease: DB.EnumCase({ type: DiseaseIdentifier() }),
    Poison: DB.EnumCase({ type: PoisonIdentifier() }),
    Language: DB.EnumCase({ type: LanguageIdentifier() }),
    Skill: DB.EnumCase({ type: SkillIdentifier() }),
    SkillApplication: DB.EnumCase({ type: SkillApplicationIdentifier() }),
    CloseCombatTechnique: DB.EnumCase({ type: CloseCombatTechniqueIdentifier() }),
    RangedCombatTechnique: DB.EnumCase({ type: RangedCombatTechniqueIdentifier() }),
    LiturgicalChant: DB.EnumCase({ type: LiturgicalChantIdentifier() }),
    Ceremony: DB.EnumCase({ type: CeremonyIdentifier() }),
    Spell: DB.EnumCase({ type: SpellIdentifier() }),
    Ritual: DB.EnumCase({ type: RitualIdentifier() }),
    TargetCategory: DB.EnumCase({ type: TargetCategoryIdentifier() }),
    Patron: DB.EnumCase({ type: PatronIdentifier() }),
  }),
})

export const SelectOptionParentIdentifier = DB.Enum(import.meta.url, {
  name: "SelectOptionParentIdentifier",
  values: () => ({
    ...ActivatableIdentifier.type.value.values,
    TradeSecret: DB.EnumCase({ type: TradeSecretIdentifier() }),
  }),
})

export const RequirableSelectOptionIdentifier = DB.Enum(import.meta.url, {
  name: "RequirableSelectOptionIdentifier",
  values: () => ({
    General: DB.EnumCase({ type: GeneralIdentifier() }),
    Race: DB.EnumCase({ type: RaceIdentifier() }),
    Skill: DB.EnumCase({ type: SkillIdentifier() }),
    SkillApplication: DB.EnumCase({ type: SkillApplicationIdentifier() }),
    CloseCombatTechnique: DB.EnumCase({ type: CloseCombatTechniqueIdentifier() }),
    RangedCombatTechnique: DB.EnumCase({ type: RangedCombatTechniqueIdentifier() }),
    Property: DB.EnumCase({ type: PropertyIdentifier() }),
    Aspect: DB.EnumCase({ type: AspectIdentifier() }),
    Disease: DB.EnumCase({ type: DiseaseIdentifier() }),
    Poison: DB.EnumCase({ type: PoisonIdentifier() }),
    Language: DB.EnumCase({ type: LanguageIdentifier() }),
    AnimalShape: DB.EnumCase({ type: AnimalShapeIdentifier() }),
    LiturgicalChant: DB.EnumCase({ type: LiturgicalChantIdentifier() }),
    Ceremony: DB.EnumCase({ type: CeremonyIdentifier() }),
    Spell: DB.EnumCase({ type: SpellIdentifier() }),
    Ritual: DB.EnumCase({ type: RitualIdentifier() }),
    TradeSecret: DB.EnumCase({ type: TradeSecretIdentifier() }),
    ArcaneBardTradition: DB.EnumCase({ type: ArcaneBardTraditionIdentifier() }),
    ArcaneDancerTradition: DB.EnumCase({ type: ArcaneDancerTraditionIdentifier() }),
    Element: DB.EnumCase({ type: ElementIdentifier() }),
  }),
})

export const CoreRuleDerivableContentIdentifier = DB.Enum(import.meta.url, {
  name: "CoreRuleDerivableContentIdentifier",
  values: () => ({
    MagicalTradition: DB.EnumCase({ type: MagicalTraditionIdentifier() }),
    FamiliarSpecialAbility: DB.EnumCase({ type: FamiliarSpecialAbilityIdentifier() }),
    MagicalSpecialAbility: DB.EnumCase({ type: MagicalSpecialAbilityIdentifier() }),
    BlessedTradition: DB.EnumCase({ type: BlessedTraditionIdentifier() }),
  }),
})

export const EquipmentIdentifier = DB.Enum(import.meta.url, {
  name: "EquipmentIdentifier",
  values: () => ({
    Ammunition: DB.EnumCase({ type: AmmunitionIdentifier() }),
    Animal: DB.EnumCase({ type: AnimalIdentifier() }),
    AnimalCare: DB.EnumCase({ type: AnimalCareIdentifier() }),
    Armor: DB.EnumCase({ type: ArmorIdentifier() }),
    BandageOrRemedy: DB.EnumCase({ type: BandageOrRemedyIdentifier() }),
    Book: DB.EnumCase({ type: BookIdentifier() }),
    CeremonialItem: DB.EnumCase({ type: CeremonialItemIdentifier() }),
    Clothes: DB.EnumCase({ type: ClothesIdentifier() }),
    ClothingPackage: DB.EnumCase({ type: ClothingPackageIdentifier() }),
    Container: DB.EnumCase({ type: ContainerIdentifier() }),
    Elixir: DB.EnumCase({ type: ElixirIdentifier() }),
    EquipmentOfBlessedOnes: DB.EnumCase({ type: EquipmentOfBlessedOnesIdentifier() }),
    GemOrPreciousStone: DB.EnumCase({ type: GemOrPreciousStoneIdentifier() }),
    IlluminationLightSource: DB.EnumCase({ type: IlluminationLightSourceIdentifier() }),
    IlluminationRefillOrSupply: DB.EnumCase({ type: IlluminationRefillOrSupplyIdentifier() }),
    Jewelry: DB.EnumCase({ type: JewelryIdentifier() }),
    Laboratory: DB.EnumCase({ type: LaboratoryIdentifier() }),
    Liebesspielzeug: DB.EnumCase({ type: LiebesspielzeugIdentifier() }),
    LuxuryGood: DB.EnumCase({ type: LuxuryGoodIdentifier() }),
    MagicalArtifact: DB.EnumCase({ type: MagicalArtifactIdentifier() }),
    MusicalInstrument: DB.EnumCase({ type: MusicalInstrumentIdentifier() }),
    Newspaper: DB.EnumCase({ type: NewspaperIdentifier() }),
    OrienteeringAid: DB.EnumCase({ type: OrienteeringAidIdentifier() }),
    Poison: DB.EnumCase({ type: PoisonIdentifier() }),
    RopeOrChain: DB.EnumCase({ type: RopeOrChainIdentifier() }),
    Stationery: DB.EnumCase({ type: StationeryIdentifier() }),
    ThievesTool: DB.EnumCase({ type: ThievesToolIdentifier() }),
    ToolOfTheTrade: DB.EnumCase({ type: ToolOfTheTradeIdentifier() }),
    TravelGearOrTool: DB.EnumCase({ type: TravelGearOrToolIdentifier() }),
    Vehicle: DB.EnumCase({ type: VehicleIdentifier() }),
    Weapon: DB.EnumCase({ type: WeaponIdentifier() }),
    WeaponAccessory: DB.EnumCase({ type: WeaponAccessoryIdentifier() }),
    WorkingSupernaturalCreature: DB.EnumCase({ type: WorkingSupernaturalCreatureIdentifier() }),
  }),
})

export const AmmunitionishIdentifier = DB.Enum(import.meta.url, {
  name: "AmmunitionishIdentifier",
  values: () => ({
    Ammunition: DB.EnumCase({ type: AmmunitionIdentifier() }),
    Weapon: DB.EnumCase({ type: WeaponIdentifier() }),
  }),
})

export const AdvancedSkillStyleSpecialAbilityIdentifier = DB.Enum(import.meta.url, {
  name: "AdvancedSkillStyleSpecialAbilityIdentifier",
  values: () => ({
    AdvancedCombatSpecialAbility: DB.EnumCase({ type: AdvancedCombatSpecialAbilityIdentifier() }),
    AdvancedSkillSpecialAbility: DB.EnumCase({ type: AdvancedSkillSpecialAbilityIdentifier() }),
  }),
})
