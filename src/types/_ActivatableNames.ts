import * as DB from "tsondb/schema/dsl"

export const ActivatableNameBuilderRules = DB.TypeAlias(import.meta.url, {
  name: "ActivatableNameBuilderRules",
  comment:
    "Rules for building the name of an activatable. These rules are used when the activatable doesn't have a custom name specified.",
  type: () =>
    DB.Object({
      levelPlacement: DB.Optional({
        comment:
          "Where the level is placed in the name if the activatable has levels. Defaults to “After”.",
        type: DB.IncludeIdentifier(ActivatableNameLevelPlacement),
      }),
      useParenthesis: DB.Optional({
        comment: "Whether to use parenthesis around the printed options. Defaults to true.",
        type: DB.Boolean(),
      }),
    }),
})

export const nameBuilderRules = DB.Optional({
  comment:
    "Rules for building the name of an activatable. These rules are used when the activatable doesn't have a custom name specified.",
  type: DB.IncludeIdentifier(ActivatableNameBuilderRules),
})

const ActivatableNameLevelPlacement = DB.Enum(import.meta.url, {
  name: "ActivatableNameLevelPlacement",
  values: () => ({
    BeforeOptions: DB.EnumCase({ type: null }),
    AfterOptions: DB.EnumCase({ type: null }),
  }),
})

export const activatableDisplayNameCustomizer = ({
  instance,
  instanceDisplayName,
  instanceDisplayNameLocaleId,
  locales,
}: {
  instance: { translations: Record<string, { name: string; name_in_library?: string }> }
  instanceDisplayName: string
  instanceDisplayNameLocaleId: string | undefined
  locales: string[]
}) => {
  for (const locale of locales) {
    const translation = instance.translations[locale]
    if (translation) {
      return {
        name: translation.name_in_library ?? translation.name,
        localeId: locale,
      }
    }
  }
  return { name: instanceDisplayName, localeId: instanceDisplayNameLocaleId }
}
