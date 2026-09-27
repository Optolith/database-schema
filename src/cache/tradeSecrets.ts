import { assertExhaustive } from "@elyukai/utils/typeSafety"
import { Case } from "tsondb/schema/gen"
import type {
  ArmorComplexity,
  Complexity,
  EntityMap,
  EquipmentIdentifier,
  PublicationRefs,
  RecipeTradeSecret,
  TradeSecret,
} from "../../gen/types.js"
import type { CacheBuilder } from "./internal.ts"

type EquipmentEntitiesWithComplexities = {
  [K in EquipmentIdentifier["kind"]]: EntityMap[K] extends {
    complexity?: Complexity | ArmorComplexity
  }
    ? K
    : never
}[EquipmentIdentifier["kind"]]

type HerbaryEntitiesWithTradeSecrets = "Disease" | "Elixir" | "HerbalAid" | "Poison"

export type DerivedTradeSecretsCache = {
  equipment: { [K in EquipmentEntitiesWithComplexities]: Record<string, TradeSecret> }
  herbary: { [K in HerbaryEntitiesWithTradeSecrets]: Record<string, TradeSecret> }
  all: {
    id: Case<
      "TradeSecret" | EquipmentEntitiesWithComplexities | HerbaryEntitiesWithTradeSecrets,
      string
    >
    content: TradeSecret
  }[]
}

const emptyDerivedEquipmentTradeSecretsCache: DerivedTradeSecretsCache["equipment"] = {
  Armor: {},
  BandageOrRemedy: {},
  Book: {},
  CeremonialItem: {},
  Clothes: {},
  Container: {},
  IlluminationLightSource: {},
  IlluminationRefillOrSupply: {},
  Jewelry: {},
  Laboratory: {},
  Liebesspielzeug: {},
  LuxuryGood: {},
  MagicalArtifact: {},
  MusicalInstrument: {},
  OrienteeringAid: {},
  RopeOrChain: {},
  Stationery: {},
  ThievesTool: {},
  ToolOfTheTrade: {},
  TravelGearOrTool: {},
  Vehicle: {},
  Weapon: {},
  WeaponAccessory: {},
}

const emptyDerivedHerbaryTradeSecretsCache: DerivedTradeSecretsCache["herbary"] = {
  Disease: {},
  Elixir: {},
  HerbalAid: {},
  Poison: {},
}

export const buildDerivedTradeSecretsCache: CacheBuilder<DerivedTradeSecretsCache> = (
  database,
  idMap,
) => {
  const cache: DerivedTradeSecretsCache = {
    equipment: emptyDerivedEquipmentTradeSecretsCache,
    herbary: emptyDerivedHerbaryTradeSecretsCache,
    all: database.getAllInstanceContainersOfEntity("TradeSecret").map(container => ({
      id: Case("TradeSecret", container.id),
      content: container.content,
    })),
  }

  for (const entity of Object.keys(cache.equipment) as EquipmentEntitiesWithComplexities[]) {
    for (const container of database.getAllInstanceContainersOfEntity(entity)) {
      if (container.content.complexity && container.content.complexity.kind === "Complex") {
        const derivedTradeSecret: TradeSecret = {
          ap_value: Case("Fixed", container.content.complexity.Complex.ap_value),
          is_secret_knowledge: false,
          prerequisites:
            entity === "Weapon"
              ? [
                  Case(
                    "Single",
                    Case("Activatable", {
                      id: Case("GeneralSpecialAbility", idMap.GeneralSpecialAbility.Weaponsmith),
                      active: true,
                    }),
                  ),
                ]
              : entity === "Armor"
                ? [
                    Case(
                      "Single",
                      Case("Activatable", {
                        id: Case("GeneralSpecialAbility", idMap.GeneralSpecialAbility.Armorer),
                        active: true,
                      }),
                    ),
                  ]
                : undefined,
          src: container.content.complexity.Complex.src ?? container.content.src,
          translations: Object.fromEntries(
            Object.entries(container.content.translations).map(([lang, translation]) => [
              lang,
              {
                name: translation.name,
              },
            ]),
          ),
        }

        cache.equipment[entity][container.id] = derivedTradeSecret
        cache.all.push({
          id: Case(entity, container.id),
          content: derivedTradeSecret,
        })
      }
    }
  }

  const addTradeSecretToHerbaryCache = (
    entity: HerbaryEntitiesWithTradeSecrets,
    container: {
      id: string
      content: { src: PublicationRefs; translations: Record<string, { name: string }> }
    },
    tradeSecret: RecipeTradeSecret,
  ) => {
    const derivedTradeSecret: TradeSecret = {
      ap_value: Case("Fixed", tradeSecret.ap_value),
      is_secret_knowledge: false,
      prerequisites: tradeSecret.prerequisites,
      src: tradeSecret.src ?? container.content.src,
      translations: Object.fromEntries(
        Object.entries(container.content.translations).map(([lang, translation]) => [
          lang,
          {
            name: translation.name,
          },
        ]),
      ),
    }

    cache.herbary[entity][container.id] = derivedTradeSecret
    cache.all.push({
      id: Case(entity, container.id),
      content: derivedTradeSecret,
    })
  }

  for (const entity of Object.keys(
    emptyDerivedHerbaryTradeSecretsCache,
  ) as HerbaryEntitiesWithTradeSecrets[]) {
    switch (entity) {
      case "Disease":
      case "Elixir":
      case "HerbalAid":
        for (const container of database.getAllInstanceContainersOfEntity(entity)) {
          if (container.content.trade_secret) {
            addTradeSecretToHerbaryCache(entity, container, container.content.trade_secret)
          }
        }
        break
      case "Poison":
        for (const container of database.getAllInstanceContainersOfEntity(entity)) {
          if (container.content.source_type.kind === "AlchemicalPoison") {
            addTradeSecretToHerbaryCache(
              entity,
              container,
              container.content.source_type.AlchemicalPoison.trade_secret,
            )
          } else if (
            container.content.source_type.kind == "AnimalVenom" &&
            container.content.source_type.AnimalVenom.complexity?.kind === "Complex"
          ) {
            addTradeSecretToHerbaryCache(
              entity,
              container,
              container.content.source_type.AnimalVenom.complexity.Complex,
            )
          }
        }
        break
      default:
        return assertExhaustive(entity)
    }
  }

  return cache
}
