import * as DB from "tsondb/schema/dsl"
import { PropertyIdentifier } from "./_Identifier.ts"
import { SkillCheck } from "./_SkillCheck.js"
import { NestedTranslationMap } from "./Locale.js"

export const Property = DB.Entity(import.meta.url, {
  name: "Property",
  namePlural: "Properties",
  type: () =>
    DB.Object({
      check: DB.Optional({
        comment:
          "The property check’s attributes. Only the properties from the Core Rules have defined property checks.",
        type: DB.IncludeIdentifier(SkillCheck),
      }),
      specializations: DB.Required({
        comment: "The property’s specializations.",
        type: DB.ChildEntities(PropertySpecialization),
      }),
      derivedSpecializations: DB.Optional({
        comment: "The property’s derived specializations.",
        type: DB.IncludeIdentifier(DerivedPropertySpecializations),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "Property",
        DB.Object({
          name: DB.Required({
            comment: "The property’s name.",
            type: DB.String({ minLength: 1 }),
          }),
        }),
      ),
    }),
  instanceDisplayName: {},
  uniqueConstraints: [
    {
      entityMapKeyPath: "translations",
      keyPathInEntityMap: "name",
    },
  ],
})

const DerivedPropertySpecializations = DB.Enum(import.meta.url, {
  name: "DerivedPropertySpecializations",
  values: () => ({
    Elements: DB.EnumCase({ type: null }),
  }),
})

export const PropertySpecialization = DB.Entity(import.meta.url, {
  name: "PropertySpecialization",
  namePlural: "PropertySpecializations",
  type: () =>
    DB.Object({
      parent: DB.Required({
        comment: "The associated property.",
        type: PropertyIdentifier(),
      }),
      translations: NestedTranslationMap(
        DB.Required,
        "Property",
        DB.Object({
          name: DB.Required({
            comment: "The property’s name.",
            type: DB.String({ minLength: 1 }),
          }),
        }),
      ),
    }),
  parentReferenceKey: "parent",
  instanceDisplayName: {},
  uniqueConstraints: [
    {
      entityMapKeyPath: "translations",
      keyPathInEntityMap: "name",
    },
  ],
})
