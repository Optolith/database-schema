import * as DB from "tsondb/schema/dsl"
import { TargetCategoryIdentifier } from "./_Identifier.js"
import { NestedTranslationMap } from "./Locale.js"

export const AffectedTargetCategories = DB.TypeAlias(import.meta.url, {
  name: "AffectedTargetCategories",
  comment: `The target category – the kind of creature or object – the skill affects.

If no target categories are given, the skill applies to all target categories.`,
  type: () => DB.Array(DB.IncludeIdentifier(SpecificAffectedTargetCategory)),
})

const SpecificAffectedTargetCategory = DB.TypeAlias(import.meta.url, {
  name: "SpecificAffectedTargetCategory",
  type: () =>
    DB.Object({
      id: DB.Required({ type: DB.IncludeIdentifier(SpecificAffectedTargetCategoryIdentifier) }),
      translations: NestedTranslationMap(
        DB.Optional,
        "SpecificAffectedTargetCategory",
        DB.Object({
          note: DB.Required({ type: DB.String({ minLength: 1 }) }),
        }),
      ),
    }),
})

const SpecificAffectedTargetCategoryIdentifier = DB.Enum(import.meta.url, {
  name: "SpecificAffectedTargetCategoryIdentifier",
  values: () => ({
    Self: DB.EnumCase({ type: null }),
    Zone: DB.EnumCase({ type: null }),
    LiturgicalChantsAndCeremonies: DB.EnumCase({ type: null }),
    Cantrips: DB.EnumCase({ type: null }),
    Spellworks: DB.EnumCase({ type: null }),
    Predefined: DB.EnumCase({ type: TargetCategoryIdentifier() }),
  }),
})
