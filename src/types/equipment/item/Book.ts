import * as DB from "tsondb/schema/dsl"
import { SkillIdentifier } from "../../_Identifier.js"
import { NestedTranslationMap } from "../../Locale.js"
import { Errata } from "../../source/_Erratum.js"
import { src } from "../../source/_PublicationRef.js"
import { Complexity, Cost, StructurePoints, Weight } from "./_Item.js"
import { LinguisticPrerequisites } from "../../_Prerequisite.js"

export const Book = DB.Entity(import.meta.url, {
  name: "Book",
  namePlural: "Books",
  type: () =>
    DB.Object({
      types: DB.Required({
        comment: "The type of book.",
        type: DB.Array(DB.IncludeIdentifier(BookType), { minItems: 1, uniqueItems: true }),
      }),
      cost: DB.Required({
        comment: "The cost in silverthalers.",
        type: DB.IncludeIdentifier(BookCost),
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
      contentQuality: DB.Optional({
        comment: "The quality of the book’s content.",
        type: DB.IncludeIdentifier(BookContentQuality),
      }),
      prerequisites: DB.Optional({
        comment:
          "Which prerequisites must be met to buy the stat block? For example, a character might need the advantage Spellcaster or Blessed. Note: the AP cost for a profession package does not include these prerequisites.",
        type: DB.IncludeIdentifier(BookLinguisticPrerequisites),
      }),
      rules: DB.Required({
        comment:
          "Skills and abilities you can learn by reading the book, as well as any other rules and effects concerning the book.",
        type: DB.IncludeIdentifier(BookRules),
      }),
      src,
      translations: NestedTranslationMap(
        DB.Required,
        "Book",
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
          legality: DB.Optional({
            comment: "The legality of the item, if specified.",
            type: DB.String({ minLength: 1, markdown: "inline" }),
          }),
          availability: DB.Optional({
            comment: "The availability of the item, if specified.",
            type: DB.String({ minLength: 1, markdown: "inline" }),
          }),
          special: DB.Optional({
            comment: "Special properties or features of the item.",
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

const BookType = DB.Enum(import.meta.url, {
  name: "BookType",
  comment: "The type of book.",
  values: () => ({
    Mundane: DB.EnumCase({
      comment: "A mundane book without special rules.",
      type: DB.IncludeIdentifier(MundaneBookType),
    }),
    Magical: DB.EnumCase({
      comment: "A magical book.",
      type: null,
    }),
    Religious: DB.EnumCase({
      comment: "A religious book.",
      type: null,
    }),
  }),
})

const MundaneBookType = DB.Enum(import.meta.url, {
  name: "MundaneBookType",
  comment: "The type of mundane book, i.e. the type of writing it contains.",
  values: () => ({
    RomanceNovel: DB.EnumCase({
      comment: "A romance novel.",
      type: null,
    }),
    Poetry: DB.EnumCase({
      comment: "A piece of poetry.",
      type: null,
    }),
    PoliticalPamphlet: DB.EnumCase({
      comment: "A political pamphlet.",
      type: null,
    }),
    CrimeStory: DB.EnumCase({
      comment: "A crime story.",
      type: null,
    }),
    FairyTale: DB.EnumCase({
      comment: "A fairy tale.",
      type: null,
    }),
    Novel: DB.EnumCase({
      comment: "A novel.",
      type: null,
    }),
    ProfessionalPublication: DB.EnumCase({
      comment:
        "A professional publication about a specific topic, represented by a (knowledge) skill.",
      type: SkillIdentifier(),
    }),
  }),
})

const BookCost = DB.Enum(import.meta.url, {
  name: "BookCost",
  comment:
    "The cost of the book, which may be a single value or multiple values that are defined by specific editions or other defining factors of the book.",
  values: () => ({
    Single: DB.EnumCase({
      comment: "The book only has a single cost description.",
      type: DB.IncludeIdentifier(BookCostVariant),
    }),
    Multiple: DB.EnumCase({
      comment: "The book’s cost varies by edition or other factors.",
      type: DB.Array(DB.IncludeIdentifier(BookCostVariant), { minItems: 2 }),
    }),
  }),
})

const BookCostVariant = DB.Enum(import.meta.url, {
  name: "BookCostVariant",
  comment: "A variant for the book’s cost.",
  values: () => ({
    Definite: DB.EnumCase({
      comment: "A definite cost value.",
      type: DB.IncludeIdentifier(DefiniteBookCostVariant),
    }),
    Indefinite: DB.EnumCase({
      comment: "An indefinite cost value.",
      type: DB.IncludeIdentifier(IndefiniteBookCostVariant),
    }),
  }),
})

const DefiniteBookCostVariant = DB.TypeAlias(import.meta.url, {
  name: "DefiniteBookCostVariant",
  comment: "A definite cost value for the book, such as a specific cost or cost range.",
  type: () =>
    DB.Object({
      cost: DB.Required({
        comment: "The cost in silverthalers.",
        type: DB.IncludeIdentifier(Cost),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "DefiniteBookCostVariant",
        DB.Object(
          {
            label: DB.Optional({
              comment: "The label for the cost variant, e.g. “Original script”.",
              type: DB.String({ minLength: 1, markdown: "inline" }),
            }),
          },
          { minProperties: 1 },
        ),
      ),
    }),
})

const IndefiniteBookCostVariant = DB.TypeAlias(import.meta.url, {
  name: "IndefiniteBookCostVariant",
  comment:
    "An indefinite cost value for the book, which means it is impossible to narrow the range of the cost value by any numbers.",
  type: () =>
    DB.Object({
      translations: NestedTranslationMap(
        DB.Required,
        "IndefiniteBookCostVariant",
        DB.Object({
          label: DB.Optional({
            comment: "The label for the cost variant, e.g. “Original script”.",
            type: DB.String({ minLength: 1, markdown: "inline" }),
          }),
          description: DB.Required({
            comment: "The description of the cost variant, e.g. “less”.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
        }),
      ),
    }),
})

const BookContentQuality = DB.Enum(import.meta.url, {
  name: "BookContentQuality",
  comment: "The quality of the book’s content.",
  values: () => ({
    Modest: DB.EnumCase({ type: null }),
    Average: DB.EnumCase({ type: null }),
    Demanding: DB.EnumCase({ type: DB.Integer({ minimum: 1, maximum: 3 }) }),
  }),
})

const BookRules = DB.Enum(import.meta.url, {
  name: "BookRules",
  comment:
    "Skills and abilities you can learn by reading the book, as well as any other rules and effects concerning the book.",
  values: () => ({
    Plain: DB.EnumCase({ type: DB.IncludeIdentifier(PlainBookRules) }),
    Entertainment: DB.EnumCase({ type: null }),
    ByEdition: DB.EnumCase({ type: DB.IncludeIdentifier(BookRulesByEdition) }),
  }),
})

const PlainBookRules = DB.TypeAlias(import.meta.url, {
  name: "PlainBookRules",
  comment: "The book’s rules without any special effects or conditions.",
  type: () =>
    DB.Object({
      translation: NestedTranslationMap(
        DB.Required,
        "PlainBookRules",
        DB.Object({
          text: DB.Required({
            comment: "The (main) rules text.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          reconstruction: DB.Optional({
            comment: "Rules for reconstructing certain skills or abilities from the book.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          references: DB.Optional({
            comment:
              "References to skills and abilities that, while mentioned in the book, cannot be learned from this book alone.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          textAfter: DB.Optional({
            comment: "Additional rules text that comes after all other rules.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
        }),
      ),
    }),
})

const BookRulesByEdition = DB.TypeAlias(import.meta.url, {
  name: "BookRulesByEdition",
  comment:
    "The book’s rules with differences between each edition and more differentiation between types of rules.",
  type: () =>
    DB.Object({
      editions: DB.Required({
        type: DB.Array(DB.IncludeIdentifier(BookRulesOfEdition), { minItems: 1 }),
      }),
      translation: NestedTranslationMap(
        DB.Optional,
        "BookRulesByEdition",
        DB.Object({
          textAfter: DB.Optional({
            comment: "Additional rules text that comes after all other rules.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
        }),
      ),
    }),
})

const BookRulesOfEdition = DB.TypeAlias(import.meta.url, {
  name: "BookRulesOfEdition",
  type: () =>
    DB.Object({
      prerequisities: DB.Optional({
        comment: "The prerequisites for learning the rules of this edition.",
        type: DB.IncludeIdentifier(BookLinguisticPrerequisites),
      }),
      translation: NestedTranslationMap(
        DB.Required,
        "BookRulesOfEdition",
        DB.Object({
          label: DB.Required({
            comment: "The edition(s) the rules apply to.",
            type: DB.String({ minLength: 1 }),
          }),
          text: DB.Required({
            comment: "The rules text.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          reconstruction: DB.Optional({
            comment: "Rules for reconstructing certain skills or abilities from the book.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
          references: DB.Optional({
            comment:
              "References to skills and abilities that, while mentioned in the book, cannot be learned from this book alone.",
            type: DB.String({ minLength: 1, markdown: "block" }),
          }),
        }),
      ),
    }),
})

const BookLinguisticPrerequisites = DB.TypeAlias(import.meta.url, {
  name: "BookLinguisticPrerequisites",
  type: () =>
    DB.Object({
      linguistic: DB.Required({
        comment: "The linguistic prerequisites for this book.",
        type: DB.IncludeIdentifier(LinguisticPrerequisites),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "BookLinguisticPrerequisitesTranslation",
        DB.Object({
          replacement: DB.Required({
            comment: "The label for this linguistic prerequisites.",
            type: DB.String({ minLength: 1, markdown: "inline" }),
          }),
        }),
      ),
    }),
})
