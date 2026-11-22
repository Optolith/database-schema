//
//  Database.swift
//  OptolithDatabaseSchema
//
//  Created by Lukas Obermann on 16.11.2026.
//

import Foundation

public class Database {
    private let data: CompressedDatabaseRepresentation

    public init(from file: Data) throws {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        decoder.keyDecodingStrategy = .convertFromSnakeCase

        self.data = try decoder.decode(
            CompressedDatabaseRepresentationWithMetadata.self, from: file
        ).data
    }

    public func getInstance<T: Entity>(of type: T.Type, by id: T.ID) -> T? {
        data.getDictionary(for: type)[id]
    }

    public func getAllInstances<T: Entity>(of type: T.Type) -> [T] {
        Array(data.getDictionary(for: type).values)
    }

    public func countInstances<T: Entity>(of type: T.Type) -> Int {
        data.getDictionary(for: type).count
    }

    public func getSingletonInstance<T>(of type: T.Type) -> T? {
        data.getSingleton(for: type)
    }

    public func getAllChildInstances<T: ChildEntity>(of type: T.Type, forParent parent: T.ParentID)
        -> [T]
    {
        data.getDictionary(for: type).values.filter { parent == $0[keyPath: T.parentId] }
    }
}
