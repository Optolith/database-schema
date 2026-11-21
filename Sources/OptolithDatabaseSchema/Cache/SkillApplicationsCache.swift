//
//  SkillApplicationsCache.swift
//  OptolithDatabaseSchema
//
//  Created by Lukas Obermann on 21.11.26.
//

import Foundation

public enum ResolvedSkillApplicationIdentifier: Hashable, Equatable, Sendable {
    case skillApplication(SkillApplication.ID)
    case newSkillApplication(ResolvedNewSkillApplication.ID)
    case blessedTradition(BlessedTradition.ID)
    case disease(Disease.ID)
    case region(Region.ID)
}

public struct ResolvedSkillApplication: Identifiable, Equatable, Sendable, NameableTranslatable,
    PossiblyReferencingPublications
{
    public typealias ParentID = Skill.ID

    public static let parentId: KeyPath<Self, ParentID> & Sendable = \.parent

    public typealias ID = ResolvedSkillApplicationIdentifier

    public let id: ID

    /// The skill this application belongs to.
    public let parent: Skill.ID

    public let prerequisites: PlainGeneralPrerequisites?

    /// References to where in which publications this entry has been defined. Entries may also be added or removed in later printings.
    public let src: PublicationRefs?

    /// All translations for the entry, identified by IETF language tag (BCP47).
    public let translations: LocaleMap<SkillApplicationTranslation>
}

extension ResolvedNewSkillApplication {
    private func getParent(database: Database) -> LocaleMap<SkillApplicationTranslation>? {
        switch parent {
        case .generalSelectOption(let id):
            return database.getInstance(of: GeneralSelectOption.self, by: id)?.translations.map {
                .init(name: $0.value.name)
            }
        case .advantage(let id):
            return database.getInstance(of: Advantage.self, by: id)?.translations.map {
                .init(name: $0.value.name)
            }
        case .disadvantage(let id):
            return database.getInstance(of: Disadvantage.self, by: id)?.translations.map {
                .init(name: $0.value.name)
            }
        case .advancedCombatSpecialAbility(let id):
            return database.getInstance(of: AdvancedCombatSpecialAbility.self, by: id)?.translations
                .map { .init(name: $0.value.name) }
        case .advancedKarmaSpecialAbility(let id):
            return database.getInstance(of: AdvancedKarmaSpecialAbility.self, by: id)?.translations
                .map { .init(name: $0.value.name) }
        case .advancedMagicalSpecialAbility(let id):
            return database.getInstance(of: AdvancedMagicalSpecialAbility.self, by: id)?
                .translations.map { .init(name: $0.value.name) }
        case .advancedSkillSpecialAbility(let id):
            return database.getInstance(of: AdvancedSkillSpecialAbility.self, by: id)?.translations
                .map { .init(name: $0.value.name) }
        case .blessedTradition(let id):
            return database.getInstance(of: BlessedTradition.self, by: id)?.translations.map {
                .init(name: $0.value.name)
            }
        case .ceremonialItemSpecialAbility(let id):
            return database.getInstance(of: CeremonialItemSpecialAbility.self, by: id)?.translations
                .map { .init(name: $0.value.name) }
        case .combatSpecialAbility(let id):
            return database.getInstance(of: CombatSpecialAbility.self, by: id)?.translations.map {
                .init(name: $0.value.name)
            }
        case .combatStyleSpecialAbility(let id):
            return database.getInstance(of: CombatStyleSpecialAbility.self, by: id)?.translations
                .map { .init(name: $0.value.name) }
        case .fatePointSpecialAbility(let id):
            return database.getInstance(of: FatePointSpecialAbility.self, by: id)?.translations.map
            { .init(name: $0.value.name) }
        case .generalSpecialAbility(let id):
            return database.getInstance(of: GeneralSpecialAbility.self, by: id)?.translations.map {
                .init(name: $0.value.name)
            }
        case .liturgicalStyleSpecialAbility(let id):
            return database.getInstance(of: LiturgicalStyleSpecialAbility.self, by: id)?
                .translations.map { .init(name: $0.value.name) }
        case .magicalSpecialAbility(let id):
            return database.getInstance(of: MagicalSpecialAbility.self, by: id)?.translations.map {
                .init(name: $0.value.name)
            }
        case .magicalTradition(let id):
            return database.getInstance(of: MagicalTradition.self, by: id)?.translations.map {
                .init(name: $0.value.name)
            }
        case .magicStyleSpecialAbility(let id):
            return database.getInstance(of: MagicStyleSpecialAbility.self, by: id)?.translations.map
            { .init(name: $0.value.name) }
        case .sexSpecialAbility(let id):
            return database.getInstance(of: SexSpecialAbility.self, by: id)?.translations.map {
                .init(name: $0.value.name)
            }
        }
    }

