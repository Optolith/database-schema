import * as DB from "tsondb/schema/dsl"
import { EquipmentPrerequisites } from "../../_Prerequisite.ts"
import { src } from "../../source/_PublicationRef.js"
import { Cost, DefaultItemTranslations } from "./_Item.js"

export const Animal = DB.Entity(import.meta.url, {
  name: "Animal",
  namePlural: "Animals",
  type: () =>
    DB.Object({
      cost: DB.Required({
        comment: "The cost in silverthalers.",
        type: DB.IncludeIdentifier(Cost),
      }),
      prerequisites: DB.Optional({
        comment:
          "The prerequisites of the item, if any. Note that this is fully separate from the prerequisites of the item’s trade secret, which are defined independently from this.",
        type: DB.IncludeIdentifier(EquipmentPrerequisites),
      }),
      src,
      translations: DefaultItemTranslations("Animal"),
    }),
  instanceDisplayName: {},
  uniqueConstraints: [
    {
      entityMapKeyPath: "translations",
      keyPathInEntityMap: "name",
    },
  ],
})
