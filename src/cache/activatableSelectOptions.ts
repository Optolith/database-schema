import { on } from "@elyukai/utils/function"
import { isNotNullish } from "@elyukai/utils/nullable"
import { mapObject } from "@elyukai/utils/object"
import { compareNullish, compareNumber } from "@elyukai/utils/ordering"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { Entity, TSONDB } from "tsondb"
import { Case, fromUniformCase } from "tsondb/schema/gen"
import type {
  ActivatableIdentifier,
  BlessedTradition,
  CombatTechniqueIdentifier,
  Element,
  GeneralPrerequisiteGroup,
  GeneralPrerequisites,
  GeneralSelectOption,
  GenericSkillsSelectOptionCategoryCategory,
  ImprovementCost,
  Poison,
  PrerequisiteForLevel,
  RequirableSelectOptionIdentifier,
  SelectOptionCategory,
  SelectOptions,
  SelectOptionsAdventurePointsValue,
  SelectOptionsBindingCostValue,
  Skill_ID,
  SkillApplicationOrUse,
  SkillishIdentifier,
  SkillSelectOptionCategoryPrerequisite,
  SpecificFromSkillSelectOptionCategoryCategory,
  SpecificTargetCategory,
  TargetCategory,
  TradeSecretAdventurePointsValue,
} from "../../gen/types.js"
import type { TSONDBTypes } from "../main.js"
import type { IdMap } from "./index.ts"
import type { CacheBuilder } from "./internal.ts"
import type { ResolvedNewSkillApplication, ResolvedSkillUse } from "./newApplicationsAndUses.ts"

export type ResolvedSelectOptionIdentifier =
  | RequirableSelectOptionIdentifier
  | Case<
      | "Blessing"
      | "Cantrip"
      | "Script"
      | "Culture"
      | "SexPractice"
      | "HomunculusType"
      | "BlessedTradition"
      | "Disease"
      | "Poison"
      | "TargetCategory",
      string
    >

export type ResolvedSelectOption = {
  id: ResolvedSelectOptionIdentifier
  content: Omit<GeneralSelectOption, "ap_value"> & {
    volume?: number
    ap_value?: TradeSecretAdventurePointsValue
  }
  newApplications: ResolvedNewSkillApplication[]
  uses: ResolvedSkillUse[]
}

const wrapPlainApValue = (
  apValue: number | undefined,
): TradeSecretAdventurePointsValue | undefined =>
  apValue === undefined ? undefined : Case("Fixed", apValue)

const matchesSpecificSkillishIdList = (
  id: string,
  config: SpecificFromSkillSelectOptionCategoryCategory<string>,
): boolean => {
  switch (config.operation.kind) {
    case "Intersection":
      return config.list.includes(id)
    case "Difference":
      return !config.list.includes(id)
    default:
      return assertExhaustive(config.operation)
  }
}

const getSkillishPrerequisites = (
  ps: SkillSelectOptionCategoryPrerequisite[] | undefined,
  id: SkillishIdentifier | CombatTechniqueIdentifier,
): GeneralPrerequisites | undefined => {
  if (ps === undefined) {
    return undefined
  }

  return ps.map(p => {
    switch (p.kind) {
      case "Self":
        return {
          level: 1,
          prerequisite: Case(
            "Single",
            Case("Rated", {
              id,
              value: p.Self.value,
            }),
          ),
        }
      case "SelectOption":
        return {
          level: 1,
          prerequisite: Case(
            "Single",
            Case("Activatable", {
              id: p.SelectOption.id,
              active: p.SelectOption.active,
              level: p.SelectOption.level,
              options: [id],
            }),
          ),
        }
      default:
        return assertExhaustive(p)
    }
  })
}

const getSkillishBindingCost = (
  bindingCost:
    | SelectOptionsBindingCostValue<SkillishIdentifier | CombatTechniqueIdentifier>
    | undefined,
  id: Case<SkillishEntityName, string>,
): number | undefined => {
  if (bindingCost === undefined) {
    return undefined
  }

  return (
    bindingCost.Fixed.map.find(mapping => equalsSkillishIdGroup(mapping.id, id))?.bindingCost ??
    bindingCost.Fixed.default
  )
}

