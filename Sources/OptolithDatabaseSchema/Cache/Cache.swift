//
//  Cache.swift
//  OptolithDatabaseSchema
//
//  Created by Lukas Obermann on 21.11.26.
//

public struct Cache: Sendable {
    public let activatableSelectOptions: ActivatableSelectOptionsCache
    public let ancestorBloodAdvantages: AncestorBloodAdvantagesCache
    public let derivedTradeSecrets: TradeSecretsCache
    public let magicalAndBlessedAdvantagesAndDisadvantages:
        MagicalAndBlessedAdvantagesAndDisadvantagesCache
    public let newApplicationsAndUses: NewApplicationsAndUsesCache
    public let skillApplications: SkillApplicationsCache
    public let skillsBySkillGroup: SkillsBySkillGroupCache

    public init(from database: Database, settings: Settings) {
        activatableSelectOptions = ActivatableSelectOptionsCache(from: database)
        ancestorBloodAdvantages = AncestorBloodAdvantagesCache(from: database)
        derivedTradeSecrets = TradeSecretsCache(from: database, settings: settings)
        magicalAndBlessedAdvantagesAndDisadvantages =
            MagicalAndBlessedAdvantagesAndDisadvantagesCache(from: database, settings: settings)
        newApplicationsAndUses = NewApplicationsAndUsesCache(
            from: database, activatableSelectOptions: activatableSelectOptions)
        skillApplications = SkillApplicationsCache(
            from: database, newApplicationsAndUses: newApplicationsAndUses)
        skillsBySkillGroup = SkillsBySkillGroupCache(from: database)
    }
}
