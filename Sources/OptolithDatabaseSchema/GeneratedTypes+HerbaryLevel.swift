//
//  GeneratedTypes+HerbaryLevel.swift
//  OptolithDatabaseSchema
//
//  Created by Lukas Obermann on 21.11.26.
//

import Foundation

extension Poison {
    /// The level of the poison as an integer. Variable levels are returned as the largest possible level.
    public var normalizedLevel: Int {
        switch self.sourceType {
        case .animalVenom(let animalVenom):
            switch animalVenom.level {
            case .constant(let constantLevel):
                return constantLevel
            case .qualityLevel:
                return 6
            case .bySubtype(let levelBySubtype):
                return min(6, levelBySubtype.map { $0.value }.max() ?? 6)
            }
        case .alchemicalPoison(_), .alchemicalPactGiftPoison: return 6
        case .mineralPoison(let mineralPoison): return mineralPoison.level
        case .plantPoison(let plantPoison): return plantPoison.level
        case .demonicPoison(let demonicPoison):
            switch demonicPoison.level {
            case .constant(let constantLevel): return constantLevel.value
            case .qualityLevel(_): return 6
            }
        }
    }
}