const equalsSkillishIdGroup = (
  a: SkillishIdentifier | CombatTechniqueIdentifier,
  b: SkillishIdentifier | CombatTechniqueIdentifier,
): boolean => {
  switch (a.kind) {
    case "Skill":
      return b.kind === "Skill" && a.Skill === b.Skill
    case "Spell":
      return b.kind === "Spell" && a.Spell === b.Spell
    case "Ritual":
      return b.kind === "Ritual" && a.Ritual === b.Ritual
    case "LiturgicalChant":
      return b.kind === "LiturgicalChant" && a.LiturgicalChant === b.LiturgicalChant
    case "Ceremony":
      return b.kind === "Ceremony" && a.Ceremony === b.Ceremony
    case "CloseCombatTechnique":
      return b.kind === "CloseCombatTechnique" && a.CloseCombatTechnique === b.CloseCombatTechnique
    case "RangedCombatTechnique":
      return (
        b.kind === "RangedCombatTechnique" && a.RangedCombatTechnique === b.RangedCombatTechnique
      )
    default:
      return assertExhaustive(a)
  }
}

const getApValueForSkillish = (
  config:
    | SelectOptionsAdventurePointsValue<SkillishIdentifier | CombatTechniqueIdentifier>
    | undefined,
  id: SkillishIdentifier | CombatTechniqueIdentifier,
  ic: ImprovementCost,
): number | undefined => {
  if (config === undefined) {
    return undefined
  }

  switch (config.kind) {
    case "DerivedFromImprovementCost":
      return (
        (() => {
          switch (ic.kind) {
            case "A":
              return 1
            case "B":
              return 2
            case "C":
              return 3
            case "D":
              return 4
            default:
              assertExhaustive(ic)
          }
        })() *
          (config.DerivedFromImprovementCost.multiplier ?? 1) +
        (config.DerivedFromImprovementCost.offset ?? 0)
      )
    case "Fixed":
      return (
        config.Fixed.map.find(mapping => equalsSkillishIdGroup(mapping.id, id))?.ap_value ??
        config.Fixed.default
      )
    default:
      return assertExhaustive(config)
  }
}

const convertSkillApplicationOrUse = (
  entryId: ActivatableIdentifier,
  id: Skill_ID,
  applicationOrUse: SkillApplicationOrUse,
) =>
  ({
    id: fromUniformCase(entryId) + "+" + applicationOrUse.id,
    content: {
      parent: entryId,
      skills: [id],
      translations: applicationOrUse.translations,
    },
  }) satisfies ResolvedNewSkillApplication | ResolvedSkillUse

type SkillishEntityName =
  | "Skill"
  | "CloseCombatTechnique"
  | "RangedCombatTechnique"
  | "Spell"
  | "Ritual"
  | "LiturgicalChant"
  | "Ceremony"

const getDefaultSkillishFilter = <E extends SkillishEntityName>(
  category: GenericSkillsSelectOptionCategoryCategory<string>,
): ((instance: { id: string; content: Entity<TSONDBTypes, E> }) => boolean) | undefined => {
  const { specific } = category
  return specific === undefined
    ? undefined
    : ({ id }) => matchesSpecificSkillishIdList(id, specific)
}

const getDerivedSkillishSelectOptions = <E extends SkillishEntityName>(
  database: TSONDB<TSONDBTypes>,
  entryId: ActivatableIdentifier,
  entity: E,
  category: GenericSkillsSelectOptionCategoryCategory<string> & {
    skill_applications?: SkillApplicationOrUse[] | undefined
    skill_uses?: SkillApplicationOrUse[] | undefined
  },
  options: {
    bindingCost?: SelectOptionsBindingCostValue<SkillishIdentifier | CombatTechniqueIdentifier>
    ap_value?: SelectOptionsAdventurePointsValue<SkillishIdentifier | CombatTechniqueIdentifier>
  },
  filter = getDefaultSkillishFilter<E>(category),
) => {
  const { prerequisites } = category
  const { bindingCost, ap_value } = options

  const instances = database.getAllInstanceContainersOfEntity(entity)
  const filteredInstances = filter === undefined ? instances : instances.filter(filter)
  return filteredInstances.map(({ id, content }): ResolvedSelectOption => {
    const wrappedId = Case<SkillishEntityName, string>(entity, id)
    return {
      id: wrappedId,
      content: {
        parent: entryId,
        prerequisites: getSkillishPrerequisites(prerequisites, wrappedId),
        binding_cost: getSkillishBindingCost(bindingCost, wrappedId),
        ap_value: wrapPlainApValue(
          getApValueForSkillish(ap_value, wrappedId, content.improvement_cost),
        ),
        src: content.src,
        translations: mapObject(content.translations, t10n => ({
          name: t10n.name,
        })),
      },
      newApplications:
        category.skill_applications?.map(app => convertSkillApplicationOrUse(entryId, id, app)) ??
        [],
      uses: category.skill_uses?.map(use => convertSkillApplicationOrUse(entryId, id, use)) ?? [],
    }
  })
}

