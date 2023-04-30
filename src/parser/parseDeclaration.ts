import { Declaration } from "../nodes/Declaration";
import { FunctionCall } from "../nodes/FunctionCall";
import { Value } from "../nodes/Value";
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

  let valueToken = lexer.expect("KEYWORD", "SPACE");

  if (valueToken instanceof ParserError) {
    report(valueToken.message, valueToken.loc);
    return;
  }

  let semicolonOrFunc: Token<TokenType> | ParserError = lexer.expect(
    "SEMICOLON",
    "OPAREN",
    "KEYWORD",
    "SPACE"
  );

  if (semicolonOrFunc instanceof ParserError) {
    report(semicolonOrFunc.message, semicolonOrFunc.loc);
    return;
  }

  if (semicolonOrFunc.type === "SEMICOLON") {
    return new Declaration(
      keyToken.value,
      [new Value(valueToken.value, valueToken.loc)],
      keyToken.loc
    );
  }

  const values: (Value | FunctionCall)[] = [];

  while (semicolonOrFunc.type !== "SEMICOLON") {
    if (semicolonOrFunc.type === "SPACE") {
      semicolonOrFunc = lexer.expect("KEYWORD");

      if (semicolonOrFunc instanceof ParserError) {
        report(semicolonOrFunc.message, semicolonOrFunc.loc);
        return;
      }
    }

    if (semicolonOrFunc.type === "KEYWORD") {
      values.push(new Value(semicolonOrFunc.value, semicolonOrFunc.loc));
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
