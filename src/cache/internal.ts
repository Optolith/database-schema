import type { TSONDB } from "tsondb"
import type { Settings } from "../../gen/types.js"
import type { TSONDBTypes } from "../main.ts"

export type CacheBuilder<T = unknown, Args extends unknown[] = []> = (
  db: TSONDB<TSONDBTypes>,
  settings: Settings,
  ...args: Args
) => T
