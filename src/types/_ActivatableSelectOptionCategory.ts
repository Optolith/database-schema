import * as DB from "tsondb/schema/dsl"
import { NestedTranslationMap } from "./Locale.js"
import {
  CeremonyIdentifier,
  CloseCombatTechniqueIdentifier,
  ElementIdentifier,
  LiturgicalChantIdentifier,
  RangedCombatTechniqueIdentifier,
  RitualIdentifier,
  SkillGroupIdentifier,
  SkillIdentifier,
  SpellIdentifier,
  TargetCategoryIdentifier,
  PropertyIdentifier,
} from "./_Identifier.js"
import {
  ActivatableIdentifier,
  CombatTechniqueIdentifier,
  SkillishIdentifier,
} from "./_IdentifierGroup.js"
import { PropertyPrerequisite } from "./prerequisites/single/PropertyPrerequisite.js"

export const SelectOptionCategory = DB.Enum(import.meta.url, {
  name: "SelectOptionCategory",
  values: () => ({
    Blessings: DB.EnumCase({ type: null }),
    Cantrips: DB.EnumCase({ type: null }),
    TradeSecrets: DB.EnumCase({ type: null }),
    Scripts: DB.EnumCase({ type: null }),
    AnimalShapes: DB.EnumCase({ type: null }),
    ArcaneBardTraditions: DB.EnumCase({ type: null }),
    ArcaneDancerTraditions: DB.EnumCase({ type: null }),
    SexPractices: DB.EnumCase({ type: null }),
    Races: DB.EnumCase({ type: null }),
    Cultures: DB.EnumCase({ type: null }),
    RacesAndCultures: DB.EnumCase({ type: null }),
    HomunculusTypes: DB.EnumCase({ type: null }),
    BlessedTraditions: DB.EnumCase({
      type: DB.IncludeIdentifier(BlessedTraditionsSelectOptionCategory),
    }),
    Elements: DB.EnumCase({ type: DB.IncludeIdentifier(ElementsSelectOptionCategory) }),
    Properties: DB.EnumCase({ type: DB.IncludeIdentifier(PropertiesSelectOptionCategory) }),
    Aspects: DB.EnumCase({ type: DB.IncludeIdentifier(AspectSelectOptionCategory) }),
    Diseases: DB.EnumCase({ type: DB.IncludeIdentifier(DiseasesPoisonsSelectOptionCategory) }),
    Poisons: DB.EnumCase({ type: DB.IncludeIdentifier(DiseasesPoisonsSelectOptionCategory) }),
    Languages: DB.EnumCase({ type: DB.IncludeIdentifier(LanguagesSelectOptionCategory) }),
    Skills: DB.EnumCase({ type: DB.IncludeIdentifier(SkillsSelectOptionCategory) }),
    CombatTechniques: DB.EnumCase({
      type: DB.IncludeIdentifier(CombatTechniquesSelectOptionCategory),
    }),
    TargetCategories: DB.EnumCase({
      type: DB.IncludeIdentifier(TargetCategoriesSelectOptionCategory),
    }),
  }),
})

