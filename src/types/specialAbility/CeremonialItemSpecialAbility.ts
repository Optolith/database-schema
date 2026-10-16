import * as DB from "tsondb/schema/dsl"
import { effect, levels, maximum, name, name_in_library } from "../_Activatable.js"
import { ap_value, ap_value_append, ap_value_l10n } from "../_ActivatableAdventurePointsValue.js"
import { nameBuilderRules } from "../_ActivatableNames.ts"
import {
  explicit_select_options,
  select_options,
  verifySelectOptionRules,
} from "../_ActivatableSelectOptions.js"
import { skill_applications, skill_uses } from "../_ActivatableSkillApplicationsAndUses.js"
import { AspectIdentifier, CeremonialItemSpecialAbilityGroupIdentifier } from "../_Identifier.ts"
import { GeneralPrerequisites } from "../_Prerequisite.js"
import { NestedTranslationMap } from "../Locale.js"
import { Errata } from "../source/_Erratum.js"
import { src } from "../source/_PublicationRef.js"
import { BlessedTradition } from "./BlessedTradition.ts"

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
      aspect: DB.Optional({
        comment: "The blessed aspect.",
        type: DB.IncludeIdentifier(CeremonialItemSpecialAbilityAspect),
      }),
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
  customConstraints: deps => verifySelectOptionRules("CeremonialItemSpecialAbility", deps),
})

const CeremonialItemSpecialAbilityAspect = DB.Enum(import.meta.url, {
  name: "CeremonialItemSpecialAbilityAspect",
  values: () => ({
    Single: DB.EnumCase({ type: DB.IncludeIdentifier(SingleCeremonialItemSpecialAbilityAspect) }),
    ByTradition: DB.EnumCase({
      type: DB.IncludeIdentifier(CeremonialItemSpecialAbilityAspectByTradition),
    }),
  }),
})

const SingleCeremonialItemSpecialAbilityAspect = DB.TypeAlias(import.meta.url, {
  name: "SingleCeremonialItemSpecialAbilityAspect",
  type: () => AspectIdentifier(),
})

const CeremonialItemSpecialAbilityAspectByTradition = DB.TypeAlias(import.meta.url, {
  name: "CeremonialItemSpecialAbilityAspectByTradition",
  type: () =>
    DB.NestedEntityMap({
      name: "CeremonialItemSpecialAbilityAspectForTradition",
      namePlural: "CeremonialItemSpecialAbilityAspectForTraditions",
      secondaryEntity: BlessedTradition,
      type: DB.Object({
        aspect: DB.Required({ type: AspectIdentifier() }),
      }),
    }),
})
