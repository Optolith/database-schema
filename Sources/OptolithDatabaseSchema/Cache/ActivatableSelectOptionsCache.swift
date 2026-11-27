//
//  ActivatableSelectOptionsCache.swift
//  OptolithDatabaseSchema
//
//  Created by Lukas Obermann on 21.11.26.
//

import Foundation

public enum ResolvedSelectOptionIdentifier: Hashable, Sendable {
    case general(GeneralSelectOption.ID)
    case advantage(Advantage.ID)
    case animalShape(AnimalShape.ID)
    case arcaneBardTradition(ArcaneBardTradition.ID)
    case arcaneDancerTradition(ArcaneDancerTradition.ID)
    case aspect(Aspect.ID)
    case blessedTradition(BlessedTradition.ID)
    case blessing(Blessing.ID)
    case cantrip(Cantrip.ID)
    case ceremony(Ceremony.ID)
    case closeCombatTechnique(CloseCombatTechnique.ID)
    case culture(Culture.ID)
    case disease(Disease.ID)
    case element(Element.ID)
    case homunculusType(HomunculusType.ID)
    case language(Language.ID)
    case liturgicalChant(LiturgicalChant.ID)
    case patron(Patron.ID)
    case poison(Poison.ID)
    case property(Property.ID)
    case race(Race.ID)
    case rangedCombatTechnique(RangedCombatTechnique.ID)
    case region(Region.ID)
    case ritual(Ritual.ID)
    case script(Script.ID)
    case sexPractice(SexPractice.ID)
    case skill(Skill.ID)
    case skillApplication(SkillApplication.ID)
    case spell(Spell.ID)
    case targetCategory(TargetCategory.ID)
    case tradeSecret(TradeSecret.ID)
}

public struct ResolvedSelectOption: Identifiable, Sendable {
    public typealias ID = ResolvedSelectOptionIdentifier

    public let id: ID

    /// The entry that contains select option.
    public let parent: SelectOptionParentIdentifier

    /// Sometimes, professions use specific text selections that are not contained in described lists. This ensures you can use them for professions only. They are not going to be displayed as options to the user.
    public let professionOnly: Bool?

    /// Prerequisites for the select option.
    public let prerequisites: GeneralPrerequisites?

    /// Specific binding cost for the select option. Only has an effect if the associated entry supports binding costs.
    public let bindingCost: Int?

    public let volume: Int?

    /// Specific AP cost for the select option.
    public let apValue: TradeSecretAdventurePointsValue?

    /// References to where in which publications this entry has been defined. Entries may also be added or removed in later printings.
    public let src: PublicationRefs?

    /// All translations for the entry, identified by IETF language tag (BCP47).
    public let translations: LocaleMap<GeneralSelectOptionTranslation>

    public let newApplications: [ResolvedNewSkillApplication]

    public let uses: [ResolvedSkillUse]

    public init(
        id: ID,
        parent: SelectOptionParentIdentifier,
        professionOnly: Bool? = nil,
        prerequisites: GeneralPrerequisites? = nil,
        bindingCost: Int? = nil,
        volume: Int? = nil,
        apValue: TradeSecretAdventurePointsValue? = nil,
        src: PublicationRefs? = nil,
        translations: LocaleMap<GeneralSelectOptionTranslation>,
        newApplications: [ResolvedNewSkillApplication] = [],
        uses: [ResolvedSkillUse] = []
    ) {
        self.id = id
        self.parent = parent
        self.professionOnly = professionOnly
        self.prerequisites = prerequisites
        self.bindingCost = bindingCost
        self.volume = volume
        self.apValue = apValue
        self.src = src
        self.translations = translations
        self.newApplications = newApplications
        self.uses = uses
    }
}

