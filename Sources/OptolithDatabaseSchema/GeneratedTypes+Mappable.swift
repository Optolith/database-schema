//
//  GeneratedTypes+Mappable.swift
//  OptolithDatabaseSchema
//
//  Created by Lukas Obermann on 21.11.26.
//

extension LocaleMap {
    public func map<U>(_ transform: ((key: Locale.ID, value: T)) -> U) -> LocaleMap<U> {
        var newMap: [Locale.ID: U] = [:]
        for pair in self.map {
            newMap[pair.key] = transform(pair)
        }
        return LocaleMap<U>(newMap)
    }
}

extension PrerequisitesElement {
    public func map<U>(_ transform: (T) -> U) -> PrerequisitesElement<U> {
        switch self {
        case .single(let group): return .single(transform(group))
        case .disjunction(let disjunction):
            return .disjunction(
                PrerequisitesDisjunction(
                    list: disjunction.list.map { transform($0) },
                    displayOption: disjunction.displayOption))
        case .group(let group):
            return .group(
                PrerequisiteGroup(
                    list: group.list.map { transform($0) },
                    translations: group.translations))
        }
    }
}
