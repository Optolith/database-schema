//
//  NewApplicationsAndUsesCache.swift
//  OptolithDatabaseSchema
//
//  Created by Lukas Obermann on 21.11.26.
//

public protocol AffectingSkillsIfParent {
    var parent: NewSkillApplicationOrUseParentIdentifier { get }
    var skills: [Skill.ID] { get }
}

extension NewSkillApplication: AffectingSkillsIfParent {}
extension SkillUse: AffectingSkillsIfParent {}

public protocol ResolvableWithSources {
    associatedtype Resolved: PossiblyReferencingPublications
    func asResolved(src: PublicationRefs?) -> Resolved
}

extension NewSkillApplication: ResolvableWithSources {
    public func asResolved(src: PublicationRefs?) -> ResolvedNewSkillApplication {
        .init(
            id: id.uuidString,
            parent: parent,
            skills: skills,
            requiredSkillRating: requiredSkillRating,
            src: src,
            translations: translations
        )
    }
}

extension SkillUse: ResolvableWithSources {
    public func asResolved(src: PublicationRefs?) -> ResolvedSkillUse {
        .init(
            id: id.uuidString,
            parent: parent,
            skills: skills,
            requiredSkillRating: requiredSkillRating,
            src: src,
            translations: translations
        )
    }
}

public struct ResolvedNewSkillApplication: Identifiable, Sendable, AffectingSkillsIfParent,
    PossiblyReferencingPublications, ResolvableWithSources
{
    public typealias ParentID = NewSkillApplicationOrUseParentIdentifier
    public static let parentId: KeyPath<Self, ParentID> & Sendable = \.parent

    public typealias ID = String

    public let id: ID

    /// The entry that enables the new skill application.
    public let parent: ParentID

    /// The skill(s) this application belongs to.
    public let skills: [Skill.ID]

    /// If an application applies to multiple skills, it may need to ensure the respective skill is on a certain skill rating if the activatable entry cannot ensure this prerequisite.
    public let requiredSkillRating: Int?

    /// References to where in which publications this entry has been defined. Entries may also be added or removed in later printings.
    public let src: PublicationRefs?

    /// All translations for the entry, identified by IETF language tag (BCP47).
    public let translations: LocaleMap<NewSkillApplicationTranslation>?

    public func asResolved(src: PublicationRefs?) -> Self {
        .init(
            id: id,
            parent: parent,
            skills: skills,
            requiredSkillRating: requiredSkillRating,
            src: src ?? self.src,
            translations: translations
        )
    }
}

public struct ResolvedSkillUse: Identifiable, Sendable, AffectingSkillsIfParent,
    PossiblyReferencingPublications, ResolvableWithSources
{
    public typealias ParentID = NewSkillApplicationOrUseParentIdentifier
    public static let parentId: KeyPath<Self, ParentID> & Sendable = \.parent

    public typealias ID = String

    public let id: ID

    /// The entry that enables the use.
    public let parent: NewSkillApplicationOrUseParentIdentifier

    /// The skill(s) this use belongs to.
    public let skills: [Skill.ID]

    /// If a use applies to multiple skills, it may need to ensure the respective skill is on a certain skill rating if the activatable entry cannot ensure this prerequisite.
    public let requiredSkillRating: Int?

    /// References to where in which publications this entry has been defined. Entries may also be added or removed in later printings.
    public let src: PublicationRefs?

    /// All translations for the entry, identified by IETF language tag (BCP47).
    public let translations: LocaleMap<SkillUseTranslation>?

    public func asResolved(src: PublicationRefs?) -> Self {
        .init(
            id: id,
            parent: parent,
            skills: skills,
            requiredSkillRating: requiredSkillRating,
            src: src ?? self.src,
            translations: translations
        )
    }
}