private func getDerivedSelectOptions(
    from database: Database, forEntry id: ActivatableIdentifier,
    entrySrc parentSrc: PublicationRefs, selectOptions: SelectOptions?
) -> [ResolvedSelectOption] {
    guard let derived = selectOptions?.derived else { return [] }
    let parentId = id.asSelectOptionParentIdentifier

    switch derived {
    case .blessings:
        return database.getAllInstances(of: Blessing.self).map { $0.asSelectOption(of: parentId) }
    case .cantrips:
        return database.getAllInstances(of: Cantrip.self).map { $0.asSelectOption(of: parentId) }
    case .tradeSecrets:
        return database.getAllInstances(of: TradeSecret.self).map {
            $0.asSelectOption(of: parentId)
        }
    case .scripts:
        return database.getAllInstances(of: Script.self).map { $0.asSelectOption(of: parentId) }
    case .animalShapes:
        let animalShapes = database.getAllInstances(of: AnimalShape.self)

        let sortedAnimalShapesByPath = Dictionary(
            grouping: animalShapes.sorted {
                database.getInstance(of: AnimalShapeSize.self, by: $0.size)!.volume
                    < database.getInstance(of: AnimalShapeSize.self, by: $1.size)!.volume
            }
        ) { $0.path }.mapValues { $0.map(\.id) }

        return animalShapes.compactMap { animalShape -> ResolvedSelectOption? in
            let path = database.getInstance(of: AnimalShapePath.self, by: animalShape.path)
            let size = database.getInstance(of: AnimalShapeSize.self, by: animalShape.size)
            guard let animalShapesInPath = sortedAnimalShapesByPath[animalShape.path] else {
                return nil
            }
            let indexInPath = animalShapesInPath.firstIndex(of: animalShape.id)

            let prerequisites: GeneralPrerequisites? =
                if let indexInPath {
                    if indexInPath == 0 {
                        sortedAnimalShapesByPath.compactMap {
                            $0.key != animalShape.path ? nil : $0.value.first
                        }.map { firstInPath in
                            PrerequisiteForLevel(
                                level: 1,
                                prerequisite: .single(
                                    .activatable(
                                        .init(
                                            id: id,
                                            active: false,
                                            options: [.animalShape(firstInPath)]
                                        )))
                            )
                        }
                    } else {
                        [
                            .init(
                                level: 1,
                                prerequisite: .single(
                                    .activatable(
                                        .init(
                                            id: id,
                                            active: true,
                                            options: [
                                                .animalShape(animalShapesInPath[indexInPath - 1])
                                            ]
                                        )))
                            )
                        ]
                    }
                } else {
                    nil
                }

            return ResolvedSelectOption(
                id: .animalShape(animalShape.id),
                parent: parentId,
                prerequisites: prerequisites,
                volume: size?.volume,
                apValue: (size?.apValue).map { .fixed($0) },
                translations: animalShape.translations.map {
                    let name =
                        if let pathTranslation = path?.translations.map[$0.key] {
                            "\($0.value.name) (\(pathTranslation.name)"
                        } else {
                            $0.value.name
                        }
                    return GeneralSelectOptionTranslation(name: name)
                }
            )
        }
    case .arcaneBardTraditions:
        return database.getAllInstances(of: ArcaneBardTradition.self).map {
            $0.asSelectOption(of: parentId)
        }
    case .arcaneDancerTraditions:
        return database.getAllInstances(of: ArcaneDancerTradition.self).map {
            $0.asSelectOption(of: parentId)
        }
    case .sexPractices:
        return database.getAllInstances(of: SexPractice.self).map {
            $0.asSelectOption(of: parentId)
        }
    case .races:
        return database.getAllInstances(of: Race.self).map { $0.asSelectOption(of: parentId) }
    case .cultures:
        return database.getAllInstances(of: Culture.self).map { $0.asSelectOption(of: parentId) }
    case .racesAndCultures:
        return database.getAllInstances(of: Race.self).map { $0.asSelectOption(of: parentId) }
            + database.getAllInstances(of: Culture.self).map { $0.asSelectOption(of: parentId) }
    case .homunculusTypes:
        return database.getAllInstances(of: HomunculusType.self).map {
            $0.asSelectOption(of: parentId)
        }
    case .blessedTraditions(let blessedTraditionsConfig):
        return database.getAllInstances(of: BlessedTradition.self).map {
            $0.asSelectOption(
                of: parentId, with: (config: blessedTraditionsConfig, originalParentId: id))
        }
    case .elements(let elementsConfig):
        let elements = database.getAllInstances(of: Element.self)
        let filteredElements =
            if let specific = elementsConfig.specific {
                elements.filter { specific.contains($0.id) }
            } else {
                elements
            }
        return filteredElements.map { $0.asSelectOption(of: parentId) }
    case .properties(let propertiesConfig):
        return database.getAllInstances(of: Property.self).map {
            $0.asSelectOption(of: parentId, with: propertiesConfig)
        }
    case .aspects(let aspectsConfig):
        return database.getAllInstances(of: Aspect.self).map {
            $0.asSelectOption(of: parentId, with: aspectsConfig)
        }
    case .diseases(let diseasesConfig):
        return database.getAllInstances(of: Disease.self).map {
            $0.asSelectOption(of: parentId, with: diseasesConfig)
        }
    case .poisons(let poisonsConfig):
        return database.getAllInstances(of: Poison.self).map {
            $0.asSelectOption(of: parentId, with: poisonsConfig)
        }
    case .languages(let languagesConfig):
        return database.getAllInstances(of: Language.self).map {
            $0.asSelectOption(of: parentId, with: languagesConfig)
        }
    case .skills(let anySkillsConfig):
        return anySkillsConfig.categories.flatMap { category -> [ResolvedSelectOption] in
            switch category {
            case .skills(let skillsConfig):
                return skillsConfig.getSelectOptions(
                    parent: parentId,
                    parentSrc: parentSrc,
                    database: database,
                    for: Skill.self,
                    config: anySkillsConfig,
                    wrapIdentifier: AnySkillIdentifier.skill,
                    wrapIdentifierFromCategory: SkillishIdentifier.skill
                ) { skill in
                    let matchesGroupRequirement =
                        if let groups = skillsConfig.groups {
                            groups.contains(skill.group)
                        } else { true }

                    let matchesIdRequirement = skillsConfig.specific?.matches(id: skill.id) ?? true

                    return matchesGroupRequirement && matchesIdRequirement
                }
            case .spells(let spellsConfig):
                return spellsConfig.getSelectOptions(
                    parent: parentId,
                    parentSrc: parentSrc,
                    database: database,
                    for: Spell.self,
                    config: anySkillsConfig,
                    wrapIdentifier: AnySkillIdentifier.spell,
                    wrapIdentifierFromCategory: SkillishIdentifier.spell
                ) { spell in
                    spellsConfig.specific?.matches { ref in
                        switch ref {
                        case .single(let id):
                            return spell.id == id
                        case .property(let propertyId):
                            return spell.property == propertyId
                        }
                    } ?? true
                }
            case .rituals(let ritualsConfig):
                return ritualsConfig.getSelectOptions(
                    parent: parentId,
                    parentSrc: parentSrc,
                    database: database,
                    for: Ritual.self,
                    config: anySkillsConfig,
                    wrapIdentifier: AnySkillIdentifier.ritual,
                    wrapIdentifierFromCategory: SkillishIdentifier.ritual
                ) { ritual in
                    ritualsConfig.specific?.matches { ref in
                        switch ref {
                        case .single(let id):
                            return ritual.id == id
                        case .property(let propertyId):
                            return ritual.property == propertyId
                        }
                    } ?? true
                }
            case .liturgicalChants(let liturgicalChantsConfig):
                return liturgicalChantsConfig.getSelectOptions(
                    parent: parentId,
                    parentSrc: parentSrc,
                    database: database,
                    for: LiturgicalChant.self,
                    config: anySkillsConfig,
                    wrapIdentifier: AnySkillIdentifier.liturgicalChant,
                    wrapIdentifierFromCategory: SkillishIdentifier.liturgicalChant
                ) { liturgicalChantsConfig.specific?.matches(id: $0.id) ?? true }
            case .ceremonies(let ceremoniesConfig):
                return ceremoniesConfig.getSelectOptions(
                    parent: parentId,
                    parentSrc: parentSrc,
                    database: database,
                    for: Ceremony.self,
                    config: anySkillsConfig,
                    wrapIdentifier: AnySkillIdentifier.ceremony,
                    wrapIdentifierFromCategory: SkillishIdentifier.ceremony
                ) { ceremoniesConfig.specific?.matches(id: $0.id) ?? true }
            }
        }
    case .combatTechniques(let combatTechniquesConfig):
        return combatTechniquesConfig.categories.flatMap { category -> [ResolvedSelectOption] in
            switch category {
            case .closeCombatTechniques(let closeCombatTechniquesConfig):
                return closeCombatTechniquesConfig.getSelectOptions(
                    parent: parentId,
                    parentSrc: parentSrc,
                    database: database,
                    for: CloseCombatTechnique.self,
                    config: combatTechniquesConfig,
                    wrapIdentifier: AnySkillIdentifier.closeCombatTechnique,
                    wrapIdentifierFromCategory: CombatTechniqueIdentifier.closeCombatTechnique
                ) { closeCombatTechniquesConfig.specific?.matches(id: $0.id) ?? true }
            case .rangedCombatTechniques(let rangedCombatTechniquesConfig):
                return rangedCombatTechniquesConfig.getSelectOptions(
                    parent: parentId,
                    parentSrc: parentSrc,
                    database: database,
                    for: RangedCombatTechnique.self,
                    config: combatTechniquesConfig,
                    wrapIdentifier: AnySkillIdentifier.rangedCombatTechnique,
                    wrapIdentifierFromCategory: CombatTechniqueIdentifier.rangedCombatTechnique
                ) { rangedCombatTechniquesConfig.specific?.matches(id: $0.id) ?? true }
            }
        }
    case .targetCategories(let targetCategoriesConfig):
        let targetCategories = database.getAllInstances(of: TargetCategory.self)

        let filtered =
            if !targetCategoriesConfig.list.isEmpty {
                targetCategories.compactMap { targetCategory in
                    if let specific = targetCategoriesConfig.list.first(where: { ref in
                        ref.id == targetCategory.id
                    }) {
                        targetCategory.asSelectOption(of: parentId, with: specific.volume)
                    } else {
                        nil
                    }
                }
            } else {
                targetCategories.map { $0.asSelectOption(of: parentId, with: nil) }
            }

        return filtered
    case .advantages(let advantagesConfig):
        let dependingOn = advantagesConfig.dependingOn.map(ActivatableIdentifier.advantage)
        func matchesDependingOn(prereq: AdvantageDisadvantagePrerequisiteGroup) -> Bool {
            switch prereq {
            case .activatable(let activatablePrerequisite):
                activatablePrerequisite.active && dependingOn.contains(activatablePrerequisite.id)
            case .commonSuggestedByRCP,
                .noOtherAncestorBloodAdvantage,
                .sex(_),
                .race(_),
                .culture(_),
                .pact(_),
                .socialStatus(_),
                .state(_),
                .rule(_),
                .primaryAttribute(_),
                .blessedTradition(_),
                .magicalTradition(_),
                .tinyActivatable(_),
                .anySpecialAbilityOfGroup(_),
                .rated(_),
                .ratedMinimumNumber(_),
                .ratedSum(_),
                .enhancement(_),
                .text(_),
                .sexualCharacteristic(_),
                .personalityTrait(_):
                false
            }
        }

        return database.getAllInstances(of: Advantage.self).filter {
            let hasFixedAPValue =
                switch $0.apValue {
                case .fixed(_): true
                case .byLevel(_), .dependingOnActive(_), .dependingOnActiveInstances(_),
                    .derivedFromSelection(_), .indefinite:
                    false
                }

            let hasMatch =
                if let prerequisites = $0.prerequisites {
                    prerequisites.contains {
                        (p: PrerequisiteForLevel<AdvantageDisadvantagePrerequisiteGroup>) in
                        guard p.level == 1 else { return false }
                        switch p.prerequisite {
                        case .single(let single): return matchesDependingOn(prereq: single)
                        case .disjunction(let disjunction):
                            return disjunction.list.allSatisfy { dp in
                                matchesDependingOn(prereq: dp)
                            }
                        case .group(let group):
                            return group.list.contains { gp in matchesDependingOn(prereq: gp) }
                        }
                    }
                } else { false }

            return hasFixedAPValue && hasMatch
        }.map { $0.asSelectOption(of: parentId) }
    case .patrons:
        return database.getAllInstances(of: Patron.self).map { $0.asSelectOption(of: parentId) }
    }
}

