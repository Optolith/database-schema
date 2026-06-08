import * as DB from "tsondb/schema/dsl"
import { effect, name, name_in_library } from "../_Activatable.js"
import { ap_value_append, ap_value_l10n } from "../_ActivatableAdventurePointsValue.js"
import { activatableDisplayNameCustomizer } from "../_ActivatableNames.ts"
import { propertyOptional } from "../_ActivatableNonMundane.js"
import { OneTimeCostMap } from "../_ActivatableSkillCost.js"
import { GeneralPrerequisites } from "../_Prerequisite.js"
import { NestedTranslationMap } from "../Locale.js"
import { Errata } from "../source/_Erratum.js"
import { src } from "../source/_PublicationRef.js"

export const MagicalSign = DB.Entity(import.meta.url, {
  name: "MagicalSign",
  namePlural: "MagicalSigns",
  type: () =>
    DB.Object({
      prerequisites: DB.Optional({
        type: DB.IncludeIdentifier(GeneralPrerequisites),
      }),
      cost: DB.Optional({
        comment: "The cost in AE.",
        type: DB.IncludeIdentifier(MagicalSignCost),
      }),
      property: propertyOptional(),
      ap_value: DB.Required({
        comment: "The adventure points value.",
        type: DB.Integer({ minimum: 0 }),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "MagicalSign",
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

const MagicalSignCost = DB.Enum(import.meta.url, {
  name: "MagicalSignCost",
  values: () => ({
    Constant: DB.EnumCase({ type: DB.IncludeIdentifier(ConstantMagicalSignCost) }),
    Map: DB.EnumCase({ type: DB.IncludeIdentifier(OneTimeCostMap) }),
  }),
})

const ConstantMagicalSignCost = DB.TypeAlias(import.meta.url, {
  name: "ConstantMagicalSignCost",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The AE cost value.",
        type: DB.Integer({ minimum: 1 }),
      }),
      permanent_value: DB.Optional({
        comment: "The part of the cost value that has to be spent permanently.",
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})
