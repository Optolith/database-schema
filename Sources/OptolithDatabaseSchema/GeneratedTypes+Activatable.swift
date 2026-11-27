//
//  GeneratedTypes+Activatable.swift
//  OptolithDatabaseSchema
//
//  Created by Lukas Obermann on 21.11.26.
//

public protocol Activatable: ConfigurableWithSelectOptions, ReferencingPublications {
    var nameBuilderRules: ActivatableNameBuilderRules? { get }
}

extension BlessedTradition {
    public var nameBuilderRules: ActivatableNameBuilderRules? { nil }
}

extension MagicalSign {
    public var nameBuilderRules: ActivatableNameBuilderRules? { nil }
    public var selectOptions: SelectOptions? { nil }
}
