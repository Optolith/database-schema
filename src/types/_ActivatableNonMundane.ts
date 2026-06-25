import * as DB from "tsondb/schema/dsl"
import { NestedTranslationMap } from "./Locale.js"
import { DurationUnitValue } from "./_ActivatableSkillDuration.js"
import { AspectIdentifier, PropertyIdentifier } from "./_Identifier.js"
import { VolumePointsOptionReferenceIdentifier } from "./_IdentifierGroup.js"
import { ResponsiveText, ResponsiveTextOptional } from "./_ResponsiveText.js"
import { OneTimeCostMap } from "./_ActivatableSkillCost.js"

const EnchantmentCost = DB.Enum(import.meta.url, {
  name: "EnchantmentCost",
  values: () => ({
    ArcaneEnergyCost: DB.EnumCase({ type: DB.IncludeIdentifier(ArcaneEnergyCost) }),
    BindingCost: DB.EnumCase({ type: DB.IncludeIdentifier(BindingCost) }),
  }),
})

export const cost_note = DB.Optional({
  comment: "A note, appended to the generated cost string in parenthesis.",
  type: DB.IncludeIdentifier(ResponsiveTextOptional),
})

export const cost = DB.Optional({
  comment: "The cost when casting the entry.",
  type: DB.IncludeIdentifier(EnchantmentCost),
})

export const ArcaneEnergyCost = DB.Enum(import.meta.url, {
  name: "ArcaneEnergyCost",
  comment: "The AE cost.",
  values: () => ({
    Fixed: DB.EnumCase({ type: DB.IncludeIdentifier(FixedArcaneEnergyCost) }),
    PerCountable: DB.EnumCase({ type: DB.IncludeIdentifier(ArcaneEnergyCostPerCountable) }),
    Interval: DB.EnumCase({ type: DB.IncludeIdentifier(IntervalArcaneEnergyCost) }),
    ActivationAndHalfInterval: DB.EnumCase({
      type: DB.IncludeIdentifier(ActivationAndHalfIntervalArcaneEnergyCost),
    }),
    Indefinite: DB.EnumCase({ type: DB.IncludeIdentifier(IndefiniteArcaneEnergyCost) }),
    Disjunction: DB.EnumCase({ type: DB.IncludeIdentifier(ArcaneEnergyCostDisjunction) }),
    Variable: DB.EnumCase({ type: null }),
    ByLevel: DB.EnumCase({ type: DB.IncludeIdentifier(ArcaneEnergyCostByLevel) }),
    Map: DB.EnumCase({ type: DB.IncludeIdentifier(OneTimeCostMap) }),
  }),
})

export const aeCost = DB.Optional({
  comment: "The AE cost.",
  isDeprecated: true,
  type: DB.String({ minLength: 1 }),
})

const FixedArcaneEnergyCost = DB.TypeAlias(import.meta.url, {
  name: "FixedArcaneEnergyCost",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The AE cost value.",
        type: DB.Integer({ minimum: 1 }),
      }),
      is_permanent: DB.Optional({
        comment: "Set to `true` if the AE costs are permanent.",
        type: DB.Boolean(),
      }),
      interval: DB.Optional({
        comment: "Specified if the AE cost `value` has to be paid for each time interval.",
        type: DB.IncludeIdentifier(DurationUnitValue),
      }),
      per_level: DB.Optional({
        comment:
          "The AE cost are per level of the enchantment. It may either be displayed in a compressed way (e.g. `1 AE per level`) or in a verbose way (e.g. `1 AE for level I; 2 AE for level II`).",
        type: DB.IncludeIdentifier(FixedArcaneEnergyCostPerLevel),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "FixedArcaneEnergyCost",
        DB.Object(
          {
            note: DB.Optional({
              comment: "A note, appended to the generated option string in parenthesis.",
              type: DB.IncludeIdentifier(ResponsiveTextOptional),
            }),
          },
          { minProperties: 1 },
        ),
      ),
    }),
})

