//
//  Database.swift
//  OptolithDatabaseSchema
//
//  Created by Lukas Obermann on 16.11.2026.
//

import Foundation

public class Database {
    private let data: CompressedDatabaseRepresentation
    
    init(from file: Data) throws {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        
        self.data = try decoder.decode(CompressedDatabaseRepresentationWithMetadata.self, from: file).data
    }
    
    func getInstance<T>(of type: T.Type, by id: String) -> T? {
        data.getDictionary(for: type)[id]
    }
    
    func getAllInstances<T>(of type: T.Type) -> [T] {
        Array(data.getDictionary(for: type).values)
    }
    
    func getSingletonInstance<T>(of type: T.Type) -> T? {
        data.getSingleton(for: type)
    }
    
    func getAllChildInstances<T: ChildEntity>(of type: T.Type, forParent parent: T.ParentID) -> [T] {
        data.getDictionary(for: type).values.filter { parent == $0[keyPath: T.parentId] }
    }
}
