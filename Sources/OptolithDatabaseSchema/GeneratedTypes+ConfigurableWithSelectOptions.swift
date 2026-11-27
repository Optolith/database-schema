//
//  GeneratedTypes+ConfigurableWithSelectOptions.swift
//  OptolithDatabaseSchema
//
//  Created by Lukas Obermann on 21.11.26.
//

import Foundation

public protocol ConfigurableWithSelectOptions: GeneralEntity {
    var selectOptions: SelectOptions? { get }
}

public protocol SkillSelectOptionCategoryConfigurable {
    associatedtype ID: Decodable, Equatable, Sendable

    var bindingCost: SelectOptionsBindingCostValue<ID>? { get }
    var apValue: SelectOptionsAdventurePointsValue<ID>? { get }
}

extension SkillsSelectOptionCategory: SkillSelectOptionCategoryConfigurable {
    public var bindingCost: SelectOptionsBindingCostValue<ID>? { nil }
}

extension CombatTechniquesSelectOptionCategory: SkillSelectOptionCategoryConfigurable {}
