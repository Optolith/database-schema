import * as DB from "tsondb/schema/dsl"

type BinaryMathOperationName =
  | "Addition"
  | "Subtraction"
  | "Multiplication"
  | "Division"
  | "Exponentiation"

type BinaryMathOperation = {
  [K in BinaryMathOperationName]: DB.EnumCase<
    DB.Array<DB.IncludeIdentifier<[Value: DB.TypeParameter], MathOperation>>
  >
}

export type MathOperation = DB.Enum<
  "MathOperation",
  {
    Value: DB.EnumCase<DB.TypeArgument>
  } & BinaryMathOperation,
  [Value: DB.TypeParameter<"Value">]
>

export const MathOperation: MathOperation = DB.GenEnum(import.meta.url, {
  name: "MathOperation",
  parameters: [DB.Param("Value")],
  values: Value => {
    const binaryOperationType = DB.Array(
      DB.GenIncludeIdentifier<MathOperation, [Value: DB.TypeParameter]>(MathOperation, [
        DB.TypeArgument(Value),
      ]),
      { minItems: 2, maxItems: 2 },
    )

    return {
      Value: DB.EnumCase({
        comment: "A direct value.",
        type: DB.TypeArgument(Value),
      }),
      Addition: DB.EnumCase({
        comment: "Adds two values.",
        type: binaryOperationType,
      }),
      Subtraction: DB.EnumCase({
        comment: "Subtracts the right value from the left value.",
        type: binaryOperationType,
      }),
      Multiplication: DB.EnumCase({
        comment: "Multiplies two values.",
        type: binaryOperationType,
      }),
      Division: DB.EnumCase({
        comment: "Divides the left value by the right value.",
        type: binaryOperationType,
      }),
      Exponentiation: DB.EnumCase({
        comment: "Raises the left value to the power of the right value.",
        type: binaryOperationType,
      }),
    }
  },
})
