import * as DB from "tsondb/schema/dsl"
import { input, levels, maximum, name, name_in_library, rules } from "../_Activatable.ts"
import { ap_value, ap_value_append, ap_value_l10n } from "../_ActivatableAdventurePointsValue.ts"
import { activatableDisplayNameCustomizer, nameBuilderRules } from "../_ActivatableNames.ts"
import { GeneralPrerequisites } from "../_Prerequisite.ts"
import { NestedTranslationMap } from "../Locale.ts"
import { Errata } from "../source/_Erratum.ts"
import { src } from "../source/_PublicationRef.ts"

export const Trick = DB.Entity(import.meta.url, {
  name: "Trick",
  namePlural: "Tricks",
  type: () =>
    DB.Object({
      levels,
      nameBuilderRules,
      maximum,
      prerequisites: DB.Optional({
        type: DB.IncludeIdentifier(GeneralPrerequisites),
      }),
      ap_value,
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "Trick",
        DB.Object({
          name,
          name_in_library,
          input,
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
