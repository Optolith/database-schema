//
//  GeneratedTypes+Improvable.swift
//  OptolithDatabaseSchema
//
//  Created by Lukas Obermann on 21.11.26.
//

public protocol Improvable: GeneralEntity {
    var improvementCost: ImprovementCost { get }
}

extension ImprovementCost {
    var linearValue: Int {
        switch self {
        case .a: return 1
        case .b: return 2
        case .c: return 3
        case .d: return 4
        }
    }
}
