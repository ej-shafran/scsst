import { Declaration } from "../nodes/Declaration";
import { FunctionCall } from "../nodes/FunctionCall";
import { Lexer, Token, TokenType, report } from "../tokenize";
import { ParserError } from "./ParserError";
import { parseFunctionCall } from "./parseFunctionCall";

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

  let semicolonOrFunc: Token<TokenType> | ParserError = lexer.expect(
    "SEMICOLON",
    "OPAREN",
    "KEYWORD"
  );

  if (semicolonOrFunc instanceof ParserError) {
    report(semicolonOrFunc.message, semicolonOrFunc.loc);
    return;
  }

  if (semicolonOrFunc.type === "SEMICOLON") {
    return new Declaration(keyToken.value, [valueToken.value], keyToken.loc);
  }

  const values: (string | FunctionCall)[] = [];

  while (semicolonOrFunc.type !== "SEMICOLON") {
    if (semicolonOrFunc.type === "KEYWORD") {
      values.push(semicolonOrFunc.value);
    } else {
      const funcCall = parseFunctionCall(
        lexer,
        valueToken.value,
        valueToken.loc,
        semicolonOrFunc as Token<"OPAREN">
      );
      if (!funcCall) return;

      values.push(funcCall);
    }

    semicolonOrFunc = lexer.expect("SEMICOLON", "OPAREN", "KEYWORD");

    if (semicolonOrFunc instanceof ParserError) {
      report(semicolonOrFunc.message, semicolonOrFunc.loc);
      return;
    }
  }

  return new Declaration(keyToken.value, values, keyToken.loc);
}
