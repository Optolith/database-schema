//
//  SkillsBySkillGroupCache.swift
//  OptolithDatabaseSchema
//
//  Created by Lukas Obermann on 21.11.26.
//

public struct SkillsBySkillGroupCache: Sendable {
    public let skillsBySkillGroup: [SkillGroup.ID: [Skill]]

    init(from database: Database) {
        skillsBySkillGroup = Dictionary(
            grouping: database.getAllInstances(of: Skill.self), by: \.group)
    }
}
