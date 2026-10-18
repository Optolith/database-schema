import type { ReadonlyTSONDB } from "tsondb/readonly"
import type { Settings } from "../../gen/types.js"
import type { TSONDBTypes } from "../main.ts"

export type CacheBuilder<T = unknown, Args extends unknown[] = []> = (
  db: ReadonlyTSONDB<TSONDBTypes>,
  settings: Settings,
  ...args: Args
) => T
