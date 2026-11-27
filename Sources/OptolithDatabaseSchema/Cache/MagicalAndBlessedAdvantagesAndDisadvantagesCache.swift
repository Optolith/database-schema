//
//  MagicalAndBlessedAdvantagesAndDisadvantagesCache.swift
//  OptolithDatabaseSchema
//
//  Created by Lukas Obermann on 21.11.26.
//

public struct MagicalAndBlessedAdvantagesAndDisadvantagesCache: Sendable {
    public let ancestorBloodAdvantageIds: [Advantage.ID]

    init(from database: Database, settings: Settings) {
        ancestorBloodAdvantageIds =
            database
            .getAllInstances(of: Advantage.self)
            .filter { advantage in
                advantage.prerequisites?.contains(where: { prerequisite in
                    switch prerequisite.prerequisite {
                    case .single(let single):
                        return single == .noOtherAncestorBloodAdvantage
                    case .disjunction(let disjunction):
                        return disjunction.list.contains { disjunction in
                            disjunction == .noOtherAncestorBloodAdvantage
                        }
                    case .group(let group):
                        return group.list.contains { group in
                            group == .noOtherAncestorBloodAdvantage
                        }
                    }
                }) ?? false
            }
            .map(\.id)
    }
}
