//
//  GeneratedTypes+SelectOptionDerivable.swift
//  OptolithDatabaseSchema
//
//  Created by Lukas Obermann on 21.11.26.
//

public protocol SelectOptionDerivable {
    func asSelectOption(of parent: SelectOptionParentIdentifier) -> ResolvedSelectOption
}

public protocol SelectOptionDerivableWithCategoryConfiguration {
    associatedtype CategoryConfiguration

    func asSelectOption(of parent: SelectOptionParentIdentifier, with config: CategoryConfiguration)
        -> ResolvedSelectOption
}

extension Blessing: SelectOptionDerivable {
    public func asSelectOption(of parent: SelectOptionParentIdentifier) -> ResolvedSelectOption {
        ResolvedSelectOption(
            id: .blessing(id),
            parent: parent,
            src: src,
            translations: translations.map { GeneralSelectOptionTranslation(name: $0.value.name) }
        )
    }
}

extension Cantrip: SelectOptionDerivable {
    public func asSelectOption(of parent: SelectOptionParentIdentifier) -> ResolvedSelectOption {
        ResolvedSelectOption(
            id: .cantrip(id),
            parent: parent,
            src: src,
            translations: translations.map { GeneralSelectOptionTranslation(name: $0.value.name) }
        )
    }
}

extension TradeSecret: SelectOptionDerivable {
    public func asSelectOption(of parent: SelectOptionParentIdentifier) -> ResolvedSelectOption {
        ResolvedSelectOption(
            id: .tradeSecret(id),
            parent: parent,
            prerequisites: prerequisites?.map { $0.asLevelled },
            apValue: apValue,
            src: src,
            translations: translations.map {
                GeneralSelectOptionTranslation(name: $0.value.name, errata: $0.value.errata)
            }
        )
    }
}

extension Script: SelectOptionDerivable {
    public func asSelectOption(of parent: SelectOptionParentIdentifier) -> ResolvedSelectOption {
        ResolvedSelectOption(
            id: .script(id),
            parent: parent,
            apValue: apValue.map { .fixed($0) },
            src: src,
            translations: translations.map {
                GeneralSelectOptionTranslation(name: $0.value.name, errata: $0.value.errata)
            }
        )
    }
}

extension ArcaneBardTradition: SelectOptionDerivable {
    public func asSelectOption(of parent: SelectOptionParentIdentifier) -> ResolvedSelectOption {
        ResolvedSelectOption(
            id: .arcaneBardTradition(id),
            parent: parent,
            prerequisites: prerequisites.map { $0.asLevelledGeneral },
            translations: translations.map { GeneralSelectOptionTranslation(name: $0.value.name) }
        )
    }
}

extension ArcaneDancerTradition: SelectOptionDerivable {
    public func asSelectOption(of parent: SelectOptionParentIdentifier) -> ResolvedSelectOption {
        ResolvedSelectOption(
            id: .arcaneDancerTradition(id),
            parent: parent,
            prerequisites: prerequisites.map { $0.asLevelledGeneral },
            translations: translations.map { GeneralSelectOptionTranslation(name: $0.value.name) }
        )
    }
}

extension SexPractice: SelectOptionDerivable {
    public func asSelectOption(of parent: SelectOptionParentIdentifier) -> ResolvedSelectOption {
        ResolvedSelectOption(
            id: .sexPractice(id),
            parent: parent,
            src: src,
            translations: translations.map { GeneralSelectOptionTranslation(name: $0.value.name) }
        )
    }
}

extension Race: SelectOptionDerivable {
    public func asSelectOption(of parent: SelectOptionParentIdentifier) -> ResolvedSelectOption {
        ResolvedSelectOption(
            id: .race(id),
            parent: parent,
            src: src,
            translations: translations.map { GeneralSelectOptionTranslation(name: $0.value.name) }
        )
    }
}

extension Culture: SelectOptionDerivable {
    public func asSelectOption(of parent: SelectOptionParentIdentifier) -> ResolvedSelectOption {
        ResolvedSelectOption(
            id: .culture(id),
            parent: parent,
            src: src,
            translations: translations.map { GeneralSelectOptionTranslation(name: $0.value.name) }
        )
    }
}

extension HomunculusType: SelectOptionDerivable {
    public func asSelectOption(of parent: SelectOptionParentIdentifier) -> ResolvedSelectOption {
        ResolvedSelectOption(
            id: .homunculusType(id),
            parent: parent,
            translations: translations.map { GeneralSelectOptionTranslation(name: $0.value.name) }
        )
    }
}

