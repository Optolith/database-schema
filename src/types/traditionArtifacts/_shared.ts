import * as DB from "tsondb/schema/dsl"
import { NestedTranslationMap } from "../Locale.ts"
import { effect, name, name_in_library } from "../_Activatable.ts"
import { ap_value_append, ap_value_l10n } from "../_ActivatableAdventurePointsValue.ts"
import { aeCost, bindingCost, cost_note, volume_l10n } from "../_ActivatableNonMundane.ts"
import { Errata } from "../source/_Erratum.ts"

export const translations = <T extends string>(entity: T) =>
  NestedTranslationMap(
    DB.Required,
    entity,
    DB.Object({
      name,
      name_in_library,
      effect,
      cost_note,
      bindingCost,
      aeCost,
      volume: volume_l10n,
      ap_value_append,
      ap_value: ap_value_l10n,
      errata: DB.Optional({
        type: DB.IncludeIdentifier(Errata),
      }),
    }),
  )