const getDerivedSelectOptions = (
  selectOptionCategory: SelectOptionCategory,
  entryId: ActivatableIdentifier,
  database: TSONDB<TSONDBTypes>,
  idMap: IdMap,
): ResolvedSelectOption[] => {
  switch (selectOptionCategory.kind) {
    case "Blessings":
      return database.getAllInstanceContainersOfEntity("Blessing").map(
        ({ id, content }): ResolvedSelectOption => ({
          id: Case("Blessing", id),
          content: {
            parent: entryId,
            src: content.src,
            translations: mapObject(content.translations, t10n => ({ name: t10n.name })),
          },
          newApplications: [],
          uses: [],
        }),
      )

    case "Cantrips":
      return database.getAllInstanceContainersOfEntity("Cantrip").map(
        ({ id, content }): ResolvedSelectOption => ({
          id: Case("Cantrip", id),
          content: {
            parent: entryId,
            src: content.src,
            translations: mapObject(content.translations, t10n => ({ name: t10n.name })),
          },
          newApplications: [],
          uses: [],
        }),
      )

    case "TradeSecrets":
      return database.getAllInstanceContainersOfEntity("TradeSecret").map(
        ({ id, content }): ResolvedSelectOption => ({
          id: Case("TradeSecret", id),
          content: {
            parent: entryId,
            prerequisites: content.prerequisites?.map(p => ({ level: 1, prerequisite: p })),
            ap_value: content.ap_value,
            src: content.src,
            translations: mapObject(content.translations, t10n => ({
              name: t10n.name,
              errata: t10n.errata,
            })),
          },
          newApplications: [],
          uses: [],
        }),
      )

    case "Scripts":
      return database.getAllInstanceContainersOfEntity("Script").map(
        ({ id, content }): ResolvedSelectOption => ({
          id: Case("Script", id),
          content: {
            parent: entryId,
            ap_value: wrapPlainApValue(content.ap_value),
            src: content.src,
            translations: mapObject(content.translations, t10n => ({
              name: t10n.name,
              errata: t10n.errata,
            })),
          },
          newApplications: [],
          uses: [],
        }),
      )

    case "AnimalShapes": {
      const animalShapePaths = database.getAllInstanceContainersOfEntity("AnimalShapePath")
      const animalShapeSizes = database.getAllInstanceContainersOfEntity("AnimalShapeSize")
      const animalShapes = database.getAllInstanceContainersOfEntity("AnimalShape")

      const pathsWithOrderedIds = animalShapePaths.reduce<Record<string, string[]>>(
        (acc, { id }) => ({
          ...acc,
          [id]: animalShapes
            .toSorted(
              on(
                item =>
                  database.getInstanceContainerOfEntityById("AnimalShapeSize", item.content.size)
                    ?.content.volume,
                compareNullish(compareNumber),
              ),
            )
            .map(({ id }) => id),
        }),
        {},
      )

      return animalShapes.map(({ id, content }): ResolvedSelectOption => {
        const path = animalShapePaths.find(({ id: pathId }) => pathId === content.path)
        const size = animalShapeSizes.find(({ id: sizeId }) => sizeId === content.size)
        const pathIndex =
          path !== undefined ? (pathsWithOrderedIds[path.id]?.indexOf(id) ?? -1) : -1
        return {
          id: Case("AnimalShape", id),
          content: {
            parent: entryId,
            prerequisites:
              pathIndex >= 0
                ? pathIndex === 0
                  ? animalShapePaths
                      .filter(
                        ({ id: pathId }) =>
                          pathId !== content.path && pathsWithOrderedIds[pathId]?.[0] !== undefined,
                      )
                      .map(({ id: pathId }) => ({
                        level: 1,
                        prerequisite: Case(
                          "Single",
                          Case("Activatable", {
                            id: entryId,
                            active: false,
                            options: [Case("AnimalShape", pathsWithOrderedIds[pathId]![0]!)],
                          }),
                        ),
                      }))
                  : [
                      {
                        level: 1,
                        prerequisite: Case(
                          "Single",
                          Case("Activatable", {
                            id: entryId,
                            active: true,
                            options: [
                              Case("AnimalShape", pathsWithOrderedIds[path!.id]![pathIndex - 1]!),
                            ],
                          }),
                        ),
                      },
                    ]
                : undefined,
            volume: size?.content.volume,
            ap_value: wrapPlainApValue(size?.content.ap_value),
            translations: mapObject(content.translations, (t10n, lang) => ({
              name:
                path?.content.translations[lang] !== undefined
                  ? `${t10n.name} (${path.content.translations[lang].name})`
                  : t10n.name,
            })),
          },
          newApplications: [],
          uses: [],
        }
      })
    }

    case "ArcaneBardTraditions":
      return database.getAllInstanceContainersOfEntity("ArcaneBardTradition").map(
        ({ id, content }): ResolvedSelectOption => ({
          id: Case("ArcaneBardTradition", id),
          content: {
            parent: entryId,
            prerequisites: content.prerequisites.map(p => ({
              level: 1,
              prerequisite: p,
            })),
            translations: mapObject(content.translations, t10n => ({
              name: t10n.name,
            })),
          },
          newApplications: [],
          uses: [],
        }),
      )

    case "ArcaneDancerTraditions":
      return database.getAllInstanceContainersOfEntity("ArcaneDancerTradition").map(
        ({ id, content }): ResolvedSelectOption => ({
          id: Case("ArcaneDancerTradition", id),
          content: {
            parent: entryId,
            prerequisites: content.prerequisites.map(p => ({
              level: 1,
              prerequisite: p,
            })),
            translations: mapObject(content.translations, t10n => ({
              name: t10n.name,
            })),
          },
          newApplications: [],
          uses: [],
        }),
      )

    case "SexPractices":
      return database.getAllInstanceContainersOfEntity("SexPractice").map(
        ({ id, content }): ResolvedSelectOption => ({
          id: Case("SexPractice", id),
          content: {
            parent: entryId,
            src: content.src,
            translations: mapObject(content.translations, t10n => ({
              name: t10n.name,
            })),
          },
          newApplications: [],
          uses: [],
        }),
      )

    case "Races":
      return database.getAllInstanceContainersOfEntity("Race").map(
        ({ id, content }): ResolvedSelectOption => ({
          id: Case("Race", id),
          content: {
            parent: entryId,
            src: content.src,
            translations: mapObject(content.translations, t10n => ({
              name: t10n.name,
            })),
          },
          newApplications: [],
          uses: [],
        }),
      )

    case "Cultures":
      return database.getAllInstanceContainersOfEntity("Culture").map(
        ({ id, content }): ResolvedSelectOption => ({
          id: Case("Culture", id),
          content: {
            parent: entryId,
            src: content.src,
            translations: mapObject(content.translations, t10n => ({
              name: t10n.name,
            })),
          },
          newApplications: [],
          uses: [],
        }),
      )

    case "RacesAndCultures":
      return [
        ...database.getAllInstanceContainersOfEntity("Race").map(
          ({ id, content }): ResolvedSelectOption => ({
            id: Case("Race", id),
            content: {
              parent: entryId,
              src: content.src,
              translations: mapObject(content.translations, t10n => ({
                name: t10n.name,
              })),
            },
            newApplications: [],
            uses: [],
          }),
        ),
        ...database.getAllInstanceContainersOfEntity("Culture").map(
          ({ id, content }): ResolvedSelectOption => ({
            id: Case("Culture", id),
            content: {
              parent: entryId,
              src: content.src,
              translations: mapObject(content.translations, t10n => ({
                name: t10n.name,
              })),
            },
            newApplications: [],
            uses: [],
          }),
        ),
      ]

    case "HomunculusTypes":
      return database.getAllInstanceContainersOfEntity("HomunculusType").map(
        ({ id, content }): ResolvedSelectOption => ({
          id: Case("HomunculusType", id),
          content: {
            parent: entryId,
            translations: mapObject(content.translations, t10n => ({
              name: t10n.name,
            })),
          },
          newApplications: [],
          uses: [],
        }),
      )

    case "BlessedTraditions": {
      const getPrerequisites = (
        blessedTradition: BlessedTradition,
      ): GeneralPrerequisites | undefined => {
        if (
          selectOptionCategory.BlessedTraditions.require_principles &&
          blessedTradition.associated_principles_id !== undefined
        ) {
          const option = database.getInstanceContainerOfEntityById(
            "GeneralSelectOption",
            blessedTradition.associated_principles_id,
          )
          if (option === undefined || option.content.parent.kind === "TradeSecret") {
            return undefined
          }
          return [
            {
              level: 1,
              prerequisite: Case(
                "Single",
                Case("Activatable", {
                  id: option.content.parent,
                  active: true,
                  options: [Case("General", blessedTradition.associated_principles_id)],
                }),
              ),
            },
          ]
        }

        return undefined
      }

      return database.getAllInstanceContainersOfEntity("BlessedTradition").map(
        ({ id, content }): ResolvedSelectOption => ({
          id: Case("BlessedTradition", id),
          content: {
            parent: entryId,
            prerequisites: getPrerequisites(content),
            src: content.src,
            translations: mapObject(content.translations, t10n => ({
              name: t10n.name,
            })),
          },
          newApplications: [],
          uses: [],
        }),
      )
    }

    case "Elements": {
      const mapToResolvedSelectOption = ({
        id,
        content,
      }: {
        id: string
        content: Element
      }): ResolvedSelectOption => ({
        id: Case("Element", id),
        content: {
          parent: entryId,
          translations: mapObject(content.translations, t10n => ({
            name: t10n.name,
          })),
        },
        newApplications: [],
        uses: [],
      })

      const specific = selectOptionCategory.Elements.specific

      if (specific) {
        return database
          .getAllInstanceContainersOfEntity("Element")
          .filter(({ id }) => specific.includes(id))
          .map(mapToResolvedSelectOption)
      }

      return database.getAllInstanceContainersOfEntity("Element").map(mapToResolvedSelectOption)
    }

    case "Properties": {
      const getPrerequisites = (id: string): GeneralPrerequisites | undefined => {
        if (
          selectOptionCategory.Properties.require_knowledge !== undefined ||
          selectOptionCategory.Properties.require_minimum_spellworks_on !== undefined
        ) {
          const knowledgePrerequisite: PrerequisiteForLevel<GeneralPrerequisiteGroup> | undefined =
            selectOptionCategory.Properties.require_knowledge !== undefined
              ? {
                  level: 1,
                  prerequisite: Case(
                    "Single",
                    Case("Activatable", {
                      id: Case(
                        "MagicalSpecialAbility",
                        idMap.MagicalSpecialAbility.PropertyKnowledge,
                      ),
                      active: true,
                      options: [Case("Property", id)],
                    }),
                  ),
                }
              : undefined

          const minimumSpellworksPrerequisite:
            | PrerequisiteForLevel<GeneralPrerequisiteGroup>
            | undefined =
            selectOptionCategory.Properties.require_minimum_spellworks_on !== undefined
              ? {
                  level: 1,
                  prerequisite: Case(
                    "Single",
                    Case("RatedMinimumNumber", {
                      number: selectOptionCategory.Properties.require_minimum_spellworks_on.number,
                      value: selectOptionCategory.Properties.require_minimum_spellworks_on.rating,
                      targets: Case("Spellworks", {
                        property: id,
                      }),
                    }),
                  ),
                }
              : undefined
          return [knowledgePrerequisite, minimumSpellworksPrerequisite].filter(isNotNullish)
        }
        return undefined
      }

      return database.getAllInstanceContainersOfEntity("Property").map(
        ({ id, content }): ResolvedSelectOption => ({
          id: Case("Property", id),
          content: {
            parent: entryId,
            prerequisites: getPrerequisites(id),
            translations: mapObject(content.translations, t10n => ({
              name: t10n.name,
            })),
          },
          newApplications: [],
          uses: [],
        }),
      )
    }

    case "Aspects": {
      const getPrerequisites = (id: string): GeneralPrerequisites | undefined => {
        if (
          selectOptionCategory.Aspects.require_knowledge !== undefined ||
          selectOptionCategory.Aspects.require_minimum_liturgies_on !== undefined
        ) {
          const knowledgePrerequisite: PrerequisiteForLevel<GeneralPrerequisiteGroup> | undefined =
            selectOptionCategory.Aspects.require_knowledge !== undefined
              ? {
                  level: 1,
                  prerequisite: Case(
                    "Single",
                    Case("Activatable", {
                      id: Case("KarmaSpecialAbility", idMap.KarmaSpecialAbility.AspectKnowledge),
                      active: true,
                      options: [Case("Aspect", id)],
                    }),
                  ),
                }
              : undefined

          const minimumSpellworksPrerequisite:
            | PrerequisiteForLevel<GeneralPrerequisiteGroup>
            | undefined =
            selectOptionCategory.Aspects.require_minimum_liturgies_on !== undefined
              ? {
                  level: 1,
                  prerequisite: Case(
                    "Single",
                    Case("RatedMinimumNumber", {
                      number: selectOptionCategory.Aspects.require_minimum_liturgies_on.number,
                      value: selectOptionCategory.Aspects.require_minimum_liturgies_on.rating,
                      targets: Case("Liturgies", {
                        aspect: id,
                      }),
                    }),
                  ),
                }
              : undefined
          return [knowledgePrerequisite, minimumSpellworksPrerequisite].filter(isNotNullish)
        }
        return undefined
      }

      if (selectOptionCategory.Aspects.use_master_of_suffix_as_name === true) {
        return database
          .getAllInstanceContainersOfEntity("Aspect")
          .map(
            ({ id, content }): ResolvedSelectOption => ({
              id: Case("Aspect", id),
              content: {
                parent: entryId,
                prerequisites: getPrerequisites(id),
                translations: mapObject(content.translations, t10n =>
                  t10n.master_of_aspect_suffix === undefined
                    ? undefined
                    : {
                        name: t10n.master_of_aspect_suffix,
                      },
                ),
              },
              newApplications: [],
              uses: [],
            }),
          )
          .filter(value => Object.keys(value.content.translations).length > 0)
      }

      return database.getAllInstanceContainersOfEntity("Aspect").map(
        ({ id, content }): ResolvedSelectOption => ({
          id: Case("Aspect", id),
          content: {
            parent: entryId,
            prerequisites: getPrerequisites(id),
            translations: mapObject(content.translations, t10n => ({
              name: t10n.name,
            })),
          },
          newApplications: [],
          uses: [],
        }),
      )
    }

    case "Diseases":
      return database.getAllInstanceContainersOfEntity("Disease").map(
        ({ id, content }): ResolvedSelectOption => ({
          id: Case("Disease", id),
          content: {
            parent: entryId,
            ap_value: wrapPlainApValue(
              selectOptionCategory.Diseases.use_half_level_as_ap_value === true
                ? Math.round(content.level / 3)
                : content.level,
            ),
            src: content.src,
            translations: mapObject(content.translations, t10n => ({
              name: t10n.name,
            })),
          },
          newApplications: [],
          uses: [],
        }),
      )

    case "Poisons": {
      const getLevel = (poison: Poison): number => {
        switch (poison.source_type.kind) {
          case "AnimalVenom":
            switch (poison.source_type.AnimalVenom.level.kind) {
              case "Constant":
                return poison.source_type.AnimalVenom.level.Constant
              case "QualityLevel":
                return 6
              case "BySubtype":
                return Math.min(
                  6,
                  Math.max(
                    ...poison.source_type.AnimalVenom.level.BySubtype.map(subtype => subtype.value),
                  ),
                )
              default:
                return assertExhaustive(poison.source_type.AnimalVenom.level)
            }
          case "AlchemicalPoison":
          case "AlchemicalPactGiftPoison":
            return 6
          case "MineralPoison":
            return poison.source_type.MineralPoison.level
          case "PlantPoison":
            return poison.source_type.PlantPoison.level
          case "DemonicPoison":
            switch (poison.source_type.DemonicPoison.level.kind) {
              case "Constant":
                return poison.source_type.DemonicPoison.level.Constant.value
              case "QualityLevel":
                return 6
              default:
                return assertExhaustive(poison.source_type.DemonicPoison.level)
            }
          default:
            return assertExhaustive(poison.source_type)
        }
      }

      return database.getAllInstanceContainersOfEntity("Poison").map(
        ({ id, content }): ResolvedSelectOption => ({
          id: Case("Poison", id),
          content: {
            parent: entryId,
            ap_value: wrapPlainApValue(
              selectOptionCategory.Poisons.use_half_level_as_ap_value === true
                ? Math.round(getLevel(content) / 3)
                : getLevel(content),
            ),
            src: content.src,
            translations: mapObject(content.translations, t10n => ({
              name: t10n.name,
            })),
          },
          newApplications: [],
          uses: [],
        }),
      )
    }

    case "Languages": {
      const getPrerequisites = (id: string): GeneralPrerequisites | undefined => {
        if (selectOptionCategory.Languages.prerequisites !== undefined) {
          return selectOptionCategory.Languages.prerequisites.map(config => ({
            level: 1,
            prerequisite: Case(
              "Single",
              Case("Activatable", {
                id: config.SelectOption.id,
                active: config.SelectOption.active,
                level: config.SelectOption.level,
                options: [Case("Language", id)],
              }),
            ),
          }))
        }
        return undefined
      }

      return database.getAllInstanceContainersOfEntity("Language").map(
        ({ id, content }): ResolvedSelectOption => ({
          id: Case("Language", id),
          content: {
            parent: entryId,
            prerequisites: getPrerequisites(id),
            src: content.src,
            translations: mapObject(content.translations, t10n => ({
              name: t10n.name,
            })),
          },
          newApplications: [],
          uses: [],
        }),
      )
    }

    case "Skills":
      return selectOptionCategory.Skills.categories.flatMap(category => {
        switch (category.kind) {
          case "Skills":
            return getDerivedSkillishSelectOptions(
              database,
              entryId,
              "Skill",
              category.Skills,
              selectOptionCategory.Skills,
              ({ id, content }) => {
                const matchesGroupRequirement =
                  category.Skills.groups === undefined ||
                  category.Skills.groups.some(ref => ref === content.group)

                const matchesIdRequirement =
                  category.Skills.specific === undefined ||
                  matchesSpecificSkillishIdList(id, category.Skills.specific)

                return matchesGroupRequirement && matchesIdRequirement
              },
            )
          case "Spells":
            return getDerivedSkillishSelectOptions(
              database,
              entryId,
              "Spell",
              category.Spells,
              selectOptionCategory.Skills,
            )
          case "Rituals":
            return getDerivedSkillishSelectOptions(
              database,
              entryId,
              "Ritual",
              category.Rituals,
              selectOptionCategory.Skills,
            )
          case "LiturgicalChants":
            return getDerivedSkillishSelectOptions(
              database,
              entryId,
              "LiturgicalChant",
              category.LiturgicalChants,
              selectOptionCategory.Skills,
            )
          case "Ceremonies":
            return getDerivedSkillishSelectOptions(
              database,
              entryId,
              "Ceremony",
              category.Ceremonies,
              selectOptionCategory.Skills,
            )
          default:
            return assertExhaustive(category)
        }
      })

    case "CombatTechniques":
      return selectOptionCategory.CombatTechniques.categories.flatMap(category => {
        switch (category.kind) {
          case "CloseCombatTechniques":
            return getDerivedSkillishSelectOptions(
              database,
              entryId,
              "CloseCombatTechnique",
              category.CloseCombatTechniques,
              selectOptionCategory.CombatTechniques,
            )
          case "RangedCombatTechniques":
            return getDerivedSkillishSelectOptions(
              database,
              entryId,
              "RangedCombatTechnique",
              category.RangedCombatTechniques,
              selectOptionCategory.CombatTechniques,
            )
          default:
            return assertExhaustive(category)
        }
      })

    case "TargetCategories": {
      const mapToResolvedSelectOption = (
        { id, content }: { id: string; content: TargetCategory },
        specificTargetCategory?: SpecificTargetCategory,
      ): ResolvedSelectOption => ({
        id: Case("TargetCategory", id),
        content: {
          parent: entryId,
          volume: specificTargetCategory?.volume,
          translations: mapObject(content.translations, t10n => ({
            name: t10n.name,
          })),
        },
        newApplications: [],
        uses: [],
      })

      const list = selectOptionCategory.TargetCategories.list

      if (list) {
        return database
          .getAllInstanceContainersOfEntity("TargetCategory")
          .filter(({ id }) => list.some(ref => ref.id === id))
          .map(({ id, content }) =>
            mapToResolvedSelectOption(
              { id, content },
              list.find(ref => ref.id === id),
            ),
          )
      }

      return database
        .getAllInstanceContainersOfEntity("TargetCategory")
        .map(tc => mapToResolvedSelectOption(tc))
    }

    default:
      return assertExhaustive(selectOptionCategory)
  }
}

