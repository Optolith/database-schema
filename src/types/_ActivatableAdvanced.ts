import * as DB from "tsondb/schema/dsl"
import { MagicalTraditionIdentifier, PatronIdentifier } from "./_Identifier.js"
import { AdvancedSpecialAbilityRestrictedOptionIdentifier } from "./_IdentifierGroup.js"
import { DisplayOption } from "./prerequisites/DisplayOption.js"

const AdvancedSpecialAbility = DB.GenEnum(import.meta.url, {
  name: "AdvancedSpecialAbility",
  comment: "A reference to an advanced special ability.",
  parameters: [DB.Param("Identifier")],
  values: Identifier => ({
    General: DB.EnumCase({ type: DB.TypeArgument(Identifier) }),
    RestrictOptions: DB.EnumCase({
      type: DB.GenIncludeIdentifier(RestrictAdvancedSpecialAbilityOptions, [
        DB.TypeArgument(Identifier),
      ]),
    }),
    OneOf: DB.EnumCase({
      type: DB.GenIncludeIdentifier(OneOfAdvancedSpecialAbilityOptions, [
        DB.TypeArgument(Identifier),
      ]),
    }),
    DeriveFromExternalOption: DB.EnumCase({
      type: DB.GenIncludeIdentifier(AdvancedSpecialAbilityDerivedFromExternalOption, [
        DB.TypeArgument(Identifier),
      ]),
    }),
    Any: DB.EnumCase({
      comment: "Any advanced special ability is possible.",
      type: null,
    }),
  }),
})

const RestrictAdvancedSpecialAbilityOptions = DB.GenTypeAlias(import.meta.url, {
  name: "RestrictAdvancedSpecialAbilityOptions",
  parameters: [DB.Param("Identifier")],
  type: Identifier =>
    DB.Object({
      id: DB.Required({
        comment: "The advanced special ability’s identifier.",
        type: DB.TypeArgument(Identifier),
      }),
      option: DB.Required({
        comment:
          "Specify the select option(s) that only are allowed for the referenced advanced special ability; others are disallowed.",
        type: DB.Array(DB.IncludeIdentifier(AdvancedSpecialAbilityRestrictedOptionIdentifier), {
          minItems: 1,
        }),
      }),
    }),
})

const OneOfAdvancedSpecialAbilityOptions = DB.GenTypeAlias(import.meta.url, {
  name: "OneOfAdvancedSpecialAbilityOptions",
  parameters: [DB.Param("Identifier")],
  type: Identifier =>
    DB.Object({
      options: DB.Required({
        comment: "The possible advanced special abilities.",
        type: DB.Array(DB.TypeArgument(Identifier), { minItems: 2 }),
      }),
      is_selection_required_on_purchase: DB.Required({
        comment:
          "Do have to choose the advanced special ability when buying the style special ability? Otherwise the decision can be made later.",
        type: DB.Boolean(),
      }),
      display_option: DB.Optional({
        type: DB.IncludeIdentifier(DisplayOption),
      }),
    }),
})

const AdvancedSpecialAbilityDerivedFromExternalOption = DB.GenTypeAlias(import.meta.url, {
  name: "AdvancedSpecialAbilityDerivedFromExternalOption",
  parameters: [DB.Param("Identifier")],
  type: Identifier =>
    DB.Object({
      external_entry: DB.Required({
        comment: "The possible advanced special abilities.",
        type: MagicalTraditionIdentifier(),
      }),
      map: DB.Required({
        comment: "Map options from the external entry to allowed advanced special abilities.",
        type: DB.Array(
          DB.GenIncludeIdentifier(AdvancedSpecialAbilityDerivedFromExternalOptionMapping, [
            DB.TypeArgument(Identifier),
          ]),
          { minItems: 1 },
        ),
      }),
      display_option: DB.Optional({
        type: DB.IncludeIdentifier(DisplayOption),
      }),
    }),
})

const AdvancedSpecialAbilityDerivedFromExternalOptionMapping = DB.GenTypeAlias(import.meta.url, {
  name: "AdvancedSpecialAbilityDerivedFromExternalOptionMapping",
  parameters: [DB.Param("Identifier")],
  comment: "Mapping from an option of the external entry to an allowed advanced special ability.",
  type: Identifier =>
    DB.Object({
      from_option: DB.Required({
        comment: "The select option’s identifier.",
        type: PatronIdentifier(),
      }),
      to_advanced: DB.Required({
        comment: "The advanced special ability’s identifier.",
        type: DB.TypeArgument(Identifier),
      }),
    }),
})

export const advanced = (identifier: DB.Type) =>
  DB.Required({
    comment:
      "The Advanced Special Abilities for the respective Style Special Ability. Sometimes, only a specific select option or a set of select options of an entry is allowed, which can be modelled by the option property. It can also be that you can choose from a set of special abilities, but then you can’t specify an option.",
    type: DB.Array(DB.GenIncludeIdentifier(AdvancedSpecialAbility, [identifier]), {
      minItems: 3,
      maxItems: 3,
    }),
  })
