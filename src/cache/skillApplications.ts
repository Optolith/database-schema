import { isNotNullish } from "@elyukai/utils/nullable"
import { mapObject } from "@elyukai/utils/object"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { ReadonlyTSONDB } from "tsondb/readonly"
import { Case } from "tsondb/schema/gen"
import type {
  ApplicationCategory,
  Applications,
  GeneralSelectOption,
  NewSkillApplication,
  NewSkillApplication_ID,
  PlainGeneralPrerequisites,
  Skill,
  Skill_ID,
  SkillApplication,
} from "../../gen/types.js"
import type { TSONDBTypes } from "../main.ts"
import type { CacheBuilder } from "./internal.ts"
import type {
  NewApplicationsAndUsesCache,
  ResolvedNewSkillApplication,
} from "./newApplicationsAndUses.ts"

export type ResolvedSkillApplicationIdentifier = Case<
  "SkillApplication" | "NewSkillApplication" | "BlessedTradition" | "Disease" | "Region",
  string
>

export type ResolvedSkillApplication<
  ID extends ResolvedSkillApplicationIdentifier = ResolvedSkillApplicationIdentifier,
> = {
  id: ID
  content: SkillApplication & {
    prerequisites?: PlainGeneralPrerequisites
  }
}

const getDerivedApplications = (
  applicationCategory: ApplicationCategory,
  entryId: Skill_ID,
  database: ReadonlyTSONDB<TSONDBTypes>,
): ResolvedSkillApplication[] => {
  switch (applicationCategory.kind) {
    case "BlessedTraditions": {
      return database
        .getAllInstanceContainersOfEntity("BlessedTradition")
        .map(({ id, content }): ResolvedSkillApplication => ({
          id: Case("BlessedTradition", id),
          content: {
            parent: entryId,
            src: content.src,
            translations: mapObject(content.translations, t10n => ({
              name: t10n.name,
            })),
          },
        }))
    }

    case "Diseases":
      return database
        .getAllInstanceContainersOfEntity("Disease")
        .map(({ id, content }): ResolvedSkillApplication => ({
          id: Case("Disease", id),
          content: {
            parent: entryId,
            src: content.src,
            translations: mapObject(content.translations, t10n => ({
              name: t10n.name,
            })),
          },
        }))

    case "Regions":
      return database
        .getAllInstanceContainersOfEntity("Region")
        .map(({ id, content }): ResolvedSkillApplication => ({
          id: Case("Region", id),
          content: {
            parent: entryId,
            translations: mapObject(content.translations, t10n => ({
              name: t10n.name,
            })),
          },
        }))

    default:
      return assertExhaustive(applicationCategory)
  }
}

const resolveNewSkillApplication = (
  skillId: Skill_ID,
  optionid: NewSkillApplication_ID,
  content: NewSkillApplication | ResolvedNewSkillApplication["content"],
  database: ReadonlyTSONDB<TSONDBTypes>,
): ResolvedSkillApplication | undefined => {
  const parent = database.getInstanceContainerOfEntityById(content.parent)
  const translations = content.translations ?? parent?.content.translations ?? {}

  const prerequisites: PlainGeneralPrerequisites | undefined =
    content.parent.kind === "GeneralSelectOption"
      ? (() => {
          const grandParentId = (parent as { id: string; content: GeneralSelectOption } | undefined)
            ?.content.parent

          if (grandParentId === undefined || grandParentId.kind === "TradeSecret") {
            return undefined
          }

          const grandParent = database.getInstanceContainerOfEntityById(grandParentId)

          if (grandParent === undefined) {
            return undefined
          }

          return [
            Case(
              "Single",
              Case("Activatable", {
                id: grandParentId,
                active: true,
                options: [Case("General", content.parent.GeneralSelectOption)],
              }),
            ),
          ]
        })()
      : [
          Case(
            "Single",
            Case("Activatable", {
              id: content.parent,
              active: true,
            }),
          ),
        ]

  if (prerequisites === undefined) {
    return undefined
  }

  return {
    id: Case("NewSkillApplication", optionid),
    content: {
      parent: skillId,
      src: parent?.content.src,
      prerequisites,
      translations: mapObject(translations, t10n => ({
        name: t10n.name,
      })),
    },
  }
}

const getExplicitApplications = (
  id: Skill_ID,
  database: ReadonlyTSONDB<TSONDBTypes>,
  newApplicationsAndUses: NewApplicationsAndUsesCache,
): ResolvedSkillApplication[] =>
  database
    .getAllChildInstanceContainersForParent("SkillApplication", id)
    .map(({ id: optionid, content }): ResolvedSkillApplication => ({
      id: Case("SkillApplication", optionid),
      content,
    }))
    .concat(
      database
        .getAllInstanceContainersOfEntity("NewSkillApplication")
        .filter(({ content }) => content.skills.includes(id))
        .map(({ id: optionid, content }): ResolvedSkillApplication | undefined =>
          resolveNewSkillApplication(id, optionid, content, database),
        )
        .filter(isNotNullish),
    )
    .concat(
      Object.values(newApplicationsAndUses.newApplications).flatMap(options =>
        options
          .map((application): ResolvedSkillApplication | undefined =>
            resolveNewSkillApplication(id, application.id, application.content, database),
          )
          .filter(isNotNullish),
      ),
    )

const getApplicationsForSkill = (
  applications: Applications,
  id: Skill_ID,
  database: ReadonlyTSONDB<TSONDBTypes>,
  newApplicationsAndUses: NewApplicationsAndUsesCache,
): ResolvedSkillApplication[] => [
  ...(applications.derived === undefined
    ? []
    : getDerivedApplications(applications.derived, id, database)),
  ...getExplicitApplications(id, database, newApplicationsAndUses),
]

const collectApplications = (
  database: ReadonlyTSONDB<TSONDBTypes>,
  results: {
    id: string
    content: Skill
  }[],
  newApplicationsAndUses: NewApplicationsAndUsesCache,
) =>
  results.reduce<{
    [id: string]: ResolvedSkillApplication[]
  }>((acc, { id, content }) => {
    const options = getApplicationsForSkill(
      content.applications,
      id,
      database,
      newApplicationsAndUses,
    )
    if (options.length > 0) {
      acc[id] = options
    }
    return acc
  }, {})

export type SkillApplicationsCache = Record<Skill_ID, ResolvedSkillApplication[]>

export const skillApplicationsCacheBuilder: CacheBuilder<
  SkillApplicationsCache,
  [newApplicationsAndUses: NewApplicationsAndUsesCache]
> = (database, _, newApplicationsAndUses) =>
  collectApplications(
    database,
    database.getAllInstanceContainersOfEntity("Skill"),
    newApplicationsAndUses,
  )
