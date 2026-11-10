import type { Skill, Skill_ID, SkillGroup_ID } from "../../gen/types.js"
import type { CacheBuilder } from "./internal.ts"

export type SkillsBySkillGroupCache = Partial<
  Record<SkillGroup_ID, { id: Skill_ID; content: Skill }[]>
>

export const buildSkillsBySkillGroupCache: CacheBuilder<SkillsBySkillGroupCache> = database =>
  Object.groupBy(database.getAllInstanceContainersOfEntity("Skill"), ({ content }) => content.group)
