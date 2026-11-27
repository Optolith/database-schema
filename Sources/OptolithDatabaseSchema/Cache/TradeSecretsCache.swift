//
//  TradeSecretsCache.swift
//  OptolithDatabaseSchema
//
//  Created by Lukas Obermann on 21.11.26.
//

import Foundation

public enum ResolvedTradeSecretIdentifier: Hashable, Equatable, Sendable {
    case ammunition(Ammunition.ID)
    case animal(Animal.ID)
    case animalCare(AnimalCare.ID)
    case armor(Armor.ID)
    case armorAccessory(ArmorAccessory.ID)
    case bandageOrRemedy(BandageOrRemedy.ID)
    case book(Book.ID)
    case ceremonialItem(CeremonialItem.ID)
    case clothes(Clothes.ID)
    case clothingPackage(ClothingPackage.ID)
    case container(Container.ID)
    case elixir(Elixir.ID)
    case equipmentOfBlessedOnes(EquipmentOfBlessedOnes.ID)
    case gemOrPreciousStone(GemOrPreciousStone.ID)
    case illuminationLightSource(IlluminationLightSource.ID)
    case illuminationRefillOrSupply(IlluminationRefillOrSupply.ID)
    case itemComponent(ItemComponent.ID)
    case jewelry(Jewelry.ID)
    case laboratory(Laboratory.ID)
    case liebesspielzeug(Liebesspielzeug.ID)
    case luxuryGood(LuxuryGood.ID)
    case magicalArtifact(MagicalArtifact.ID)
    case musicalInstrument(MusicalInstrument.ID)
    case newspaper(Newspaper.ID)
    case orienteeringAid(OrienteeringAid.ID)
    case poison(Poison.ID)
    case ropeOrChain(RopeOrChain.ID)
    case stationery(Stationery.ID)
    case thievesTool(ThievesTool.ID)
    case toolOfTheTrade(ToolOfTheTrade.ID)
    case travelGearOrTool(TravelGearOrTool.ID)
    case vehicle(Vehicle.ID)
    case weapon(Weapon.ID)
    case weaponAccessory(WeaponAccessory.ID)
    case workingSupernaturalCreature(WorkingSupernaturalCreature.ID)
    case specialAmmunition(SpecialAmmunition.ID)
    case disease(Disease.ID)
    case herbalAid(HerbalAid.ID)
    case talisman(Talisman.ID)
    case tradeSecret(TradeSecret.ID)
}

public struct ResolvedTradeSecret: Identifiable, Equatable, Sendable {
    public let id: ResolvedTradeSecretIdentifier

    /// Definitions for possible options for the activatable entry.
    public let selectOptions: TradeSecretSelectOptions?

    /// The trade secret’s adventure point value
    public let apValue: TradeSecretAdventurePointsValue

    /// Is this trade secret considered secret knowledge?
    public let isSecretKnowledge: Bool

    public let prerequisites: PlainGeneralPrerequisites?

    /// References to where in which publications this entry has been defined. Entries may also be added or removed in later printings.
    public let src: PublicationRefs

    /// All translations for the entry, identified by IETF language tag (BCP47).
    public let translations: LocaleMap<TradeSecretTranslation>

    init(
        id: ResolvedTradeSecretIdentifier,
        selectOptions: TradeSecretSelectOptions? = nil,
        apValue: TradeSecretAdventurePointsValue,
        isSecretKnowledge: Bool = false,
        prerequisites: PlainGeneralPrerequisites? = nil,
        src: PublicationRefs,
        translations: LocaleMap<TradeSecretTranslation>
    ) {
        self.id = id
        self.selectOptions = selectOptions
        self.apValue = apValue
        self.isSecretKnowledge = isSecretKnowledge
        self.prerequisites = prerequisites
        self.src = src
        self.translations = translations
    }
}

extension TradeSecret {
    public func asResolved() -> ResolvedTradeSecret {
        .init(
            id: .tradeSecret(id),
            selectOptions: selectOptions,
            apValue: apValue,
            isSecretKnowledge: isSecretKnowledge,
            prerequisites: prerequisites,
            src: src,
            translations: translations
        )
    }
}

func getExplicitTradeSecrets(database: Database) -> [TradeSecret.ID: ResolvedTradeSecret] {
    Dictionary(
        uniqueKeysWithValues: database.getAllInstances(of: TradeSecret.self).map {
            ($0.id, $0.asResolved())
        })
}

private func simplePrerequisiteFromId(id: SpecialAbilityIdentifier) -> PlainGeneralPrerequisites {
    [.single(.activatable(.init(id: id.asActivatableIdentifier(), active: true)))]
}

