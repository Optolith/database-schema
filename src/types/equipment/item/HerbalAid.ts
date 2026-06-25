import * as DB from "tsondb/schema/dsl"
import { src } from "../../source/_PublicationRef.js"
import { NestedTranslationMap } from "../../Locale.js"
import { WeaponIdentifier, ArmorIdentifier } from "../../_Identifier.js"
import { EffectType, RecipeTradeSecret } from "./_Herbary.js"

export const HerbalAid = DB.Entity(import.meta.url, {
  name: "HerbalAid",
  namePlural: "HerbalAids",
  type: () =>
    DB.Object({
      types: DB.Required({
        comment: "The plant types this aid belongs to.",
        type: DB.Array(DB.IncludeIdentifier(EffectType), { minItems: 1, uniqueItems: true }),
      }),
      crafting_difficulty: DB.Required({
        comment: "The difficulty for this aid to craft.",
        type: DB.Integer(),
      }),
      trade_secret: DB.Optional({
        comment: "AP value and prerequisites of the herbal aid�s trade secret.",
        type: DB.IncludeIdentifier(RecipeTradeSecret),
      }),
      combatUse: DB.Optional({
        comment: "The armor or weapon this herbal aid represents.",
        type: DB.IncludeIdentifier(HerbalAidCombatUse),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "HerbalAid",
        DB.Object({
          name: DB.Required({
            comment: "The herbal aid's name.",
            type: DB.String({ minLength: 1 }),
          }),
          description: DB.Required({
            comment: "The herbal aid's description.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          ingredients: DB.Required({
            comment: "The ingredients used to craft this herbal aid.",
            type: DB.Array(DB.String({ minLength: 1, markdown: "inline" }), { minItems: 1 }),
          }),
          typical_tools: DB.Optional({
            comment: "The typical tools used to craft this.",
            type: DB.Array(DB.String({ minLength: 1, markdown: "inline" }), { minItems: 1 }),
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

const HerbalAidCombatUse = DB.Enum(import.meta.url, {
  name: "HerbalAidCombatUse",
  values: () => ({
    Weapon: DB.EnumCase({ type: WeaponIdentifier() }),
    Armor: DB.EnumCase({ type: ArmorIdentifier() }),
  }),
})
