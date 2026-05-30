import * as DB from "tsondb/schema/dsl"
import { NestedTranslationMap } from "./Locale.js"
import { RequirableSelectOptionIdentifier } from "./_IdentifierGroup.ts"

export const CommonnessRatedAdvantageDisadvantage = DB.GenTypeAlias(import.meta.url, {
  name: "CommonnessRatedAdvantageDisadvantage",
  comment:
    "Reference to a commonness-rated advantage or disadvantage. Commonness-rating terms used in the source books are strongly recommended, common, uncommon, suggested and unsuitable.",
  parameters: [DB.Param("Identifier")],
  type: Identifier =>
    DB.Object({
      id: DB.Required({
        comment: "The advantage’s or disadvantage’s identifier.",
        type: DB.TypeArgument(Identifier),
      }),
      level: DB.Optional({
        comment: "The level of a commonness-rated advantage or disadvantage.",
        type: DB.IncludeIdentifier(CommonnessRatedAdvantageDisadvantageLevel),
      }),
      options: DB.Optional({
        comment: "The options the commonness rating applies to.",
        type: DB.Array(DB.IncludeIdentifier(RequirableSelectOptionIdentifier), { minItems: 1 }),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "CommonnessRatedAdvantageDisadvantage",
        DB.Object({
          options: DB.Required({
            comment:
              "The options the commonness rating applies to. This can be specified if plain options cannot exactly describe the options as written in the publication.",
            type: DB.String({ minLength: 1 }),
          }),
        }),
      ),
    }),
})

const CommonnessRatedAdvantageDisadvantageLevel = DB.Enum(import.meta.url, {
  name: "CommonnessRatedAdvantageDisadvantageLevel",
  comment: "The level of a commonness-rated advantage or disadvantage.",
  values: () => ({
    Constant: DB.EnumCase({ type: DB.Integer({ minimum: 1 }) }),
    Range: DB.EnumCase({
      type: DB.Object({
        min: DB.Required({ type: DB.Integer({ minimum: 1 }) }),
        max: DB.Required({ type: DB.Integer({ minimum: 1 }) }),
      }),
    }),
  }),
})
