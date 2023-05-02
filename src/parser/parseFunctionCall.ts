import { Value } from "../nodes/Value";
import { FunctionCall } from "../nodes/FunctionCall";
import { Lexer, Loc } from "../tokenize";
import { TokenOf } from "../tokenize/Token";

const KEYWORD_TOKENS = ["KEYWORD", "CPAREN"] as const;
const DELIMITER_TOKENS = ["SPACE", "COMMA", "CPAREN"] as const;
const SPACE_TOKENS = ["SPACE", "CPAREN"] as const;
const COMMA_TOKENS = ["COMMA", "CPAREN"] as const;

export function parseFunctionCall(
  lexer: Lexer,
  name: string,
  functionLoc: Loc,
  priorToken?: TokenOf<"OPAREN">
) {
  let token: TokenOf<"OPAREN" | "CPAREN" | "KEYWORD" | "SPACE" | "COMMA"> =
    priorToken ?? lexer.expect("OPAREN");

  const argList: Value[] = [];
  let isKeyword = true;
  let spaceSeparated: boolean | null = null;

  while (token.type !== "CPAREN") {
    token = lexer.expect(
      ...(isKeyword
        ? KEYWORD_TOKENS
        : spaceSeparated === null
          ? DELIMITER_TOKENS
          : spaceSeparated
            ? SPACE_TOKENS
            : COMMA_TOKENS)
    );

    if (
      spaceSeparated === null &&
      (token.type === "SPACE" || token.type === "COMMA")
    ) {
      spaceSeparated = token.type === "SPACE";
    }

    if (token.type !== "CPAREN") isKeyword = !isKeyword;

    if (token.type === "KEYWORD") {
      const value = new Value(token.value, token.loc);
      argList.push(value);
    }
  }

  return new FunctionCall(name, argList, functionLoc, !!spaceSeparated);
}

