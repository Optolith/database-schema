import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { Advantage_ID } from "../../gen/types.js"
import type { CacheBuilder } from "./internal.ts"

export type AncestorBloodAdvantagesCache = Advantage_ID[]

export const buildAncestorBloodAdvantagesCache: CacheBuilder<
  AncestorBloodAdvantagesCache
> = database =>
  database
    .getAllInstanceContainersOfEntity("Advantage")
    .filter(
      ({ content }) =>
        content.prerequisites?.some(p => {
          switch (p.prerequisite.kind) {
            case "Single":
              return p.prerequisite.Single.kind === "NoOtherAncestorBloodAdvantage"
            case "Disjunction":
              return p.prerequisite.Disjunction.list.some(
                d => d.kind === "NoOtherAncestorBloodAdvantage",
              )
            case "Group":
              return p.prerequisite.Group.list.some(g => g.kind === "NoOtherAncestorBloodAdvantage")
            default:
              return assertExhaustive(p.prerequisite)
          }
        }) ?? false,
    )
    .map(({ id }) => id)
