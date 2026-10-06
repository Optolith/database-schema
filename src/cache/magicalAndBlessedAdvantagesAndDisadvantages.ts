import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { TSONDB } from "tsondb"
import type {
  ActivatableIdentifier,
  Advantage_ID,
  AdvantageDisadvantagePrerequisiteGroup,
  AdvantageDisadvantagePrerequisites,
  Disadvantage_ID,
  RatedIdentifier,
  Settings,
} from "../../gen/types.js"
import type { TSONDBTypes } from "../main.js"
import type { CacheBuilder } from "./internal.ts"

export type MagicalAndBlessedAdvantagesAndDisadvantagesCache = Record<
  "Advantage" | "Disadvantage",
  Record<"Magical" | "Blessed", string[]>
>

const getAdvantageId = (settings: Settings, type: "Magical" | "Blessed") => {
  switch (type) {
    case "Magical":
      return settings.supernaturalBaseAdvantages.spellcasters
    case "Blessed":
      return settings.supernaturalBaseAdvantages.blessed
    default:
      return assertExhaustive(type)
  }
}

const isRatedFor = (type: "Magical" | "Blessed", ratedId: RatedIdentifier) => {
  switch (ratedId.kind) {
    case "Spell":
    case "Ritual":
      return type === "Magical"
    case "LiturgicalChant":
    case "Ceremony":
      return type === "Blessed"
    case "Attribute":
    case "Skill":
    case "CloseCombatTechnique":
    case "RangedCombatTechnique":
      return false
    default:
      return assertExhaustive(ratedId)
  }
}

const isPrerequisiteFor = (
  settings: Settings,
  type: "Magical" | "Blessed",
  prerequisite: AdvantageDisadvantagePrerequisiteGroup,
  getById: (
    id: ActivatableIdentifier,
  ) => { id: string; content: { prerequisites?: AdvantageDisadvantagePrerequisites } } | undefined,
  traversedIds: string[],
): boolean => {
  switch (prerequisite.kind) {
    case "Activatable": {
      if (
        prerequisite.Activatable.id.kind === "Advantage" &&
        prerequisite.Activatable.id.Advantage === getAdvantageId(settings, type) &&
        prerequisite.Activatable.active
      ) {
        return true
      }

      const entry = getById(prerequisite.Activatable.id)
      return entry !== undefined && is(settings, type, entry, getById, traversedIds)
    }
    case "Rated":
      return isRatedFor(type, prerequisite.Rated.id)
    case "CommonSuggestedByRCP":
    case "Sex":
    case "Race":
    case "Culture":
    case "Pact":
    case "SocialStatus":
    case "State":
    case "Rule":
    case "PrimaryAttribute":
    case "BlessedTradition":
    case "MagicalTradition":
    case "TinyActivatable":
    case "AnySpecialAbilityOfGroup":
    case "RatedMinimumNumber":
    case "RatedSum":
    case "Enhancement":
    case "Text":
    case "NoOtherAncestorBloodAdvantage":
    case "SexualCharacteristic":
    case "PersonalityTrait":
      return false
    default:
      return assertExhaustive(prerequisite)
  }
}

const is = (
  settings: Settings,
  type: "Magical" | "Blessed",
  entry: { id: string; content: { prerequisites?: AdvantageDisadvantagePrerequisites } },
  getById: (
    id: ActivatableIdentifier,
  ) => { id: string; content: { prerequisites?: AdvantageDisadvantagePrerequisites } } | undefined,
  traversedIds: string[],
): boolean => {
  if (!entry.content.prerequisites || traversedIds.includes(entry.id)) {
    return false
  }

  const newTraversedIds = [...traversedIds, entry.id]

  return (
    entry.content.prerequisites !== undefined &&
    entry.content.prerequisites.some(prerequisite => {
      switch (prerequisite.prerequisite.kind) {
        case "Single":
          return isPrerequisiteFor(
            settings,
            type,
            prerequisite.prerequisite.Single,
            getById,
            newTraversedIds,
          )
        case "Disjunction":
          return prerequisite.prerequisite.Disjunction.list.some(p =>
            isPrerequisiteFor(settings, type, p, getById, newTraversedIds),
          )
        case "Group":
          return prerequisite.prerequisite.Group.list.some(p =>
            isPrerequisiteFor(settings, type, p, getById, newTraversedIds),
          )
        default:
          return assertExhaustive(prerequisite.prerequisite)
      }
    })
  )
}

const entityKeyMap = {
  Advantage: null,
  Disadvantage: null,
} as const

type EntityKeyMap = typeof entityKeyMap

const typeKeyMap = {
  Magical: null,
  Blessed: null,
} as const

type TypeKeyMap = typeof typeKeyMap

const collectIds = (
  entity: "Advantage" | "Disadvantage",
  type: "Magical" | "Blessed",
  database: TSONDB<TSONDBTypes>,
  settings: Settings,
) =>
  database
    .getAllInstanceContainersOfEntity(entity)
    .filter(entry =>
      is(settings, type, entry, database.getInstanceContainerOfEntityById.bind(database), []),
    )
    .map(({ id }) => id)

export const buildMagicalAndBlessedAdvantagesAndDisadvantagesCache: CacheBuilder<
  MagicalAndBlessedAdvantagesAndDisadvantagesCache
> = (database, settings) => {
  return Object.fromEntries(
    (Object.keys(entityKeyMap) as (keyof EntityKeyMap)[]).map(
      (
        entity,
      ): [keyof EntityKeyMap, Record<keyof TypeKeyMap, (Advantage_ID | Disadvantage_ID)[]>] => [
        entity,
        Object.fromEntries(
          (Object.keys(typeKeyMap) as (keyof TypeKeyMap)[]).map(
            (type): [keyof TypeKeyMap, (Advantage_ID | Disadvantage_ID)[]] => [
              type,
              collectIds(entity, type, database, settings),
            ],
          ),
        ) as Record<keyof TypeKeyMap, (Advantage_ID | Disadvantage_ID)[]>,
      ],
    ),
  ) as Record<keyof EntityKeyMap, Record<keyof TypeKeyMap, (Advantage_ID | Disadvantage_ID)[]>>
}
