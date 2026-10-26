import type { ReadonlyTSONDB } from "tsondb/readonly"
import type {
  ActivatableIdentifier,
  NewSkillApplication,
  NewSkillApplicationOrUseParentIdentifier,
  PublicationRefs,
  Skill_ID,
  SkillUse,
} from "../../gen/types.js"
import type { TSONDBTypes } from "../main.ts"
import type { ActivatableSelectOptionsCache } from "./activatableSelectOptions.ts"
import type { CacheBuilder } from "./internal.ts"

export type ResolvedNewSkillApplication = {
  id: string
  content: Omit<NewSkillApplication, "parent"> & {
    parent: NewSkillApplicationOrUseParentIdentifier | ActivatableIdentifier
    src: PublicationRefs | undefined
  }
}

export type ResolvedSkillUse = {
  id: string
  content: Omit<SkillUse, "parent"> & {
    parent: NewSkillApplicationOrUseParentIdentifier | ActivatableIdentifier
    src: PublicationRefs | undefined
  }
}

const groupByAffectedSkill = <
  T extends {
    content: {
      parent: NewSkillApplicationOrUseParentIdentifier | ActivatableIdentifier
      skills: Skill_ID[]
    }
  },
>(
  database: ReadonlyTSONDB<TSONDBTypes>,
  entries: T[],
  prev: Record<
    Skill_ID,
    (T & {
      content: {
        src: PublicationRefs | undefined
      }
    })[]
  > = {},
): Record<
  Skill_ID,
  (T & {
    content: {
      src: PublicationRefs | undefined
    }
  })[]
> =>
  entries
    .map(entry => ({
      ...entry,
      content: {
        ...entry.content,
        src: database.getInstanceOfEntityById(entry.content.parent)?.src,
      },
    }))
    .reduce<
      Record<
        Skill_ID,
        (T & {
          content: {
            src: PublicationRefs | undefined
          }
        })[]
      >
    >(
      (acc, entry) =>
        entry.content.skills.reduce((acc1, skillId) => {
          acc1[skillId] = [...(acc1[skillId] ?? []), entry]
          return acc1
        }, acc),
      prev,
    )

const addGeneratedEntries = (
  database: ReadonlyTSONDB<TSONDBTypes>,
  generatedSelectOptions: ActivatableSelectOptionsCache,
  prev: NewApplicationsAndUsesCache,
): NewApplicationsAndUsesCache =>
  Object.values(generatedSelectOptions).reduce(
    (acc, byInstance) =>
      Object.values(byInstance).reduce(
        (acc1, resolvedSelectOptions) =>
          resolvedSelectOptions.reduce(
            (acc2, selectOption) => ({
              newApplications: groupByAffectedSkill(
                database,
                selectOption.newApplications,
                acc2.newApplications,
              ),
              uses: groupByAffectedSkill(database, selectOption.uses, acc2.uses),
            }),
            acc1,
          ),
        acc,
      ),
    prev,
  )

export type NewApplicationsAndUsesCache = {
  newApplications: Record<Skill_ID, ResolvedNewSkillApplication[]>
  uses: Record<Skill_ID, ResolvedSkillUse[]>
}

export const buildNewApplicationsAndUsesCache: CacheBuilder<
  NewApplicationsAndUsesCache,
  [generatedSelectOptions: ActivatableSelectOptionsCache]
> = (database, _idMap, generatedSelectOptions) => {
  const cache: NewApplicationsAndUsesCache = {
    newApplications: groupByAffectedSkill(
      database,
      database.getAllInstanceContainersOfEntity("NewSkillApplication"),
    ),
    uses: groupByAffectedSkill(database, database.getAllInstanceContainersOfEntity("SkillUse")),
  }

  return addGeneratedEntries(database, generatedSelectOptions, cache)
}