const getExplicitSelectOptions = (
  id: ActivatableIdentifier,
  database: TSONDB<TSONDBTypes>,
): ResolvedSelectOption[] =>
  database.getAllChildInstanceContainersForParent("GeneralSelectOption", id).map(
    ({ id, content }): ResolvedSelectOption => ({
      id: Case("General", id),
      content: {
        ...content,
        ap_value: wrapPlainApValue(content.ap_value),
      },
      newApplications: [], // database.getAllChildInstanceContainersForParent("NewSkillApplication", Case("GeneralSelectOption", id)), // prevent duplicates as these can already be queried from the database
      uses: [], // database.getAllChildInstanceContainersForParent("SkillUse", Case("GeneralSelectOption", id)), // prevent duplicates as these can already be queried from the database
    }),
  )

const getSelectOptions = (
  selectOptions: SelectOptions,
  id: ActivatableIdentifier,
  database: TSONDB<TSONDBTypes>,
  idMap: IdMap,
): ResolvedSelectOption[] => [
  ...(selectOptions.derived === undefined
    ? []
    : getDerivedSelectOptions(selectOptions.derived, id, database, idMap)),
  ...getExplicitSelectOptions(id, database),
]

const getSelectOptionsForResults = (
  database: TSONDB<TSONDBTypes>,
  idMap: IdMap,
  entity: ActivatableIdentifier["kind"],
  results: { id: string; content: { select_options?: SelectOptions; translations?: object } }[],
) =>
  results.reduce<{
    [id: string]: ResolvedSelectOption[]
  }>((acc, { id, content }) => {
    const options = getSelectOptions(
      content.select_options ?? {},
      Case(entity, id),
      database,
      idMap,
    )
    if (options.length > 0) {
      acc[id] = options
    }
    return acc
  }, {})

