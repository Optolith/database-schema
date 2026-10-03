import * as DB from "tsondb/schema/dsl"
import { NestedTranslationMap } from "./Locale.js"

export const SocialStatus = DB.Entity(import.meta.url, {
  name: "SocialStatus",
  namePlural: "SocialStatuses",
  type: () =>
    DB.Object({
      position: DB.Required({
        comment:
          "The social status’ position. The higher the position, the more powerful the social status. This has to be a unique value.",
        type: DB.Integer({ minimum: 1 }),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "SocialStatus",
        DB.Object({
          name: DB.Required({
            comment: "The social status’ name.",
            type: DB.String({ minLength: 1 }),
          }),
        }),
      ),
    }),
  instanceDisplayName: {},
  sortOrder: { keyPath: "position", isIndex: true },
  uniqueConstraints: [
    { keyPath: "position" },
    {
      entityMapKeyPath: "translations",
      keyPathInEntityMap: "name",
    },
  ],
})
