import config from "@elyukai/oxc-config/linter"
import { defineConfig } from "oxlint"

export default defineConfig({
  extends: [config],
  rules: {
    "no-use-before-define": "off",
    "no-redeclare": "off",
  },
})
