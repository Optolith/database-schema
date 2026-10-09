import * as DB from "tsondb/schema/dsl"
import { NestedTranslationMap } from "../Locale.js"

export const MusicTraditionReference = (traditionIdentifier: DB.ReferenceIdentifier) =>
  DB.TypeAlias(import.meta.url, {
    name: `${traditionIdentifier.entity.name  }Reference`,
    comment:
      "A reference to a music tradition with the music-tradition-specific name of the entry.",
    type: () =>
      DB.Object({
        id: DB.Required({
          comment: "The music tradition’s identifier.",
          type: traditionIdentifier,
        }),
        translations: NestedTranslationMap(
          DB.Required,
          `${traditionIdentifier.entity.name  }ReferenceTranslation`,
          DB.Object({
            name: DB.Required({
              comment: "The music-tradition-specific name of the entry.",
              type: DB.String({ minLength: 1 }),
            }),
          }),
        ),
      }),
  })

export const MusicDuration = DB.TypeAlias(import.meta.url, {
  name: "MusicDuration",
  type: () =>
    DB.Object({
      length: DB.Required({
        type: DB.IncludeIdentifier(MusicLength),
      }),
      reusability: DB.Required({
        type: DB.IncludeIdentifier(MusicReusability),
      }),
    }),
})

const MusicLength = DB.Enum(import.meta.url, {
  name: "MusicLength",
  values: () => ({
    Long: DB.EnumCase({ type: null }),
    Short: DB.EnumCase({ type: null }),
  }),
})

const MusicReusability = DB.Enum(import.meta.url, {
  name: "MusicReusability",
  values: () => ({
    OneTime: DB.EnumCase({ type: null }),
    Sustainable: DB.EnumCase({ type: null }),
  }),
})
