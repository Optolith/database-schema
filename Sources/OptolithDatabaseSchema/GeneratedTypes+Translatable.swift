//
//  GeneratedTypes+Translatable.swift
//  OptolithDatabaseSchema
//
//  Created by Lukas Obermann on 21.11.26.
//

public protocol Translatable {
    associatedtype Translation: Decodable, Equatable, Sendable

    var translations: LocaleMap<Translation> { get }
}

public protocol NameableTranslation: Decodable, Equatable, Sendable {
    var name: String { get }
}

public protocol NameableTranslatable: Translatable where Translation: NameableTranslation {}
