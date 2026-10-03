import * as DB from "tsondb/schema/dsl"
import { NestedTranslationMap } from "../../Locale.js"
import { Errata } from "../../source/_Erratum.js"
import { src } from "../../source/_PublicationRef.js"
import { CombatUse, Complexity, Cost, StructurePoints, Weight } from "./_Item.js"
import { checkWeaponCombatTechniqueIntegrity } from "./_Weapon.js"

export const MagicalArtifact = DB.Entity(import.meta.url, {
  name: "MagicalArtifact",
  namePlural: "MagicalArtifacts",
  type: () =>
    DB.Object({
      cost: DB.Required({
        comment: "The cost in silverthalers.",
        type: DB.IncludeIdentifier(Cost),
      }),
      weight: DB.Optional({
        comment: "The weight in kg.",
        type: DB.IncludeIdentifier(Weight),
      }),
      complexity: DB.Optional({
        comment: "The complexity of crafting the item.",
        type: DB.IncludeIdentifier(Complexity),
      }),
      structure_points: DB.Optional({
        comment:
          "The structure points of the item. Use an array if the item consists of multiple components that have individual structure points.",
        type: DB.IncludeIdentifier(StructurePoints),
      }),
      combat_use: DB.Optional({
        comment:
          "The item can also be used either as an improvised weapon or as an armor, although this is not the primary use case of the item.",
        type: DB.IncludeIdentifier(CombatUse),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        `MagicalArtifact`,
        DB.Object({
          name: DB.Required({
            comment: "The item’s name.",
            type: DB.String({ minLength: 1 }),
          }),
          secondary_name: DB.Optional({
            comment: "An auxiliary name or label of the item, if available.",
            type: DB.String({ minLength: 1 }),
          }),
          description: DB.Optional({
            comment: "Description text.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          note: DB.Optional({
            comment: "A note.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          rules: DB.Optional({
            comment: "Rules text.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          effect: DB.Optional({
            comment: "Effect text.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          cost: DB.Optional({
            comment: "Cost text.",
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
  customConstraints: ({ instanceContent, ...rest }) => {
    if (instanceContent.combat_use && instanceContent.combat_use.kind === "Weapon") {
      return checkWeaponCombatTechniqueIntegrity({
        ...rest,
        instanceContent: instanceContent.combat_use.Weapon,
      })
    }

    return []
  },
})
