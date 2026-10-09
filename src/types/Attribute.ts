import * as DB from "tsondb/schema/dsl"
import { AttributeColor } from "./_Color.ts"
import { NestedTranslationMap } from "./Locale.js"

export const Attribute = DB.Entity(import.meta.url, {
  name: "Attribute",
  namePlural: "Attributes",
  comment: "A base attribute of a character.",
  type: () =>
    DB.Object({
      position: DB.Required({
        comment: "The position of the attribute in lists. This has to be a unique value.",
        type: DB.Integer({ minimum: 0 }),
      }),
      color: DB.Required({
        comment: "The display color of the attribute.",
        type: DB.IncludeIdentifier(AttributeColor),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "Attribute",
        DB.Object({
          name: DB.Required({
            comment: "The attribute’s name.",
            type: DB.String({ minLength: 1 }),
          }),
          abbreviation: DB.Required({
            comment: "The abbreviation of the attribute’s name.",
            type: DB.String({ minLength: 1 }),
          }),
          description: DB.Required({
            comment: "The description of the attribute.",
            type: DB.String({ minLength: 1 }),
          }),
        }),
      ),
    }),
  instanceDisplayName: {},
  sortOrder: { keyPath: "position", isIndex: true },
  uniqueConstraints: [
    {
      keyPath: "position",
    },
    {
      entityMapKeyPath: "translations",
      keyPathInEntityMap: "name",
    },
    {
      entityMapKeyPath: "translations",
      keyPathInEntityMap: "abbreviation",
    },
  ],
})