export const TradeSecretSelectOptionCategory = DB.Enum(import.meta.url, {
  name: "TradeSecretSelectOptionCategory",
  values: () => ({
    Blessings: DB.EnumCase({ type: null }),
    Cantrips: DB.EnumCase({ type: null }),
    Scripts: DB.EnumCase({ type: null }),
    AnimalShapes: DB.EnumCase({ type: null }),
    ArcaneBardTraditions: DB.EnumCase({ type: null }),
    ArcaneDancerTraditions: DB.EnumCase({ type: null }),
    SexPractices: DB.EnumCase({ type: null }),
    Races: DB.EnumCase({ type: null }),
    Cultures: DB.EnumCase({ type: null }),
    RacesAndCultures: DB.EnumCase({ type: null }),
    HomunculusTypes: DB.EnumCase({ type: null }),
    BlessedTraditions: DB.EnumCase({
      type: DB.IncludeIdentifier(BlessedTraditionsSelectOptionCategory),
    }),
    Elements: DB.EnumCase({ type: DB.IncludeIdentifier(ElementsSelectOptionCategory) }),
    Properties: DB.EnumCase({ type: DB.IncludeIdentifier(PropertiesSelectOptionCategory) }),
    Aspects: DB.EnumCase({ type: DB.IncludeIdentifier(AspectSelectOptionCategory) }),
    Diseases: DB.EnumCase({ type: DB.IncludeIdentifier(DiseasesPoisonsSelectOptionCategory) }),
    Poisons: DB.EnumCase({ type: DB.IncludeIdentifier(DiseasesPoisonsSelectOptionCategory) }),
    Languages: DB.EnumCase({ type: DB.IncludeIdentifier(LanguagesSelectOptionCategory) }),
    Skills: DB.EnumCase({ type: DB.IncludeIdentifier(SkillsSelectOptionCategory) }),
    CombatTechniques: DB.EnumCase({
      type: DB.IncludeIdentifier(CombatTechniquesSelectOptionCategory),
    }),
    TargetCategories: DB.EnumCase({
      type: DB.IncludeIdentifier(TargetCategoriesSelectOptionCategory),
    }),
  }),
})

const BlessedTraditionsSelectOptionCategory = DB.TypeAlias(import.meta.url, {
  name: "BlessedTraditionsSelectOptionCategory",
  type: () =>
    DB.Object({
      require_principles: DB.Optional({
        comment:
          "Should the principles (code) of the tradition be required to select the respective tradition?",
        type: DB.Boolean(),
      }),
    }),
})

const ElementsSelectOptionCategory = DB.TypeAlias(import.meta.url, {
  name: "ElementsSelectOptionCategory",
  type: () =>
    DB.Object({
      specific: DB.Optional({
        comment: "Only include entries with the listed identifiers.",
        type: DB.Array(ElementIdentifier(), { minItems: 1, uniqueItems: true }),
      }),
    }),
})

const PropertiesSelectOptionCategory = DB.TypeAlias(import.meta.url, {
  name: "PropertiesSelectOptionCategory",
  type: () =>
    DB.Object({
      require_knowledge: DB.Optional({
        comment: "Does each property require its corresponding property knowledge?",
        type: DB.Boolean(),
      }),
      require_minimum_spellworks_on: DB.Optional({
        comment:
          "Require a minimum number of spellworks of the respective property to be on a minimum skill rating.",
        type: DB.IncludeIdentifier(RequiredMinimumSkillsToBeOnSkillRating),
      }),
    }),
})

const AspectSelectOptionCategory = DB.TypeAlias(import.meta.url, {
  name: "AspectSelectOptionCategory",
  type: () =>
    DB.Object({
      require_knowledge: DB.Optional({
        comment: "Does each aspect require its corresponding aspect knowledge?",
        type: DB.Boolean(),
      }),
      use_master_of_suffix_as_name: DB.Optional({
        comment:
          "The generated name should be the *Master of (Aspect)* suffix for this aspect instead of the aspect's name. If an aspect does not provide a suffix (such as the General aspect), it is automatically excluded from the list.",
        type: DB.Boolean(),
      }),
      require_minimum_liturgies_on: DB.Optional({
        comment:
          "Require a minimum number of liturgies of the respective aspect to be on a minimum skill rating.",
        type: DB.IncludeIdentifier(RequiredMinimumSkillsToBeOnSkillRating),
      }),
    }),
})

