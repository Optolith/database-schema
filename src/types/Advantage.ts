import * as DB from "tsondb/schema/dsl"
import { input, levels, maximum, name, name_in_library, range_l10n, rules } from "./_Activatable.js"
import { ap_value, ap_value_append, ap_value_l10n } from "./_ActivatableAdventurePointsValue.js"
import { automatic_entries } from "./_ActivatableAutomatic.js"
import { activatableDisplayNameCustomizer, nameBuilderRules } from "./_ActivatableNames.ts"
import { explicit_select_options, select_options } from "./_ActivatableSelectOptions.js"
import { skill_applications, skill_uses } from "./_ActivatableSkillApplicationsAndUses.js"
import { AdvantageDisadvantagePrerequisites } from "./_Prerequisite.js"
import { NestedTranslationMap } from "./Locale.js"
import { Errata } from "./source/_Erratum.js"
import { src } from "./source/_PublicationRef.js"

export const Advantage = DB.Entity(import.meta.url, {
  name: "Advantage",
  namePlural: "Advantages",
  type: () =>
    DB.Object({
      levels,
      nameBuilderRules,
      select_options,
      explicit_select_options,
      skill_applications,
      skill_uses,
      maximum,
      automatic_entries,
      prerequisites: DB.Optional({
        type: DB.IncludeIdentifier(AdvantageDisadvantagePrerequisites),
      }),
      ap_value,
      has_maximum_spent_influence: DB.Required({
        comment: "Does this advantage count towards the maximum of AP to be spent on advantages?",
        type: DB.Boolean(),
      }),
      is_exclusive_to_arcane_spellworks: DB.Required({
        comment:
          "Does this advantage exclusively applies to arcane spellworks and not to magical actions and magical applications?",
        type: DB.Boolean(),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "Advantage",
        DB.Object({
          name,
          name_in_library,
          input,
          rules,
          range: range_l10n,
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