const FixedArcaneEnergyCostPerLevel = DB.Enum(import.meta.url, {
  name: "FixedArcaneEnergyCostPerLevel",
  comment:
    "The AE cost are per level of the enchantment. It may either be displayed in a compressed way (e.g. `1 AE per level`) or in a verbose way (e.g. `1 AE for level I; 2 AE for level II`).",
  values: () => ({
    Compressed: DB.EnumCase({ type: null }),
    Verbose: DB.EnumCase({ type: null }),
  }),
})

const ArcaneEnergyCostPerCountable = DB.TypeAlias(import.meta.url, {
  name: "ArcaneEnergyCostPerCountable",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The AE cost value that has to be per a specific countable entity.",
        type: DB.Integer({ minimum: 1 }),
      }),
      base_value: DB.Optional({
        comment:
          "If defined, in addition to the cost per entity you have to pay a flat amount, regardless of the entity count.",
        type: DB.Integer({ minimum: 1 }),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "ArcaneEnergyCostPerCountable",
        DB.Object({
          per: DB.Required({
            comment: "The cost have to be per a specific countable entity, e.g. `8 AE per person`.",
            type: DB.IncludeIdentifier(ResponsiveText),
          }),
          note: DB.Optional({
            comment: "A note, appended to the generated string in parenthesis.",
            type: DB.IncludeIdentifier(ResponsiveTextOptional),
          }),
        }),
      ),
    }),
})

const IntervalArcaneEnergyCost = DB.TypeAlias(import.meta.url, {
  name: "IntervalArcaneEnergyCost",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The AE cost value that has to be payed each interval.",
        type: DB.Integer({ minimum: 1 }),
      }),
      interval: DB.Required({
        comment: "The time interval for which the AE cost `value` has to be paid.",
        type: DB.IncludeIdentifier(DurationUnitValue),
      }),
    }),
})

const ActivationAndHalfIntervalArcaneEnergyCost = DB.TypeAlias(import.meta.url, {
  name: "ActivationAndHalfIntervalArcaneEnergyCost",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment:
          "The AE cost value that has to be payed for activation. Half of this value has to be payed each interval.",
        type: DB.Integer({ minimum: 2, multipleOf: 2 }),
      }),
      interval: DB.Required({
        comment: "The time interval for which the AE cost `value` has to be paid.",
        type: DB.IncludeIdentifier(DurationUnitValue),
      }),
    }),
})

