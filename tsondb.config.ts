import { join } from "node:path"
import type { GenerationConfig } from "tsondb/config"
import { SwiftOutput } from "tsondb/renderer/swift"
import { TypeScriptOutput } from "tsondb/renderer/ts"
import { schema, type TSONDBTypes } from "./lib/main.js"

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
        visibility: "public",
        generateEntityMap: true,
        generateCompressedDatabaseRepresentationType: true,
        generateChildEntityProtocol: true,
        generateIdentifierPropertyForEntities: true,
        generateDecodableConformance: true,
        explicitNestedEntityMapTypes: {
          Locale: {
            comment: "All translations for the entry, identified by IETF language tag (BCP47).",
            typeName: "LocaleMap",
          },
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
