import * as DB from "tsondb/schema/dsl"
import { input, levels, maximum, name, name_in_library, rules } from "../_Activatable.js"
import { ap_value, ap_value_append, ap_value_l10n } from "../_ActivatableAdventurePointsValue.js"
import {
  combat_techniques,
  penalty,
  penalty_l10n,
  special_ability_usage_type,
} from "../_ActivatableCombat.js"
import { activatableDisplayNameCustomizer, nameBuilderRules } from "../_ActivatableNames.ts"
import { explicit_select_options, select_options } from "../_ActivatableSelectOptions.js"
import { skill_applications, skill_uses } from "../_ActivatableSkillApplicationsAndUses.js"
import { GeneralPrerequisites } from "../_Prerequisite.js"
import { NestedTranslationMap } from "../Locale.js"
import { Errata } from "../source/_Erratum.js"
import { src } from "../source/_PublicationRef.js"

export const CombatSpecialAbility = DB.Entity(import.meta.url, {
  name: "CombatSpecialAbility",
  namePlural: "CombatSpecialAbilities",
  type: () =>
    DB.Object({
      levels,
      nameBuilderRules,
      special_ability_usage_type,
      select_options,
      explicit_select_options,
      skill_applications,
      skill_uses,
      maximum,
      penalty,
      prerequisites: DB.Optional({
        type: DB.IncludeIdentifier(GeneralPrerequisites),
      }),
      combat_techniques,
      ap_value,
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "CombatSpecialAbility",
        DB.Object({
          name,
          name_in_library,
          input,
          rules,
          penalty: penalty_l10n,
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