const IndefiniteArcaneEnergyCost = DB.TypeAlias(import.meta.url, {
  name: "IndefiniteArcaneEnergyCost",
  type: () =>
    DB.Object({
      modifier: DB.Optional({
        comment:
          "Specified if the indefinite AP cost description needs to be modified by a certain value.",
        type: DB.IncludeIdentifier(IndefiniteArcaneEnergyCostModifier),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "IndefiniteArcaneEnergyCost",
        DB.Object({
          description: DB.Required({
            comment: "A description of where the cost come from.",
            type: DB.IncludeIdentifier(ResponsiveText),
          }),
        }),
      ),
    }),
})

const IndefiniteArcaneEnergyCostModifier = DB.TypeAlias(import.meta.url, {
  name: "IndefiniteArcaneEnergyCostModifier",
  type: () =>
    DB.Object({
      arithmetic: DB.Required({
        comment: "The arithmetic how to apply the `value` to the `base`.",
        type: DB.IncludeIdentifier(IndefiniteArcaneEnergyCostModifierArithmetic),
      }),
      value: DB.Required({
        comment: "The value that is applied to the `base` using the defined `arithmetic`.",
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})

const IndefiniteArcaneEnergyCostModifierArithmetic = DB.Enum(import.meta.url, {
  name: "IndefiniteArcaneEnergyCostModifierArithmetic",
  values: () => ({
    Add: DB.EnumCase({ type: null }),
  }),
})

const ArcaneEnergyCostDisjunction = DB.TypeAlias(import.meta.url, {
  name: "ArcaneEnergyCostDisjunction",
  type: () =>
    DB.Object({
      // interval: DB.Optional({
      //   comment: "Specified if the selected AE cost option has to be paid for each time interval.",
      //   type: DB.IncludeIdentifier(ArcaneEnergyCostDisjunctionInterval),
      // }),
      options: DB.Required({
        comment: "The possible AE cost values.",
        type: DB.Array(DB.IncludeIdentifier(ArcaneEnergyCostDisjunctionOption), { minItems: 1 }),
      }),
    }),
})

// Unclear what the following was for, but I will keep it in here for now just in case I forgot about something

// const ArcaneEnergyCostDisjunctionInterval = DB.TypeAlias(import.meta.url, {
//   name: "ArcaneEnergyCostDisjunctionInterval",
//   type: () =>
//     DB.Object({
//       value: DB.Required({
//         comment: "The interval itself.",
//         type: DB.IncludeIdentifier(DurationUnitValue),
//       }),
//       activation_value: DB.Required({
//         comment: "The AE cost value for activation.",
//         type: DB.Integer({ minimum: 1 }),
//       }),
//       after_activation: DB.Required({
//         comment: `Set to \`true\` if the action where the enchantment is casted does not as a part of the first interval that has to be payed, so that the first interval payment needs to be done after the activation.

// This works different than other sustained spells, since for them the end of the cast usually already counts as part of the first interval.`,
//         type: DB.Boolean(),
//       }),
//     }),
// })

const ArcaneEnergyCostDisjunctionOption = DB.TypeAlias(import.meta.url, {
  name: "ArcaneEnergyCostDisjunctionOption",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "A possible AE cost value.",
        type: DB.Integer({ minimum: 1 }),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "ArcaneEnergyCostDisjunctionOption",
        DB.Object(
          {
            note: DB.Optional({
              comment: "A note, appended to the generated option string in parenthesis.",
              type: DB.IncludeIdentifier(ResponsiveTextOptional),
            }),
          },
          { minProperties: 1 },
        ),
      ),
    }),
})

const ArcaneEnergyCostByLevel = DB.TypeAlias(import.meta.url, {
  name: "ArcaneEnergyCostByLevel",
  type: () =>
    DB.Object({
      levels: DB.Required({
        comment:
          "A continuous range of arcane energy cost for each level. The first element is the AE cost for the first level, the second element is the AE cost for the second level, and so on.",
        type: DB.Array(DB.IncludeIdentifier(ArcaneEnergyCostByLevelLevel), { minItems: 2 }),
      }),
      style: DB.Required({
        comment: "How to display the AE cost by level.",
        type: DB.IncludeIdentifier(ArcaneEnergyCostByLevelStyle),
      }),
    }),
})

const ArcaneEnergyCostByLevelLevel = DB.TypeAlias(import.meta.url, {
  name: "ArcaneEnergyCostByLevelLevel",
  type: () =>
    DB.Object({
      value: DB.Required({
        comment: "The arcane energy cost for this level.",
        type: DB.Integer({ minimum: 0 }),
      }),
    }),
})

const ArcaneEnergyCostByLevelStyle = DB.Enum(import.meta.url, {
  name: "ArcaneEnergyCostByLevelStyle",
  comment:
    "The AE cost are defined by level of the enchantment. It may either be displayed in a compressed way (e.g. `1/2 AE for level I/II`) or in a verbose way (e.g. `1 AE for level I; 2 AE for level II`).",
  values: () => ({
    Compressed: DB.EnumCase({ type: null }),
    Verbose: DB.EnumCase({ type: null }),
  }),
})

const Volume = DB.Enum(import.meta.url, {
  name: "Volume",
  comment: "The volume points the enchantment needs.",
  values: () => ({
    Fixed: DB.EnumCase({ type: DB.IncludeIdentifier(FixedVolume) }),
    PerLevel: DB.EnumCase({ type: DB.IncludeIdentifier(VolumePerLevel) }),
    ByLevel: DB.EnumCase({ type: DB.IncludeIdentifier(VolumeByLevel) }),
    Map: DB.EnumCase({ type: DB.IncludeIdentifier(VolumeMap) }),
    DerivedFromSelection: DB.EnumCase({ type: DB.IncludeIdentifier(VolumeDerivedFromSelection) }),
  }),
})

export const volume = DB.Required({
  comment: "The volume points the enchantment needs.",
  type: DB.IncludeIdentifier(Volume),
})

export const volume_l10n = DB.Optional({
  comment: "The volume points the enchantment needs.",
  isDeprecated: true,
  type: DB.String({ minLength: 1 }),
})

const FixedVolume = DB.TypeAlias(import.meta.url, {
  name: "FixedVolume",
  type: () =>
    DB.Object({
      points: DB.Required({
        comment: "The volume points.",
        type: DB.Integer({ minimum: 0 }),
      }),
    }),
})

const VolumePerLevel = DB.TypeAlias(import.meta.url, {
  name: "VolumePerLevel",
  type: () =>
    DB.Object({
      points: DB.Required({
        comment: "The volume points per level.",
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})

const VolumeByLevel = DB.TypeAlias(import.meta.url, {
  name: "VolumeByLevel",
  type: () =>
    DB.Object({
      list: DB.Required({
        comment:
          "The volume points for each level. The first element is the volume points for the first level, the second element is the volume points for the second level, and so on.",
        type: DB.Array(DB.IncludeIdentifier(VolumeByLevelItem), { minItems: 2 }),
      }),
    }),
})

const VolumeByLevelItem = DB.TypeAlias(import.meta.url, {
  name: "VolumeByLevelItem",
  type: () =>
    DB.Object({
      points: DB.Required({
        comment: "The volume points for this level.",
        type: DB.Integer({ minimum: 0 }),
      }),
    }),
})

const VolumeMap = DB.TypeAlias(import.meta.url, {
  name: "VolumeMap",
  comment: `A content that is \`3/4/5 Points for Chimera, Daimonid, Golems, Undead / Fairies, Ghosts / Demons, Elementals\` may be respresented as the following map:

\`\`\`yaml
options:
  - points: 3
    associated_options:
      - id:
          tag: General
          value: # ...
      # ...
    translations:
      en-US:
        label: "Chimera, Daimonid, Golems, Undead"
        label_standalone: "Chimera/Daimonid/Golems/Undead"
  - points: 4
    associated_options:
      - id:
          tag: General
          value: # ...
      # ...
    translations:
      en-US:
        label: "Fairies, Ghosts"
        label_standalone: "Fairies/Ghosts"
  - points: 5
    associated_options:
      - id:
          tag: General
          value: # ...
      # ...
    translations:
      en-US:
        label: "Demons, Elementals"
        label_standalone: "Demons/Elementals"
\`\`\`

This will generate the exact same string as seen above. The associated options are not present in the example, but they link to the options the volume specification is meant for.`,
  type: () =>
    DB.Object({
      options: DB.Required({
        comment: "The possible costs and associated labels.",
        type: DB.Array(DB.IncludeIdentifier(VolumeMapOption), { minItems: 2 }),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "VolumeMap",
        DB.Object(
          {
            list_prepend: DB.Optional({
              comment: "Place a string between the `for` and the grouped map option labels.",
              type: DB.IncludeIdentifier(ResponsiveTextOptional),
            }),
            list_append: DB.Optional({
              comment: "Place a string after the grouped map option labels.",
              type: DB.IncludeIdentifier(ResponsiveTextOptional),
            }),
            replacement: DB.Optional({
              comment:
                "If the string from the book cannot be generated using the default generation technique, use this string. All options still need to be inserted propertly, since it may be used by in-game tools to provide a selection to players.",
              type: DB.IncludeIdentifier(ResponsiveTextOptional),
            }),
          },
          { minProperties: 1 },
        ),
      ),
    }),
})

const VolumeMapOption = DB.TypeAlias(import.meta.url, {
  name: "VolumeMapOption",
  type: () =>
    DB.Object({
      points: DB.Required({
        comment: "The full permanent AE cost value for this option.",
        type: DB.Integer({ minimum: 1 }),
      }),
      associated_options: DB.Required({
        comment: "Links to the options this volume specification is meant for.",
        type: DB.Array(DB.IncludeIdentifier(VolumeMapOptionAssociatedOption), { minItems: 1 }),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "VolumeMapOption",
        DB.Object(
          {
            label: DB.Required({
              comment: "The description of the option for cost string generation.",
              type: DB.IncludeIdentifier(ResponsiveTextOptional),
            }),
            label_standalone: DB.Optional({
              comment:
                "The description of the option if used standalone. Only used if different from `label`.",
              type: DB.IncludeIdentifier(ResponsiveTextOptional),
            }),
          },
          { minProperties: 1 },
        ),
      ),
    }),
})

const VolumeMapOptionAssociatedOption = DB.TypeAlias(import.meta.url, {
  name: "VolumeMapOptionAssociatedOption",
  type: () =>
    DB.Object({
      id: DB.Required({
        comment: "The option’s identifier.",
        type: DB.IncludeIdentifier(VolumePointsOptionReferenceIdentifier),
      }),
    }),
})

const VolumeDerivedFromSelection = DB.TypeAlias(import.meta.url, {
  name: "VolumeDerivedFromSelection",
  type: () =>
    DB.Object({
      fallback: DB.Required({
        comment: "The volume for the selection if it does not define a specific one.",
        type: DB.Integer({ minimum: 0 }),
      }),
    }),
})

export const BindingCost = DB.Enum(import.meta.url, {
  name: "BindingCost",
  comment: "The binding cost for an enchantment.",
  values: () => ({
    Fixed: DB.EnumCase({ type: DB.IncludeIdentifier(FixedBindingCost) }),
    PerLevel: DB.EnumCase({ type: DB.IncludeIdentifier(BindingCostPerLevel) }),
    Map: DB.EnumCase({ type: DB.IncludeIdentifier(BindingCostMap) }),
    DerivedFromSelection: DB.EnumCase({
      type: DB.IncludeIdentifier(BindingCostDerivedFromSelection),
    }),
  }),
})

export const bindingCost = DB.Optional({
  comment: "The binding cost for an enchantment.",
  isDeprecated: true,
  type: DB.String({ minLength: 1 }),
})

const FixedBindingCost = DB.TypeAlias(import.meta.url, {
  name: "FixedBindingCost",
  type: () =>
    DB.Object({
      permanent_value: DB.Required({
        comment: `The permanent AE cost.

If the enchantment has multiple levels, it is only applied for the first level.`,
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})

const BindingCostPerLevel = DB.TypeAlias(import.meta.url, {
  name: "BindingCostPerLevel",
  type: () =>
    DB.Object({
      permanent_value: DB.Required({
        comment: "The permanent AE cost per level.",
        type: DB.Integer({ minimum: 1 }),
      }),
    }),
})

const BindingCostMap = DB.TypeAlias(import.meta.url, {
  name: "BindingCostMap",
  comment: `A content that is \`2/4/8 permanent AE for spell-swords with the combat technique Daggers, Swords, or Two-Handed Swords\` may be respresented as the following map:

\`\`\`yaml
options:
  - permanent_value: 2
    translations:
      en-US:
        label: "Daggers"
        label_standalone: "Dagger"
  - permanent_value: 4
    translations:
      en-US:
        label: "Swords"
        label_standalone: "Sword"
  - permanent_value: 8
    translations:
      en-US:
        label: "Two-Handed Swords"
        label_standalone: "Two-Handed Sword"
list_prepend: "spell-swords with the combat technique"
\`\`\`

This will generate the exact same string as seen above.`,
  type: () =>
    DB.Object({
      options: DB.Required({
        comment: "The possible costs and associated labels.",
        type: DB.Array(DB.IncludeIdentifier(BindingCostMapOption), { minItems: 2 }),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "BindingCostMap",
        DB.Object(
          {
            list_prepend: DB.Optional({
              comment: "Place a string between the `for` and the grouped map option labels.",
              type: DB.IncludeIdentifier(ResponsiveTextOptional),
            }),
            list_append: DB.Optional({
              comment: "Place a string after the grouped map option labels.",
              type: DB.IncludeIdentifier(ResponsiveTextOptional),
            }),
            replacement: DB.Optional({
              comment:
                "If the string from the book cannot be generated using the default generation technique, use this string. All options still need to be inserted propertly, since it may be used by in-game tools to provide a selection to players.",
              type: DB.IncludeIdentifier(ResponsiveTextOptional),
            }),
          },
          { minProperties: 1 },
        ),
      ),
    }),
})

const BindingCostMapOption = DB.TypeAlias(import.meta.url, {
  name: "BindingCostMapOption",
  type: () =>
    DB.Object({
      permanent_value: DB.Required({
        comment: "The full permanent AE cost value for this option.",
        type: DB.Integer({ minimum: 1 }),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "BindingCostMapOption",
        DB.Object({
          label: DB.Required({
            comment: "The description of the option for cost string generation.",
            type: DB.IncludeIdentifier(ResponsiveTextOptional),
          }),
          label_standalone: DB.Optional({
            comment:
              "The description of the option if used standalone. Only used if different from `label`.",
            type: DB.IncludeIdentifier(ResponsiveTextOptional),
          }),
        }),
      ),
    }),
})

const BindingCostDerivedFromSelection = DB.TypeAlias(import.meta.url, {
  name: "BindingCostDerivedFromSelection",
  type: () =>
    DB.Object({
      fallback: DB.Required({
        comment: "The binding cost for the selection if it does not define a specific one.",
        type: DB.Integer({ minimum: 0 }),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "BindingCostDerivedFromSelection",
        DB.Object(
          {
            listPrepend: DB.Optional({
              comment: "Place a string between the `for` and the grouped option names.",
              type: DB.String({ minLength: 1 }),
            }),
            replacement: DB.Optional({
              comment:
                "A replacement for the generated text if it would not match the original one.",
              type: DB.String({ minLength: 1, markdown: "inline" }),
            }),
          },
          { minProperties: 1 },
        ),
      ),
    }),
})

const PropertyDeclaration = DB.Enum(import.meta.url, {
  name: "PropertyDeclaration",
  comment:
    "The magic property’s identifier. `DependingOnProperty` can only be used if the special ability has an option to select a property.",
  values: () => ({
    DependingOnSelection: DB.EnumCase({ type: null }),
    Fixed: DB.EnumCase({ type: PropertyIdentifier() }),
  }),
})

export const property = () =>
  DB.Required({
    comment:
      "The magic property’s identifier. `DependingOnProperty` can only be used if the special ability has an option to select a property.",
    type: DB.IncludeIdentifier(PropertyDeclaration),
  })

export const propertyOptional = () =>
  DB.Optional({
    comment:
      "The magic property’s identifier. `DependingOnProperty` can only be used if the special ability has an option to select a property.",
    type: DB.IncludeIdentifier(PropertyDeclaration),
  })

export const aspect = () =>
  DB.Required({
    comment: "The blessed aspect.",
    type: AspectIdentifier(),
  })

export const aspectOptional = () =>
  DB.Optional({
    comment: "The blessed aspect.",
    type: AspectIdentifier(),
  })
