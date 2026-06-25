import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { TSONDB } from "tsondb"
import type {
  ActivatableIdentifier,
  Advantage_ID,
  AdvantageDisadvantagePrerequisiteGroup,
  AdvantageDisadvantagePrerequisites,
  Disadvantage_ID,
  RatedIdentifier,
} from "../../gen/types.js"
import type { TSONDBTypes } from "../main.js"
import type { IdMap } from "./index.js"
import type { CacheBuilder } from "./internal.ts"

export type MagicalAndBlessedAdvantagesAndDisadvantagesCache = Record<
  "Advantage" | "Disadvantage",
  Record<"Magical" | "Blessed", string[]>
>

const getAdvantageId = (idMap: IdMap, type: "Magical" | "Blessed") => {
  switch (type) {
    case "Magical":
      return idMap.Advantage.Spellcaster
    case "Blessed":
      return idMap.Advantage.Blessed
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
  idMap: IdMap,
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
        prerequisite.Activatable.id.Advantage === getAdvantageId(idMap, type) &&
        prerequisite.Activatable.active
      ) {
        return true
      }

      const entry = getById(prerequisite.Activatable.id)
      return entry !== undefined && is(idMap, type, entry, getById, traversedIds)
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
    case "SkillStyle":
    case "CombatStyle":
    case "MagicalStyle":
    case "LiturgicalStyle":
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
  idMap: IdMap,
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
            idMap,
            type,
            prerequisite.prerequisite.Single,
            getById,
            newTraversedIds,
          )
        case "Disjunction":
          return prerequisite.prerequisite.Disjunction.list.some(p =>
            isPrerequisiteFor(idMap, type, p, getById, newTraversedIds),
          )
        case "Group":
          return prerequisite.prerequisite.Group.list.some(p =>
            isPrerequisiteFor(idMap, type, p, getById, newTraversedIds),
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
  idMap: IdMap,
) =>
  database
    .getAllInstanceContainersOfEntity(entity)
    .filter(entry =>
      is(idMap, type, entry, database.getInstanceContainerOfEntityById.bind(database), []),
    )
    .map(({ id }) => id)

export const buildMagicalAndBlessedAdvantagesAndDisadvantagesCache: CacheBuilder<
  MagicalAndBlessedAdvantagesAndDisadvantagesCache
> = (database, idMap) => {
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
              collectIds(entity, type, database, idMap),
            ],
          ),
        ) as Record<keyof TypeKeyMap, (Advantage_ID | Disadvantage_ID)[]>,
      ],
    ),
  ) as Record<keyof EntityKeyMap, Record<keyof TypeKeyMap, (Advantage_ID | Disadvantage_ID)[]>>
}
