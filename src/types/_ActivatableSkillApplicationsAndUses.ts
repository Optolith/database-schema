import * as DB from "tsondb/schema/dsl"
import { SkillIdentifier } from "./_Identifier.js"
import { NewSkillApplicationOrUseParentIdentifier } from "./_IdentifierGroup.js"
import { NestedTranslationMap } from "./Locale.js"

export const NewSkillApplication = DB.Entity(import.meta.url, {
  name: "NewSkillApplication",
  namePlural: "NewSkillApplications",
  comment:
    "Registers new skill applications, which get enabled once the referenced entry is activated. It specifies the skill(s) it belongs to. A translation can be left out if its name equals the name of the origin activatable entry.",
  type: () =>
    DB.Object({
      parent: DB.Required({
        comment: "The entry that enables the new skill application.",
        type: DB.IncludeIdentifier(NewSkillApplicationOrUseParentIdentifier),
      }),
      skills: DB.Required({
        comment: "The skill(s) this application belongs to.",
        type: DB.Array(SkillIdentifier(), { minItems: 1 }),
      }),
      required_skill_rating: DB.Optional({
        comment:
          "If an application applies to multiple skills, it may need to ensure the respective skill is on a certain skill rating if the activatable entry cannot ensure this prerequisite.",
        type: DB.Integer({ minimum: 1 }),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "NewSkillApplication",
        DB.Object({
          name: DB.Required({
            comment: "The name of the application if different from the activatable entry’s name.",
            type: DB.String({ minLength: 1 }),
          }),
        }),
      ),
    }),
  parentReferenceKey: "parent",
  instanceDisplayName: {},
  instanceDisplayNameCustomizer: ({
    instance,
    instanceDisplayName,
    instanceDisplayNameLocaleId,
    getDisplayNameForInstanceId,
  }) => ({
    name:
      instanceDisplayName.length > 0
        ? instanceDisplayName
        : (getDisplayNameForInstanceId(instance.parent)?.name ?? ""),
    localeId: instanceDisplayNameLocaleId,
  }),
})

export const skill_applications = DB.Required({
  displayName: "New Skill Applications",
  comment:
    "Registers new skill applications, which get enabled once this entry is activated. It specifies an entry-unique identifier and the skill it belongs to. A translation can be left out if its name equals the name of the origin activatable entry.",
  type: DB.ChildEntities(NewSkillApplication),
})

export const SkillUse = DB.Entity(import.meta.url, {
  name: "SkillUse",
  namePlural: "SkillUses",
  comment:
    "Registers uses, which get enabled once this entry is activated. It specifies the skill(s) it belongs to. A translation can be left out if its name equals the name of the origin activatable entry.",
  type: () =>
    DB.Object({
      parent: DB.Required({
        comment: "The entry that enables the use.",
        type: DB.IncludeIdentifier(NewSkillApplicationOrUseParentIdentifier),
      }),
      skills: DB.Required({
        comment: "The skill(s) this use belongs to.",
        type: DB.Array(SkillIdentifier(), { minItems: 1 }),
      }),
      required_skill_rating: DB.Optional({
        comment:
          "If a use applies to multiple skills, it may need to ensure the respective skill is on a certain skill rating if the activatable entry cannot ensure this prerequisite.",
        type: DB.Integer({ minimum: 1 }),
      }),
      translations: NestedTranslationMap(
        DB.Optional,
        "SkillUse",
        DB.Object({
          name: DB.Required({
            comment: "The name of the use if different from the activatable entry’s name.",
            type: DB.String({ minLength: 1 }),
          }),
        }),
      ),
    }),
  parentReferenceKey: "parent",
  instanceDisplayName: {},
  instanceDisplayNameCustomizer: ({
    instance,
    instanceDisplayName,
    instanceDisplayNameLocaleId,
    getDisplayNameForInstanceId,
  }) => ({
    name:
      instanceDisplayName.length > 0
        ? instanceDisplayName
        : (getDisplayNameForInstanceId(instance.parent)?.name ?? ""),
    localeId: instanceDisplayNameLocaleId,
  }),
})

export const skill_uses = DB.Required({
  displayName: "Skill Uses",
  comment:
    "Registers uses, which get enabled once this entry is activated. It specifies an entry-unique identifier and the skill it belongs to. A translation can be left out if its name equals the name of the origin activatable entry.",
  type: DB.ChildEntities(SkillUse),
})
