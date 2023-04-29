import { FunctionCall } from "../nodes/FunctionCall";
import { Lexer, Loc, Token, TokenType, report } from "../tokenize";
import { ParserError } from "./ParserError";

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

  const argList: string[] = [];
  let needed: "KEYWORD" | "COMMA" = "KEYWORD";

  while (token.type !== "CPAREN") {
    token = lexer.expect(needed, "CPAREN");

    if (token instanceof ParserError) {
      report(token.message, token.loc);
      return;
    }

    if (token.type !== "CPAREN") {
      if (token.type === "KEYWORD") {
        argList.push(token.value);
      }

      needed = needed === "KEYWORD" ? "COMMA" : "KEYWORD";
    }
  }

  return new FunctionCall(name, argList, functionLoc);
}
