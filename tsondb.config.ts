import { join } from "node:path"
import type { GenerationConfig } from "tsondb/config"
import { TypeScriptOutput } from "tsondb/renderer/ts"
import { schema, type TSONDBTypes } from "./lib/main.js"

const config: GenerationConfig<TSONDBTypes> = {
  schema: schema,
  outputs: [
    TypeScriptOutput({
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
    // JsonSchemaOutput({
    //   targetPath: join(import.meta.dirname, "gen", "types.schema.json"),
    //   rendererOptions: {
    //     preserveFiles: true,
    //   },
    // }),
  ],
}

export default config
