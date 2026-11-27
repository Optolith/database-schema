import * as DB from "tsondb/schema/dsl"
import { OptionalRuleIdentifier } from "../_Identifier.ts"
import { RulePrerequisites } from "../_Prerequisite.js"
import { NestedTranslationMap } from "../Locale.js"
import { Errata } from "../source/_Erratum.js"
import { src } from "../source/_PublicationRef.js"

export const OptionalRule = DB.Entity(import.meta.url, {
  name: "OptionalRule",
  namePlural: "OptionalRules",
  type: () =>
    DB.Object({
      isMissingImplementation: DB.Required({
        comment:
          "Has the optional rule not been implemented in Optolith yet? This is also true if the optional rule does not (currently) apply to any Optolith feature.",
        type: DB.Boolean(),
      }),
      options: DB.Required({
        comment: "The options the optional rule has, if any.",
        type: DB.ChildEntities(OptionalRuleOption),
      }),
      complexityInfluence: DB.Optional({
        comment: "How this optional rule influences the complexity of the game, if specified.",
        type: DB.IncludeIdentifier(ComplexityInfluence),
      }),
      prerequisites: DB.Optional({
        type: DB.IncludeIdentifier(RulePrerequisites),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "OptionalRule",
        DB.Object({
          name: DB.Required({
            comment: "The optional rule’s name.",
            type: DB.String({ minLength: 1 }),
          }),
          description: DB.Required({
            comment: "The description of the optional rule, as stated in the optional rule box.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          additionalRules: DB.Optional({
            comment:
              "Sometimes, an optional rule does not only contain all the rules belonging to it in its rule box, but also in the main text.",
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

const ComplexityInfluence = DB.Enum(import.meta.url, {
  name: "ComplexityInfluence",
  comment: "How this optional rule influences the complexity of the game.",
  values: () => ({
    Less: DB.EnumCase({ comment: "The optional rule makes the game less complex.", type: null }),
    Unchanged: DB.EnumCase({
      comment: "The optional rule does not change the complexity of the game.",
      type: null,
    }),
    More: DB.EnumCase({ comment: "The optional rule makes the game more complex.", type: null }),
  }),
})

export const OptionalRuleOption = DB.Entity(import.meta.url, {
  name: "OptionalRuleOption",
  namePlural: "OptionalRuleOptions",
  type: () =>
    DB.Object({
      parent: DB.Required({
        comment: "The optional rule this option belongs to.",
        type: OptionalRuleIdentifier(),
      }),
      value: DB.Required({
        comment: "The value what this option means in context of the optional rule.",
        type: DB.Integer(),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "OptionalRuleOption",
        DB.Object({
          name: DB.Required({
            comment: `The optional rule option’s name.`,
            type: DB.String({ minLength: 1 }),
          }),
        }),
      ),
    }),
  parentReferenceKey: "parent",
  instanceDisplayName: {},
})
