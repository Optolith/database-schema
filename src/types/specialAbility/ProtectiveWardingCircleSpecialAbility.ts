import * as DB from "tsondb/schema/dsl"
import { levels, maximum, name, name_in_library } from "../_Activatable.js"
import { ap_value, ap_value_append, ap_value_l10n } from "../_ActivatableAdventurePointsValue.js"
import { activatableDisplayNameCustomizer, nameBuilderRules } from "../_ActivatableNames.ts"
import { explicit_select_options, select_options } from "../_ActivatableSelectOptions.js"
import { GeneralPrerequisites } from "../_Prerequisite.js"
import { NestedTranslationMap } from "../Locale.js"
import { Errata } from "../source/_Erratum.js"
import { src } from "../source/_PublicationRef.js"

export const ProtectiveWardingCircleSpecialAbility = DB.Entity(import.meta.url, {
  name: "ProtectiveWardingCircleSpecialAbility",
  namePlural: "ProtectiveWardingCircleSpecialAbilities",
  type: () =>
    DB.Object({
      levels,
      nameBuilderRules,
      select_options,
      explicit_select_options,
      maximum,
      prerequisites: DB.Optional({
        type: DB.IncludeIdentifier(GeneralPrerequisites),
      }),
      cost: DB.Required({
        comment: "The cost in AE.",
        type: DB.Integer({ minimum: 0 }),
      }),
      ap_value,
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "ProtectiveWardingCircleSpecialAbility",
        DB.Object({
          name,
          name_in_library,
          protective_circle: DB.Required({
            comment: "The rules for the protective circle variant.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          warding_circle: DB.Optional({
            comment: "The rules for the warding circle variant.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          ap_value_append,
          ap_value: ap_value_l10n,
          errata: DB.Optional({
            type: DB.IncludeIdentifier(Errata),
          }),
        }),
      ),
    }),
  instanceDisplayName: {},
  instanceDisplayNameCustomizer: activatableDisplayNameCustomizer,
  uniqueConstraints: [
    {
      entityMapKeyPath: "translations",
      keyPathInEntityMap: "name_in_library",
      keyPathInEntityMapFallback: "name",
    },
  ],
})
