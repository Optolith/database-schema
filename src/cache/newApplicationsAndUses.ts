import type {
  ActivatableIdentifier,
  NewSkillApplication,
  NewSkillApplicationOrUseParentIdentifier,
  Skill_ID,
  SkillUse,
} from "../../gen/types.js"
import type { ActivatableSelectOptionsCache } from "./activatableSelectOptions.ts"
import type { CacheBuilder } from "./internal.ts"

export type ResolvedNewSkillApplication = {
  id: string
  content: Omit<NewSkillApplication, "parent"> & {
    parent: NewSkillApplicationOrUseParentIdentifier | ActivatableIdentifier
  }
}

export type ResolvedSkillUse = {
  id: string
  content: Omit<SkillUse, "parent"> & {
    parent: NewSkillApplicationOrUseParentIdentifier | ActivatableIdentifier
  }
}

const groupByAffectedSkill = <
  T extends {
    content: {
      skills: Skill_ID[]
    }
  },
>(
  entries: T[],
  prev: Record<Skill_ID, T[]> = {},
): Record<Skill_ID, T[]> =>
  entries.reduce<Record<Skill_ID, T[]>>(
    (acc, entry) =>
      entry.content.skills.reduce((acc1, skillId) => {
        acc1[skillId] = [...(acc1[skillId] ?? []), entry]
        return acc1
      }, acc),
    prev,
  )

const addGeneratedEntries = (
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
                selectOption.newApplications,
                acc2.newApplications,
              ),
              uses: groupByAffectedSkill(selectOption.uses, acc2.uses),
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
      database.getAllInstanceContainersOfEntity("NewSkillApplication"),
    ),
    uses: groupByAffectedSkill(database.getAllInstanceContainersOfEntity("SkillUse")),
  }

  return addGeneratedEntries(generatedSelectOptions, cache)
}
