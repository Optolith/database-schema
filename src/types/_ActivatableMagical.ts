import * as DB from "tsondb/schema/dsl"

const AdvantageDisadvantageSubtype = DB.Enum(import.meta.url, {
  name: "AdvantageDisadvantageSubtype",
  values: () => ({
    MagicalRank: DB.EnumCase({ type: null }),
    MagicalTitle: DB.EnumCase({ type: null }),
    MagicalHonor: DB.EnumCase({ type: null }),
    MagicalPunishment: DB.EnumCase({ type: null }),
  }),
})

export const subtype = DB.Optional({ type: DB.IncludeIdentifier(AdvantageDisadvantageSubtype) })
