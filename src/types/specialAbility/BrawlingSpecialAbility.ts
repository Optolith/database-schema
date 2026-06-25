import * as DB from "tsondb/schema/dsl"
import { levels, maximum, name, name_in_library, rules } from "../_Activatable.js"
import { ap_value, ap_value_append, ap_value_l10n } from "../_ActivatableAdventurePointsValue.js"
import { combat_techniques, special_ability_usage_type } from "../_ActivatableCombat.js"
import { activatableDisplayNameCustomizer, nameBuilderRules } from "../_ActivatableNames.js"
import { explicit_select_options, select_options } from "../_ActivatableSelectOptions.js"
import { GeneralPrerequisites } from "../_Prerequisite.js"
import { NestedTranslationMap } from "../Locale.js"
import { Errata } from "../source/_Erratum.js"
import { src } from "../source/_PublicationRef.js"

export const BrawlingSpecialAbility = DB.Entity(import.meta.url, {
  name: "BrawlingSpecialAbility",
  namePlural: "BrawlingSpecialAbilities",
  type: () =>
    DB.Object({
      levels,
      nameBuilderRules,
      usage_type: special_ability_usage_type,
      select_options,
      explicit_select_options,
      maximum,
      prerequisites: DB.Optional({
        type: DB.IncludeIdentifier(GeneralPrerequisites),
      }),
      combat_techniques,
      ap_value,
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "BrawlingSpecialAbility",
        DB.Object({
          name,
          name_in_library,
          rules,
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
