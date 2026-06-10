import * as DB from "tsondb/schema/dsl"
import { effect, levels, maximum, name, name_in_library } from "../_Activatable.js"
import { ap_value, ap_value_append, ap_value_l10n } from "../_ActivatableAdventurePointsValue.js"
import { automatic_entries } from "../_ActivatableAutomatic.js"
import { activatableDisplayNameCustomizer, nameBuilderRules } from "../_ActivatableNames.ts"
import { explicit_select_options, select_options } from "../_ActivatableSelectOptions.js"
import { GeneralPrerequisites } from "../_Prerequisite.js"
import { NestedTranslationMap } from "../Locale.js"
import { Errata } from "../source/_Erratum.js"
import { src } from "../source/_PublicationRef.js"

export const PactGift = DB.Entity(import.meta.url, {
  name: "PactGift",
  namePlural: "PactGifts",
  type: () =>
    DB.Object({
      levels,
      nameBuilderRules,
      select_options,
      explicit_select_options,
      maximum,
      permanent_demonic_consumption: DB.Optional({
        comment: "This pact gift gives permanent levels of the condition *Demonic Consumption*.",
        type: DB.IncludeIdentifier(PactGiftPermanentDemonicConsumption),
      }),
      automatic_entries,
      prerequisites: DB.Optional({
        type: DB.IncludeIdentifier(GeneralPrerequisites),
      }),
      ap_value,
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "PactGift",
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
    {
      entityMapKeyPath: "translations",
      keyPathInEntityMap: "name_in_library",
      keyPathInEntityMapFallback: "name",
    },
  ],
})

const PactGiftPermanentDemonicConsumption = DB.Enum(import.meta.url, {
  name: "PactGiftPermanentDemonicConsumption",
  values: () => ({
    Fixed: DB.EnumCase({ type: DB.IncludeIdentifier(FixedPactGiftPermanentDemonicConsumption) }),
    PerLevel: DB.EnumCase({
      type: DB.IncludeIdentifier(PactGiftPermanentDemonicConsumptionPerLevel),
    }),
  }),
})

const FixedPactGiftPermanentDemonicConsumption = DB.TypeAlias(import.meta.url, {
  name: "FixedPactGiftPermanentDemonicConsumption",
  type: () =>
    DB.Object({
      levels: DB.Required({
        comment: "The levels of *Demonic Consumption* the pact gift causes.",
        type: DB.Integer({ minimum: 1, maximum: 4 }),
      }),
    }),
})

const PactGiftPermanentDemonicConsumptionPerLevel = DB.TypeAlias(import.meta.url, {
  name: "PactGiftPermanentDemonicConsumptionPerLevel",
  type: () =>
    DB.Object({
      levels: DB.Required({
        comment:
          "The levels of *Demonic Consumption* the pact gift causes per activated level of the pact gift.",
        type: DB.Integer({ minimum: 1, maximum: 4 }),
      }),
    }),
})