extension BlessedTradition: SelectOptionDerivable {
    public func asSelectOption(of parent: SelectOptionParentIdentifier) -> ResolvedSelectOption {
        ResolvedSelectOption(
            id: .blessedTradition(id),
            parent: parent,
            translations: translations.map { GeneralSelectOptionTranslation(name: $0.value.name) }
        )
    }
}

extension Element: SelectOptionDerivable {
    public func asSelectOption(of parent: SelectOptionParentIdentifier) -> ResolvedSelectOption {
        ResolvedSelectOption(
            id: .element(id),
            parent: parent,
            translations: translations.map { GeneralSelectOptionTranslation(name: $0.value.name) }
        )
    }
}

extension Array {
    fileprivate func ensureNonEmpty() -> Self? {
        isEmpty ? nil : self
    }
}

extension Property: SelectOptionDerivableWithCategoryConfiguration {
    private func getPrerequisites(config: PropertiesSelectOptionCategory) -> GeneralPrerequisites? {
        let knowledgePrerequisite: PrerequisiteForLevel<GeneralPrerequisiteGroup>? =
            if let requireActiveSelectionOnEntry = config.requireActiveSelectionOnEntry {
                PrerequisiteForLevel(
                    level: 1,
                    prerequisite: .single(
                        .activatable(
                            ActivatablePrerequisite(
                                id: requireActiveSelectionOnEntry,
                                active: true,
                                options: [.property(id)]
                            )))
                )
            } else {
                nil
            }

        let minimumSpellworksPrerequisite: PrerequisiteForLevel<GeneralPrerequisiteGroup>? =
            if let requireMinimumSpellworksOn = config.requireMinimumSpellworksOn {
                PrerequisiteForLevel(
                    level: 1,
                    prerequisite: .single(
                        .ratedMinimumNumber(
                            RatedMinimumNumberPrerequisite(
                                number: requireMinimumSpellworksOn.number,
                                value: requireMinimumSpellworksOn.rating,
                                targets: .spellworks(.init(property: id))
                            )))
                )
            } else {
                nil
            }

        return [knowledgePrerequisite, minimumSpellworksPrerequisite].compactMap { $0 }
            .ensureNonEmpty()
    }

    public func asSelectOption(
        of parent: SelectOptionParentIdentifier, with config: PropertiesSelectOptionCategory
    ) -> ResolvedSelectOption {
        ResolvedSelectOption(
            id: .property(id),
            parent: parent,
            prerequisites: getPrerequisites(config: config),
            translations: translations.map { GeneralSelectOptionTranslation(name: $0.value.name) }
        )
    }
}

extension Aspect: SelectOptionDerivableWithCategoryConfiguration {
    private func getPrerequisites(config: AspectSelectOptionCategory) -> GeneralPrerequisites? {
        let knowledgePrerequisite: PrerequisiteForLevel<GeneralPrerequisiteGroup>? =
            if let requireActiveSelectionOnEntry = config.requireActiveSelectionOnEntry {
                PrerequisiteForLevel(
                    level: 1,
                    prerequisite: .single(
                        .activatable(
                            ActivatablePrerequisite(
                                id: requireActiveSelectionOnEntry,
                                active: true,
                                options: [.aspect(id)]
                            )))
                )
            } else {
                nil
            }

        let minimumSpellworksPrerequisite: PrerequisiteForLevel<GeneralPrerequisiteGroup>? =
            if let requireMinimumLiturgiesOn = config.requireMinimumLiturgiesOn {
                PrerequisiteForLevel(
                    level: 1,
                    prerequisite: .single(
                        .ratedMinimumNumber(
                            RatedMinimumNumberPrerequisite(
                                number: requireMinimumLiturgiesOn.number,
                                value: requireMinimumLiturgiesOn.rating,
                                targets: .liturgies(.init(aspect: id))
                            )))
                )
            } else {
                nil
            }

        return [knowledgePrerequisite, minimumSpellworksPrerequisite].compactMap { $0 }
            .ensureNonEmpty()
    }

    public func asSelectOption(
        of parent: SelectOptionParentIdentifier, with config: AspectSelectOptionCategory
    ) -> ResolvedSelectOption {
        ResolvedSelectOption(
            id: .aspect(id),
            parent: parent,
            prerequisites: getPrerequisites(config: config),
            translations: translations.map {
                GeneralSelectOptionTranslation(
                    name: config.useMasterOfSuffixAsName == true
                        ? $0.value.masterOfAspectSuffix ?? $0.value.name : $0.value.name
                )
            }
        )
    }
}