func getTradeSecretsForEquipmentEntity<T: Equipment & NameableTranslatable, ID: Hashable>(
    database: Database, settings: Settings, entity: T.Type, createId: (UUID) -> ID,
    createResolvedId: (ID) -> ResolvedTradeSecretIdentifier
) -> [ID: ResolvedTradeSecret] {
    Dictionary(
        uniqueKeysWithValues: database.getAllInstances(of: entity).compactMap {
            item -> (ID, ResolvedTradeSecret)? in
            guard let tradeSecretFromComplexity = item.deriveTradeSecret(settings) else {
                return nil
            }
            let equipmentIdentifier = createId(item.id)

            let prerequisites: PlainGeneralPrerequisites? =
                if item is Weapon {
                    simplePrerequisiteFromId(
                        id: settings.derivedTradeSecrets.requiredSpecialAbilityForWeapons)
                } else if item is Ammunition {
                    simplePrerequisiteFromId(
                        id: settings.derivedTradeSecrets.requiredSpecialAbilityForAmmunition)
                } else if item is Armor {
                    simplePrerequisiteFromId(
                        id: settings.derivedTradeSecrets.requiredSpecialAbilityForArmor)
                } else {
                    tradeSecretFromComplexity.prerequisites
                }

            return (
                equipmentIdentifier,
                ResolvedTradeSecret(
                    id: createResolvedId(equipmentIdentifier),
                    apValue: .fixed(tradeSecretFromComplexity.apValue),
                    prerequisites: prerequisites,
                    src: tradeSecretFromComplexity.src ?? item.src,
                    translations: item.translations.map {
                        TradeSecretTranslation(name: $0.value.name)
                    }
                )
            )
        })
}

func getTradeSecretsForEquipment(database: Database, settings: Settings) -> [EquipmentIdentifier:
    ResolvedTradeSecret]
{
    EquipmentIdentifier.allEntities.reduce(into: [EquipmentIdentifier: ResolvedTradeSecret]()) {
        partialResult, pair in
        let (entity, createId) = pair
        if let entity = entity as? any (Equipment & NameableTranslatable).Type {
            partialResult.merge(
                getTradeSecretsForEquipmentEntity(
                    database: database,
                    settings: settings,
                    entity: entity,
                    createId: createId,
                    createResolvedId: { $0.asResolvedTradeSecretIdentifier() }
                ),
                uniquingKeysWith: { _, new in new }
            )
        }
    }
}

extension SpecialAmmunition: EquipmentWithComplexity {}

func getTradeSecretsForSpecialAmmunition(database: Database, settings: Settings)
    -> [SpecialAmmunition.ID: ResolvedTradeSecret]
{
    getTradeSecretsForEquipmentEntity(
        database: database,
        settings: settings,
        entity: SpecialAmmunition.self,
        createId: { $0 },
        createResolvedId: ResolvedTradeSecret.ID.specialAmmunition
    )
}

public protocol SimpleTradeSecretDerivable: ReferencingPublications, NameableTranslatable, Entity,
    TradeSecretDerivable
{
    func getResolvedTradeSecretIdentifier() -> ResolvedTradeSecret.ID
}

extension SimpleTradeSecretDerivable {
    func asResolvedTradeSecret(_ settings: Settings) -> ResolvedTradeSecret? {
        if let config = deriveTradeSecret(settings) {
            .init(
                id: getResolvedTradeSecretIdentifier(),
                apValue: .fixed(config.apValue),
                prerequisites: config.prerequisites,
                src: config.src ?? src,
                translations: translations.map { TradeSecretTranslation(name: $0.value.name) }
            )
        } else {
            nil
        }
    }

    static func getTradeSecretsForSimpleTradeSecretDerivable<T: SimpleTradeSecretDerivable>(
        of type: T.Type, database: Database, settings: Settings
    ) -> [T.ID: ResolvedTradeSecret] {
        let list = database.getAllInstances(of: type)
            .compactMap { disease -> (T.ID, ResolvedTradeSecret)? in
                if let tradeSecret = disease.asResolvedTradeSecret(settings) {
                    (disease.id, tradeSecret)
                } else {
                    nil
                }
            }

        return Dictionary(uniqueKeysWithValues: list)
    }
}

extension Disease: SimpleTradeSecretDerivable {
    public func getResolvedTradeSecretIdentifier() -> ResolvedTradeSecret.ID {
        .disease(id)
    }

