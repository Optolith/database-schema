//
//  GeneratedTypes+TradeSecretDerivable.swift
//  OptolithDatabaseSchema
//
//  Created by Lukas Obermann on 21.11.26.
//

public struct DerivedTradeSecretSource {
    public let apValue: Int
    public let prerequisites: PlainGeneralPrerequisites?
    public let src: PublicationRefs?
}

public protocol TradeSecretDerivable {
    func deriveTradeSecret(_ settings: Settings) -> DerivedTradeSecretSource?
}

extension Complexity: TradeSecretDerivable {
    public func deriveTradeSecret(_ settings: Settings) -> DerivedTradeSecretSource? {
        switch self {
        case .primitive, .simple:
            nil
        case .complex(let c):
            DerivedTradeSecretSource(apValue: c.apValue, prerequisites: c.prerequisites, src: c.src)
        }
    }
}

extension ArmorComplexity: TradeSecretDerivable {
    public func deriveTradeSecret(_ settings: Settings) -> DerivedTradeSecretSource? {
        switch self {
        case .various, .primitive, .simple:
            nil
        case .complex(let c):
            DerivedTradeSecretSource(apValue: c.apValue, prerequisites: c.prerequisites, src: c.src)
        }
    }
}

public protocol Equipment: GeneralEntity, ReferencingPublications, TradeSecretDerivable {}

public protocol EquipmentWithComplexity: Equipment {
    var complexity: Complexity? { get }
}

extension EquipmentWithComplexity {
    public func deriveTradeSecret(_ settings: Settings) -> DerivedTradeSecretSource? {
        complexity?.deriveTradeSecret(settings)
    }
}

public protocol EquipmentWithArmorComplexity: Equipment {
    var complexity: ArmorComplexity? { get }
}

extension EquipmentWithArmorComplexity {
    public func deriveTradeSecret(_ settings: Settings) -> DerivedTradeSecretSource? {
        complexity?.deriveTradeSecret(settings)
    }
}

extension RecipeTradeSecret: TradeSecretDerivable {
    public func deriveTradeSecret(_ settings: Settings) -> DerivedTradeSecretSource? {
        .init(apValue: apValue, prerequisites: prerequisites, src: src)
    }
}

extension Disease: TradeSecretDerivable {
    public func deriveTradeSecret(_ settings: Settings) -> DerivedTradeSecretSource? {
        tradeSecret?.deriveTradeSecret(settings)
    }
}

extension Elixir: TradeSecretDerivable {
    public func deriveTradeSecret(_ settings: Settings) -> DerivedTradeSecretSource? {
        tradeSecret?.deriveTradeSecret(settings)
    }
}

extension HerbalAid: TradeSecretDerivable {
    public func deriveTradeSecret(_ settings: Settings) -> DerivedTradeSecretSource? {
        tradeSecret?.deriveTradeSecret(settings)
    }
}

extension RecipeComplexity: TradeSecretDerivable {
    public func deriveTradeSecret(_ settings: Settings) -> DerivedTradeSecretSource? {
        switch self {
        case .primitive, .simple:
            nil
        case .complex(let c):
            DerivedTradeSecretSource(apValue: c.apValue, prerequisites: c.prerequisites, src: c.src)
        }
    }
}

extension Poison: TradeSecretDerivable {
    public func deriveTradeSecret(_ settings: Settings) -> DerivedTradeSecretSource? {
        switch sourceType {
        case .alchemicalPoison(let alchemicalPoison):
            return alchemicalPoison.tradeSecret.deriveTradeSecret(settings)
        case .animalVenom(let animalVenom):
            return animalVenom.complexity?.deriveTradeSecret(settings)
        case .alchemicalPactGiftPoison, .mineralPoison(_), .plantPoison(_), .demonicPoison(_):
            return nil
        }
    }
}

extension Talisman: TradeSecretDerivable {
    public func deriveTradeSecret(_ settings: Settings) -> DerivedTradeSecretSource? {
        let requiredFocusRule: PlainGeneralPrerequisites =
            [
                .single(
                    .rule(
                        .init(
                            id: .focusRule(
                                settings.derivedTradeSecrets.requiredFocusRuleForTalismans),
                            active: true
                        )))
            ]

        let requiredTradition: PlainGeneralPrerequisites =
            if let tradition, !tradition.isEmpty {
                if tradition.count == 1, let first = tradition.first {
                    [
                        .single(
                            .activatable(.init(id: .blessedTradition(first), active: true))
                        )
                    ]
                } else {
                    [
                        .disjunction(
                            .init(
                                list: tradition.map {
                                    .activatable(.init(id: .blessedTradition($0), active: true))
                                }))
                    ]
                }
            } else {
                []
            }

        if let apValue {
            return .init(
                apValue: apValue,
                prerequisites: requiredFocusRule + requiredTradition,
                src: src
            )
        } else {
            return nil
        }
    }
}
