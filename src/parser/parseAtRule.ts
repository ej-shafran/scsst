import { AtRule } from "../nodes/AtRule";
import { Lexer, TokenType, TokenOf } from "../tokenize";
import { safe } from "./safe";

export function parseAtRule(lexer: Lexer, priorToken?: TokenOf<"KEYWORD">) {
  let token: TokenOf<TokenType> = priorToken ?? lexer.expect("KEYWORD");
  const originalLoc = token.loc;

  let content = "";
  while (token.type !== "SEMICOLON") {
    content += token.value;

    token = lexer.expect("KEYWORD", "SEMICOLON", "SPACE");
  }

  return new AtRule(content, originalLoc);
}

export default safe(parseAtRule);
