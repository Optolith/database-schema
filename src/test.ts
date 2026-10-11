// oxlint-disable no-undef
import { stderr } from "node:process"
import { styleText } from "node:util"

// importing the main file will run the schema checks
import("./main.js")
  .then(() => {
    console.log(styleText("green", "Schema is valid"))
  })
  .catch((err: unknown) => {
    console.error(
      styleText("red", err instanceof Error ? err.message : String(err), { stream: stderr }),
    )
    process.exitCode = 1
  })
