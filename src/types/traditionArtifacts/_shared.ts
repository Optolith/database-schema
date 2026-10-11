import { omitUndefinedKeys } from "@elyukai/utils/object"
import * as DB from "tsondb/schema/dsl"
import { effect, levels, maximum, name, name_in_library } from "../_Activatable.ts"
import { ap_value, ap_value_append, ap_value_l10n } from "../_ActivatableAdventurePointsValue.ts"
import { nameBuilderRules } from "../_ActivatableNames.ts"
import {
  aeCost,
  bindingCost,
  cost,
  cost_note,
  property,
  volume,
  volume_l10n,
} from "../_ActivatableNonMundane.ts"
import {
  explicit_select_options,
  select_options,
  verifySelectOptionRules,
} from "../_ActivatableSelectOptions.ts"
import type { TraditionArtifactEnchantmentIdentifier } from "../_IdentifierGroup.ts"
import { GeneralPrerequisites } from "../_Prerequisite.ts"
import { NestedTranslationMap } from "../Locale.ts"
import { Errata } from "../source/_Erratum.ts"
import { src } from "../source/_PublicationRef.ts"

export const full = <
  T extends keyof (typeof TraditionArtifactEnchantmentIdentifier)["type"]["value"]["values"],
>(options: {
  name: T
  namePlural: string
  displayName?: string
  displayNamePlural?: string
  cost?: () => DB.MemberDecl
  brew?: () => DB.MemberDecl
  volume?: false
}) =>
  DB.Entity(import.meta.url, {
    name: options.name,
    namePlural: options.namePlural,
    displayName: options.displayName,
    displayNamePlural: options.displayNamePlural,
    type: () =>
      DB.Object(
        omitUndefinedKeys({
          levels,
          nameBuilderRules,
          select_options,
          explicit_select_options,
          maximum,
          prerequisites: DB.Optional({
            type: DB.IncludeIdentifier(GeneralPrerequisites),
          }),
          volume: options.volume === false ? undefined : volume,
          brew: options.brew?.(),
          cost: options.cost?.() ?? cost,
          property: property(),
          ap_value,
          src,
          translations: translations(options.name),
        }) as Record<string, DB.MemberDecl>,
      ),
    instanceDisplayName: {},
    uniqueConstraints: [
      {
        entityMapKeyPath: "translations",
        keyPathInEntityMap: "name_in_library",
        keyPathInEntityMapFallback: "name",
      },
    ],
    customConstraints: deps => verifySelectOptionRules(options.name, deps),
  })

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
