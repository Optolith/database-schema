import type { ReadonlyTSONDB } from "tsondb/readonly"
import type { TSONDBTypes } from "../main.ts"
import {
  activatableSelectOptionsCacheBuilder,
  type ActivatableSelectOptionsCache,
  type ResolvedSelectOption,
  type ResolvedSelectOptionIdentifier,
} from "./activatableSelectOptions.ts"
import {
  buildAncestorBloodAdvantagesCache,
  type AncestorBloodAdvantagesCache,
} from "./ancestorBloodAdvantages.ts"
import {
  buildMagicalAndBlessedAdvantagesAndDisadvantagesCache,
  type MagicalAndBlessedAdvantagesAndDisadvantagesCache,
} from "./magicalAndBlessedAdvantagesAndDisadvantages.ts"
import {
  buildNewApplicationsAndUsesCache,
  type NewApplicationsAndUsesCache,
  type ResolvedNewSkillApplication,
  type ResolvedSkillUse,
} from "./newApplicationsAndUses.ts"
import {
  skillApplicationsCacheBuilder,
  type ResolvedSkillApplication,
  type ResolvedSkillApplicationIdentifier,
  type SkillApplicationsCache,
} from "./skillApplications.ts"
import { buildSkillsBySkillGroupCache, type SkillsBySkillGroupCache } from "./skillsBySkillGroup.ts"
import { buildDerivedTradeSecretsCache, type DerivedTradeSecretsCache } from "./tradeSecrets.ts"

/**
 * The cache object containing all precomputed data.
 */
export type Cache = {
  activatableSelectOptions: ActivatableSelectOptionsCache
  ancestorBloodAdvantages: AncestorBloodAdvantagesCache
  derivedTradeSecrets: DerivedTradeSecretsCache
  magicalAndBlessedAdvantagesAndDisadvantages: MagicalAndBlessedAdvantagesAndDisadvantagesCache
  newApplicationsAndUses: NewApplicationsAndUsesCache
  skillApplications: SkillApplicationsCache
  skillsBySkillGroup: SkillsBySkillGroupCache
}

export type {
  ActivatableSelectOptionsCache,
  AncestorBloodAdvantagesCache,
  DerivedTradeSecretsCache,
  MagicalAndBlessedAdvantagesAndDisadvantagesCache,
  NewApplicationsAndUsesCache,
  ResolvedNewSkillApplication,
  ResolvedSelectOption,
  ResolvedSelectOptionIdentifier,
  ResolvedSkillApplication,
  ResolvedSkillApplicationIdentifier,
  ResolvedSkillUse,
  SkillApplicationsCache,
  SkillsBySkillGroupCache,
}

/**
 * Creates the cache by precomputing all necessary data from the database.
 * @param db The TSONDB instance containing the database.
 * @param idMap An object containing identifiers of specific entries in the database that are used for creating the cache.
 * @returns The created cache object.
 */
export const createCache = (db: ReadonlyTSONDB<TSONDBTypes>): Cache => {
  const settings = db.getSingletonInstanceOfEntity("Settings")

  if (!settings) {
    throw new Error("Settings not found in the database.")
  }

  const activatableSelectOptions = activatableSelectOptionsCacheBuilder(db, settings)
  const ancestorBloodAdvantages = buildAncestorBloodAdvantagesCache(db, settings)
  const derivedTradeSecrets = buildDerivedTradeSecretsCache(db, settings)
  const magicalAndBlessedAdvantagesAndDisadvantages =
    buildMagicalAndBlessedAdvantagesAndDisadvantagesCache(db, settings)
  const newApplicationsAndUses = buildNewApplicationsAndUsesCache(
    db,
    settings,
    activatableSelectOptions,
  )
  const skillApplications = skillApplicationsCacheBuilder(db, settings, newApplicationsAndUses)
  const skillsBySkillGroup = buildSkillsBySkillGroupCache(db, settings)

  return {
    activatableSelectOptions,
    ancestorBloodAdvantages,
    derivedTradeSecrets,
    magicalAndBlessedAdvantagesAndDisadvantages,
    newApplicationsAndUses,
    skillApplications,
    skillsBySkillGroup,
  }
}
