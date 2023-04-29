import { Declaration } from "../nodes/Declaration";
import { MediaQuery } from "../nodes/MediaQuery";
import { Lexer, Token, TokenType, report } from "../tokenize";
import { ParserError } from "./ParserError";
import { parseBlock } from "./parseBlock";
import { parseFunctionCall } from "./parseFunctionCall";

export function parseMediaQuery(lexer: Lexer, priorToken?: Token<"KEYWORD">) {
  let token: Token<TokenType> | ParserError =
    priorToken ?? lexer.expect("KEYWORD");

  if (token instanceof ParserError) {
    report(token.message, token.loc);
    return;
  }

  const originalLoc = token.loc;

  let prefix = token.value;
  let query: Declaration | null = null;

  while (token.type !== "OCURLY") {
    token = lexer.expect("KEYWORD", "OPAREN", "OCURLY", "SPACE");

    if (token instanceof ParserError) {
      report(token.message, token.loc);
      return;
    }

    if (token.type === "OCURLY") break;

    if (token.type !== "OPAREN") {
      prefix += token.value;
      continue;
    }

    const keyToken = lexer.expect("KEYWORD");

    if (keyToken instanceof ParserError) {
      report(keyToken.message, keyToken.loc);
      return;
    }

    token = lexer.expect("COLON");

    if (token instanceof ParserError) {
      report(token.message, token.loc);
      return;
    }

    const valueToken = lexer.expect("KEYWORD");

    if (valueToken instanceof ParserError) {
      report(valueToken.message, valueToken.loc);
      return;
    }

    const cparenOrFuncCall = lexer.expect("CPAREN", "OPAREN");

    if (cparenOrFuncCall instanceof ParserError) {
      report(cparenOrFuncCall.message, cparenOrFuncCall.loc);
      return;
    }

    if (cparenOrFuncCall.type === "CPAREN") { //TODO: find a way to use parseDeclaration
      query = new Declaration(keyToken.value, [valueToken.value], keyToken.loc);
    } else {
      const funcCall = parseFunctionCall(
        lexer,
        valueToken.value,
        valueToken.loc,
        cparenOrFuncCall as Token<"OPAREN">
      );
      if (!funcCall) return;

      query = new Declaration(keyToken.value, [funcCall], keyToken.loc);

      token = lexer.expect("CPAREN");
      if (token instanceof ParserError) return;
    }

    continue;
  }

  const block = parseBlock(lexer, token as Token<"OCURLY">);
  if (!block) return;

  return new MediaQuery(prefix, query, block, originalLoc);
}
