import * as DB from "tsondb/schema/dsl"
import { GradientColor } from "./_Color.ts"
import { SkillCheck } from "./_SkillCheck.js"
import { NestedTranslationMap } from "./Locale.js"

export const SkillGroup = DB.Entity(import.meta.url, {
  name: "SkillGroup",
  namePlural: "SkillGroups",
  type: () =>
    DB.Object({
      position: DB.Required({
        comment: "The position of the skill group in lists. This has to be a unique value.",
        type: DB.Integer({ minimum: 0 }),
      }),
      check: DB.Required({
        comment: "The skill group’s skill check attributes",
        type: DB.IncludeIdentifier(SkillCheck),
      }),
      color: DB.Required({
        comment: "The display color of the skill group.",
        type: DB.IncludeIdentifier(GradientColor),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "SkillGroup",
        DB.Object({
          name: DB.Required({
            comment: "The skill group’s name.",
            type: DB.String({ minLength: 1 }),
          }),
          longName: DB.Required({
            comment: "The skill group’s long name.",
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
  ],
})
