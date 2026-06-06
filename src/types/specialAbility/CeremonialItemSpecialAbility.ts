import * as DB from "tsondb/schema/dsl"
import { effect, levels, maximum, name, name_in_library } from "../_Activatable.js"
import { ap_value, ap_value_append, ap_value_l10n } from "../_ActivatableAdventurePointsValue.js"
import { activatableDisplayNameCustomizer, nameBuilderRules } from "../_ActivatableNames.ts"
import { aspectOptional } from "../_ActivatableNonMundane.js"
import { explicit_select_options, select_options } from "../_ActivatableSelectOptions.js"
import { skill_applications, skill_uses } from "../_ActivatableSkillApplicationsAndUses.js"
import { GeneralPrerequisites } from "../_Prerequisite.js"
import { NestedTranslationMap } from "../Locale.js"
import { Errata } from "../source/_Erratum.js"
import { src } from "../source/_PublicationRef.js"

export const CeremonialItemSpecialAbility = DB.Entity(import.meta.url, {
  name: "CeremonialItemSpecialAbility",
  namePlural: "CeremonialItemSpecialAbilities",
  type: () =>
    DB.Object({
      levels,
      nameBuilderRules,
      select_options,
      explicit_select_options,
      skill_applications,
      skill_uses,
      maximum,
      aspect: aspectOptional(),
      prerequisites: DB.Optional({
        type: DB.IncludeIdentifier(GeneralPrerequisites),
      }),
      ap_value,
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "CeremonialItemSpecialAbility",
        DB.Object({
          name,
          name_in_library,
          effect,
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
    [
      {
        keyPath: "aspect",
      },
      {
        entityMapKeyPath: "translations",
        keyPathInEntityMap: "name_in_library",
        keyPathInEntityMapFallback: "name",
      },
    ],
  ],
})
