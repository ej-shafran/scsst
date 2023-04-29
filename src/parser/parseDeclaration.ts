import { Declaration } from "../nodes/Declaration";
import { Lexer, Token, TokenType, report } from "../tokenize";
import { ParserError } from "./ParserError";

export function parseDeclaration(lexer: Lexer, priorToken?: Token<"KEYWORD">) {
  const keyToken = priorToken ?? lexer.expect("KEYWORD");

  if (keyToken instanceof ParserError) {
    report(keyToken.message, keyToken.loc);
    return;
  }

  let error: Token<TokenType> | ParserError = lexer.expect("COLON");

  if (error instanceof ParserError) {
    report(error.message, error.loc);
    return;
  }

  const valueToken = lexer.expect("KEYWORD");

  if (valueToken instanceof ParserError) {
    report(valueToken.message, valueToken.loc);
    return;
  }

  error = lexer.expect("SEMICOLON"); // TODO: deal with functions

  if (error instanceof ParserError) {
    report(error.message, error.loc);
    return;
  }

  return new Declaration(keyToken.value, valueToken.value, keyToken.loc);
}