private func getExplicitSelectOptions(
    from database: Database, entityType: any ConfigurableWithSelectOptions.Type,
    parentId: ActivatableIdentifier
) -> [ResolvedSelectOption] {
    let parent = parentId.asSelectOptionParentIdentifier
    let selectOptions = database.getAllChildInstances(
        of: GeneralSelectOption.self, forParent: parent)
    return selectOptions.map { selectOption in
        let apValue: TradeSecretAdventurePointsValue? =
            if let apValue = selectOption.apValue {
                .fixed(apValue)
            } else {
                nil
            }

        return ResolvedSelectOption(
            id: .general(selectOption.id),
            parent: parent,
            professionOnly: selectOption.professionOnly,
            prerequisites: selectOption.prerequisites,
            bindingCost: selectOption.bindingCost,
            apValue: apValue,
            src: selectOption.src,
            translations: selectOption.translations,
            newApplications: [],
            uses: []
        )
    }
}

private func getSelectOptionsForEntity(
    from database: Database, entityType: any Activatable.Type,
    getActivatableIdentifier: GetActivatableIdentifier
) -> [ActivatableIdentifier: [ResolvedSelectOption.ID: ResolvedSelectOption]] {
    Dictionary(
        uniqueKeysWithValues: database.getAllInstances(of: entityType).compactMap {
            let id = getActivatableIdentifier($0.id)

            let explicit = getExplicitSelectOptions(
                from: database,
                entityType: entityType,
                parentId: id)

            let derived = getDerivedSelectOptions(
                from: database,
                forEntry: id,
                entrySrc: $0.src,
                selectOptions: $0.selectOptions)

            return (id, Dictionary(uniqueKeysWithValues: (explicit + derived).map { ($0.id, $0) }))
        })
}