private func getSourceFromNewSkillApplicationOrUseParent(
    database: Database, id: NewSkillApplicationOrUseParentIdentifier
) -> PublicationRefs? {
    switch id {
    case .generalSelectOption(let id):
        database.getInstance(of: GeneralSelectOption.self, by: id)?.src
    case .advantage(let id): database.getInstance(of: Advantage.self, by: id)?.src
    case .disadvantage(let id): database.getInstance(of: Disadvantage.self, by: id)?.src
    case .advancedCombatSpecialAbility(let id):
        database.getInstance(of: AdvancedCombatSpecialAbility.self, by: id)?.src
    case .advancedKarmaSpecialAbility(let id):
        database.getInstance(of: AdvancedKarmaSpecialAbility.self, by: id)?.src
    case .advancedMagicalSpecialAbility(let id):
        database.getInstance(of: AdvancedMagicalSpecialAbility.self, by: id)?.src
    case .advancedSkillSpecialAbility(let id):
        database.getInstance(of: AdvancedSkillSpecialAbility.self, by: id)?.src
    case .blessedTradition(let id): database.getInstance(of: BlessedTradition.self, by: id)?.src
    case .ceremonialItemSpecialAbility(let id):
        database.getInstance(of: CeremonialItemSpecialAbility.self, by: id)?.src
    case .combatSpecialAbility(let id):
        database.getInstance(of: CombatSpecialAbility.self, by: id)?.src
    case .combatStyleSpecialAbility(let id):
        database.getInstance(of: CombatStyleSpecialAbility.self, by: id)?.src
    case .fatePointSpecialAbility(let id):
        database.getInstance(of: FatePointSpecialAbility.self, by: id)?.src
    case .generalSpecialAbility(let id):
        database.getInstance(of: GeneralSpecialAbility.self, by: id)?.src
    case .liturgicalStyleSpecialAbility(let id):
        database.getInstance(of: LiturgicalStyleSpecialAbility.self, by: id)?.src
    case .magicalSpecialAbility(let id):
        database.getInstance(of: MagicalSpecialAbility.self, by: id)?.src
    case .magicalTradition(let id): database.getInstance(of: MagicalTradition.self, by: id)?.src
    case .magicStyleSpecialAbility(let id):
        database.getInstance(of: MagicStyleSpecialAbility.self, by: id)?.src
    case .sexSpecialAbility(let id): database.getInstance(of: SexSpecialAbility.self, by: id)?.src
    }
}

func groupByAffectedSkill<
    Raw: AffectingSkillsIfParent & ResolvableWithSources,
    Result: AffectingSkillsIfParent & PossiblyReferencingPublications
>(database: Database, entries: [Raw], prev: [Skill.ID: [Result]] = [:]) -> [Skill.ID: [Result]]
where Raw.Resolved == Result {
    let mapped = entries.map {
        $0.asResolved(
            src: getSourceFromNewSkillApplicationOrUseParent(database: database, id: $0.parent))
    }
    var newMap = prev

    for entry in mapped {
        for skill in entry.skills {
            var prevArr = prev[skill] ?? []
            prevArr.append(entry)
            newMap[skill] = prevArr
        }
    }

    return newMap
}

public struct NewApplicationsAndUsesCache: Sendable {
    public let newApplications: [Skill.ID: [ResolvedNewSkillApplication]]
    public let uses: [Skill.ID: [ResolvedSkillUse]]

    init(from database: Database, activatableSelectOptions: ActivatableSelectOptionsCache) {
        var newApplications = groupByAffectedSkill(
            database: database, entries: database.getAllInstances(of: NewSkillApplication.self))
        var uses = groupByAffectedSkill(
            database: database, entries: database.getAllInstances(of: SkillUse.self))

        for byId in activatableSelectOptions.byId {
            for selectOption in byId.value {
                newApplications = groupByAffectedSkill(
                    database: database, entries: selectOption.value.newApplications,
                    prev: newApplications)
                uses = groupByAffectedSkill(
                    database: database, entries: selectOption.value.uses, prev: uses)
            }
        }

        self.newApplications = newApplications
        self.uses = uses
    }
}
