import * as DB from "tsondb/schema/dsl"
import { AmmunitionIdentifier } from "../../_Identifier.ts"
import { EquipmentPrerequisites } from "../../_Prerequisite.ts"
import { NestedTranslationMap } from "../../Locale.ts"
import { Errata } from "../../source/_Erratum.ts"
import { src } from "../../source/_PublicationRef.ts"
import { Complexity } from "./_Item.ts"

export const SpecialAmmunition = DB.Entity(import.meta.url, {
  name: "SpecialAmmunition",
  namePlural: "SpecialAmmunition",
  type: () =>
    DB.Object({
      applicableTo: DB.Required({
        comment: "The base ammunition type that is affected by this specialization.",
        type: DB.Array(AmmunitionIdentifier(), { minItems: 1 }),
      }),
      costModifier: DB.Required({
        comment: "The cost modifier for the base price of affected ammunition.",
        type: DB.Integer({ minimum: 1 }),
      }),
      complexity: DB.Optional({
        comment: "The complexity of crafting the item.",
        type: DB.IncludeIdentifier(Complexity),
      }),
      prerequisites: DB.Optional({
        comment:
          "The prerequisites of the item, if any. Note that this is fully separate from the prerequisites of the item’s trade secret, which are defined independently from this.",
        type: DB.IncludeIdentifier(EquipmentPrerequisites),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "SpecialAmmunition",
        DB.Object({
          name: DB.Required({
            comment: "The item’s name.",
            type: DB.String({ minLength: 1 }),
          }),
          secondary_name: DB.Optional({
            comment: "An auxiliary name or label of the item, if available.",
            type: DB.String({ minLength: 1 }),
          }),
          note: DB.Optional({
            comment: "Note text.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          rules: DB.Optional({
            comment: "Special rules text.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          errata: DB.Optional({
            type: DB.IncludeIdentifier(Errata),
          }),
        }),
      ),
    }),
  instanceDisplayName: {},
  uniqueConstraints: [
    {
      entityMapKeyPath: "translations",
      keyPathInEntityMap: "name",
    },
  ],
})