private typealias GetActivatableIdentifier = (UUID) -> ActivatableIdentifier

public struct ActivatableSelectOptionsCache: Sendable {
    public let byId: [ActivatableIdentifier: [ResolvedSelectOption.ID: ResolvedSelectOption]]

    init(from database: Database) {
        let initial = [ActivatableIdentifier: [ResolvedSelectOption.ID: ResolvedSelectOption]]()
        byId = ActivatableIdentifier.allEntities.reduce(into: initial) { result, element in
            let (entityType, getActivatableIdentifier) = element
            if entityType is any Activatable.Type {
                let selectOptionsForEntity = getSelectOptionsForEntity(
                    from: database, entityType: entityType as! any Activatable.Type,
                    getActivatableIdentifier: getActivatableIdentifier)
                result.merge(selectOptionsForEntity) { (_, new) in new }
            }
        }
    }
}

protocol AnySkillsSelectOptionCategoryCategory {
    associatedtype Ref: Decodable, Equatable, Sendable

    /// Only include (`Intersection`) or exclude (`Difference`) specific entries.
    var specific: SpecificFromSkillSelectOptionCategoryCategory<Ref>? { get }

    /// Generate prerequisites for each entry of the category.
    var prerequisites: [SkillSelectOptionCategoryPrerequisite]? { get }
}

