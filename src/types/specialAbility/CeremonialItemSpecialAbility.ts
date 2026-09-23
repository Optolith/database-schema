import * as DB from "tsondb/schema/dsl"
import { effect, levels, maximum, name, name_in_library } from "../_Activatable.js"
import { ap_value, ap_value_append, ap_value_l10n } from "../_ActivatableAdventurePointsValue.js"
import { nameBuilderRules } from "../_ActivatableNames.ts"
import { aspectOptional } from "../_ActivatableNonMundane.js"
import { explicit_select_options, select_options } from "../_ActivatableSelectOptions.js"
import { skill_applications, skill_uses } from "../_ActivatableSkillApplicationsAndUses.js"
import { CeremonialItemSpecialAbilityGroupIdentifier } from "../_Identifier.ts"
import { GeneralPrerequisites } from "../_Prerequisite.js"
import { NestedTranslationMap } from "../Locale.js"
import { Errata } from "../source/_Erratum.js"
import { src } from "../source/_PublicationRef.js"

export const CeremonialItemSpecialAbility = DB.Entity(import.meta.url, {
  name: "CeremonialItemSpecialAbility",
  namePlural: "CeremonialItemSpecialAbilities",
  type: () =>
    DB.Object({
      associatedItem: DB.Optional({
        type: CeremonialItemSpecialAbilityGroupIdentifier(),
      }),
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
  instanceDisplayNameCustomizer: ({
    instance,
    instanceDisplayName,
    instanceDisplayNameLocaleId,
    locales,
    getDisplayNameForInstanceId,
  }) => {
    for (const locale of locales) {
      const translation = instance.translations[locale]
      if (translation) {
        const parent =
          instance.associatedItem === undefined
            ? undefined
            : getDisplayNameForInstanceId(
                "CeremonialItemSpecialAbilityGroup",
                instance.associatedItem,
              )

        return {
          name:
            (parent === undefined ? "" : parent.name + " — ") +
            (translation.name_in_library ?? translation.name),
          localeId: locale,
        }
      }
    }

    //   {
    //   name:
    //     instanceDisplayName.length > 0
    //       ? instanceDisplayName
    //       : (getDisplayNameForInstanceId(instance.parent)?.name ?? ""),
    //   localeId: instanceDisplayNameLocaleId,
    // }

    return { name: instanceDisplayName, localeId: instanceDisplayNameLocaleId }
  },
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
