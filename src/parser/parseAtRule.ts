import { AtRule } from "../nodes/AtRule";
import { Lexer, Token, TokenType, report } from "../tokenize";
import { ParserError } from "./ParserError";

export function parseAtRule(lexer: Lexer, priorToken?: Token<"KEYWORD">) {
  let token: Token<TokenType> | ParserError =
    priorToken ?? lexer.expect("KEYWORD");

  if (token instanceof ParserError) {
    report(token.message, token.loc);
    return;
  }

  const originalLoc = token.loc;

  let content = "";

  while (token.type !== "SEMICOLON") {
    content += token.value;

    token = lexer.expect("KEYWORD", "SEMICOLON", "SPACE");

    if (token instanceof ParserError) {
      report(token.message, token.loc);
      return;
    }
  }

  return new AtRule(content, originalLoc);
}