const RequiredMinimumSkillsToBeOnSkillRating = DB.TypeAlias(import.meta.url, {
  name: "RequiredMinimumSkillsToBeOnSkillRating",
  comment:
    "Require a minimum number of spellworks/liturgies of the respective property/aspect to be on a minimum skill rating.",
  type: () =>
    DB.Object({
      number: DB.Required({
        comment:
          "The minimum number of liturgies that need to be on the defined minimum skill rating.",
        type: DB.Integer({ minimum: 1 }),
      }),
      rating: DB.Required({
        comment: "The minimum skill rating the defined minimum number of liturgies need to be on.",
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})

const DiseasesPoisonsSelectOptionCategory = DB.TypeAlias(import.meta.url, {
  name: "DiseasesPoisonsSelectOptionCategory",
  type: () =>
    DB.Object({
      use_half_level_as_ap_value: DB.Optional({
        comment: "Only convert half the disease/poison level into the AP value.",
        type: DB.Boolean(),
      }),
    }),
})

const LanguagesSelectOptionCategory = DB.TypeAlias(import.meta.url, {
  name: "LanguagesSelectOptionCategory",
  type: () =>
    DB.Object({
      prerequisites: DB.Optional({
        comment: "Generate prerequisites for each entry of the category.",
        type: DB.Array(DB.IncludeIdentifier(LanguagesSelectOptionCategoryPrerequisite), {
          minItems: 1,
        }),
      }),
    }),
})

const LanguagesSelectOptionCategoryPrerequisite = DB.Enum(import.meta.url, {
  name: "LanguagesSelectOptionCategoryPrerequisite",
  values: () => ({
    SelectOption: DB.EnumCase({ type: DB.IncludeIdentifier(OptionPrerequisite) }),
  }),
})

const SkillsSelectOptionCategory = DB.TypeAlias(import.meta.url, {
  name: "SkillsSelectOptionCategory",
  type: () =>
    DB.Object({
      categories: DB.Required({
        comment: "A list of skill categories.",
        type: DB.Array(DB.IncludeIdentifier(SkillsSelectOptionCategoryCategory), { minItems: 1 }),
      }),
      ap_value: DB.Optional({
        comment: "Generate AP values for each entry.",
        type: DB.GenIncludeIdentifier(SelectOptionsAdventurePointsValue, [
          DB.IncludeIdentifier(SkillishIdentifier),
        ]),
      }),
    }),
})

const SpellFilter = DB.Enum(import.meta.url, {
  name: "SpellFilter",
  values: () => ({
    Identifier: DB.EnumCase({ type: SpellIdentifier() }),
    Property: DB.EnumCase({ type: PropertyIdentifier() }),
  }),
})

const RitualFilter = DB.Enum(import.meta.url, {
  name: "RitualFilter",
  values: () => ({
    Identifier: DB.EnumCase({ type: RitualIdentifier() }),
    Property: DB.EnumCase({ type: PropertyIdentifier() }),
  }),
})

const SkillsSelectOptionCategoryCategory = DB.Enum(import.meta.url, {
  name: "SkillsSelectOptionCategoryCategory",
  values: () => ({
    Skills: DB.EnumCase({ type: DB.IncludeIdentifier(SkillSelectOptionCategoryCategory) }),
    Spells: DB.EnumCase({
      type: DB.GenIncludeIdentifier(GenericSkillsSelectOptionCategoryCategory, [
        DB.IncludeIdentifierType(SpellFilter()),
      ]),
    }),
    Rituals: DB.EnumCase({
      type: DB.GenIncludeIdentifier(GenericSkillsSelectOptionCategoryCategory, [
        DB.IncludeIdentifierType(RitualFilter()),
      ]),
    }),
    LiturgicalChants: DB.EnumCase({
      type: DB.GenIncludeIdentifier(GenericSkillsSelectOptionCategoryCategory, [
        LiturgicalChantIdentifier(),
      ]),
    }),
    Ceremonies: DB.EnumCase({
      type: DB.GenIncludeIdentifier(GenericSkillsSelectOptionCategoryCategory, [
        CeremonyIdentifier(),
      ]),
    }),
  }),
})

const SkillSelectOptionCategoryCategory = DB.TypeAlias(import.meta.url, {
  name: "SkillSelectOptionCategoryCategory",
  type: () =>
    DB.Object({
      groups: DB.Optional({
        comment: "Only include entries of the specified groups.",
        type: DB.Array(SkillGroupIdentifier(), { minItems: 1 }),
      }),
      specific: DB.Optional({
        comment: "Only include or exclude specific skills.",
        type: DB.GenIncludeIdentifier(SpecificFromSkillSelectOptionCategoryCategory, [
          SkillIdentifier(),
        ]),
      }),
      skill_applications: DB.Optional({
        comment:
          "Registers new applications, which get enabled once this entry is activated with its respective select option. It specifies an entry-unique identifier, the skill it belongs to is derived from the select option automatically. A translation can be left out if its name equals the name of the origin entry.",
        type: DB.Array(DB.IncludeIdentifier(SkillApplicationOrUse), { minItems: 1 }),
      }),
      skill_uses: DB.Optional({
        comment:
          "Registers uses, which get enabled once this entry is activated with its respective select option. It specifies an entry-unique identifier, the skill it belongs to is derived from the select option automatically. A translation can be left out if its name equals the name of the origin entry.",
        type: DB.Array(DB.IncludeIdentifier(SkillApplicationOrUse), { minItems: 1 }),
      }),
      prerequisites: DB.Optional({
        comment: "Generate prerequisites for each entry of the category.",
        type: DB.Array(DB.IncludeIdentifier(SkillSelectOptionCategoryPrerequisite), {
          minItems: 1,
        }),
      }),
      ap_value: DB.Optional({
        comment: "Generate AP values for each entry.",
        type: DB.GenIncludeIdentifier(SelectOptionsAdventurePointsValue, [SkillIdentifier()]),
      }),
    }),
})

const CombatTechniquesSelectOptionCategory = DB.TypeAlias(import.meta.url, {
  name: "CombatTechniquesSelectOptionCategory",
  type: () =>
    DB.Object({
      categories: DB.Required({
        comment: "A list of combat technique categories.",
        type: DB.Array(DB.IncludeIdentifier(CombatTechniquesSelectOptionCategoryCategory), {
          minItems: 1,
        }),
      }),
      bindingCost: DB.Optional({
        comment:
          "Generate binding cost values for each entry.\n\n*Note: This only works if the entry it is defined on supports binding costs, i.e. is a tradition artifact enchantment.*",
        type: DB.GenIncludeIdentifier(SelectOptionsBindingCostValue, [
          DB.IncludeIdentifier(CombatTechniqueIdentifier),
        ]),
      }),
      ap_value: DB.Optional({
        comment: "Generate AP values for each entry.",
        type: DB.GenIncludeIdentifier(SelectOptionsAdventurePointsValue, [
          DB.IncludeIdentifier(CombatTechniqueIdentifier),
        ]),
      }),
    }),
})

const CombatTechniquesSelectOptionCategoryCategory = DB.Enum(import.meta.url, {
  name: "CombatTechniquesSelectOptionCategoryCategory",
  values: () => ({
    CloseCombatTechniques: DB.EnumCase({
      type: DB.GenIncludeIdentifier(GenericSkillsSelectOptionCategoryCategory, [
        CloseCombatTechniqueIdentifier(),
      ]),
    }),
    RangedCombatTechniques: DB.EnumCase({
      type: DB.GenIncludeIdentifier(GenericSkillsSelectOptionCategoryCategory, [
        RangedCombatTechniqueIdentifier(),
      ]),
    }),
  }),
})

const SkillApplicationOrUse = DB.TypeAlias(import.meta.url, {
  name: "SkillApplicationOrUse",
  type: () =>
    DB.Object({
      id: DB.Required({
        comment: "The application’s or use’s identifier. An entry-unique, increasing integer.",
        type: DB.Integer({ minimum: 1 }),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "SkillApplicationOrUse",
        DB.Object({
          name: DB.Required({
            comment:
              "The name of the application or use if different from the activatable entry’s name.",
            type: DB.String({ minLength: 1 }),
          }),
        }),
      ),
    }),
})

const GenericSkillsSelectOptionCategoryCategory = DB.GenTypeAlias(import.meta.url, {
  name: "GenericSkillsSelectOptionCategoryCategory",
  parameters: [DB.Param("Ref")],
  type: Ref =>
    DB.Object({
      specific: DB.Optional({
        comment: "Only include (`Intersection`) or exclude (`Difference`) specific entries.",
        type: DB.GenIncludeIdentifier(SpecificFromSkillSelectOptionCategoryCategory, [
          DB.TypeArgument(Ref),
        ]),
      }),
      prerequisites: DB.Optional({
        comment: "Generate prerequisites for each entry of the category.",
        type: DB.Array(DB.IncludeIdentifier(SkillSelectOptionCategoryPrerequisite), {
          minItems: 1,
        }),
      }),
    }),
})

const SpecificFromSkillSelectOptionCategoryCategory = DB.GenTypeAlias(import.meta.url, {
  name: "SpecificFromSkillSelectOptionCategoryCategory",
  parameters: [DB.Param("Ref")],
  type: Ref =>
    DB.Object({
      operation: DB.Required({
        type: DB.IncludeIdentifier(SpecificFromSkillSelectOptionCategoryCategoryOperation),
      }),
      list: DB.Required({
        comment: "The list of specific entries.",
        type: DB.Array(DB.TypeArgument(Ref), { minItems: 1, uniqueItems: true }),
      }),
    }),
})

const SpecificFromSkillSelectOptionCategoryCategoryOperation = DB.Enum(import.meta.url, {
  name: "SpecificFromSkillSelectOptionCategoryCategoryOperation",
  comment: "Only include (`Intersection`) or exclude (`Difference`) specific entries.",
  values: () => ({
    Intersection: DB.EnumCase({ type: null }),
    Difference: DB.EnumCase({ type: null }),
  }),
})

const SkillSelectOptionCategoryPrerequisite = DB.Enum(import.meta.url, {
  name: "SkillSelectOptionCategoryPrerequisite",
  values: () => ({
    Self: DB.EnumCase({ type: DB.IncludeIdentifier(SelfPrerequisite) }),
    SelectOption: DB.EnumCase({ type: DB.IncludeIdentifier(OptionPrerequisite) }),
  }),
})

const SelfPrerequisite = DB.TypeAlias(import.meta.url, {
  name: "SelfPrerequisite",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The entry requires itself on a certain Skill Rating.",
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})

const OptionPrerequisite = DB.TypeAlias(import.meta.url, {
  name: "OptionPrerequisite",
  comment: "The entry requires or prohibits itself as a select option of another entry.",
  type: () =>
    DB.Object({
      id: DB.Required({
        comment: "The target entry's identifier.",
        type: DB.IncludeIdentifier(ActivatableIdentifier),
      }),
      active: DB.Required({
        comment: "Is the select option required (`true`) or prohibited (`false`)?",
        type: DB.Boolean(),
      }),
      level: DB.Optional({
        comment: "The required level, if any.",
        type: DB.Integer({ minimum: 2 }),
      }),
    }),
})

const SelectOptionsAdventurePointsValue = DB.GenEnum(import.meta.url, {
  name: "SelectOptionsAdventurePointsValue",
  comment: "Generate AP values for each entry.",
  parameters: [DB.Param("Identifier")],
  values: Identifier => ({
    DerivedFromImprovementCost: DB.EnumCase({
      type: DB.IncludeIdentifier(SelectOptionsDeriveAdventurePointsValueFromImprovementCost),
    }),
    Fixed: DB.EnumCase({
      type: DB.GenIncludeIdentifier(SelectOptionsFixedAdventurePointsValue, [
        DB.TypeArgument(Identifier),
      ]),
    }),
  }),
})

const SelectOptionsDeriveAdventurePointsValueFromImprovementCost = DB.TypeAlias(import.meta.url, {
  name: "SelectOptionsDeriveAdventurePointsValueFromImprovementCost",
  comment:
    "Derive the cost from the improvement cost of each entry. The AP value is calculated by multiplying the improvement cost with `multiplier` and then adding `offset`.",
  type: () =>
    DB.Object({
      multiplier: DB.Optional({
        comment:
          "This number is multiplied with the improvement cost of the entry (A = 1 to D = 4).",
        type: DB.Integer({ minimum: 2 }),
      }),
      offset: DB.Optional({
        comment: "This number is added to the multiplied improvement cost of the entry.",
        type: DB.Integer(),
      }),
    }),
})

const SelectOptionsFixedAdventurePointsValue = DB.GenTypeAlias(import.meta.url, {
  name: "SelectOptionsFixedAdventurePointsValue",
  parameters: [DB.Param("Identifier")],
  type: Identifier =>
    DB.Object({
      map: DB.Required({
        comment: "A mapping of skill identifiers to their specific AP values.",
        type: DB.Array(
          DB.GenIncludeIdentifier(SelectOptionsFixedAdventurePointsValueMapping, [
            DB.TypeArgument(Identifier),
          ]),
        ),
      }),
      default: DB.Required({
        comment:
          "The default value of an entry. Used as a fallback if no value is found in `list`.",
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})

const SelectOptionsFixedAdventurePointsValueMapping = DB.GenTypeAlias(import.meta.url, {
  name: "SelectOptionsFixedAdventurePointsValueMapping",
  parameters: [DB.Param("Identifier")],
  type: Identifier =>
    DB.Object({
      id: DB.Required({
        comment: "The entry’s identifier.",
        type: DB.TypeArgument(Identifier),
      }),
      ap_value: DB.Required({
        comment: "The AP value for the specified entry.",
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})

const SelectOptionsBindingCostValue = DB.GenEnum(import.meta.url, {
  name: "SelectOptionsBindingCostValue",
  comment: "Generate binding cost for each entry.",
  parameters: [DB.Param("Identifier")],
  values: Identifier => ({
    Fixed: DB.EnumCase({
      type: DB.GenIncludeIdentifier(SelectOptionsFixedBindingCostValue, [
        DB.TypeArgument(Identifier),
      ]),
    }),
  }),
})

const SelectOptionsFixedBindingCostValue = DB.GenTypeAlias(import.meta.url, {
  name: "SelectOptionsFixedBindingCostValue",
  parameters: [DB.Param("Identifier")],
  type: Identifier =>
    DB.Object({
      map: DB.Required({
        comment: "A mapping of skill identifiers to their specific binding cost values.",
        type: DB.Array(
          DB.GenIncludeIdentifier(SelectOptionsFixedBindingCostValueMapping, [
            DB.TypeArgument(Identifier),
          ]),
        ),
      }),
      default: DB.Required({
        comment:
          "The default value of an entry. Used as a fallback if no value is found in `list`.",
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})

const SelectOptionsFixedBindingCostValueMapping = DB.GenTypeAlias(import.meta.url, {
  name: "SelectOptionsFixedBindingCostValueMapping",
  parameters: [DB.Param("Identifier")],
  type: Identifier =>
    DB.Object({
      id: DB.Required({
        comment: "The entry’s identifier.",
        type: DB.TypeArgument(Identifier),
      }),
      bindingCost: DB.Required({
        comment: "The binding cost for the specified entry.",
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})

const TargetCategoriesSelectOptionCategory = DB.TypeAlias(import.meta.url, {
  name: "TargetCategoriesSelectOptionCategory",
  type: () =>
    DB.Object({
      list: DB.Required({
        comment: "A list of target categories.",
        type: DB.Array(DB.IncludeIdentifier(SpecificTargetCategory), { minItems: 1 }),
      }),
    }),
})

const SpecificTargetCategory = DB.TypeAlias(import.meta.url, {
  name: "SpecificTargetCategory",
  type: () =>
    DB.Object({
      id: DB.Required({
        comment: "The target category’s identifier.",
        type: TargetCategoryIdentifier(),
      }),
      volume: DB.Optional({
        comment: "The volume for this specific selection.",
        type: DB.Integer({ minimum: 0 }),
      }),
    }),
})
