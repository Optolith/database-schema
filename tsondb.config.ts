import { assertExhaustive } from "@elyukai/utils/typeSafety"
import { join } from "node:path"
import type { GenerationConfig } from "tsondb/config"
import { SwiftOutput } from "tsondb/renderer/swift"
import { TypeScriptOutput } from "tsondb/renderer/ts"
import type * as DB from "tsondb/schema/dsl"
import { schema, type TSONDBTypes } from "./lib/main.js"

type TranslationType =
  | DB.ObjectType
  | DB.IncludeIdentifierType<DB.TypeParameter[], DB.TypeAliasDecl<string, TranslationType>>

const resolveIsTranslationWithName = (type: TranslationType): boolean => {
  switch (type.kind) {
    case "ObjectType":
      return (
        "name" in type.properties &&
        type.properties.name.isRequired &&
        type.properties.name.type.kind === "StringType"
      )
    case "IncludeIdentifierType":
      return resolveIsTranslationWithName(type.reference.type.value)
    default:
      return assertExhaustive(type)
  }
}

const config: GenerationConfig<TSONDBTypes> = {
  schema,
  outputs: [
    TypeScriptOutput({
      // oxlint-disable-next-line typescript/no-unsafe-call  typescript/no-unsafe-assignment
      targetPath: join(import.meta.dirname, "gen", "types.d.ts"),
      rendererOptions: {
        generateHelpers: true,
        inferTranslationParameters: {
          format: "mf2",
          otherTypes: {
            list: "string[]",
          },
        },
      },
    }),
    SwiftOutput({
      // oxlint-disable-next-line typescript/no-unsafe-call  typescript/no-unsafe-assignment
      targetPath: join(import.meta.dirname, "Sources", "OptolithDatabaseSchema", "GeneratedTypes"),
      rendererOptions: {
        indentation: 2,
        visibility: "public",
        generateEntityMap: true,
        generateCompressedDatabaseRepresentationType: true,
        generateEntityProtocol: true,
        generateChildEntityProtocol: true,
        generateIdentifierPropertyForEntities: true,
        generateDecodableConformance: true,
        generateStructInitializers: true,
        generateIdentifierGroupIterable: true,
        explicitNestedEntityMapTypes: {
          Locale: {
            comment: "All translations for the entry, identified by IETF language tag (BCP47).",
            typeName: "LocaleMap",
          },
        },
        deriveConformances: decl => {
          const additionalConformances: string[] = []

          if (
            decl.kind === "EntityDecl" &&
            "improvement_cost" in decl.type.value.properties &&
            decl.type.value.properties.improvement_cost.isRequired &&
            decl.type.value.properties.improvement_cost.type.kind === "IncludeIdentifierType" &&
            decl.type.value.properties.improvement_cost.type.reference.name === "ImprovementCost"
          ) {
            additionalConformances.push("Improvable")
          }

          if (
            (decl.kind === "EntityDecl" ||
              decl.kind === "SingletonEntityDecl" ||
              decl.kind === "TypeAliasDecl") &&
            decl.type.value.kind === "ObjectType" &&
            "src" in decl.type.value.properties &&
            decl.type.value.properties.src.isRequired &&
            decl.type.value.properties.src.type.kind === "IncludeIdentifierType" &&
            decl.type.value.properties.src.type.reference.name === "PublicationRefs"
          ) {
            additionalConformances.push("ReferencingPublications")
          }

          if (
            decl.kind === "EntityDecl" &&
            decl.name in
              (schema.getDeclaration("ActivatableIdentifier") as DB.EnumDecl).type.value.values
          ) {
            additionalConformances.push("Activatable")
          }

          if (
            decl.kind === "EntityDecl" &&
            decl.name in
              (schema.getDeclaration("EquipmentIdentifier") as DB.EnumDecl).type.value.values
          ) {
            if (
              // oxlint-disable-next-line typescript/no-unnecessary-condition
              decl.type.value.properties.complexity?.type.kind === "IncludeIdentifierType" &&
              decl.type.value.properties.complexity.type.reference.name === "Complexity"
            ) {
              additionalConformances.push("EquipmentWithComplexity")
            }

            if (
              // oxlint-disable-next-line typescript/no-unnecessary-condition
              decl.type.value.properties.complexity?.type.kind === "IncludeIdentifierType" &&
              decl.type.value.properties.complexity.type.reference.name === "ArmorComplexity"
            ) {
              additionalConformances.push("EquipmentWithArmorComplexity")
            }
          }

          if (
            decl.kind === "EntityDecl" &&
            "select_options" in decl.type.value.properties &&
            decl.type.value.properties.select_options.type.kind === "IncludeIdentifierType" &&
            decl.type.value.properties.select_options.type.reference.name === "SelectOptions"
          ) {
            additionalConformances.push("ConfigurableWithSelectOptions")
          }

          if (
            decl.kind === "TypeAliasDecl" &&
            decl.type.value.kind === "ObjectType" &&
            decl.name.endsWith("Translation") &&
            resolveIsTranslationWithName(decl.type.value)
          ) {
            additionalConformances.push("NameableTranslation")
          }

          if (
            (decl.kind === "EntityDecl" ||
              decl.kind === "SingletonEntityDecl" ||
              decl.kind === "TypeAliasDecl") &&
            decl.type.value.kind === "ObjectType" &&
            "translations" in decl.type.value.properties &&
            decl.type.value.properties.translations.isRequired &&
            decl.type.value.properties.translations.type.kind === "NestedEntityMapType" &&
            decl.type.value.properties.translations.type.secondaryEntity === schema.localeEntity
          ) {
            if (
              resolveIsTranslationWithName(decl.type.value.properties.translations.type.type.value)
            ) {
              additionalConformances.push("NameableTranslatable")
            } else {
              additionalConformances.push("Translatable")
            }
          }

          return additionalConformances
        },
      },
    }),
    // JsonSchemaOutput({
    //   targetPath: join(import.meta.dirname, "gen", "types.schema.json"),
    //   rendererOptions: {
    //     preserveFiles: true,
    //   },
    // }),
  ],
}

export default config