extension GenericSkillsSelectOptionCategoryCategory: AnySkillsSelectOptionCategoryCategory {}
extension SkillSelectOptionCategoryCategory: AnySkillsSelectOptionCategoryCategory {}

enum AnySkillIdentifier {
    case skill(Skill.ID)
    case closeCombatTechnique(CloseCombatTechnique.ID)
    case rangedCombatTechnique(RangedCombatTechnique.ID)
    case spell(Spell.ID)
    case ritual(Ritual.ID)
    case liturgicalChant(LiturgicalChant.ID)
    case ceremony(Ceremony.ID)

    var asRatedIdentifier: RatedIdentifier {
        switch self {
        case .skill(let id): return .skill(id)
        case .closeCombatTechnique(let id): return .closeCombatTechnique(id)
        case .rangedCombatTechnique(let id): return .rangedCombatTechnique(id)
        case .spell(let id): return .spell(id)
        case .ritual(let id): return .ritual(id)
        case .liturgicalChant(let id): return .liturgicalChant(id)
        case .ceremony(let id): return .ceremony(id)
        }
    }

    var asRequirableSelectOptionIdentifier: RequirableSelectOptionIdentifier {
        switch self {
        case .skill(let id): return .skill(id)
        case .closeCombatTechnique(let id): return .closeCombatTechnique(id)
        case .rangedCombatTechnique(let id): return .rangedCombatTechnique(id)
        case .spell(let id): return .spell(id)
        case .ritual(let id): return .ritual(id)
        case .liturgicalChant(let id): return .liturgicalChant(id)
        case .ceremony(let id): return .ceremony(id)
        }
    }

