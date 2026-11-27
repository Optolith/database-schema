//
//  GeneratedTypes+ReferencingPublications.swift
//  OptolithDatabaseSchema
//
//  Created by Lukas Obermann on 21.11.26.
//

public protocol ReferencingPublications {
    var src: PublicationRefs { get }
}

public protocol PossiblyReferencingPublications {
    var src: PublicationRefs? { get }
}
