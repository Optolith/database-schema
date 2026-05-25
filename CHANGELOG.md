# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [0.42.4](https://github.com/Optolith/database-schema/compare/v0.42.3...v0.42.4) (2026-04-10)


### Features

* add replacement text option to known item specifics ([4a6648e](https://github.com/Optolith/database-schema/commit/4a6648e307a35a62422c923de59b156811da1119))

## [0.42.3](https://github.com/Optolith/database-schema/compare/v0.42.2...v0.42.3) (2026-04-10)

## [0.42.2](https://github.com/elyukai/optolith-database-schema/compare/v0.42.1...v0.42.2) (2026-04-10)


### Features

* known item specifics ([9a9a2bd](https://github.com/elyukai/optolith-database-schema/commit/9a9a2bd6a1a2ff3ee7a3c14cea064a0cce1ee52f))

## [0.42.1](https://github.com/elyukai/optolith-database-schema/compare/v0.42.0...v0.42.1) (2026-03-31)


### Features

* add Bannzeichen entity ([2dd0be7](https://github.com/elyukai/optolith-database-schema/commit/2dd0be71977a447248c6916c89d624d4290601e1)), closes [#135](https://github.com/elyukai/optolith-database-schema/issues/135) [#133](https://github.com/elyukai/optolith-database-schema/issues/133)
* add goblin rituals entity ([78dcb9a](https://github.com/elyukai/optolith-database-schema/commit/78dcb9a737ca7c76370942168163b6b9ca3971ce)), closes [#132](https://github.com/elyukai/optolith-database-schema/issues/132) [#131](https://github.com/elyukai/optolith-database-schema/issues/131)

## [0.42.0](https://github.com/elyukai/optolith-database-schema/compare/v0.41.0...v0.42.0) (2026-03-23)


### ⚠ BREAKING CHANGES

* adjust translations for 0.41.0 schema changes
* do not confuse rules tab with rules term in entry texts
* require hair and eye color specifications

### Features

* add familiars trick magical tradition restriction ([5c8a164](https://github.com/elyukai/optolith-database-schema/commit/5c8a164428d3e2a706bf07f106e1c7aecc8cb1af)), closes [#126](https://github.com/elyukai/optolith-database-schema/issues/126) [#106](https://github.com/elyukai/optolith-database-schema/issues/106)
* adjust translations for 0.41.0 schema changes ([849fca4](https://github.com/elyukai/optolith-database-schema/commit/849fca45dbfcd48e8fa99a30ee375d37738c55f3))
* do not confuse rules tab with rules term in entry texts ([7d8bcd8](https://github.com/elyukai/optolith-database-schema/commit/7d8bcd89baebcea6db20c442cb26aa48ea9268cc))
* hair color label and hair color count ([750ddb1](https://github.com/elyukai/optolith-database-schema/commit/750ddb154824ab1e2de557084655297aa19e86fd)), closes [#116](https://github.com/elyukai/optolith-database-schema/issues/116)
* require hair and eye color specifications ([99466ed](https://github.com/elyukai/optolith-database-schema/commit/99466ed0eec6676c0a8a0259bfc7480988284f41))
* skill rating as check-result-based base value ([bd931ff](https://github.com/elyukai/optolith-database-schema/commit/bd931ffcb671e7b34a79d8d3f6b11da586a21859)), closes [#125](https://github.com/elyukai/optolith-database-schema/issues/125)

## [0.41.0](https://github.com/elyukai/optolith-database-schema/compare/v0.40.0...v0.41.0) (2026-03-21)


### ⚠ BREAKING CHANGES

* allow activatable prerequisites for geode rituals
* childhood and magical disease flags
* attribute adjustments can vary by race variant
* optional ceremonial item structure points
* allow enhancements as profession special abilities
* allow weapons as ammunition
* multiple weapon reaches
* reach position
* derived characteristic type
* id-connected race base values
* atomic talisman activation values
* plain quality level effect
* animal poison can have a complexity
* unify poison times as expression

* id-connected race base values ([ee11a36](https://github.com/elyukai/optolith-database-schema/commit/ee11a3605159dfff9a1ba12fabe5cb11523bbf91))
* unify poison times as expression ([03f33ce](https://github.com/elyukai/optolith-database-schema/commit/03f33ce36d127c080a932be013428a0f6247aaf1))


### Features

* allow activatable prerequisites for geode rituals ([937eeb9](https://github.com/elyukai/optolith-database-schema/commit/937eeb94e0c110acf7959ee07b9a7bbd48bb3938)), closes [#124](https://github.com/elyukai/optolith-database-schema/issues/124)
* allow enhancements as profession special abilities ([47cdc55](https://github.com/elyukai/optolith-database-schema/commit/47cdc55aa0eb0b312a6528e020fc4069e02c70bd)), closes [#114](https://github.com/elyukai/optolith-database-schema/issues/114)
* allow weapons as ammunition ([d36c4b8](https://github.com/elyukai/optolith-database-schema/commit/d36c4b8334e72ce680ec50b8d5ac4272302286cc)), closes [#90](https://github.com/elyukai/optolith-database-schema/issues/90)
* animal poison can have a complexity ([eafeb5d](https://github.com/elyukai/optolith-database-schema/commit/eafeb5de3648d6d9181e5e772dbfcab121c3f0ea)), closes [#48](https://github.com/elyukai/optolith-database-schema/issues/48)
* atomic talisman activation values ([0375cd5](https://github.com/elyukai/optolith-database-schema/commit/0375cd5d2ae3812218bd753a98fa9a0f34f9cd8b))
* attribute adjustments can vary by race variant ([ed6cec9](https://github.com/elyukai/optolith-database-schema/commit/ed6cec999785f6f516478d03a34900e6f173abe8)), closes [#117](https://github.com/elyukai/optolith-database-schema/issues/117)
* childhood and magical disease flags ([d4008b3](https://github.com/elyukai/optolith-database-schema/commit/d4008b3fcf60ae0da3fb317721eac3c0d7703a2a)), closes [#122](https://github.com/elyukai/optolith-database-schema/issues/122)
* derived characteristic type ([9a5ae50](https://github.com/elyukai/optolith-database-schema/commit/9a5ae5028092a6226443f3836e26941d32516307))
* magical melody cost interval ([c3087b4](https://github.com/elyukai/optolith-database-schema/commit/c3087b456bbe57a7a8efc95700bf0a692241c8ad)), closes [#123](https://github.com/elyukai/optolith-database-schema/issues/123)
* multiple weapon reaches ([00966f9](https://github.com/elyukai/optolith-database-schema/commit/00966f9186a1298ac575c8fdef4cab7e60b22658)), closes [#89](https://github.com/elyukai/optolith-database-schema/issues/89)
* optional ceremonial item structure points ([b172b9f](https://github.com/elyukai/optolith-database-schema/commit/b172b9f3313e59f08bb0d2cdf07b917ea13b5472)), closes [#115](https://github.com/elyukai/optolith-database-schema/issues/115)
* plain quality level effect ([30db26f](https://github.com/elyukai/optolith-database-schema/commit/30db26fc6bc5eb742d6d87847d91fec85c235954)), closes [#56](https://github.com/elyukai/optolith-database-schema/issues/56)
* reach position ([962950d](https://github.com/elyukai/optolith-database-schema/commit/962950d4c58b8caad89d617f789c221fdae7c202))
* specific skills for profession skill options ([4f5ed76](https://github.com/elyukai/optolith-database-schema/commit/4f5ed7679f94acb67e7bb845114a46a2d82a3136)), closes [#97](https://github.com/elyukai/optolith-database-schema/issues/97)

## [0.40.0](https://github.com/elyukai/optolith-database-schema/compare/v0.39.0...v0.40.0) (2026-03-15)


### ⚠ BREAKING CHANGES

* translations for style and advanced special abilities

### Features

* translations for style and advanced special abilities ([7712c1b](https://github.com/elyukai/optolith-database-schema/commit/7712c1b9bd49a3cd934a03d3018972d6376c686a))

## [0.39.0](https://github.com/elyukai/optolith-database-schema/compare/v0.38.0...v0.39.0) (2026-03-14)


### ⚠ BREAKING CHANGES

* more translations for equipment and professions

### Features

* more translations for equipment and professions ([960f1a9](https://github.com/elyukai/optolith-database-schema/commit/960f1a9a363593b8b16b0258f86338a546e0c674))

## [0.38.0](https://github.com/elyukai/optolith-database-schema/compare/v0.37.0...v0.38.0) (2026-03-14)


### ⚠ BREAKING CHANGES

* reconstruction and references can differ per edition

### Features

* display names for new skill applications and uses ([e3eaca0](https://github.com/elyukai/optolith-database-schema/commit/e3eaca0c25f6597bed456f6ae2edd0ff4afd2dae))
* reconstruction and references can differ per edition ([8774da6](https://github.com/elyukai/optolith-database-schema/commit/8774da6c72786333b09235ee712d0864778dbbfe))

## [0.37.0](https://github.com/elyukai/optolith-database-schema/compare/v0.36.1...v0.37.0) (2026-03-14)


### ⚠ BREAKING CHANGES

* more detailed book rules and meta data

### Features

* more detailed book rules and meta data ([04b3a74](https://github.com/elyukai/optolith-database-schema/commit/04b3a7451e8ccc629b670da95b178f115085363b))

## [0.36.1](https://github.com/elyukai/optolith-database-schema/compare/v0.36.0...v0.36.1) (2026-03-13)


### Features

* cost map style ([127cc6c](https://github.com/elyukai/optolith-database-schema/commit/127cc6cc48ea1c77ab4e31eb424ddc92c2cb248e))

## [0.36.0](https://github.com/elyukai/optolith-database-schema/compare/v0.35.0...v0.36.0) (2026-03-13)


### ⚠ BREAKING CHANGES

* style for time units

### Features

* style for time units ([5f5785d](https://github.com/elyukai/optolith-database-schema/commit/5f5785db79da544267d48f5787d5142517c30f1f))

## [0.35.0](https://github.com/elyukai/optolith-database-schema/compare/v0.34.17...v0.35.0) (2026-03-13)


### ⚠ BREAKING CHANGES

* only allow numeric cost for jewelry

### Features

* only allow numeric cost for jewelry ([a83b27e](https://github.com/elyukai/optolith-database-schema/commit/a83b27e802efb026bbd2fc75ee70a41df2c56c36))

## [0.34.17](https://github.com/elyukai/optolith-database-schema/compare/v0.34.16...v0.34.17) (2026-03-12)


### Features

* add two translations ([4d3b548](https://github.com/elyukai/optolith-database-schema/commit/4d3b548c70f4bb12e0bb6178a0a0426be56c4b97))

## [0.34.16](https://github.com/elyukai/optolith-database-schema/compare/v0.34.15...v0.34.16) (2026-03-12)


### Features

* add translations for enhancements ([5c11a0f](https://github.com/elyukai/optolith-database-schema/commit/5c11a0f59cbbeb162d67b492be2a3481782535d7))

## [0.34.15](https://github.com/elyukai/optolith-database-schema/compare/v0.34.14...v0.34.15) (2026-03-12)


### Features

* add translations for recent additions ([8f59744](https://github.com/elyukai/optolith-database-schema/commit/8f59744409c12894525e18b880296cefc9e90aa1))

## [0.34.14](https://github.com/elyukai/optolith-database-schema/compare/v0.34.13...v0.34.14) (2026-03-11)

## [0.34.13](https://github.com/elyukai/optolith-database-schema/compare/v0.34.12...v0.34.13) (2026-03-11)


### Features

* alchemical poison can be demonic as well ([21e033e](https://github.com/elyukai/optolith-database-schema/commit/21e033e0169c051baf5f3167e070adcde9da76b3))

## [0.34.12](https://github.com/elyukai/optolith-database-schema/compare/v0.34.11...v0.34.12) (2026-03-10)


### Features

* optional language and script for books ([3239e09](https://github.com/elyukai/optolith-database-schema/commit/3239e095392ff91811956ad8f9f022e057fa9763))

## [0.34.11](https://github.com/elyukai/optolith-database-schema/compare/v0.34.10...v0.34.11) (2026-03-10)


### Features

* working supernatural creature entity ([f8a174e](https://github.com/elyukai/optolith-database-schema/commit/f8a174efad6dc46e83efd9d6e33155de435e6569))

## [0.34.10](https://github.com/elyukai/optolith-database-schema/compare/v0.34.9...v0.34.10) (2026-03-10)


### Features

* poison cost depending on purchase or sale ([22e6dfd](https://github.com/elyukai/optolith-database-schema/commit/22e6dfda8b2e9425ab7b524fda0276ef549a685c))

## [0.34.9](https://github.com/elyukai/optolith-database-schema/compare/v0.34.8...v0.34.9) (2026-03-09)


### Features

* add circle of damnation as possible poison duration component ([d519e66](https://github.com/elyukai/optolith-database-schema/commit/d519e662b416a376824a1042bf0f11f7e9033017))

## [0.34.8](https://github.com/elyukai/optolith-database-schema/compare/v0.34.7...v0.34.8) (2026-03-09)


### Bug Fixes

* **cache:** handle added poison source type ([17d46f1](https://github.com/elyukai/optolith-database-schema/commit/17d46f17b45efe20e154e15a526a370e7b73a5c2))

## [0.34.7](https://github.com/elyukai/optolith-database-schema/compare/v0.34.6...v0.34.7) (2026-03-09)


### Features

* add alchemical pact gift poison source type and make cost optional ([c32cb59](https://github.com/elyukai/optolith-database-schema/commit/c32cb594aa0cb7802511adb7ed13327e51620999)), closes [#88](https://github.com/elyukai/optolith-database-schema/issues/88)

## [0.34.6](https://github.com/elyukai/optolith-database-schema/compare/v0.34.5...v0.34.6) (2026-03-09)


### Features

* general rules for influences ([f97e9dc](https://github.com/elyukai/optolith-database-schema/commit/f97e9dce22dcbb11a5f4ca593cbc751475fa8eef))

## [0.34.5](https://github.com/elyukai/optolith-database-schema/compare/v0.34.4...v0.34.5) (2026-03-09)


### Features

* support markdown in influence effect texts ([1e08553](https://github.com/elyukai/optolith-database-schema/commit/1e08553eae6216411abe4124b63a07684ffd485d))

## [0.34.4](https://github.com/elyukai/optolith-database-schema/compare/v0.34.3...v0.34.4) (2026-03-09)


### Features

* profession influence prerequisites ([c7f862b](https://github.com/elyukai/optolith-database-schema/commit/c7f862b4cb798a566eb82835d002f707cc739881))
* rule precondition ([7404637](https://github.com/elyukai/optolith-database-schema/commit/7404637f2982a9abd5c26a9b10c77e75deb848a2))

## [0.34.3](https://github.com/elyukai/optolith-database-schema/compare/v0.34.2...v0.34.3) (2026-03-09)


### Features

* add race and activatable influence prerequisites ([bc41f2e](https://github.com/elyukai/optolith-database-schema/commit/bc41f2e7d10ca24b83f3961fd644428c188696ab))

## [0.34.2](https://github.com/elyukai/optolith-database-schema/compare/v0.34.1...v0.34.2) (2026-03-08)


### Features

* make optional rule complexity influence optional ([fa4c6f8](https://github.com/elyukai/optolith-database-schema/commit/fa4c6f820bc5c48ddbceacee325c2d29b839069f))

## [0.34.1](https://github.com/elyukai/optolith-database-schema/compare/v0.34.0...v0.34.1) (2026-03-08)

## [0.34.0](https://github.com/elyukai/optolith-database-schema/compare/v0.33.0...v0.34.0) (2026-03-08)


### ⚠ BREAKING CHANGES

* define attribute and skill group colors
* atomic specification of how an optional rule influences game complexity

### Features

* atomic specification of how an optional rule influences game complexity ([b2f1c5d](https://github.com/elyukai/optolith-database-schema/commit/b2f1c5dfd64777cb083da4bb1964ad4a3e219e8b))
* define attribute and skill group colors ([8aedafb](https://github.com/elyukai/optolith-database-schema/commit/8aedafb8136439fa9a1011ea94ee2f301f0d6f64))

## [0.33.0](https://github.com/elyukai/optolith-database-schema/compare/v0.32.0...v0.33.0) (2026-02-25)


### ⚠ BREAKING CHANGES

* require blessed ones' name
* required skill group for free AP distribution on skills
* remove terrain knowledge profession option
* require experience level for profession packages
* remove subgroup option from common mundane professions
* culture languages can specify specializations

### Features

* activatable name builder rules ([977f33c](https://github.com/elyukai/optolith-database-schema/commit/977f33c068d9a47f9b760fa50b53a33ede3688cb))
* add various translations ([7b28823](https://github.com/elyukai/optolith-database-schema/commit/7b2882322cd7b7a217c124a69bdf709e07cdd177))
* culture languages can specify specializations ([1c84c83](https://github.com/elyukai/optolith-database-schema/commit/1c84c830bc67eb9d41523c8b5ffe31fca8958d53))
* language specialization display name includes language ([badd4ae](https://github.com/elyukai/optolith-database-schema/commit/badd4aef9537786e54c002048f10b2e57bd26f1a))
* remove subgroup option from common mundane professions ([710d5be](https://github.com/elyukai/optolith-database-schema/commit/710d5be33d2dfa62c9a6a875a53f4fac07f50748))
* remove terrain knowledge profession option ([fa3be57](https://github.com/elyukai/optolith-database-schema/commit/fa3be570968d507cd825808b5f8c77d6b14af315))
* require blessed ones' name ([9fcb303](https://github.com/elyukai/optolith-database-schema/commit/9fcb303452ea8534e9f69eb1779afd9b52464d7d))
* require experience level for profession packages ([ab02370](https://github.com/elyukai/optolith-database-schema/commit/ab02370c90f685034cc43a16ea798ab47a2ba25b))
* required skill group for free AP distribution on skills ([6154058](https://github.com/elyukai/optolith-database-schema/commit/6154058d655dc5adf9c796a4e5590616bb17ffbf))

## [0.32.0](https://github.com/elyukai/optolith-database-schema/compare/v0.31.4...v0.32.0) (2026-02-21)


### ⚠ BREAKING CHANGES

* streamline types

* streamline types ([9fd01ec](https://github.com/elyukai/optolith-database-schema/commit/9fd01ec1f287b881548f91d562eea7efcfc2e50f))


### Features

* add translations for magical actions ([db431e2](https://github.com/elyukai/optolith-database-schema/commit/db431e25cf45b732ea5ed4be9faca7b6e98617ca))

## [0.31.4](https://github.com/elyukai/optolith-database-schema/compare/v0.31.3...v0.31.4) (2026-02-16)


### Bug Fixes

* optional withdrawal prevention and disease link ([a9211ec](https://github.com/elyukai/optolith-database-schema/commit/a9211ec6b784538cc303cde312b59d8f72079775))

## [0.31.3](https://github.com/elyukai/optolith-database-schema/compare/v0.31.2...v0.31.3) (2026-02-16)


### Bug Fixes

* interpretation and display of poisons/elixirs ([30a6a3c](https://github.com/elyukai/optolith-database-schema/commit/30a6a3c4262e2920f9100605faee8c426cd37491))

## [0.31.2](https://github.com/elyukai/optolith-database-schema/compare/v0.31.1...v0.31.2) (2026-02-15)


### Features

* add translations for poisons, elixirs, sex practices, diseases and personality traits ([3561289](https://github.com/elyukai/optolith-database-schema/commit/3561289fc1283bcecde3065bee5850b166ba3270))


### Bug Fixes

* incorrect comment ([c3a6124](https://github.com/elyukai/optolith-database-schema/commit/c3a61244cec93af6396f723ee972e7911f98c1fa))
* poison addition interpretation ([a24aeb6](https://github.com/elyukai/optolith-database-schema/commit/a24aeb6dd1cf170afe0d7de1b23f5cdf0c11b5b3))

## [0.31.1](https://github.com/elyukai/optolith-database-schema/compare/v0.31.0...v0.31.1) (2026-02-15)


### Features

* add rest of translations for equipment ([fa4b7b5](https://github.com/elyukai/optolith-database-schema/commit/fa4b7b5e68491aa367e65f14ebf6afdf636da1da))

## [0.31.0](https://github.com/elyukai/optolith-database-schema/compare/v0.30.1...v0.31.0) (2026-02-14)


### ⚠ BREAKING CHANGES

* use correct entity names in identifier groups

### Features

* add some translations for equipment ([3fa1060](https://github.com/elyukai/optolith-database-schema/commit/3fa10600c26c6c82cbbed08a8cca6114d6feeeee))
* locale measurement adjustments ([9040013](https://github.com/elyukai/optolith-database-schema/commit/9040013a844b33a707b7d0f8d804f24a2bfb1325))


### Bug Fixes

* use correct entity names in identifier groups ([b46029d](https://github.com/elyukai/optolith-database-schema/commit/b46029da1e0520cbe99f3665a928868648e027ca))

## [0.30.1](https://github.com/elyukai/optolith-database-schema/compare/v0.30.0...v0.30.1) (2026-02-13)


### Features

* add translations for curricula ([7da65cf](https://github.com/elyukai/optolith-database-schema/commit/7da65cf3b8015be63dccf93137dfa4cc97ed1d24))

## [0.30.0](https://github.com/elyukai/optolith-database-schema/compare/v0.29.1...v0.30.0) (2026-02-12)


### ⚠ BREAKING CHANGES

* adjust for activatable display
* require focus rule subjects
* more advanced identifier options

### Features

* add more translations ([b2a0d58](https://github.com/elyukai/optolith-database-schema/commit/b2a0d5820240fd3b89461c1742b894981c1acdbd))
* add optional derived characteristic description ([403d4bc](https://github.com/elyukai/optolith-database-schema/commit/403d4bc1e3768a78d4bc71778c80b29c3a13d91e))
* adjust for activatable display ([40c07ba](https://github.com/elyukai/optolith-database-schema/commit/40c07baa30361b7955f478b840717e06767054cb))
* more advanced identifier options ([e0ac1e3](https://github.com/elyukai/optolith-database-schema/commit/e0ac1e31e4c9d19f6dacff60a120c08311a165bf)), closes [#120](https://github.com/elyukai/optolith-database-schema/issues/120)
* require focus rule subjects ([78b69fb](https://github.com/elyukai/optolith-database-schema/commit/78b69fbe7063ba39301392382f8e8429284e7220))

## [0.29.1](https://github.com/elyukai/optolith-database-schema/compare/v0.29.0...v0.29.1) (2026-02-09)


### Features

* include all derived characteristic settings ([3c0469e](https://github.com/elyukai/optolith-database-schema/commit/3c0469e4148d8bd314e3c949a42a7e0ca593f87c))
* values and translations for derived characteristic base value calculation ([f55bb9f](https://github.com/elyukai/optolith-database-schema/commit/f55bb9f6c292b79c8d45d8b620f641b8bc2fc1e8))

## [0.29.0](https://github.com/elyukai/optolith-database-schema/compare/v0.28.3...v0.29.0) (2026-02-09)


### ⚠ BREAKING CHANGES

* adjust cache builder for current database

### Features

* add some translation strings ([55d2273](https://github.com/elyukai/optolith-database-schema/commit/55d227322346b204720b9f3a4eb32c586d26c45e))
* adjust cache builder for current database ([9407cb5](https://github.com/elyukai/optolith-database-schema/commit/9407cb57670d8b50ba72cf5e856534447f249218))
* **cache:** export other relevant types ([0b80c3b](https://github.com/elyukai/optolith-database-schema/commit/0b80c3bf02d1037459d8a2f19280a29082893acc))

## [0.28.3](https://github.com/elyukai/optolith-database-schema/compare/v0.28.2...v0.28.3) (2026-02-05)

## [0.28.2](https://github.com/elyukai/optolith-database-schema/compare/v0.28.1...v0.28.2) (2026-02-05)


### Features

* add optional isRemoved flag to initial source refs ([ae034e1](https://github.com/elyukai/optolith-database-schema/commit/ae034e1bd6ed3da3940ba0b3af0a162d45141168))
* nested entity maps should not be empty ([72a3384](https://github.com/elyukai/optolith-database-schema/commit/72a3384fdad7623bc211e23271dfb47b628e4d35))

## [0.28.1](https://github.com/elyukai/optolith-database-schema/compare/v0.28.0...v0.28.1) (2026-02-05)


### Bug Fixes

* empty target categories must be possible ([b7d449a](https://github.com/elyukai/optolith-database-schema/commit/b7d449a5f0a42b4b927c3c0bf4a07745222ba03f))
* require at least one target category ([b251679](https://github.com/elyukai/optolith-database-schema/commit/b2516791a1a2cf6725c6560bee3bf89c41fb0786))

## [0.28.0](https://github.com/elyukai/optolith-database-schema/compare/v0.27.1...v0.28.0) (2026-02-01)


### ⚠ BREAKING CHANGES

* remodel reversalis

### Features

* remodel reversalis ([99d3bc4](https://github.com/elyukai/optolith-database-schema/commit/99d3bc425cac0693237860d0eedde790e60da0d3))

## [0.27.1](https://github.com/elyukai/optolith-database-schema/compare/v0.27.0...v0.27.1) (2026-02-01)


### Features

* add reversalis fields to spells and rituals ([73edb6c](https://github.com/elyukai/optolith-database-schema/commit/73edb6cb5dd4a209e20b8e68eb4503c0e7e48f64))

## [0.27.0](https://github.com/elyukai/optolith-database-schema/compare/v0.26.5...v0.27.0) (2026-01-29)


### ⚠ BREAKING CHANGES

* The position values need to be added. Also, the
"order" value for social statuses has been renamed to "position" to
align with other specially sorted entities.

### Features

* allow deprecation as only source reference ([fb251d1](https://github.com/elyukai/optolith-database-schema/commit/fb251d1bb6e47b9ca6bbe97e37e124188e037816))
* allow options text with reference ([260f74d](https://github.com/elyukai/optolith-database-schema/commit/260f74dcd2de9d5c43c983a58060524a6581b119))
* automatic race disadvantages ([21b8fcc](https://github.com/elyukai/optolith-database-schema/commit/21b8fcc7d273109f1399027ceb56253bed7e0971)), closes [#113](https://github.com/elyukai/optolith-database-schema/issues/113)
* custom sort orders and position values ([aca931d](https://github.com/elyukai/optolith-database-schema/commit/aca931d66818f1e425a6283e846b4c5c10003b2b))
* talisman melee and ranged uses ([5a1fc2f](https://github.com/elyukai/optolith-database-schema/commit/5a1fc2f2f5dd35b1b426ab4b6f12852082863aaa)), closes [#60](https://github.com/elyukai/optolith-database-schema/issues/60)


### Bug Fixes

* add type parameter name ([d42253c](https://github.com/elyukai/optolith-database-schema/commit/d42253c483b9e2291ba2bd58f3d879c66b1f2991))
* make unique constraint work with any damage ([8af0910](https://github.com/elyukai/optolith-database-schema/commit/8af09109ba1dd433973aca185f2566978ac89750))
* src comment and display name ([0a073b5](https://github.com/elyukai/optolith-database-schema/commit/0a073b5d6706a3a87f4ae5935651f28eaed0ad0b))
* talisman combat use nesting and constraint ([1f8823f](https://github.com/elyukai/optolith-database-schema/commit/1f8823fa5fc075ed60cabfb81276db58e47ecae0))

## [0.26.5](https://github.com/elyukai/optolith-database-schema/compare/v0.26.4...v0.26.5) (2025-12-29)


### Features

* add some display names ([6cb3f40](https://github.com/elyukai/optolith-database-schema/commit/6cb3f40f7e1cb43ec02fcb48030b72613d194701))


### Bug Fixes

* duplicate cost map translation identifier ([6fad16b](https://github.com/elyukai/optolith-database-schema/commit/6fad16bf98ede7dc3f41ec6afb153eb2ad4b9d84))

## [0.26.4](https://github.com/elyukai/optolith-database-schema/compare/v0.26.3...v0.26.4) (2025-12-29)


### Features

* add object as skill check penalty ([f3ea105](https://github.com/elyukai/optolith-database-schema/commit/f3ea105280387cbfb70c988aecd4285fb9e91572)), closes [#101](https://github.com/elyukai/optolith-database-schema/issues/101)
* add race as requirable select option ([e3bd65f](https://github.com/elyukai/optolith-database-schema/commit/e3bd65f71194c136130265d5bff24d9fe71f3dcc)), closes [#99](https://github.com/elyukai/optolith-database-schema/issues/99)
* add rated option to enhancement prerequisite ([ae43d2a](https://github.com/elyukai/optolith-database-schema/commit/ae43d2ab12e9313260b96bac931a75e730d69423)), closes [#103](https://github.com/elyukai/optolith-database-schema/issues/103)
* add sustained skill cost map ([1fd987d](https://github.com/elyukai/optolith-database-schema/commit/1fd987de4fe3b0a5e72eaa49f95252c9cb7e6cdb)), closes [#102](https://github.com/elyukai/optolith-database-schema/issues/102)
* warding circle text is optional ([8a4903e](https://github.com/elyukai/optolith-database-schema/commit/8a4903ebdcd1e2e8c77a220cc272421913f42493)), closes [#105](https://github.com/elyukai/optolith-database-schema/issues/105)

## [0.26.3](https://github.com/elyukai/optolith-database-schema/compare/v0.26.2...v0.26.3) (2025-12-28)


### Features

* add spellworks as target category option ([13413e2](https://github.com/elyukai/optolith-database-schema/commit/13413e236f73832c7ef625f57778ccff483a7ecd)), closes [#100](https://github.com/elyukai/optolith-database-schema/issues/100)


### Bug Fixes

* general select option display name ([498014a](https://github.com/elyukai/optolith-database-schema/commit/498014a55afecf91fa1bac6ada00a35402b0837a))

## [0.26.2](https://github.com/elyukai/optolith-database-schema/compare/v0.26.1...v0.26.2) (2025-12-23)


### Bug Fixes

* add homunculus type to schema ([59a6d41](https://github.com/elyukai/optolith-database-schema/commit/59a6d4119dc8a7ea5b76bdd79ddb6a856ad64897))

## [0.26.1](https://github.com/elyukai/optolith-database-schema/compare/v0.26.0...v0.26.1) (2025-12-23)


### Features

* add homunculus type entity ([4fb42d3](https://github.com/elyukai/optolith-database-schema/commit/4fb42d3f8497fa1b06a4e7ba2a0853ef5844fd8e))
* allow homunculus types as derived select options ([8062836](https://github.com/elyukai/optolith-database-schema/commit/8062836e9c2ebc290da58842b6acf17679451514))
* customize AP value string generation ([2dc62b5](https://github.com/elyukai/optolith-database-schema/commit/2dc62b5907a178e450b831b92b8e8788de832cd1))
* streamline trade secret select options ([8eaab37](https://github.com/elyukai/optolith-database-schema/commit/8eaab37e9b92f0dfca1bab67a5ebbb6dcf30003d))
* support binding cost generation for select options ([c8de5a7](https://github.com/elyukai/optolith-database-schema/commit/c8de5a74bd7e7277b4d141b5abd5e1e949634f5e))


### Bug Fixes

* note on profession spells and liturgies ([fd52e85](https://github.com/elyukai/optolith-database-schema/commit/fd52e8525623cbc6b2dbcac5e7934c8c9206a99e)), closes [#98](https://github.com/elyukai/optolith-database-schema/issues/98)
* require binding cost map option translations ([b2c23c7](https://github.com/elyukai/optolith-database-schema/commit/b2c23c7099809ff96ba4b3ee9ad24fde710e05c2))

## [0.26.0](https://github.com/elyukai/optolith-database-schema/compare/v0.25.0...v0.26.0) (2025-12-15)


### ⚠ BREAKING CHANGES

* Combat techniques need to specify special rules
differently.

### Features

* add profession liturgies for ap sum option ([a1316af](https://github.com/elyukai/optolith-database-schema/commit/a1316af0c1f8b85e79f5f393eed2c3bec5204645)), closes [#86](https://github.com/elyukai/optolith-database-schema/issues/86)
* custom constraint for weapon values ([02be29d](https://github.com/elyukai/optolith-database-schema/commit/02be29dab7bca40fb4c370c48a9f775ccf8aaf7d))

## [0.25.0](https://github.com/elyukai/optolith-database-schema/compare/v0.24.3...v0.25.0) (2025-12-14)


### ⚠ BREAKING CHANGES

* add unique constraints

### Features

* add unique constraints ([8bacb48](https://github.com/elyukai/optolith-database-schema/commit/8bacb489d804d280801b38111d96732fb9a317fc))
* adjust display names of pact domains and types ([6086a6d](https://github.com/elyukai/optolith-database-schema/commit/6086a6d89160f7f09f9f6474cc240acd4d518f43))

## [0.24.3](https://github.com/elyukai/optolith-database-schema/compare/v0.24.2...v0.24.3) (2025-12-09)


### Features

* add raw value option to elixirs ([f14ecf0](https://github.com/elyukai/optolith-database-schema/commit/f14ecf01b4eb6acbaee8b27abb95e9907a41aed4)), closes [#84](https://github.com/elyukai/optolith-database-schema/issues/84)


### Bug Fixes

* profession variants could not be entered ([df21ff3](https://github.com/elyukai/optolith-database-schema/commit/df21ff3e992c9976a5111de1a46f644f26f8c122))

## [0.24.2](https://github.com/elyukai/optolith-database-schema/compare/v0.24.1...v0.24.2) (2025-12-09)


### Features

* add input option to advanced combat special abilities ([254f683](https://github.com/elyukai/optolith-database-schema/commit/254f683dd219ba8dfefffb30568e7898cbebb974)), closes [#80](https://github.com/elyukai/optolith-database-schema/issues/80)
* add one blunt side as an option for specific combat techniques ([18e2059](https://github.com/elyukai/optolith-database-schema/commit/18e2059118f1f1ba8af443d5d40636a6e4ceafab)), closes [#79](https://github.com/elyukai/optolith-database-schema/issues/79)
* add personality trait prerequisite to personality traits ([5f521c1](https://github.com/elyukai/optolith-database-schema/commit/5f521c113d0ae1932062d086747dd4cf21b37124)), closes [#83](https://github.com/elyukai/optolith-database-schema/issues/83)
* add tradition artifact entities for achaz ([b071ac9](https://github.com/elyukai/optolith-database-schema/commit/b071ac927a28bd1aee38a354406145a4e86bbb03)), closes [#81](https://github.com/elyukai/optolith-database-schema/issues/81)
* modification level translation in display name ([6995b8c](https://github.com/elyukai/optolith-database-schema/commit/6995b8cebd943be4742e545c93e54208362f2e9c))
* optional weight for gems and precious stones ([7e93d95](https://github.com/elyukai/optolith-database-schema/commit/7e93d95232efc17b005edf3100788287e42bdc62)), closes [#78](https://github.com/elyukai/optolith-database-schema/issues/78)


### Bug Fixes

* achaz enchantments as select option parent ([71f9d59](https://github.com/elyukai/optolith-database-schema/commit/71f9d5981bd566189713dc2c46b32bdcb0f272d1))

## [0.24.1](https://github.com/elyukai/optolith-database-schema/compare/v0.24.0...v0.24.1) (2025-12-08)


### Features

* add and adjust translation strings ([5cd59ca](https://github.com/elyukai/optolith-database-schema/commit/5cd59ca6ce600c0ffbc62ef49e0609cc02cfd3d2))


### Bug Fixes

* double name ([d2b8a44](https://github.com/elyukai/optolith-database-schema/commit/d2b8a4450dc032c3411190b58bea9c1ee7df94d7))
* fixed blessing range without values ([0751823](https://github.com/elyukai/optolith-database-schema/commit/075182370c4ed81ea30af1c8552aa95fcd2aa669))

## [0.24.0](https://github.com/elyukai/optolith-database-schema/compare/v0.23.2...v0.24.0) (2025-12-05)


### ⚠ BREAKING CHANGES

* The prerequisites field is moved from profession
versions to profession packages.

### Bug Fixes

* arcane traditions and elements can be requirable select options ([d1c9795](https://github.com/elyukai/optolith-database-schema/commit/d1c9795e8378b8f7da69e47491c48df6514661a8))
* profession prerequisites can differ per profession version ([08a7d8d](https://github.com/elyukai/optolith-database-schema/commit/08a7d8d2c88beff69ea7b4d68995b1eb6d2528a6))

## [0.23.2](https://github.com/elyukai/optolith-database-schema/compare/v0.23.1...v0.23.2) (2025-12-04)


### Bug Fixes

* use correct identifiers in restrictions ([9392990](https://github.com/elyukai/optolith-database-schema/commit/9392990109296bc4cfbc5116c8fa5360efd4a02d))

## [0.23.1](https://github.com/elyukai/optolith-database-schema/compare/v0.23.0...v0.23.1) (2025-12-04)


### Bug Fixes

* restore removed magical artifact translation properties ([d4b8ad3](https://github.com/elyukai/optolith-database-schema/commit/d4b8ad3bd854b32d2a6b05d1e79837c210910d4b))

## [0.23.0](https://github.com/elyukai/optolith-database-schema/compare/v0.22.0...v0.23.0) (2025-12-04)


### ⚠ BREAKING CHANGES

* **gen:** duplicate translation postfix
* This removes previous note and rules fields.
* add map and permanent cost options to magical signs
* add item restrictions to equipment of blessed ones
* unify item restrictions and add profession restrictions
* translation keys follow Unicode MessageFormat 2.0

### Features

* add expression-based poison duration option ([fcb30ba](https://github.com/elyukai/optolith-database-schema/commit/fcb30ba06b93924ce9399ea5481b98bd2689b229)), closes [#70](https://github.com/elyukai/optolith-database-schema/issues/70)
* add item restrictions to armor ([6a14e81](https://github.com/elyukai/optolith-database-schema/commit/6a14e811fe71e2f6ade006572d4ba4740cc7b4cd)), closes [#68](https://github.com/elyukai/optolith-database-schema/issues/68)
* add item restrictions to equipment of blessed ones ([d2418f4](https://github.com/elyukai/optolith-database-schema/commit/d2418f4036c52d5cf972208c67ecf1229e883c85)), closes [#72](https://github.com/elyukai/optolith-database-schema/issues/72)
* add map and permanent cost options to magical signs ([6958dd7](https://github.com/elyukai/optolith-database-schema/commit/6958dd7f7bda88027d38ba2a3de75a0c645ff7f7)), closes [#75](https://github.com/elyukai/optolith-database-schema/issues/75)
* add structure points option to some item categories ([6281812](https://github.com/elyukai/optolith-database-schema/commit/62818120f9e849ba7e95f3a68a3f00758fb8a514)), closes [#76](https://github.com/elyukai/optolith-database-schema/issues/76)
* add translatable intoxicant addiction chance ([bd6fc3c](https://github.com/elyukai/optolith-database-schema/commit/bd6fc3c1448c4b6a221603f33197d8b44a743509)), closes [#71](https://github.com/elyukai/optolith-database-schema/issues/71)
* allow penalty for combat style special abilities ([90ca20f](https://github.com/elyukai/optolith-database-schema/commit/90ca20f52f806824325a916b8a89f46070db941a)), closes [#77](https://github.com/elyukai/optolith-database-schema/issues/77)
* optional intoxicant overdose ([90d3adc](https://github.com/elyukai/optolith-database-schema/commit/90d3adc6f4a214f3a4178fb402becc446984005d)), closes [#69](https://github.com/elyukai/optolith-database-schema/issues/69)
* translation keys follow Unicode MessageFormat 2.0 ([b651562](https://github.com/elyukai/optolith-database-schema/commit/b651562db13d1531d160f8d3288485a04f9bfa3e))
* unify item restrictions and add profession restrictions ([5611ba5](https://github.com/elyukai/optolith-database-schema/commit/5611ba54402ce6ac401d40160513b3db70327d8d)), closes [#51](https://github.com/elyukai/optolith-database-schema/issues/51)
* use description, effect and cost for magical artifact ([a7988fc](https://github.com/elyukai/optolith-database-schema/commit/a7988fc426ad76f4b876071b4cde05b11d523212)), closes [#74](https://github.com/elyukai/optolith-database-schema/issues/74)


### Bug Fixes

* **gen:** duplicate translation postfix ([772da37](https://github.com/elyukai/optolith-database-schema/commit/772da37386622cff0a1ab4954a392eeaca1ac72a))

## [0.22.0](https://github.com/elyukai/optolith-database-schema/compare/v0.21.2...v0.22.0) (2025-12-01)


### ⚠ BREAKING CHANGES

* Previous lists of values by level need to be wrapped in
an object.

### Features

* add two-handed option to combat technique restriction ([92d9269](https://github.com/elyukai/optolith-database-schema/commit/92d9269a923ccaa9a99617c34de612947ddbcb88)), closes [#67](https://github.com/elyukai/optolith-database-schema/issues/67)
* allow magical signs having AE cost ([f8e53e7](https://github.com/elyukai/optolith-database-schema/commit/f8e53e7dc3645e19a24cc60f1257ccd33f8579d6)), closes [#53](https://github.com/elyukai/optolith-database-schema/issues/53)
* ap value may depend on (any) active instance ([80b726f](https://github.com/elyukai/optolith-database-schema/commit/80b726f945cd6fe4609dfc0b11195ee3801d6433)), closes [#49](https://github.com/elyukai/optolith-database-schema/issues/49)
* ap value per level based on size category ([43b86db](https://github.com/elyukai/optolith-database-schema/commit/43b86dbf6b6940b6352a69d2a5e9c2f2430e2516)), closes [#43](https://github.com/elyukai/optolith-database-schema/issues/43)
* enable automatic entries for advantages ([a3e3559](https://github.com/elyukai/optolith-database-schema/commit/a3e35594ccaf85a7d10db4425234bdf8adc7bca0))
* make magical sign property optional ([5d5db60](https://github.com/elyukai/optolith-database-schema/commit/5d5db60ce3dba9330ed1b6f63b8ceb9e8b4c393b)), closes [#52](https://github.com/elyukai/optolith-database-schema/issues/52)
* support levels for automatic entries ([dfd83bd](https://github.com/elyukai/optolith-database-schema/commit/dfd83bd28b68bf73df6936d566765f526b1879c4))


### Bug Fixes

* identifier access error ([782ae60](https://github.com/elyukai/optolith-database-schema/commit/782ae60ca8e20f9118448922946735313852fed8))

## [0.21.2](https://github.com/elyukai/optolith-database-schema/compare/v0.21.1...v0.21.2) (2025-11-30)


### Features

* allow three fraction digits for item weight ([9d2dc02](https://github.com/elyukai/optolith-database-schema/commit/9d2dc029c2a07ec3180b4d340ff5ea8afe67fcba))

## [0.21.1](https://github.com/elyukai/optolith-database-schema/compare/v0.21.0...v0.21.1) (2025-11-27)


### Features

* add trade secret option for diseases ([da69a79](https://github.com/elyukai/optolith-database-schema/commit/da69a793a65e7737505c4ff140f6be2132119d6c))
* add weight and complexity options to vehicles ([bfbf0c0](https://github.com/elyukai/optolith-database-schema/commit/bfbf0c017f0e7bd08bf0ebebe189a862796831ce)), closes [#59](https://github.com/elyukai/optolith-database-schema/issues/59)
* magical artifacts may define complexity and combat uses ([0a86d73](https://github.com/elyukai/optolith-database-schema/commit/0a86d7396b2fddd977e214ab8be283dd31353292)), closes [#62](https://github.com/elyukai/optolith-database-schema/issues/62)


### Bug Fixes

* ranged weapons may have a range of 0 ([fb34438](https://github.com/elyukai/optolith-database-schema/commit/fb3443816195b3079362d07c9bb3a261f98609c8)), closes [#63](https://github.com/elyukai/optolith-database-schema/issues/63)

## [0.21.0](https://github.com/elyukai/optolith-database-schema/compare/v0.20.6...v0.21.0) (2025-11-21)


### ⚠ BREAKING CHANGES

* patrons also work with tribes instead of plain cultures to align with animist powers

### Features

* allow race prerequisite for personality traits ([146723c](https://github.com/elyukai/optolith-database-schema/commit/146723c3e7f91e8c4b4e63b61df95c5a497ea117)), closes [#45](https://github.com/elyukai/optolith-database-schema/issues/45)
* allow trade secret for animal poisons ([8d14f89](https://github.com/elyukai/optolith-database-schema/commit/8d14f891dabad75b9ad1d37c98f1bf8b10c74d69))
* patrons also work with tribes instead of plain cultures to align with animist powers ([68b857a](https://github.com/elyukai/optolith-database-schema/commit/68b857afbefb0655a842cd86f5321f155054db7a)), closes [#47](https://github.com/elyukai/optolith-database-schema/issues/47)


### Bug Fixes

* always display child instances of activatable entries ([06b5443](https://github.com/elyukai/optolith-database-schema/commit/06b5443531c5b00fbf4b422aac9e2cdc6ea6ff14)), closes [#51](https://github.com/elyukai/optolith-database-schema/issues/51)
* cantrip note translations should be optional ([490a4eb](https://github.com/elyukai/optolith-database-schema/commit/490a4ebeeb728ec61e83193a6f84cd774625b777))

## [0.20.6](https://github.com/elyukai/optolith-database-schema/compare/v0.20.5...v0.20.6) (2025-11-16)


### Features

* focus rules and optional rules can require other focus rules or optional rules to be active ([797825b](https://github.com/elyukai/optolith-database-schema/commit/797825b6da46517b1f7a9e2f00f34b21c8bae15d))

## [0.20.5](https://github.com/elyukai/optolith-database-schema/compare/v0.20.4...v0.20.5) (2025-11-15)


### Features

* include translations in locales ([15b7d13](https://github.com/elyukai/optolith-database-schema/commit/15b7d13c1c64a62b5c3f6406a980cf6477b211db))

## [0.20.4](https://github.com/elyukai/optolith-database-schema/compare/v0.20.3...v0.20.4) (2025-11-15)


### Features

* generated typescript typings ([ace11a4](https://github.com/elyukai/optolith-database-schema/commit/ace11a4eea93665decc0070267e9a873aa856734))

## [0.20.3](https://github.com/elyukai/optolith-database-schema/compare/v0.20.2...v0.20.3) (2025-11-14)


### Bug Fixes

* enhancement display name ([f76c622](https://github.com/elyukai/optolith-database-schema/commit/f76c6225456d09817bb960ce041dd2bb121047e3))

## [0.20.2](https://github.com/elyukai/optolith-database-schema/compare/v0.20.1...v0.20.2) (2025-11-13)


### Bug Fixes

* wrong newspaper translation name ([278f214](https://github.com/elyukai/optolith-database-schema/commit/278f21449836143440d485ba350a8e60748fc3f1))

## [0.20.1](https://github.com/elyukai/optolith-database-schema/compare/v0.20.0...v0.20.1) (2025-11-13)


### Features

* add "various" case to armor complexity ([23d4294](https://github.com/elyukai/optolith-database-schema/commit/23d429466ac6eb34c8086c63abde93bfec5d354d)), closes [#21](https://github.com/elyukai/optolith-database-schema/issues/21)
* add newspaper entity ([6503ac1](https://github.com/elyukai/optolith-database-schema/commit/6503ac161b00c980695ea94a87d27ebbfcef7674)), closes [#40](https://github.com/elyukai/optolith-database-schema/issues/40)
* add supplemental content option to magical traditions to enable trailing tables ([2348130](https://github.com/elyukai/optolith-database-schema/commit/2348130ce28e6ddde64ff6304ae04d01a00573c8)), closes [elyukai/optolith-data#791](https://github.com/elyukai/optolith-data/issues/791)
* animal poison level may depend on the subtype of animal ([a2fb493](https://github.com/elyukai/optolith-database-schema/commit/a2fb493d251d733c13b1d22034c9b8e917e67d68)), closes [#38](https://github.com/elyukai/optolith-database-schema/issues/38)

## [0.20.0](https://github.com/elyukai/optolith-database-schema/compare/v0.19.1...v0.20.0) (2025-11-02)


### ⚠ BREAKING CHANGES

* align book type/category with official sources
* use book cost variant with single single costs as well to enable label usage

### Features

* add book category ([b3a88fa](https://github.com/elyukai/optolith-database-schema/commit/b3a88fa9ea417930c4c5249869f4153404570393))


### Bug Fixes

* align book type/category with official sources ([b89bda8](https://github.com/elyukai/optolith-database-schema/commit/b89bda8e670d1a46d6a5ea2f094401e458ce62f7))
* general select option display name customizer ([47b308b](https://github.com/elyukai/optolith-database-schema/commit/47b308b4b93deabb83aaec11b4036b9a70350a83))
* make definite book cost variant translations optional if label is not used ([79c4daa](https://github.com/elyukai/optolith-database-schema/commit/79c4daa3d50aa3468f0c72ef6a5736779c421039))
* use book cost variant with single single costs as well to enable label usage ([e3f9138](https://github.com/elyukai/optolith-database-schema/commit/e3f91381fe6d93525366e15c3d4073cda90821b8))

## [0.19.1](https://github.com/elyukai/optolith-database-schema/compare/v0.19.0...v0.19.1) (2025-10-27)


### Bug Fixes

* general special ability options and activatable instances in general should use child entity types instead of reference types ([5952ef2](https://github.com/elyukai/optolith-database-schema/commit/5952ef214d388e328b6a94364384eed712cefb13))

## [0.19.0](https://github.com/elyukai/optolith-database-schema/compare/v0.18.13...v0.19.0) (2025-10-27)


### ⚠ BREAKING CHANGES

* combineable binary math operators to specific adventure points value by active instances instead of fixed functions

### Features

* combineable binary math operators to specific adventure points value by active instances instead of fixed functions ([f11c1e1](https://github.com/elyukai/optolith-database-schema/commit/f11c1e1e07318ed5836d9964f3658335bf07d072))

## [0.18.13](https://github.com/elyukai/optolith-database-schema/compare/v0.18.12...v0.18.13) (2025-10-17)


### Features

* add options for adventure point multiplier expression ([7898b2d](https://github.com/elyukai/optolith-database-schema/commit/7898b2da788e386e74f75b9883638026900b3e95))

## [0.18.12](https://github.com/elyukai/optolith-database-schema/compare/v0.18.11...v0.18.12) (2025-10-17)


### Bug Fixes

* allow single range as a possible book cost value ([4e60943](https://github.com/elyukai/optolith-database-schema/commit/4e60943174213defe3ad006f64b18c359cc86469))

## [0.18.11](https://github.com/elyukai/optolith-database-schema/compare/v0.18.10...v0.18.11) (2025-10-17)


### Bug Fixes

* duplicate DefiniteBookCostVariant identifier ([3735381](https://github.com/elyukai/optolith-database-schema/commit/373538121fecbae58dfb02d782d23bbdc9a17029))

## [0.18.10](https://github.com/elyukai/optolith-database-schema/compare/v0.18.9...v0.18.10) (2025-10-17)


### Features

* books may have multiple cost values dependending on the edition or other factors ([bd4507d](https://github.com/elyukai/optolith-database-schema/commit/bd4507d2507e01e363dad831a50f87e691ed6087))
* trade secrets and activatable entries can have an adventure points value that is based on the number of active instances ([c575ec1](https://github.com/elyukai/optolith-database-schema/commit/c575ec11f7326902348956971bea73cf7e9b2cb9))
* trade secrets can have explicit select options ([48e5d3f](https://github.com/elyukai/optolith-database-schema/commit/48e5d3f8c688733227a8de5cc629b3878f949fcf))

## [0.18.9](https://github.com/elyukai/optolith-database-schema/compare/v0.18.8...v0.18.9) (2025-10-15)


### Features

* add alternative rule and player type entities ([034a2ed](https://github.com/elyukai/optolith-database-schema/commit/034a2ed6849a5581951fe1757c5c7179509f76bd))

## [0.18.8](https://github.com/elyukai/optolith-database-schema/compare/v0.18.7...v0.18.8) (2025-10-14)

## [0.18.7](https://github.com/elyukai/optolith-database-schema/compare/v0.18.6...v0.18.7) (2025-10-14)


### Bug Fixes

* additionalRules have to be optional ([1b42e26](https://github.com/elyukai/optolith-database-schema/commit/1b42e26383567195fc328fecedb760990b3ca6aa))

## [0.18.6](https://github.com/elyukai/optolith-database-schema/compare/v0.18.5...v0.18.6) (2025-10-14)


### Features

* add additionalRules to optional rules to separate box text from associated main text ([a7b1bed](https://github.com/elyukai/optolith-database-schema/commit/a7b1bed0fadc3d346b4962e1ba808eb2ac05e670))

## [0.18.5](https://github.com/elyukai/optolith-database-schema/compare/v0.18.4...v0.18.5) (2025-10-09)


### Bug Fixes

* duplicate identifier violations and non-existent display name ([0bd47d1](https://github.com/elyukai/optolith-database-schema/commit/0bd47d12b58cf47f804387443927c0d97acc7ce7))

## [0.18.4](https://github.com/elyukai/optolith-database-schema/compare/v0.18.3...v0.18.4) (2025-10-05)

## [0.18.3](https://github.com/elyukai/optolith-database-schema/compare/v0.18.2...v0.18.3) (2025-10-04)


### Bug Fixes

* include new equipment entities top-level in schema ([b3f7344](https://github.com/elyukai/optolith-database-schema/commit/b3f734484bbc52bea1f0a3542f3fccb1edfe66cf))

## [0.18.2](https://github.com/elyukai/optolith-database-schema/compare/v0.18.1...v0.18.2) (2025-10-04)


### Bug Fixes

* adjust for remaining incompatibilities with source data ([00a0efc](https://github.com/elyukai/optolith-database-schema/commit/00a0efc6d090171e83ff01236e8df146a120f71e))

## [0.18.1](https://github.com/elyukai/optolith-database-schema/compare/v0.18.0...v0.18.1) (2025-10-03)

## [0.18.0](https://github.com/elyukai/optolith-database-schema/compare/v0.17.2...v0.18.0) (2025-10-03)


### ⚠ BREAKING CHANGES

* tsondb integration
* use identifier object instead of plain number for publication prerequisite identifier
* adjust naming for compiles languages that dont create namespaces per file
* add blessed tradition type as union type

### Features

* add blessed tradition type as union type ([dd999c1](https://github.com/elyukai/optolith-database-schema/commit/dd999c1387d950fd27169c601f4653a1fd0273d6))
* add skill application identifier as possible select option identifier ([2523228](https://github.com/elyukai/optolith-database-schema/commit/25232282da57baf82d369bc80be703ae69df6f6d))
* add translation strings for prerequisites ([a031ad9](https://github.com/elyukai/optolith-database-schema/commit/a031ad93ea305c831fbb52498adecec3f9b3b2e1))
* adjust naming for compiles languages that dont create namespaces per file ([4236fa3](https://github.com/elyukai/optolith-database-schema/commit/4236fa38040bf034d27e942e66647462a1e15f3c))
* **swift:** add initializers to all structs ([fc79950](https://github.com/elyukai/optolith-database-schema/commit/fc79950428c62f0ca11d56299854f83a37d693c8))
* **swift:** add set of available locales and documentation for LocaleMap ([c247c06](https://github.com/elyukai/optolith-database-schema/commit/c247c067e4b38cf8b748fe1ab1228ecbf294b8cc))
* **swift:** do not generate ignored files ([6dd361a](https://github.com/elyukai/optolith-database-schema/commit/6dd361a16cea4488b4d7d34a86edbf673ea97d4b))
* **swift:** remove generation date header comment ([9db2fd5](https://github.com/elyukai/optolith-database-schema/commit/9db2fd59894a692a8443592e8247251f55913e73))
* tsondb integration ([619805c](https://github.com/elyukai/optolith-database-schema/commit/619805ccfb3771962cc5e987f80b51a5dcf56c09)), closes [#35](https://github.com/elyukai/optolith-database-schema/issues/35)


### Bug Fixes

* **swift:** add ignored LocaleMap type ([f80bbaa](https://github.com/elyukai/optolith-database-schema/commit/f80bbaa8289c9053ae31867564a072cf7bd506a0))
* **swift:** identifier objects' initializers must be public ([8f2be47](https://github.com/elyukai/optolith-database-schema/commit/8f2be474440a00c37d4aee8f6eb4cceba2dbf8ee))
* **swift:** LocaleMap initializer didnt initialize all properties ([f5167bb](https://github.com/elyukai/optolith-database-schema/commit/f5167bb56586e88d970cf893e5ea077bc41e1113))
* **swift:** remove unnecessary indentation in empty lines ([dbe1902](https://github.com/elyukai/optolith-database-schema/commit/dbe19027a05a9834fc00cc2fcb1892fca1fd74fe))
* use identifier object instead of plain number for publication prerequisite identifier ([bb7a688](https://github.com/elyukai/optolith-database-schema/commit/bb7a688b019fc95070bb7aaf4246a6d64d0de91a))

### [0.17.2](https://github.com/elyukai/optolith-database-schema/compare/v0.17.1...v0.17.2) (2024-10-06)

### [0.17.1](https://github.com/elyukai/optolith-database-schema/compare/v0.17.0...v0.17.1) (2024-10-06)


### Features

* add minimum and maximum UI strings with placeholders ([1bf8df1](https://github.com/elyukai/optolith-database-schema/commit/1bf8df1575c605b50d2990ed5cd85892d871ecba))
* add pluralization type definitions ([a8340e6](https://github.com/elyukai/optolith-database-schema/commit/a8340e6dd488945b63347a80de0f54f5eb5050e8))
* use @optolith/helpers package ([d8324f7](https://github.com/elyukai/optolith-database-schema/commit/d8324f7042f459201452704bffa3c06e1ec582fe))

## [0.17.0](https://github.com/elyukai/optolith-database-schema/compare/v0.16.8...v0.17.0) (2024-10-03)


### ⚠ BREAKING CHANGES

* add translations for library entries of spellworks and liturgical chants

### Features

* add translations for library entries of spellworks and liturgical chants ([223a469](https://github.com/elyukai/optolith-database-schema/commit/223a469a63b44d0204d762b17905d622d7b6b9a2))

### [0.16.8](https://github.com/elyukai/optolith-database-schema/compare/v0.16.7...v0.16.8) (2024-03-01)


### Bug Fixes

* add slash to protective and warding circle key ([ef91f89](https://github.com/elyukai/optolith-database-schema/commit/ef91f897ad56db97f93a76958fab8dd69121830c))

### [0.16.7](https://github.com/elyukai/optolith-database-schema/compare/v0.16.6...v0.16.7) (2024-03-01)

### [0.16.6](https://github.com/elyukai/optolith-database-schema/compare/v0.16.5...v0.16.6) (2024-03-01)


### Features

* add special ability group translations ([5b95dd5](https://github.com/elyukai/optolith-database-schema/commit/5b95dd52e1ef9124da51b38bc1263b44f85740fa))

### [0.16.5](https://github.com/elyukai/optolith-database-schema/compare/v0.16.4...v0.16.5) (2024-02-29)


### Features

* add missing activatable and rated identifiers ([a34676b](https://github.com/elyukai/optolith-database-schema/commit/a34676b3c3a7d91621d285447eb913d6888e2c8e))
* convert many used keys to their english fallback and add some new keys ([ae07fd2](https://github.com/elyukai/optolith-database-schema/commit/ae07fd2b6def34c4a5269202a9ac3a3b8e735b37))


### Bug Fixes

* add missing identifier handling to magical and blessed advantages and disadvantages cache ([eba871a](https://github.com/elyukai/optolith-database-schema/commit/eba871a0e7ea803775a30c01e2d2c278bd60856f))
* applications and uses for select options ([c21b851](https://github.com/elyukai/optolith-database-schema/commit/c21b8512817204129a9213b330abc811b64dad13))

### [0.16.4](https://github.com/elyukai/optolith-database-schema/compare/v0.16.3...v0.16.4) (2024-01-21)


### Features

* magical and blessed advantages and disadvantages identifier cache ([4dc6e3d](https://github.com/elyukai/optolith-database-schema/commit/4dc6e3dec721019af728db6b68138498da4b1775))

### [0.16.3](https://github.com/elyukai/optolith-database-schema/compare/v0.16.2...v0.16.3) (2024-01-18)


### Bug Fixes

* resolve intersection types ([829da00](https://github.com/elyukai/optolith-database-schema/commit/829da0079a60693dbeec94cbfb02b447c5105da5))

### [0.16.2](https://github.com/elyukai/optolith-database-schema/compare/v0.16.1...v0.16.2) (2024-01-18)


### Bug Fixes

* update build artifacts ([cb11b32](https://github.com/elyukai/optolith-database-schema/commit/cb11b322783236738eee3541e1ac3165ab172c1c))

### [0.16.1](https://github.com/elyukai/optolith-database-schema/compare/v0.16.0...v0.16.1) (2024-01-16)

## [0.16.0](https://github.com/elyukai/optolith-database-schema/compare/v0.15.5...v0.16.0) (2024-01-12)


### ⚠ BREAKING CHANGES

* remove GenericIdentifier in favor of GeneralIdentifier

### Bug Fixes

* remove GenericIdentifier in favor of GeneralIdentifier ([aea4586](https://github.com/elyukai/optolith-database-schema/commit/aea4586074ff4d4a1e7441e0149b3671bbb3de00))

### [0.15.5](https://github.com/elyukai/optolith-database-schema/compare/v0.15.4...v0.15.5) (2024-01-12)

### [0.15.4](https://github.com/elyukai/optolith-database-schema/compare/v0.15.3...v0.15.4) (2024-01-12)


### Features

* add possible and requirable select option identifiers ([0ee088a](https://github.com/elyukai/optolith-database-schema/commit/0ee088a01b98e2f8828303d43f40ac8143db1eac))
* add pre-generated select options for activatable entries as cache ([3fdcaf2](https://github.com/elyukai/optolith-database-schema/commit/3fdcaf2a95623e751993c1e696f2b269acbc7594))


### Bug Fixes

* add missing vampiric gift identifier to activatable identifier group ([98316b6](https://github.com/elyukai/optolith-database-schema/commit/98316b63a9b9e7dd00939d596621a3b5782e2d2e))
* wrong identifier references in select option config ([a70a7ea](https://github.com/elyukai/optolith-database-schema/commit/a70a7ea4a02ecbcb5167ab13b1e3a1d75c327e3f))

### [0.15.3](https://github.com/elyukai/optolith-database-schema/compare/v0.15.2...v0.15.3) (2024-01-09)


### Features

* **cache:** add ancestor blood advantages list as cache ([8f06497](https://github.com/elyukai/optolith-database-schema/commit/8f0649704670264a10acd4985311345b8f80c45a))

### [0.15.2](https://github.com/elyukai/optolith-database-schema/compare/v0.15.1...v0.15.2) (2024-01-08)


### Bug Fixes

* rated sum targets should only be skill identifiers ([7247292](https://github.com/elyukai/optolith-database-schema/commit/7247292c9e8f47bca7d0e96e139b77eeeaa6a08a))

### [0.15.1](https://github.com/elyukai/optolith-database-schema/compare/v0.15.0...v0.15.1) (2024-01-06)


### Features

* group abbreviated and full adventure points translations with and without preceding value ([b0e0bdd](https://github.com/elyukai/optolith-database-schema/commit/b0e0bddf32326bd3529f7ed15e7a416ba6da21ea))

## [0.15.0](https://github.com/elyukai/optolith-database-schema/compare/v0.14.0...v0.15.0) (2023-12-29)


### ⚠ BREAKING CHANGES

* convert core rule identifier to plain integer

### Features

* type config type includes type name literal ([04a57e8](https://github.com/elyukai/optolith-database-schema/commit/04a57e8bc4063444c66d118938fe9b011a0b7448))


* convert core rule identifier to plain integer ([d6395ea](https://github.com/elyukai/optolith-database-schema/commit/d6395ea8f5c105596e3ce68f5212e0e44550bfe2))

## [0.14.0](https://github.com/elyukai/optolith-database-schema/compare/v0.13.8...v0.14.0) (2023-12-27)


### ⚠ BREAKING CHANGES

* remove equipment category Alchemicum

### Features

* add optional "notes" field to poison translation ([0cf9d98](https://github.com/elyukai/optolith-database-schema/commit/0cf9d988907734b89119cf6d9e3a3d480199128f)), closes [#28](https://github.com/elyukai/optolith-database-schema/issues/28)
* add poison duration type "instant" ([0581049](https://github.com/elyukai/optolith-database-schema/commit/0581049f282988ca5a24ff4ba219310003061d59))


### Bug Fixes

* add elixir identifier ([98993f7](https://github.com/elyukai/optolith-database-schema/commit/98993f7c351fc647cbe6982276cebab0e014ec44))
* remove equipment category Alchemicum ([95768f3](https://github.com/elyukai/optolith-database-schema/commit/95768f30131b9c4e3f66f01950b6c7ea6f9ccfff)), closes [#32](https://github.com/elyukai/optolith-database-schema/issues/32)
* weapons should require a complexity ([7ad54e1](https://github.com/elyukai/optolith-database-schema/commit/7ad54e1c16e8782072d543450a27a5572ab875ed))

### [0.13.8](https://github.com/elyukai/optolith-database-schema/compare/v0.13.7...v0.13.8) (2023-12-07)

### [0.13.7](https://github.com/elyukai/optolith-database-schema/compare/v0.13.6...v0.13.7) (2023-12-05)

### [0.13.6](https://github.com/elyukai/optolith-database-schema/compare/v0.13.5...v0.13.6) (2023-12-05)

### [0.13.5](https://github.com/elyukai/optolith-database-schema/compare/v0.13.4...v0.13.5) (2023-12-05)

### [0.13.4](https://github.com/elyukai/optolith-database-schema/compare/v0.13.3...v0.13.4) (2023-12-01)


### Bug Fixes

* make complexity optional for natural weapons ([13a3b53](https://github.com/elyukai/optolith-database-schema/commit/13a3b530f4cabf4c644c7ded8b020cef21df9013))
* musical instruments may have a complexity and combat use ([8e6dab0](https://github.com/elyukai/optolith-database-schema/commit/8e6dab0907af7d11f32631c00f8abc4178157492))

### [0.13.3](https://github.com/elyukai/optolith-database-schema/compare/v0.13.2...v0.13.3) (2023-11-01)


### Features

* ajv configuration options ([0c5ba39](https://github.com/elyukai/optolith-database-schema/commit/0c5ba3981e44edc120fcab237ecf8aa31af7a5ad))

### [0.13.2](https://github.com/elyukai/optolith-database-schema/compare/v0.13.1...v0.13.2) (2023-10-31)

### [0.13.1](https://github.com/elyukai/optolith-database-schema/compare/v0.13.0...v0.13.1) (2023-10-31)


### Features

* add strings for main window and spellwork/magical action categories ([0fe96bc](https://github.com/elyukai/optolith-database-schema/commit/0fe96bcb9f300dddd21f8f9d02826e4c7e2cee31))
* translation strings can vary by operating system ([952a0aa](https://github.com/elyukai/optolith-database-schema/commit/952a0aa5bcc8296f15837270d54456e08b2d89b2))

## [0.13.0](https://github.com/elyukai/optolith-database-schema/compare/v0.12.1...v0.13.0) (2023-10-03)


### ⚠ BREAKING CHANGES

* change and add lots of new translations with new key format
* replace all enums with union types to enable type-only usage

### Features

* cache capability ([45cf7bf](https://github.com/elyukai/optolith-database-schema/commit/45cf7bfd3e43f2786926633b0c5e2eee8982d965))
* change and add lots of new translations with new key format ([3068ee9](https://github.com/elyukai/optolith-database-schema/commit/3068ee94ed6a6d0a021704f92af18984d33bb53b))


### Bug Fixes

* typo in getFilenamePrefixAsNumericId ([802349e](https://github.com/elyukai/optolith-database-schema/commit/802349ea5b566682e0fb7bbd45811bda1800a686))


* replace all enums with union types to enable type-only usage ([fe5aa11](https://github.com/elyukai/optolith-database-schema/commit/fe5aa116f8fc922c3b6150d2bc663ddde5e8f104))

### [0.12.1](https://github.com/elyukai/optolith-database-schema/compare/v0.12.0...v0.12.1) (2023-06-11)


### Features

* provide function to get raw validation results ([c4bf451](https://github.com/elyukai/optolith-database-schema/commit/c4bf451195f7b754edf15ef43cd5363baafdd1d4))


### Bug Fixes

* use different file name validation patterns per type ([8e3915f](https://github.com/elyukai/optolith-database-schema/commit/8e3915f716823b971068018acba196b900fc390c))

## [0.12.0](https://github.com/elyukai/optolith-database-schema/compare/v0.11.9...v0.12.0) (2023-06-03)


### ⚠ BREAKING CHANGES

* rename header tab keys and add button names

### Features

* rename header tab keys and add button names ([79d8381](https://github.com/elyukai/optolith-database-schema/commit/79d8381c1b7dc4571edf8920a6e8db47dc560431))

### [0.11.9](https://github.com/elyukai/optolith-database-schema/compare/v0.11.8...v0.11.9) (2023-05-31)


### Bug Fixes

* move TypeId declaration to exported file ([940f567](https://github.com/elyukai/optolith-database-schema/commit/940f5674f64547c277f479e43df4d3b193e5489c))

### [0.11.8](https://github.com/elyukai/optolith-database-schema/compare/v0.11.7...v0.11.8) (2023-05-31)


### Bug Fixes

* **exports:** config exports did not match new folder structure ([dcb95e8](https://github.com/elyukai/optolith-database-schema/commit/dcb95e8ee0bd95006382bc6e62da245cc391986a))

### [0.11.7](https://github.com/elyukai/optolith-database-schema/compare/v0.11.6...v0.11.7) (2023-05-30)


### Bug Fixes

* restrict ValidResults types to each entity's type ([62b0eb0](https://github.com/elyukai/optolith-database-schema/commit/62b0eb0fda08b9885a1c8598cf653a168cfa93a8))

### [0.11.6](https://github.com/elyukai/optolith-database-schema/compare/v0.11.5...v0.11.6) (2023-05-28)

### [0.11.5](https://github.com/elyukai/optolith-database-schema/compare/v0.11.4...v0.11.5) (2023-05-27)

### [0.11.4](https://github.com/elyukai/optolith-database-schema/compare/v0.11.3...v0.11.4) (2023-05-27)

### [0.11.3](https://github.com/elyukai/optolith-database-schema/compare/v0.11.2...v0.11.3) (2023-05-27)

### [0.11.2](https://github.com/elyukai/optolith-database-schema/compare/v0.11.1...v0.11.2) (2023-05-27)

### [0.11.1](https://github.com/elyukai/optolith-database-schema/compare/v0.11.0...v0.11.1) (2023-05-27)

## [0.11.0](https://github.com/elyukai/optolith-database-schema/compare/v0.10.1...v0.11.0) (2023-05-27)


### ⚠ BREAKING CHANGES

* add integrity validation capabilities
* use exports field in package.json

### Features

* add integrity validation capabilities ([d39110e](https://github.com/elyukai/optolith-database-schema/commit/d39110ea320348260d690bdf9f8d19734709c10c))


### build

* use exports field in package.json ([771682a](https://github.com/elyukai/optolith-database-schema/commit/771682abca14539ead8b714c2f931be570426f85))

### [0.10.1](https://github.com/elyukai/optolith-database-schema/compare/v0.10.0...v0.10.1) (2023-05-01)

## [0.10.0](https://github.com/elyukai/optolith-database-schema/compare/v0.9.0...v0.10.0) (2023-05-01)


### ⚠ BREAKING CHANGES

* finish schema

### Features

* finish schema ([0ea6a83](https://github.com/elyukai/optolith-database-schema/commit/0ea6a838e22651b0e24708dcb10143db3c4300ca))
* sort errors by file path, with numbers in ascending order ([abc0bb1](https://github.com/elyukai/optolith-database-schema/commit/abc0bb13fd1d8d72237725ea37031c5697adaab9))


### Bug Fixes

* allow numbers in names ([4f6b2ae](https://github.com/elyukai/optolith-database-schema/commit/4f6b2aea2dba9a92a77b2667ed98617c233bbef1))
* ignore hidden files ([230326f](https://github.com/elyukai/optolith-database-schema/commit/230326ff25c3faee88f614c3380396070efb1516))
* the file name id may be 0 for custom entries ([8b1144e](https://github.com/elyukai/optolith-database-schema/commit/8b1144e6f13b46a9ef5aa1824d987ab70cfb8a95))
* uppercase letters should be allowed after the first letter ([50b2020](https://github.com/elyukai/optolith-database-schema/commit/50b2020bd6ed81c44d944cb8048b966c72b8fb38))

## [0.9.0](https://github.com/elyukai/optolith-database-schema/compare/v0.8.1...v0.9.0) (2023-01-14)


### ⚠ BREAKING CHANGES

* make protective/warding circle cost language-independent
* change magical rune options to explicit options

### Features

* add trinkhornzauber identifier to applying identifier groups ([f6671e3](https://github.com/elyukai/optolith-database-schema/commit/f6671e31bd94a8a6600e17dc448e619be2e30d74))
* change magical rune options to explicit options ([a8c45d1](https://github.com/elyukai/optolith-database-schema/commit/a8c45d148d8ad5060b3d60536b11c39673fb01ab))
* magical signs ([4517d64](https://github.com/elyukai/optolith-database-schema/commit/4517d64bdafd1800074bac684053abbdc104518e))
* make protective/warding circle cost language-independent ([27640a6](https://github.com/elyukai/optolith-database-schema/commit/27640a695050597ba910331ab1e35094a0f827f2))


### Bug Fixes

* advanced special ability OneOf option should allow and required multiple options ([0e5bbd4](https://github.com/elyukai/optolith-database-schema/commit/0e5bbd485da7843f810e092883c03c12dced1e57))
* make cost optional for all tradition arfifact enchantments ([6025485](https://github.com/elyukai/optolith-database-schema/commit/60254855e2e236f328d1f1480b009f322b0881d9))
* some tradition properties have to be optional ([687665d](https://github.com/elyukai/optolith-database-schema/commit/687665d0a0699e8ee25d2f378cb3b041384173bb))
* translation was not embedded in locale map ([a395778](https://github.com/elyukai/optolith-database-schema/commit/a39577830351b36595a06c247234fac3a3d499b1))
* wand enchantments dont use volume ([1a3f34a](https://github.com/elyukai/optolith-database-schema/commit/1a3f34a3880fb19ab6fbe7cc7a481e2deb7bab9a))

### [0.8.1](https://github.com/elyukai/optolith-database-schema/compare/v0.8.0...v0.8.1) (2023-01-08)


### Features

* allow minimum total for countable cost for sustained skills ([448978f](https://github.com/elyukai/optolith-database-schema/commit/448978f3815e721bb69e5315b61f5d5b0e3854e2))
* allow only casting time during lovemaking to be present ([9be75fe](https://github.com/elyukai/optolith-database-schema/commit/9be75fe9372c9ef40bca914d2659b3b026f543d9))
* allow to restrict advanced special ability to aspect option ([21289fe](https://github.com/elyukai/optolith-database-schema/commit/21289fe81d3b81648eb65e8d459a3d6f71d984ab))
* use summoning and creation difficulty as possible skill check penalties ([5756ecd](https://github.com/elyukai/optolith-database-schema/commit/5756ecd33fe1c32f28b31d0afa88e1f45658a0be))


### Bug Fixes

* optional language specializations ([2ead215](https://github.com/elyukai/optolith-database-schema/commit/2ead215fc1bcb870ecec8a7f88a48bc7d09136b3))

## [0.8.0](https://github.com/elyukai/optolith-database-schema/compare/v0.7.0...v0.8.0) (2023-01-03)


### ⚠ BREAKING CHANGES

* remove none option from cost, do not use property instead
* use simple boolean to indicate implementation availability

### Features

* add interval cost option ([6643594](https://github.com/elyukai/optolith-database-schema/commit/66435948fb567e161e6ab3ecc8e416e9cbef3441))


### Bug Fixes

* add missing KrallenkettenzauberIdentifier and add to associated groups ([2f18a75](https://github.com/elyukai/optolith-database-schema/commit/2f18a75e4bd61f31e8cf0f62de46685c18cc603b))
* RatedIdentifier used wrong SkillIdentifier ([c528f34](https://github.com/elyukai/optolith-database-schema/commit/c528f34f10bda702d5adf5f2e6fd4948a98b9f62))


* remove none option from cost, do not use property instead ([4a1cc06](https://github.com/elyukai/optolith-database-schema/commit/4a1cc062aaa47715d54922545cb1477567416cf0))
* use simple boolean to indicate implementation availability ([4282ef3](https://github.com/elyukai/optolith-database-schema/commit/4282ef3d7567919012f65197b4bc9c94176e5720))

## [0.7.0](https://github.com/elyukai/optolith-database-schema/compare/v0.6.0...v0.7.0) (2022-12-25)


### ⚠ BREAKING CHANGES

* `restricted_to_traditions` should only apply to magical traditions
* familiar's tricks may have life point cost

### Features

* familiar's tricks may have life point cost ([d428bd3](https://github.com/elyukai/optolith-database-schema/commit/d428bd3384a3d707f95f842198d86d6d6e5a7a6c))
* sustained familiar's tricks may not have a sustaining interval ([178374d](https://github.com/elyukai/optolith-database-schema/commit/178374df2742aae7f7efd6bfdd13d61402e16b88))


### Bug Fixes

* missing item cost variants ([608fd16](https://github.com/elyukai/optolith-database-schema/commit/608fd16379484de96d2b6d49ea01f570ead946dd))
* wrong tag-complementing property for subject identifier ([036a219](https://github.com/elyukai/optolith-database-schema/commit/036a2192f2aff4698d4df25315a9c46babf6881f))


* `restricted_to_traditions` should only apply to magical traditions ([a182e6c](https://github.com/elyukai/optolith-database-schema/commit/a182e6ccf9bdf5da327b48ff43e88375517da90f))

## [0.6.0](https://github.com/elyukai/optolith-database-schema/compare/v0.5.4...v0.6.0) (2022-12-10)


### ⚠ BREAKING CHANGES

* rename common ingredients to typical ingredients

### Features

* prerequisite disjunctions may have a display option ([36e9ceb](https://github.com/elyukai/optolith-database-schema/commit/36e9ceb26b52f673e13ea2323cb9a3283dc21586))
* weapons can be restricted to traditions during character creation ([5e085d2](https://github.com/elyukai/optolith-database-schema/commit/5e085d2258e6232e829f9e21cc7823d14ef42322))


### Bug Fixes

* duration variant key convention ([dc1a05e](https://github.com/elyukai/optolith-database-schema/commit/dc1a05ed27e3f97b2cfc2ccfdbe4c20160b0b711))
* fixed cost countable translation might not be compressable ([561b4ad](https://github.com/elyukai/optolith-database-schema/commit/561b4ad0f9b938539826f734f8c84d45cc1c4543))
* missing equipment packages source references ([ff3ae6c](https://github.com/elyukai/optolith-database-schema/commit/ff3ae6cbb52902e00ea13179a88bb9abd19d6663))


* rename common ingredients to typical ingredients ([aa7fb6e](https://github.com/elyukai/optolith-database-schema/commit/aa7fb6ed41a756d65637520095b58b6226f410c9))

### [0.5.4](https://github.com/elyukai/optolith-database-schema/compare/v0.5.3...v0.5.4) (2022-12-03)


### Bug Fixes

* elective spellwork restriction structure ([3ceb624](https://github.com/elyukai/optolith-database-schema/commit/3ceb6244ec433bb60fe292dde32d99ac93edccb2))
* grouped common profession for cultures ([df66943](https://github.com/elyukai/optolith-database-schema/commit/df66943aadfd297d773dda7d4a0a65c8b79095ce))

### [0.5.3](https://github.com/elyukai/optolith-database-schema/compare/v0.5.2...v0.5.3) (2022-12-03)


### Bug Fixes

* escaping curly braces in regular expression ([4f59611](https://github.com/elyukai/optolith-database-schema/commit/4f59611827d0948df7de32e73623cef858ad89c7))
* import resolving of types used in generic types ([592ade9](https://github.com/elyukai/optolith-database-schema/commit/592ade94fddc14bdda5bfcf8b3dc51c33f36f509))

### [0.5.2](https://github.com/elyukai/optolith-database-schema/compare/v0.5.1...v0.5.2) (2022-12-02)


### Bug Fixes

* validation error output type did not match type for error printing ([709f2f4](https://github.com/elyukai/optolith-database-schema/commit/709f2f46a68ff438cd158defddf93f508871eef9))

### [0.5.1](https://github.com/elyukai/optolith-database-schema/compare/v0.5.0...v0.5.1) (2022-12-02)


### Features

* explicit verbose error-printing option ([ebf055c](https://github.com/elyukai/optolith-database-schema/commit/ebf055c92302c5cfd80493dff1fd38276d05aa30))

## [0.5.0](https://github.com/elyukai/optolith-database-schema/compare/v0.4.1...v0.5.0) (2022-12-01)


### ⚠ BREAKING CHANGES

* explicit identifier tags, simpler prerequisites, multiple small changes

### Features

* equipment of blessed ones may be for multiple traditions ([3ffbfa2](https://github.com/elyukai/optolith-database-schema/commit/3ffbfa20cd40279091c71e7ef22496f6eab0f501))
* explicit identifier tags, simpler prerequisites, multiple small changes ([89ab7dd](https://github.com/elyukai/optolith-database-schema/commit/89ab7dd343db1027672b24c63216aba44f2db855))
* poisons and elixirs ([2552156](https://github.com/elyukai/optolith-database-schema/commit/2552156860ec527b568621dffa9ad6ebef1ae3e3))


### Bug Fixes

* import specifiers ([fddea8b](https://github.com/elyukai/optolith-database-schema/commit/fddea8bc62a6ab4ddfef0fcea082a73749152ad4))

### [0.4.1](https://github.com/elyukai/optolith-database-schema/compare/v0.4.0...v0.4.1) (2022-08-01)


### Bug Fixes

* not all ceremonial item special abilities have an aspect ([d99fc59](https://github.com/elyukai/optolith-database-schema/commit/d99fc59d786bef8951edd45db0a0c2d43c4a5ac3))
* require nested properties of enums with associated values ([ed8046e](https://github.com/elyukai/optolith-database-schema/commit/ed8046ea07acd5ae2b98bc901f688b4612d45ba6))

## [0.4.0](https://github.com/elyukai/optolith-database-schema/compare/v0.3.0...v0.4.0) (2022-08-01)


### ⚠ BREAKING CHANGES

* streamline enums with and without associated values

### Features

* adjust equipment item schemes based on example files ([a7344f2](https://github.com/elyukai/optolith-database-schema/commit/a7344f2faa8a414ca62586b884e7eb5892645fef))


* streamline enums with and without associated values ([a4685e3](https://github.com/elyukai/optolith-database-schema/commit/a4685e34999ada051117834fc17d19b41f5f3304))

## [0.3.0](https://github.com/elyukai/optolith-database-schema/compare/v0.2.4...v0.3.0) (2022-07-23)


### ⚠ BREAKING CHANGES

* rework equipment item data types
* rework tradition artifact enchantment data types
* rework special ability data types
* rename profession versions key and associated types
* rework magical actions data types
* rework prerequisite data types
* rework rule and source data types
* rework "top-level" data types

### Features

* add check for data file base name pattern ([45337c7](https://github.com/elyukai/optolith-database-schema/commit/45337c7d30cfc49b579b74aec1a4d99885ce5d29))
* add equipment item types to config ([9d68865](https://github.com/elyukai/optolith-database-schema/commit/9d688658224dcd225b617b7c83628180bf024af5))
* add printing file name errors ([7d97c65](https://github.com/elyukai/optolith-database-schema/commit/7d97c658ec0867e6bf06fc4011c58e176cd8d804))
* armor sturdiness rating ([a9be0ad](https://github.com/elyukai/optolith-database-schema/commit/a9be0ad34b1dd6b379d7929e2d453b535be46c24))
* differenciate between general animal care and animal feed ([fc813a0](https://github.com/elyukai/optolith-database-schema/commit/fc813a0325b5e90346958e3b0c1e8d44900d9e1f))
* include more rules for value presence in items into combat techniques ([5d7b4f7](https://github.com/elyukai/optolith-database-schema/commit/5d7b4f74518dfa7b4d3862d1388f586934d11c71))
* upgrade to json schema 2020-12 ([4131750](https://github.com/elyukai/optolith-database-schema/commit/413175042b009301e754f7cbe2c66029e74daddc))
* use json schema draft 2020-12 ([6d3781b](https://github.com/elyukai/optolith-database-schema/commit/6d3781b3ca24dc9ce9fb1f5db0b71781bf52d0ad))


### Bug Fixes

* attribute reference identifier maximum ([edc5447](https://github.com/elyukai/optolith-database-schema/commit/edc5447554ce2b897fa4ff89a19099f9112100cb))
* minor errors that surfaced during database conversion for dis/advantages, professions and talismans ([0b43558](https://github.com/elyukai/optolith-database-schema/commit/0b435585522b0d0f2760f75698660a25b488ab93))
* use json schema draft 2019-09 due to issues with yaml language server in vscode ([c406f15](https://github.com/elyukai/optolith-database-schema/commit/c406f15d284e86168eb2a5efccf43d66982171c8))


* rename profession versions key and associated types ([1c7a2bf](https://github.com/elyukai/optolith-database-schema/commit/1c7a2bf85a59a9a459502e0f119315c218e23688))
* rework "top-level" data types ([0f3d815](https://github.com/elyukai/optolith-database-schema/commit/0f3d815ea11fc1a9ff51fd376abfe463a110b322))
* rework equipment item data types ([0bb3a24](https://github.com/elyukai/optolith-database-schema/commit/0bb3a24af01e8869249ecd5a3c950e0f0855ca02))
* rework magical actions data types ([1e953f3](https://github.com/elyukai/optolith-database-schema/commit/1e953f304d16cd1228010a2523c1fbc4f45d1a31))
* rework prerequisite data types ([bdebfc3](https://github.com/elyukai/optolith-database-schema/commit/bdebfc3e1f538e33a70453c3125306b8433c88e5))
* rework rule and source data types ([cc2482f](https://github.com/elyukai/optolith-database-schema/commit/cc2482f9b67968f3ea16d4faf9944caebe14e15c))
* rework special ability data types ([b630525](https://github.com/elyukai/optolith-database-schema/commit/b630525b09f473b73b1550a5f3cf459ab61f682d))
* rework tradition artifact enchantment data types ([5346e17](https://github.com/elyukai/optolith-database-schema/commit/5346e1772e425c88269fee7e93b95af61668753d))

### [0.2.4](https://github.com/elyukai/optolith-database-schema/compare/v0.2.3...v0.2.4) (2022-03-30)


### Features

* add actions as duration unit ([5e64e38](https://github.com/elyukai/optolith-database-schema/commit/5e64e38dbbcda2980bb70a2b1c1b8d01b3a31324))
* add cantrips as target category ([ac4cf38](https://github.com/elyukai/optolith-database-schema/commit/ac4cf380bc96ea20c214938fd96eca1af28b3952))
* add notes to tradition notes of cantrips ([7b37327](https://github.com/elyukai/optolith-database-schema/commit/7b373271312324064b0bac824511248d07f4ffbe))
* guild mages tradition can be noted as common for in general ([df175d1](https://github.com/elyukai/optolith-database-schema/commit/df175d1f523fb9f09c0e672b4bc71437763f34b1))
* remove compressed paramater description option ([7897b72](https://github.com/elyukai/optolith-database-schema/commit/7897b723258d97c1c71dcfef422821657c8efea2))


### Bug Fixes

* compressed name should be optional ([7281f6a](https://github.com/elyukai/optolith-database-schema/commit/7281f6ae055588511dfdb4ebc186f5e492e823c8))
* cost needs to be required ([05fd208](https://github.com/elyukai/optolith-database-schema/commit/05fd2086642ee8781f1a33021f98333685234b50))

### [0.2.3](https://github.com/elyukai/optolith-database-schema/compare/v0.2.2...v0.2.3) (2022-03-29)


### Features

* allow dis-/advantages to not contribute to maximum AP value ([9e401d0](https://github.com/elyukai/optolith-database-schema/commit/9e401d0be40797a5758220233af6c162d1ce76fb))


### Bug Fixes

* state prerequisite should have unique tag ([7710fd5](https://github.com/elyukai/optolith-database-schema/commit/7710fd538582b85cd67cb81b2f791774102d17db))

### [0.2.2](https://github.com/elyukai/optolith-database-schema/compare/v0.2.1...v0.2.2) (2022-03-29)


### Features

* add offset option for deriving AP value from improvement cost ([f556207](https://github.com/elyukai/optolith-database-schema/commit/f55620751b7a68383c74ba8c4256d11802ab99c7))

### [0.2.1](https://github.com/elyukai/optolith-database-schema/compare/v0.2.0...v0.2.1) (2022-03-29)


### Bug Fixes

* category names and prerequisites should be defined separately ([eb312fe](https://github.com/elyukai/optolith-database-schema/commit/eb312fe2fc9973ef6be36937ebd8af8c8bf30e60))

## [0.2.0](https://github.com/elyukai/optolith-database-schema/compare/v0.1.28...v0.2.0) (2022-03-29)


### ⚠ BREAKING CHANGES

* derived select options are not a list anymore

* derived select options are not a list anymore ([fa64a60](https://github.com/elyukai/optolith-database-schema/commit/fa64a60670f0cdf5567a168f3a4eccd7ea71d367))

### [0.1.28](https://github.com/elyukai/optolith-database-schema/compare/v0.1.27...v0.1.28) (2022-03-25)


### Features

* allow skills in advanced special ability restrictions ([237dbbd](https://github.com/elyukai/optolith-database-schema/commit/237dbbdeddcc0df07387196ae2537a19c1deab16))
* items status quo ([c4b349b](https://github.com/elyukai/optolith-database-schema/commit/c4b349bf10fca92286c0510cab8ccb67563f0532))

### [0.1.27](https://github.com/elyukai/optolith-database-schema/compare/v0.1.26...v0.1.27) (2022-03-24)


### Bug Fixes

* maximum call stack size exceeded with ui schema ([a752342](https://github.com/elyukai/optolith-database-schema/commit/a752342708b2a3e4b98e57a0adcbfd9b449d02fe))

### [0.1.26](https://github.com/elyukai/optolith-database-schema/compare/v0.1.25...v0.1.26) (2022-03-24)


### Features

* animal diseases ([b7d2639](https://github.com/elyukai/optolith-database-schema/commit/b7d263942c14c76b6a3bfda780ecadf6cb7a60df))
* armor types ([c5b9a22](https://github.com/elyukai/optolith-database-schema/commit/c5b9a22e5c277a28a8bc0c8cbe3b0cc41235087d))
* diseases ([5e7c8a6](https://github.com/elyukai/optolith-database-schema/commit/5e7c8a6f83ce0b3f7c3854e759b8f042ed7451c8))
* item groups ([b2678ac](https://github.com/elyukai/optolith-database-schema/commit/b2678aca250d4666f7a894ddfc0fc9c3f6a22bcf))
* poisons ([fb9898f](https://github.com/elyukai/optolith-database-schema/commit/fb9898fbce8fcaaed0f83f8afe8fafeab8294a28))
* reaches ([9ed3937](https://github.com/elyukai/optolith-database-schema/commit/9ed39370410a3af29c585a3321c59e794dad70ae))
* ui status quo ([5cb5058](https://github.com/elyukai/optolith-database-schema/commit/5cb50581de6bb3c9a4ee7a89ae52a1dea957c8d8))

### [0.1.25](https://github.com/elyukai/optolith-database-schema/compare/v0.1.24...v0.1.25) (2022-03-23)


### Features

* add missing json schema definitions as placeholders ([28d2c6f](https://github.com/elyukai/optolith-database-schema/commit/28d2c6f2758fc090b4854eb8656613932841b252))

### [0.1.24](https://github.com/elyukai/optolith-database-schema/compare/v0.1.23...v0.1.24) (2022-03-23)


### Features

* add curriculum references and name additions ([468f96c](https://github.com/elyukai/optolith-database-schema/commit/468f96ce9af3b6f3135f959c9dc5d2646ea46e41))

### [0.1.23](https://github.com/elyukai/optolith-database-schema/compare/v0.1.22...v0.1.23) (2022-03-23)


### Features

* church influences ([81b96c4](https://github.com/elyukai/optolith-database-schema/commit/81b96c49bb365527bbbededc02afb227b80bff98))
* core rules ([3be09e3](https://github.com/elyukai/optolith-database-schema/commit/3be09e3707a198ff0697ccf9325e83037ebd6e32))
* equipment packages ([8fc29ef](https://github.com/elyukai/optolith-database-schema/commit/8fc29ef67ab8679f95234e30e19a49486a05b6fc))
* magical tradition placeholders# ([bfa1e18](https://github.com/elyukai/optolith-database-schema/commit/bfa1e18195b847925a8fd8d3e56b8ff130d8a584))
* profession male/female names and groups ([a38b0f4](https://github.com/elyukai/optolith-database-schema/commit/a38b0f4401444318b57bb163eb7192dd58b83d3d))
* talismans ([22a1a4f](https://github.com/elyukai/optolith-database-schema/commit/22a1a4f00985f70dba7d5b38f2f583263cf0389d))
* talismans support multiple traditions ([480779e](https://github.com/elyukai/optolith-database-schema/commit/480779e9c41efc6e5685b52cc45339bb04e94c97))
* update validation config to include latest new definitions ([bb9d856](https://github.com/elyukai/optolith-database-schema/commit/bb9d85685edee1eb3ac30589eb25e09c02bc36da))

### [0.1.22](https://github.com/elyukai/optolith-database-schema/compare/v0.1.21...v0.1.22) (2022-03-23)


### Features

* professions ([0b6ec67](https://github.com/elyukai/optolith-database-schema/commit/0b6ec6718daae4d09ad0ce562ca69fe55cca5d4c))

### [0.1.21](https://github.com/elyukai/optolith-database-schema/compare/v0.1.20...v0.1.21) (2022-03-22)


### Features

* personality traits ([d800133](https://github.com/elyukai/optolith-database-schema/commit/d80013327924376a13fdee0efcc7efdf6d84e616))

### [0.1.20](https://github.com/elyukai/optolith-database-schema/compare/v0.1.19...v0.1.20) (2022-03-22)


### Features

* services can be for multiple creature types ([1853485](https://github.com/elyukai/optolith-database-schema/commit/1853485aea88c38339b5ad5d3396aef7dc263888))

### [0.1.19](https://github.com/elyukai/optolith-database-schema/compare/v0.1.18...v0.1.19) (2022-03-21)


### Features

* add maximum and radius options to ranges ([2b7b579](https://github.com/elyukai/optolith-database-schema/commit/2b7b579e1ee3b82bb7d779e19c373935816ff8d8))

### [0.1.18](https://github.com/elyukai/optolith-database-schema/compare/v0.1.17...v0.1.18) (2022-03-21)


### Features

* animist powers can have prerequisites ([3fa06f4](https://github.com/elyukai/optolith-database-schema/commit/3fa06f41cbf84a0fbe54d51b5c2adb78d8c74129))
* derived animist power costs can have notes ([3ca4f3e](https://github.com/elyukai/optolith-database-schema/commit/3ca4f3edb30847fdf1878a8ed56943930be30d9d))


### Bug Fixes

* wrong discriminator for race prerequisite ([dea373f](https://github.com/elyukai/optolith-database-schema/commit/dea373f141a1a64f95dc8f33a3ecbfb0f7d51993))

### [0.1.17](https://github.com/elyukai/optolith-database-schema/compare/v0.1.16...v0.1.17) (2022-03-21)


### Bug Fixes

* duration value can be 1 ([9be3bdb](https://github.com/elyukai/optolith-database-schema/commit/9be3bdbc0e0b8502e7d0424f94eaf1b7b57091eb))
* zibilja rituals need their own custom parameters ([d60ee69](https://github.com/elyukai/optolith-database-schema/commit/d60ee693dda449d2b00d4f77dbef8d0a9e1e1e8b))

### [0.1.16](https://github.com/elyukai/optolith-database-schema/compare/v0.1.15...v0.1.16) (2022-03-17)


### Features

* support countable entities for ae cost of elven magical songs ([2feb0de](https://github.com/elyukai/optolith-database-schema/commit/2feb0deed85b7e823597560fd83523556a283642))


### Bug Fixes

* sex restriction of a name group from a culture should be optional ([e09f0b4](https://github.com/elyukai/optolith-database-schema/commit/e09f0b43d8b193303d67247a060fcaad8495a99f))

### [0.1.15](https://github.com/elyukai/optolith-database-schema/compare/v0.1.14...v0.1.15) (2022-03-16)


### Bug Fixes

* remove fields not present in cantrip ([132f37b](https://github.com/elyukai/optolith-database-schema/commit/132f37b211732c039f784e1279ff997f998d0be7))

### [0.1.14](https://github.com/elyukai/optolith-database-schema/compare/v0.1.13...v0.1.14) (2022-03-16)


### Bug Fixes

* multiple cantrip field definitions ([db26bb4](https://github.com/elyukai/optolith-database-schema/commit/db26bb4d540cc4eb497020302dde9cfdbe5c3950))

### [0.1.13](https://github.com/elyukai/optolith-database-schema/compare/v0.1.12...v0.1.13) (2022-03-16)


### Bug Fixes

* cantrip effects cannot have effects based on quality level ([2193205](https://github.com/elyukai/optolith-database-schema/commit/21932059554078f89e2322242cdfd44d7a956db0))

### [0.1.12](https://github.com/elyukai/optolith-database-schema/compare/v0.1.11...v0.1.12) (2022-03-16)

### [0.1.11](https://github.com/elyukai/optolith-database-schema/compare/v0.1.10...v0.1.11) (2022-03-16)


### Features

* add numeric ae cost field to ancestor glyphs ([d8e36d9](https://github.com/elyukai/optolith-database-schema/commit/d8e36d9a8a583cb57f72bbb4224ab8e10d7943c8))

### [0.1.10](https://github.com/elyukai/optolith-database-schema/compare/v0.1.9...v0.1.10) (2022-03-16)


### Bug Fixes

* main type refs and titles ([3abec4e](https://github.com/elyukai/optolith-database-schema/commit/3abec4e47ec3356d770d45c1e47ddb5c2e0fb9e4))

### [0.1.9](https://github.com/elyukai/optolith-database-schema/compare/v0.1.8...v0.1.9) (2022-03-16)


### Bug Fixes

* generator script should use new directories config location ([b83532b](https://github.com/elyukai/optolith-database-schema/commit/b83532bd9a84a20939dcbfd4d3f5fde060558f57))

### [0.1.8](https://github.com/elyukai/optolith-database-schema/compare/v0.1.7...v0.1.8) (2022-03-16)


### Bug Fixes

* **npm:** ship package directory config with npm ([dbf196c](https://github.com/elyukai/optolith-database-schema/commit/dbf196c105bad7d06d016af56242adbd867de20d))

### [0.1.7](https://github.com/elyukai/optolith-database-schema/compare/v0.1.6...v0.1.7) (2022-03-16)


### Features

* add basic validation utilities ([5676d39](https://github.com/elyukai/optolith-database-schema/commit/5676d39a3285901b750314832d7978692b1d26de))
* add validation by schema for all types ([b3578ef](https://github.com/elyukai/optolith-database-schema/commit/b3578ef7914db35dbdfda87e1ccf95d37f61e9d7))
* read magical actions ([543ef8e](https://github.com/elyukai/optolith-database-schema/commit/543ef8ee3567d4ec946f1be2492056d74de54976))


### Bug Fixes

* add extension to all relative module specifiers ([1a0b029](https://github.com/elyukai/optolith-database-schema/commit/1a0b029de43ce2026d9134b0f6dd3ee1f106afa2))
* relative links to top-level schema documents ([065efab](https://github.com/elyukai/optolith-database-schema/commit/065efab03a5b4547a9bdc2c1fcf4a3ad010d858e))

### [0.1.6](https://github.com/elyukai/optolith-database-schema/compare/v0.1.5...v0.1.6) (2022-03-11)

### [0.1.5](https://github.com/elyukai/optolith-database-schema/compare/v0.1.4...v0.1.5) (2022-03-10)


### Features

* prerequisites ([148ffd4](https://github.com/elyukai/optolith-database-schema/commit/148ffd47a70b9fb3a1bad540de8b89319a4f8c7d))
* select options for activatable entries ([9af975b](https://github.com/elyukai/optolith-database-schema/commit/9af975bcd1425f2a252ea41930233c3531376615))


### Bug Fixes

* exported name of select options ([5ecef02](https://github.com/elyukai/optolith-database-schema/commit/5ecef02d0178c7252f3b4a11d5ca0373908d6b87))
* keep deprecated penalty translation strings ([e4a8d91](https://github.com/elyukai/optolith-database-schema/commit/e4a8d910dd561255d21801616b2c44fcdd28a30f))
* keep deprecated translation strings for tradition artifact enchantments ([351146e](https://github.com/elyukai/optolith-database-schema/commit/351146ef87691d645a74d8f538d060095b8f7ac5))

### [0.1.4](https://github.com/elyukai/optolith-database-schema/compare/v0.1.3...v0.1.4) (2022-03-09)


### Features

* maximum activatable activations ([1750796](https://github.com/elyukai/optolith-database-schema/commit/175079672da1a692a2a2c49df86d818257af771a))
* tradition artifact enchantment arcane energy cost ([f71916c](https://github.com/elyukai/optolith-database-schema/commit/f71916cfa9fe5f32ad75cd7d9341c9fdef4cfba6))
* tradition artifact enchantment binding cost ([07c25fe](https://github.com/elyukai/optolith-database-schema/commit/07c25fe1b6330bba1698794d47abc6cb0dfae402))
* tradition artifact enchantment volume points ([5cc8ce6](https://github.com/elyukai/optolith-database-schema/commit/5cc8ce63c4eb6928faca5c6ed58cd7da9abb27cd))

### [0.1.3](https://github.com/elyukai/optolith-database-schema/compare/v0.1.2...v0.1.3) (2022-03-09)


### Features

* first concept of penalties for combat-related special abilities ([d79d3b3](https://github.com/elyukai/optolith-database-schema/commit/d79d3b3752252342795400c905e2944d1234bd37))


### Bug Fixes

* remove generic numeric identifier maximum ([e121081](https://github.com/elyukai/optolith-database-schema/commit/e1210810f9cdbf8a720d0e12d5ec6ac21010a8dd))

### [0.1.2](https://github.com/elyukai/optolith-database-schema/compare/v0.1.1...v0.1.2) (2022-03-09)


### Bug Fixes

* output for namespaced imports ([0bf0c9d](https://github.com/elyukai/optolith-database-schema/commit/0bf0c9d8713e0449342b2b01309eb38b3b1013a7))

### [0.1.1](https://github.com/elyukai/optolith-database-schema/compare/v0.1.0...v0.1.1) (2022-03-09)


### Features

* familiar's tricks ([f8f88c9](https://github.com/elyukai/optolith-database-schema/commit/f8f88c9ab3c3339c4e26830623052d09924c4102))
* trade secrets ([c834c31](https://github.com/elyukai/optolith-database-schema/commit/c834c31de87ce830d34c4cf9c0f60dcfb5a4d3ca))

## [0.1.0](https://github.com/elyukai/optolith-database-schema/compare/v0.0.4...v0.1.0) (2022-03-08)


### ⚠ BREAKING CHANGES

* extract tradition artifact enchantments and rituals
* export all prerequisites in another namespace

### Features

* advantages and disadvantages base ([c025bb6](https://github.com/elyukai/optolith-database-schema/commit/c025bb6b8ee6dc3007c0af3b691852a864ebdea6))
* animal shapes ([56b00f9](https://github.com/elyukai/optolith-database-schema/commit/56b00f90aff28f7cc8e8182f3f049d4593430113))
* brews ([03a785d](https://github.com/elyukai/optolith-database-schema/commit/03a785d3cfa8fab2da0a8fe1ddb402b2b5a3ab7d))
* continents ([95482db](https://github.com/elyukai/optolith-database-schema/commit/95482db5671440e24156c651ab094b4a10790223))
* languages ([b85c4f1](https://github.com/elyukai/optolith-database-schema/commit/b85c4f1bcaf5199cd1501051c17b05a8b5178345))
* patrons ([c7e9b6c](https://github.com/elyukai/optolith-database-schema/commit/c7e9b6cabdfdfca7d51eb6891bfb8b8b2973bbff))
* pluralization categories type for user interface ([a434d53](https://github.com/elyukai/optolith-database-schema/commit/a434d53a47e0e50b129855aee8e0a5bc4b634d79))
* scripts ([78a2e92](https://github.com/elyukai/optolith-database-schema/commit/78a2e92d72c0e2616948e9e2ccc1b51752be3b87))
* special abilities base ([f935264](https://github.com/elyukai/optolith-database-schema/commit/f935264328d19b29b0e30a0b1907501c30a2d4c5))


* export all prerequisites in another namespace ([4c09c3e](https://github.com/elyukai/optolith-database-schema/commit/4c09c3e3371beff4587327e40564866b397e311b))
* extract tradition artifact enchantments and rituals ([58e06c6](https://github.com/elyukai/optolith-database-schema/commit/58e06c6925bb56ea854ad211efcf89f981e715b7))

### [0.0.4](https://github.com/elyukai/optolith-database-schema/compare/v0.0.3...v0.0.4) (2022-03-06)


### Bug Fixes

* broken markdown newlines ([87c5ff2](https://github.com/elyukai/optolith-database-schema/commit/87c5ff243c6df1a9dd966167c85dd41b45c36369))
* cost map should allow different translations ([f65683f](https://github.com/elyukai/optolith-database-schema/commit/f65683fc45f2c9f16d1571ec9fcbc449eee042b1))

### [0.0.3](https://github.com/elyukai/optolith-database-schema/compare/v0.0.2...v0.0.3) (2022-03-05)


### Features

* blessings ([8586a40](https://github.com/elyukai/optolith-database-schema/commit/8586a4026615ff6ebdc6cfb1e988d71828e5cd23))
* cantrips ([50397e8](https://github.com/elyukai/optolith-database-schema/commit/50397e83c9322dd36ef0cd28d2924128a6133a27))
* pact categories ([7b9cbc6](https://github.com/elyukai/optolith-database-schema/commit/7b9cbc66a5f13b40536d03a90f726fd9aff8c15a))


### Bug Fixes

* liturgies do not have properties ([9b2c41d](https://github.com/elyukai/optolith-database-schema/commit/9b2c41dd9996abeac627b652cdb6ce0226760f2a))

### [0.0.2](https://github.com/elyukai/optolith-database-schema/compare/v0.0.1...v0.0.2) (2022-03-05)


### Features

* finish basic activatable skills ([ede33df](https://github.com/elyukai/optolith-database-schema/commit/ede33df9e897cb58f19f58c4e8d5619c2f9be0e0))

### 0.0.1 (2022-03-05)


### Features

* add combat techniques ([1fcfbbd](https://github.com/elyukai/optolith-database-schema/commit/1fcfbbd1ae7504c2f8d8d12e58aa77883c987bd3))
* add Condition ([eeb00eb](https://github.com/elyukai/optolith-database-schema/commit/eeb00eb5b349c3833bee9391996d3dfabd07cd95))
* add culture ([875afba](https://github.com/elyukai/optolith-database-schema/commit/875afba4b05a5ffbc0a2763ed69c53d6e6f2ac83))
* add derived characteristics ([c97f993](https://github.com/elyukai/optolith-database-schema/commit/c97f9932b4a329dd8620d7b61ff995e61e26f7ea))
* add ImprovementCost ([fb68fca](https://github.com/elyukai/optolith-database-schema/commit/fb68fcab306e07905bfc3d26e35f2740c5aaf9b3))
* add initial set of types and output ([0d379b5](https://github.com/elyukai/optolith-database-schema/commit/0d379b5123534f4439a0d5fdbc7358d074e64972))
* add locale and publication entities ([651a824](https://github.com/elyukai/optolith-database-schema/commit/651a824dc28b1bb90bb5c7d6227cba6dde57a27f))
* add markdown annotations ([a6440d9](https://github.com/elyukai/optolith-database-schema/commit/a6440d97b9ad83f2c7bce7f94014ab2a1efb442c))
* add Markdown availability hints in documentation ([3e2190f](https://github.com/elyukai/optolith-database-schema/commit/3e2190f5bc96fd0bf632fbcac19619ea67fd2c13))
* add prerequisites ([4c44130](https://github.com/elyukai/optolith-database-schema/commit/4c44130326cb8d2b90edf349bbb631a70c53eef1))
* add race ([e2d1c52](https://github.com/elyukai/optolith-database-schema/commit/e2d1c52a0aed49b3770b5e973a90dd21362fcdea))
* add simple referencial integrity utilities ([fbb0f88](https://github.com/elyukai/optolith-database-schema/commit/fbb0f887f3a1a02f1ee3d8b44fefc4e45bc90931))
* first iteration of magical actions ([794824b](https://github.com/elyukai/optolith-database-schema/commit/794824b643ec4ddd2ff279aca15c4f1edb61e3db))


### Bug Fixes

* nested types and property paths ([e51cc15](https://github.com/elyukai/optolith-database-schema/commit/e51cc154caf4b4e7bedb66a7baff533bdc313d14))