    var asResolvedSelectOptionIdentifier: ResolvedSelectOptionIdentifier {
        switch self {
        case .skill(let id): return .skill(id)
        case .closeCombatTechnique(let id): return .closeCombatTechnique(id)
        case .rangedCombatTechnique(let id): return .rangedCombatTechnique(id)
        case .spell(let id): return .spell(id)
        case .ritual(let id): return .ritual(id)
        case .liturgicalChant(let id): return .liturgicalChant(id)
        case .ceremony(let id): return .ceremony(id)
        }
    }
}

extension AnySkillsSelectOptionCategoryCategory {
    private func resolvePrerequisites(id: AnySkillIdentifier) -> GeneralPrerequisites? {
        guard let prerequisites else { return nil }

        return prerequisites.map {
            switch $0 {
            case .`self`(let selfConfig):
                return .init(
                    level: 1,
                    prerequisite: .single(
                        .rated(.init(id: id.asRatedIdentifier, value: selfConfig.value))))
            case .selectOption(let selectOptionConfig):
                return .init(
                    level: 1,
                    prerequisite: .single(
                        .activatable(
                            .init(
                                id: selectOptionConfig.id,
                                active: selectOptionConfig.active,
                                level: selectOptionConfig.level,
                                options: [id.asRequirableSelectOptionIdentifier]
                            )))
                )
            }
        }
    }

    func getSelectOptions<
        T: Improvable & NameableTranslatable & ReferencingPublications,
        Config: SkillSelectOptionCategoryConfigurable
    >(
        parent: SelectOptionParentIdentifier,
        parentSrc: PublicationRefs,
        database: Database,
        for type: T.Type,
        config: Config,
        wrapIdentifier: (T.ID) -> AnySkillIdentifier,
        wrapIdentifierFromCategory: (T.ID) -> Config.ID,
        predicate: (T) -> Bool
    ) -> [ResolvedSelectOption] {
        let genericSkills = database.getAllInstances(of: type)
        return genericSkills.filter(predicate).map { skill in
            let wrappedId = wrapIdentifier(skill.id)

            let bindingCost: Int? =
                if let bindingCostConfig = config.bindingCost {
                    bindingCostConfig.resolve(id: wrapIdentifierFromCategory(skill.id))
                } else {
                    nil
                }

            let apValue: Int? =
                if let apValueConfig = config.apValue {
                    apValueConfig.resolve(
                        id: wrapIdentifierFromCategory(skill.id),
                        improvementCost: skill.improvementCost)
                } else {
                    nil
                }

            return ResolvedSelectOption(
                id: wrappedId.asResolvedSelectOptionIdentifier,
                parent: parent,
                prerequisites: resolvePrerequisites(id: wrappedId),
                bindingCost: bindingCost,
                apValue: apValue.map { .fixed($0) },
                src: skill.src,
                translations: skill.translations.map {
                    GeneralSelectOptionTranslation(name: $0.value.name)
                }
            )
        }
    }
}

extension SelectOptionsBindingCostValue where Identifier: Equatable {
    func resolve(id: Identifier) -> Int {
        switch self {
        case .fixed(let config):
            return config.map.first { $0.id == id }?.bindingCost ?? config.default
        }
    }
}

extension SelectOptionsAdventurePointsValue where Identifier: Equatable {
    func resolve(id: Identifier, improvementCost ic: ImprovementCost) -> Int {
        switch self {
        case .derivedFromImprovementCost(let config):
            return ic.linearValue * (config.multiplier ?? 1) + (config.offset ?? 0)
        case .fixed(let config):
            return config.map.first { $0.id == id }?.apValue ?? config.default
        }
    }
}

extension SpecificFromSkillSelectOptionCategoryCategory {
    func matches(id: Ref) -> Bool {
        return list.contains(id) == (operation == .intersection)
    }

    func matches(_ predicate: (Ref) -> Bool) -> Bool {
        return list.contains(where: predicate) == (operation == .intersection)
    }
}