extension Disease: SelectOptionDerivableWithCategoryConfiguration {
    public func asSelectOption(
        of parent: SelectOptionParentIdentifier, with config: DiseasesPoisonsSelectOptionCategory
    ) -> ResolvedSelectOption {
        ResolvedSelectOption(
            id: .disease(id),
            parent: parent,
            apValue: .fixed(
                config.useHalfLevelAsApValue == true ? Int((Double(level) / 2.0).rounded()) : level),
            src: src,
            translations: translations.map { GeneralSelectOptionTranslation(name: $0.value.name) }
        )
    }
}

extension Poison: SelectOptionDerivableWithCategoryConfiguration {
    public func asSelectOption(
        of parent: SelectOptionParentIdentifier, with config: DiseasesPoisonsSelectOptionCategory
    ) -> ResolvedSelectOption {
        ResolvedSelectOption(
            id: .poison(id),
            parent: parent,
            apValue: .fixed(
                config.useHalfLevelAsApValue == true
                    ? Int((Double(normalizedLevel) / 2.0).rounded()) : normalizedLevel),
            src: src,
            translations: translations.map { GeneralSelectOptionTranslation(name: $0.value.name) }
        )
    }
}

extension Language: SelectOptionDerivableWithCategoryConfiguration {
    private func getPrerequisites(config: LanguagesSelectOptionCategory) -> GeneralPrerequisites? {
        guard let prerequisites = config.prerequisites else { return nil }
        return prerequisites.map {
            switch $0 {
            case .selectOption(let prerequisite):
                return PrerequisiteForLevel(
                    level: 1,
                    prerequisite: .single(
                        .activatable(
                            ActivatablePrerequisite(
                                id: prerequisite.id,
                                active: prerequisite.active,
                                level: prerequisite.level,
                                options: [.language(id)]))))
            }
        }
    }

    public func asSelectOption(
        of parent: SelectOptionParentIdentifier, with config: LanguagesSelectOptionCategory
    ) -> ResolvedSelectOption {
        ResolvedSelectOption(
            id: .language(id),
            parent: parent,
            prerequisites: getPrerequisites(config: config),
            src: src,
            translations: translations.map { GeneralSelectOptionTranslation(name: $0.value.name) }
        )
    }
}

extension BlessedTradition: SelectOptionDerivableWithCategoryConfiguration {
    private func getPrerequisites(
        config: BlessedTraditionsSelectOptionCategory, originalParentId: ActivatableIdentifier
    ) -> GeneralPrerequisites? {
        guard config.requirePrinciples == true,
            let associatedPrinciplesId
        else { return nil }

        return [
            .init(
                level: 1,
                prerequisite: .single(
                    .activatable(
                        .init(
                            id: originalParentId,
                            active: true,
                            options: [.general(associatedPrinciplesId)]
                        )))
            )
        ]
    }

    public func asSelectOption(
        of parent: SelectOptionParentIdentifier,
        with config: (
            config: BlessedTraditionsSelectOptionCategory, originalParentId: ActivatableIdentifier
        )
    ) -> ResolvedSelectOption {
        ResolvedSelectOption(
            id: .blessedTradition(id),
            parent: parent,
            prerequisites: getPrerequisites(
                config: config.0, originalParentId: config.originalParentId),
            src: src,
            translations: translations.map { GeneralSelectOptionTranslation(name: $0.value.name) }
        )
    }
}

extension Patron: SelectOptionDerivable {
    public func asSelectOption(of parent: SelectOptionParentIdentifier) -> ResolvedSelectOption {
        ResolvedSelectOption(
            id: .patron(id),
            parent: parent,
            src: src,
            translations: translations.map { GeneralSelectOptionTranslation(name: $0.value.name) }
        )
    }
}

extension Advantage: SelectOptionDerivable {
    public func asSelectOption(of parent: SelectOptionParentIdentifier) -> ResolvedSelectOption {
        let apValueForOption: TradeSecretAdventurePointsValue? =
            switch apValue {
            case .fixed(let fixed):
                .fixed(fixed)
            case .byLevel(_), .dependingOnActive(_), .dependingOnActiveInstances(_),
                .derivedFromSelection(_), .indefinite:
                nil
            }

        return ResolvedSelectOption(
            id: .advantage(id),
            parent: parent,
            apValue: apValueForOption,
            translations: translations.map { GeneralSelectOptionTranslation(name: $0.value.name) }
        )
    }
}

extension TargetCategory: SelectOptionDerivableWithCategoryConfiguration {
    public func asSelectOption(of parent: SelectOptionParentIdentifier, with volume: Int?)
        -> ResolvedSelectOption
    {
        ResolvedSelectOption(
            id: .targetCategory(id),
            parent: parent,
            volume: volume,
            translations: translations.map { GeneralSelectOptionTranslation(name: $0.value.name) }
        )
    }
}
