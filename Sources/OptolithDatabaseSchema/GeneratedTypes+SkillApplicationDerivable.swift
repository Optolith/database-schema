//
//  GeneratedTypes+SkillApplicationDerivable.swift
//  OptolithDatabaseSchema
//
//  Created by Lukas Obermann on 21.11.26.
//

public protocol SkillApplicationDerivable {
    func deriveSkillApplication(parent: Skill.ID) -> ResolvedSkillApplication
}

extension BlessedTradition: SkillApplicationDerivable {
    public func deriveSkillApplication(parent: Skill.ID) -> ResolvedSkillApplication {
        .init(
            id: .blessedTradition(id),
            parent: parent,
            prerequisites: nil,
            src: src,
            translations: translations.map { .init(name: $0.value.name) }
        )
    }
}

extension Disease: SkillApplicationDerivable {
    public func deriveSkillApplication(parent: Skill.ID) -> ResolvedSkillApplication {
        .init(
            id: .blessedTradition(id),
            parent: parent,
            prerequisites: nil,
            src: src,
            translations: translations.map { .init(name: $0.value.name) }
        )
    }
}

extension Region: SkillApplicationDerivable {
    public func deriveSkillApplication(parent: Skill.ID) -> ResolvedSkillApplication {
        .init(
            id: .blessedTradition(id),
            parent: parent,
            prerequisites: nil,
            src: nil,
            translations: translations.map { .init(name: $0.value.name) }
        )
    }
}

extension SkillApplication: SkillApplicationDerivable {
    public func deriveSkillApplication() -> ResolvedSkillApplication {
        deriveSkillApplication(parent: parent)
    }

    public func deriveSkillApplication(parent: Skill.ID) -> ResolvedSkillApplication {
        .init(
            id: .skillApplication(id),
            parent: parent,
            prerequisites: nil,
            src: nil,
            translations: translations.map { .init(name: $0.value.name) }
        )
    }
}
