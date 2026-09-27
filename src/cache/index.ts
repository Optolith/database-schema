import type { TSONDB } from "tsondb"
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
import { buildDerivedTradeSecretsCache, type DerivedTradeSecretsCache } from "./tradeSecrets.ts"

/**
 * Identifiers of specific entries in the database that are used for creating the cache.
 */
export type IdMap = {
  Advantage: Record<"Blessed" | "Spellcaster", string>
  GeneralSpecialAbility: Record<"Weaponsmith" | "Armorer", string>
  MagicalSpecialAbility: Record<"PropertyKnowledge", string>
  KarmaSpecialAbility: Record<"AspectKnowledge", string>
}

/**
 * The cache object containing all precomputed data.
 */
export type Cache = {
  activatableSelectOptions: ActivatableSelectOptionsCache
  ancestorBloodAdvantages: AncestorBloodAdvantagesCache
  derivedTradeSecrets: DerivedTradeSecretsCache
  magicalAndBlessedAdvantagesAndDisadvantages: MagicalAndBlessedAdvantagesAndDisadvantagesCache
  newApplicationsAndUses: NewApplicationsAndUsesCache
}

export type {
  ActivatableSelectOptionsCache,
  AncestorBloodAdvantagesCache,
  MagicalAndBlessedAdvantagesAndDisadvantagesCache,
  NewApplicationsAndUsesCache,
  ResolvedNewSkillApplication,
  ResolvedSelectOption,
  ResolvedSelectOptionIdentifier,
  ResolvedSkillUse,
}

/**
 * Creates the cache by precomputing all necessary data from the database.
 * @param db The TSONDB instance containing the database.
 * @param idMap An object containing identifiers of specific entries in the database that are used for creating the cache.
 * @returns The created cache object.
 */
export const createCache = (db: TSONDB<TSONDBTypes>, idMap: IdMap): Cache => {
  const activatableSelectOptions = activatableSelectOptionsCacheBuilder(db, idMap)
  const ancestorBloodAdvantages = buildAncestorBloodAdvantagesCache(db, idMap)
  const derivedTradeSecrets = buildDerivedTradeSecretsCache(db, idMap)
  const magicalAndBlessedAdvantagesAndDisadvantages =
    buildMagicalAndBlessedAdvantagesAndDisadvantagesCache(db, idMap)
  const newApplicationsAndUses = buildNewApplicationsAndUsesCache(
    db,
    idMap,
    activatableSelectOptions,
  )

  return {
    activatableSelectOptions,
    ancestorBloodAdvantages,
    derivedTradeSecrets,
    magicalAndBlessedAdvantagesAndDisadvantages,
    newApplicationsAndUses,
  }
}
