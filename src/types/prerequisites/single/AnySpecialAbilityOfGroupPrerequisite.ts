import * as DB from "tsondb/schema/dsl"
import { SpecialAbilityIdentifier } from "../../_IdentifierGroup.ts"
import { DisplayOption } from "../DisplayOption.ts"

export const AnySpecialAbilityOfGroupPrerequisite = DB.TypeAlias(import.meta.url, {
  name: "AnySpecialAbilityOfGroupPrerequisite",
  type: () =>
    DB.Object({
      group: DB.Required({
        type: DB.IncludeIdentifier(SpecialAbilityGroup),
      }),
      display_option: DB.Optional({
        type: DB.IncludeIdentifier(DisplayOption),
      }),
    }),
})

const SpecialAbilityGroup = DB.Enum(import.meta.url, {
  name: "SpecialAbilityGroup",
  values: () => ({
    ...Object.fromEntries(
      Object.keys(SpecialAbilityIdentifier.type.value.values).map(entity => [
        entity,
        DB.EnumCase({ type: null }),
      ]),
    ),
  }),
})