    static func getTradeSecrets(database: Database, settings: Settings) -> [Self.ID:
        ResolvedTradeSecret]
    {
        return getTradeSecretsForSimpleTradeSecretDerivable(
            of: Self.self, database: database, settings: settings)
    }
}

extension Elixir: SimpleTradeSecretDerivable {
    public func getResolvedTradeSecretIdentifier() -> ResolvedTradeSecret.ID {
        .elixir(id)
    }

    static func getTradeSecrets(database: Database, settings: Settings) -> [Self.ID:
        ResolvedTradeSecret]
    {
        return getTradeSecretsForSimpleTradeSecretDerivable(
            of: Self.self, database: database, settings: settings)
    }
}

extension HerbalAid: SimpleTradeSecretDerivable {
    public func getResolvedTradeSecretIdentifier() -> ResolvedTradeSecret.ID {
        .herbalAid(id)
    }

    static func getTradeSecrets(database: Database, settings: Settings) -> [Self.ID:
        ResolvedTradeSecret]
    {
        return getTradeSecretsForSimpleTradeSecretDerivable(
            of: Self.self, database: database, settings: settings)
    }
}

extension Poison: SimpleTradeSecretDerivable {
    public func getResolvedTradeSecretIdentifier() -> ResolvedTradeSecret.ID {
        .poison(id)
    }

    static func getTradeSecrets(database: Database, settings: Settings) -> [Self.ID:
        ResolvedTradeSecret]
    {
        return getTradeSecretsForSimpleTradeSecretDerivable(
            of: Self.self, database: database, settings: settings)
    }
}

extension Talisman: SimpleTradeSecretDerivable {
    public func getResolvedTradeSecretIdentifier() -> ResolvedTradeSecret.ID {
        .talisman(id)
    }

    static func getTradeSecrets(database: Database, settings: Settings) -> [Self.ID:
        ResolvedTradeSecret]
    {
        return getTradeSecretsForSimpleTradeSecretDerivable(
            of: Self.self, database: database, settings: settings)
    }
}

public struct TradeSecretsCache: Sendable {
    public let explicitTradeSecrets: [TradeSecret.ID: ResolvedTradeSecret]
    public let derivedTradeSecretsForEquipment: [EquipmentIdentifier: ResolvedTradeSecret]
    public let derivedTradeSecretsForSpecialAmmunition: [SpecialAmmunition.ID: ResolvedTradeSecret]
    public let derivedTradeSecretsForDisease: [Disease.ID: ResolvedTradeSecret]
    public let derivedTradeSecretsForElixir: [Elixir.ID: ResolvedTradeSecret]
    public let derivedTradeSecretsForHerbalAid: [HerbalAid.ID: ResolvedTradeSecret]
    public let derivedTradeSecretsForPoison: [Poison.ID: ResolvedTradeSecret]
    public let derivedTradeSecretsForTalisman: [Talisman.ID: ResolvedTradeSecret]
    public let allTradeSecrets: [ResolvedTradeSecret.ID: ResolvedTradeSecret]

    init(from database: Database, settings: Settings) {
        explicitTradeSecrets = getExplicitTradeSecrets(database: database)
        derivedTradeSecretsForEquipment = getTradeSecretsForEquipment(
            database: database, settings: settings)
        derivedTradeSecretsForSpecialAmmunition = getTradeSecretsForSpecialAmmunition(
            database: database, settings: settings)
        derivedTradeSecretsForDisease = Disease.getTradeSecrets(
            database: database, settings: settings)
        derivedTradeSecretsForElixir = Elixir.getTradeSecrets(
            database: database, settings: settings)
        derivedTradeSecretsForHerbalAid = HerbalAid.getTradeSecrets(
            database: database, settings: settings)
        derivedTradeSecretsForPoison = Poison.getTradeSecrets(
            database: database, settings: settings)
        derivedTradeSecretsForTalisman = Talisman.getTradeSecrets(
            database: database, settings: settings)

        let tradeSecretsList: [ResolvedTradeSecret] =
            Array(explicitTradeSecrets.values) + Array(derivedTradeSecretsForEquipment.values)
            + Array(derivedTradeSecretsForSpecialAmmunition.values)
            + Array(derivedTradeSecretsForDisease.values)
            + Array(derivedTradeSecretsForElixir.values)
            + Array(derivedTradeSecretsForHerbalAid.values)
            + Array(derivedTradeSecretsForPoison.values)
            + Array(derivedTradeSecretsForTalisman.values)

        allTradeSecrets = Dictionary(uniqueKeysWithValues: tradeSecretsList.map { ($0.id, $0) })
    }
}