export type ActivatableSelectOptionsCache = Record<
  ActivatableIdentifier["kind"],
  {
    [id: string]: ResolvedSelectOption[]
  }
>

const cacheKeyBase: Record<ActivatableIdentifier["kind"], null> = {
  Advantage: null,
  Disadvantage: null,
  AdvancedCombatSpecialAbility: null,
  AdvancedKarmaSpecialAbility: null,
  AdvancedMagicalSpecialAbility: null,
  AdvancedSkillSpecialAbility: null,
  AncestorGlyph: null,
  ArcaneOrbEnchantment: null,
  AttireEnchantment: null,
  Beutelzauber: null,
  BlessedTradition: null,
  BowlEnchantment: null,
  BrawlingSpecialAbility: null,
  CauldronEnchantment: null,
  CeremonialItemSpecialAbility: null,
  ChronicleEnchantment: null,
  CombatSpecialAbility: null,
  CombatStyleSpecialAbility: null,
  CommandSpecialAbility: null,
  DaggerRitual: null,
  FamiliarSpecialAbility: null,
  FatePointSexSpecialAbility: null,
  FatePointSpecialAbility: null,
  FoolsHatEnchantment: null,
  GeneralSpecialAbility: null,
  Haubenzauber: null,
  Hauerkettenzauber: null,
  InstrumentEnchantment: null,
  KarmaSpecialAbility: null,
  Keulenzauber: null,
  Krallenkettenzauber: null,
  Kristallkugelzauber: null,
  LiturgicalStyleSpecialAbility: null,
  LycantropicGift: null,
  MagicalSign: null,
  MagicalSpecialAbility: null,
  MagicalTradition: null,
  MagicStyleSpecialAbility: null,
  OrbEnchantment: null,
  PactGift: null,
  ProtectiveWardingCircleSpecialAbility: null,
  RingEnchantment: null,
  Schweinetrommelzauber: null,
  Sermon: null,
  SexSpecialAbility: null,
  SickleRitual: null,
  SikaryanDrainSpecialAbility: null,
  SkillStyleSpecialAbility: null,
  SpellSwordEnchantment: null,
  StaffEnchantment: null,
  ToyEnchantment: null,
  Trinkhornzauber: null,
  VampiricGift: null,
  Vision: null,
  WandEnchantment: null,
  WeaponEnchantment: null,
}

export const activatableSelectOptionsCacheBuilder: CacheBuilder<ActivatableSelectOptionsCache> = (
  database,
  idMap,
) =>
  Object.fromEntries(
    (Object.keys(cacheKeyBase) as (keyof typeof cacheKeyBase)[]).map(
      (
        entity,
      ): [
        ActivatableIdentifier["kind"],
        {
          [id: string]: ResolvedSelectOption[]
        },
      ] => [
        entity,
        getSelectOptionsForResults(
          database,
          idMap,
          entity,
          database.getAllInstanceContainersOfEntity(entity),
        ),
      ],
    ),
  ) as ActivatableSelectOptionsCache
