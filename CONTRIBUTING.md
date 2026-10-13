# Contribute

## Prerequisites

You will need Node.js installed. Install dependencies via `npm install`/`npm i`.

## Building and build passes

Successful compilation requires some generated types, as these are used to provide type safety for unique constraints and other features. However, the project needs to be built first to be able to generate the types. Since TypeScript compiles even with errors, you will need to build first, then generate the types, and then build a second time with the generated types.

- **Build TypeScript:** `npm run build`
- **Generate Types:** `npm run generate`

Generated files will be saved to the `/gen` folder; compiled JavaScript files will be saved to the `/lib` folder.

### Watch

You can also watch for changes when you are working on the schema. For this, there are two commands you can run in parallel. You do not need to care about build passes in that case, as the watcher processes will take care of it.

- **Watch TypeScript:** `npm run watch`
- **Watch Generate Types:** `npm run generate:watch`

## Testing with the database

In order to test changes with the actual database, one approach could be to install the schema as a local npm package in the database. To do so, go to your local database copy and run `npm i ../path/to/schema`, where you just point to your local working copy of the database schema repository (the one this document belongs to).

Make sure to always restart the editor when you make changes, as the database schema is not automatically reloaded. If the editor UI does not update properly, try resetting the browser cache by holding shift while reloading the page.

## Naming conventions

If you create branches in this repository, use either `feature/<topic>` or `fix/<topic>` as the branch name and replace `<topic>` with a kebab case version of what the branch is going to do. Branches are merged using squash merge, so commits within a pull request do not have to follow any naming convention, just do what you can work with best.

Alternatively, you can fork the repository and create pull requests from there.

## New entities

If you add new entities, there are some additional steps to take.

1. Add the corresponding identifier to the `src/types/_Identifier.ts` file. Just duplicate an existing one, adjust the referenced entity at the end and make sure the variable/function name is the entity name plus `Identifier` and is inserted into the list of identifiers in alphabetical order.
2. Check `src/types/_IdentifierGroup.ts` if you need to add the entity to any existing identifier group. For example, if you add another special ability entity, add it to the `SpecialAbilityIdentifier` group; if it is a combat-related special ability, add it to the `CombatRelatedSpecialAbilityIdentifier` group as well.
3. **If it is not a child entity:** Export the entity declaration alone from `src/types/index.ts`.
4. **If it is not a child entity:** Add the entity declaration to the schema definition in `src/main.ts` in alphabetical order.

## Formatting and linting

This repository makes use of linting via `oxlint` and formatting via `oxfmt`. It can be helpful to use available editor extensions when contributing to fix errors before they appear in your PR. Formatting and linting is checked for every pull request and must succeed in order to be able to accept your PR.

To lint and format the whole repo locally, there are some commands:

- `npm run lint` to run the linter on all files
- `npm run format` to format all files
- `npm run format:check` to test if all files are formatted correctly