    private func getPrerequisites(database: Database) -> PlainGeneralPrerequisites? {
        switch parent {
        case .generalSelectOption(let id):
            let parentSelectOption = database.getInstance(of: GeneralSelectOption.self, by: id)
            guard let parentSelectOption else { return nil }
            guard let grandParentId = parentSelectOption.parent.asActivatableIdentifier else {
                return nil
            }
            return [
                .single(
                    .activatable(.init(id: grandParentId, active: true, options: [.general(id)])))
            ]
        case .advantage(let id):
            return [.single(.activatable(.init(id: .advantage(id), active: true)))]
        case .disadvantage(let id):
            return [.single(.activatable(.init(id: .disadvantage(id), active: true)))]
        case .advancedCombatSpecialAbility(let id):
            return [
                .single(.activatable(.init(id: .advancedCombatSpecialAbility(id), active: true)))
            ]
        case .advancedKarmaSpecialAbility(let id):
            return [
                .single(.activatable(.init(id: .advancedKarmaSpecialAbility(id), active: true)))
            ]
        case .advancedMagicalSpecialAbility(let id):
            return [
                .single(.activatable(.init(id: .advancedMagicalSpecialAbility(id), active: true)))
            ]
        case .advancedSkillSpecialAbility(let id):
            return [
                .single(.activatable(.init(id: .advancedSkillSpecialAbility(id), active: true)))
            ]
        case .blessedTradition(let id):
            return [.single(.activatable(.init(id: .blessedTradition(id), active: true)))]
        case .ceremonialItemSpecialAbility(let id):
            return [
                .single(.activatable(.init(id: .ceremonialItemSpecialAbility(id), active: true)))
            ]
        case .combatSpecialAbility(let id):
            return [.single(.activatable(.init(id: .combatSpecialAbility(id), active: true)))]
        case .combatStyleSpecialAbility(let id):
            return [.single(.activatable(.init(id: .combatStyleSpecialAbility(id), active: true)))]
        case .fatePointSpecialAbility(let id):
            return [.single(.activatable(.init(id: .fatePointSpecialAbility(id), active: true)))]
        case .generalSpecialAbility(let id):
            return [.single(.activatable(.init(id: .generalSpecialAbility(id), active: true)))]
        case .liturgicalStyleSpecialAbility(let id):
            return [
                .single(.activatable(.init(id: .liturgicalStyleSpecialAbility(id), active: true)))
            ]
        case .magicalSpecialAbility(let id):
            return [.single(.activatable(.init(id: .magicalSpecialAbility(id), active: true)))]
        case .magicalTradition(let id):
            return [.single(.activatable(.init(id: .magicalTradition(id), active: true)))]
        case .magicStyleSpecialAbility(let id):
            return [.single(.activatable(.init(id: .magicStyleSpecialAbility(id), active: true)))]
        case .sexSpecialAbility(let id):
            return [.single(.activatable(.init(id: .sexSpecialAbility(id), active: true)))]
        }
    }

    typealias AnyTranslation = NameableTranslation & Decodable & Equatable & Sendable

    func asResolvedSkillApplications(database: Database) -> [ResolvedSkillApplication] {
        guard let parentTranslations = getParent(database: database) else { return [] }
        return skills.map { skill in
            .init(
                id: .newSkillApplication(id),
                parent: skill,
                prerequisites: getPrerequisites(database: database),
                src: nil,
                translations: translations?.map { .init(name: $0.value.name) } ?? parentTranslations
            )
        }
    }
}

func getDerivedApplications(database: Database, id: Skill.ID, category: ApplicationCategory?)
    -> [ResolvedSkillApplication]
{
    guard let category else { return [] }
    switch category {
    case .blessedTraditions:
        return database.getAllInstances(of: BlessedTradition.self).map {
            $0.deriveSkillApplication(parent: id)
        }
    case .diseases:
        return database.getAllInstances(of: Disease.self).map {
            $0.deriveSkillApplication(parent: id)
        }
    case .regions:
        return database.getAllInstances(of: Region.self).map {
            $0.deriveSkillApplication(parent: id)
        }
    }
}

func getExplicitApplications(database: Database, id: Skill.ID) -> [ResolvedSkillApplication] {
    return database.getAllChildInstances(of: SkillApplication.self, forParent: id).map {
        $0.deriveSkillApplication()
    }
}

func getResolvedNewSkillApplications(
    database: Database, newApplicationsAndUses: NewApplicationsAndUsesCache
) -> [Skill.ID: [ResolvedSkillApplication]] {
    return newApplicationsAndUses.newApplications.mapValues {
        $0.flatMap { $0.asResolvedSkillApplications(database: database) }
    }
}

public struct SkillApplicationsCache: Sendable {
    public typealias ApplicationsBySkill = [Skill.ID: [ResolvedSkillApplication.ID:
        ResolvedSkillApplication]]
    public let applicationsBySkill: ApplicationsBySkill

    init(from database: Database, newApplicationsAndUses: NewApplicationsAndUsesCache) {
        let baseApplications = database.getAllInstances(of: Skill.self).reduce(
            into: [Skill.ID: [ResolvedSkillApplication]]()
        ) { partialResult, skill in
            let explicitApplications = getExplicitApplications(database: database, id: skill.id)
            let derivedApplications = getDerivedApplications(
                database: database, id: skill.id, category: skill.applications.derived)
            partialResult[skill.id] = explicitApplications + derivedApplications
        }

        let newApplications = getResolvedNewSkillApplications(
            database: database, newApplicationsAndUses: newApplicationsAndUses)

        let allApplications = baseApplications.merging(newApplications, uniquingKeysWith: +)

        applicationsBySkill = allApplications.mapValues {
            Dictionary(uniqueKeysWithValues: $0.map { ($0.id, $0) })
        }
    }
}
