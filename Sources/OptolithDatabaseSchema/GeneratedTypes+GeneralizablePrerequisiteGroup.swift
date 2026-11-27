//
//  GeneratedTypes+GeneralizablePrerequisiteGroup.swift
//  OptolithDatabaseSchema
//
//  Created by Lukas Obermann on 21.11.26.
//

import Foundation

public protocol GeneralizablePrerequisiteGroup: Decodable, Equatable, Sendable {
    var asGeneral: GeneralPrerequisiteGroup { get }
}

extension PrerequisitesElement {
    public var asLevelled: PrerequisiteForLevel<T> {
        PrerequisiteForLevel(level: 1, prerequisite: self)
    }
}

extension PrerequisitesElement where T: GeneralizablePrerequisiteGroup {
    public var asGeneral: PrerequisitesElement<GeneralPrerequisiteGroup> {
        map { $0.asGeneral }
    }

    public var asLevelledGeneral: PrerequisiteForLevel<GeneralPrerequisiteGroup> {
        PrerequisiteForLevel(level: 1, prerequisite: map { $0.asGeneral })
    }
}

extension ArcaneTraditionPrerequisiteGroup: GeneralizablePrerequisiteGroup {
    public var asGeneral: GeneralPrerequisiteGroup {
        switch self {
        case .sex(let sex): return .sex(sex)
        case .culture(let culture): return .culture(culture)
        }
    }
}
