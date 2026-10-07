import * as DB from "tsondb/schema/dsl"
import { DerivedCharacteristicIdentifier } from "../../_Identifier.ts"
import { DisplayOption } from "../DisplayOption.ts"

export const EnergyPrerequisite = DB.TypeAlias(import.meta.url, {
  name: "EnergyPrerequisite",
  type: () =>
    DB.Object({
      id: DB.Required({
        comment: "The energy’s identifier.",
        type: DerivedCharacteristicIdentifier(),
      }),
      value: DB.Required({
        comment: "The required value of additionally bought points.",
        type: DB.Integer({ minimum: 0 }),
      }),
      display_option: DB.Optional({
        type: DB.IncludeIdentifier(DisplayOption),
      }),
    }),
  customConstraints: ({ instanceContent, getInstanceById }) =>
    getInstanceById("DerivedCharacteristic", instanceContent.id)?.type?.kind === "Energy"
      ? []
      : ["The selected derived characteristic must be an energy."],
})
