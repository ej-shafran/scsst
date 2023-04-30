import { Value } from "../nodes/Value";
import { FunctionCall } from "../nodes/FunctionCall";
import { Lexer, Loc, Token, TokenType, report } from "../tokenize";
import { ParserError } from "./ParserError";

const KEYWORD_TOKENS = ["KEYWORD", "CPAREN"] as const;

const DELIMITER_TOKENS = ["SPACE", "COMMA", "CPAREN"] as const;

const SPACE_TOKENS = ["SPACE", "CPAREN"] as const;

const COMMA_TOKENS = ["COMMA", "CPAREN"] as const;

export function parseFunctionCall(
  lexer: Lexer,
  name: string,
  functionLoc: Loc,
  priorToken?: Token<"OPAREN">
) {
  let token: Token<TokenType> | ParserError =
    priorToken ?? lexer.expect("OPAREN");

  if (token instanceof ParserError) {
    report(token.message, token.loc);
    return;
  }

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

    if (token instanceof ParserError) {
      report(token.message, token.loc);
      return;
    }

    if (token.type !== "CPAREN") {
      if (token.type === "KEYWORD") {
        argList.push(new Value(token.value, token.loc));
      }
      else if (token.type === "SPACE") spaceSeparated = true;
      else spaceSeparated = false;

      isKeyword = !isKeyword;
    }
  }

  return new FunctionCall(name, argList, functionLoc, spaceSeparated ?? false);
}
